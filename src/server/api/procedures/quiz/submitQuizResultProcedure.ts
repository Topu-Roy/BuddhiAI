import { randomUUID } from "crypto";
import { protectedProcedure } from "@/server/api/trpc";
import { submitQuizInputSchema } from "@/server/schema/quiz";
import { TRPCError } from "@trpc/server";
import { tryCatch } from "@/lib/helpers/try-catch";

type InputAnswer = {
  localId: number;
  selectedAnswerIndex: number;
  questionId: string;
};

type QuizQuestion = {
  localId: number;
  correctAnswerIndex: number;
};

export const EXPLORE_ITEMS_PER_PAGE = 9;
const PASS_PERCENTAGE = 60;

// Helper functions for cleaner code
function calculatePassingScore(totalQuestions: number) {
  return (PASS_PERCENTAGE / 100) * totalQuestions;
}

function calculateAverageScore(currentAverage: number, currentCount: number, newScore: number, newCount: number) {
  return Math.round((currentAverage * currentCount + newScore) / newCount);
}

function calculateAverageTime(currentAverage: number, currentCount: number, newTime: number, newCount: number) {
  return Math.round((currentAverage * currentCount + newTime) / newCount);
}

function processAnswers(inputAnswers: InputAnswer[], quizQuestions: QuizQuestion[]) {
  const questionMap = new Map(quizQuestions.map(q => [q.localId, q.correctAnswerIndex]));

  return inputAnswers.map(answer => ({
    ...answer,
    isCorrect: questionMap.get(answer.localId) === answer.selectedAnswerIndex,
  }));
}

export const submitQuizResultProcedure = protectedProcedure
  .input(submitQuizInputSchema)
  .mutation(async ({ ctx, input }) => {
    // Fetch quiz, profile, and analytics data in parallel
    const { data: promiseData, error: quizError } = await tryCatch(
      Promise.all([
        ctx.db.quiz.findFirst({
          where: {
            id: input.quizId,
          },
          select: {
            id: true,
            _count: { select: { questions: true } },
            questions: {
              select: {
                localId: true,
                correctAnswerIndex: true,
              },
            },
          },
        }),
        ctx.db.profile.findUnique({
          where: { userId: ctx.user.id },
          select: { id: true },
        }),
        ctx.db.quizAnalytics.findFirst({
          where: { quizId: input.quizId },
          select: {
            totalPassed: true,
            totalFailed: true,
            averageTime: true,
            averageScore: true,
            timesTaken: true,
          },
        }),
      ])
    );

    if (quizError) {
      console.error(quizError.stack);
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to fetch quiz or profile" });
    }

    const [quiz, profile, analytics] = promiseData;

    if (!quiz) throw new TRPCError({ code: "NOT_FOUND", message: "Quiz not found" });
    if (!profile) throw new TRPCError({ code: "NOT_FOUND", message: "Profile not found" });

    // Process answers and calculate results
    const answers = processAnswers(input.answers, quiz.questions);
    const totalCorrectAnswers = answers.filter(a => a.isCorrect).length;
    const totalIncorrectAnswers = answers.filter(a => a.isCorrect === false).length;
    const PASSING_SCORE = calculatePassingScore(quiz._count.questions);
    const isPassed = totalCorrectAnswers >= PASSING_SCORE;

    // Pre-calculate values outside transaction
    const currentTimesTaken = analytics?.timesTaken ?? 0;
    const newTimesTaken = currentTimesTaken + 1;
    const newAverageScore = analytics
      ? calculateAverageScore(analytics.averageScore, currentTimesTaken, totalCorrectAnswers, newTimesTaken)
      : totalCorrectAnswers;
    const newAverageTime = analytics
      ? calculateAverageTime(analytics.averageTime ?? 0, currentTimesTaken, input.timeTookInSeconds, newTimesTaken)
      : input.timeTookInSeconds;

    // Execute the transaction
    const txPromise = ctx.db.$transaction(async tx => {
      const resultId = randomUUID(); // To ensure same id for answers and result

      // Execute all operations in parallel for maximum efficiency
      await Promise.all([
        // Create result
        tx.result.create({
          data: {
            id: resultId,
            profileId: input.profileId,
            quizId: input.quizId,
            correctAnswer: totalCorrectAnswers,
            incorrectAnswer: totalIncorrectAnswers,
            timeTookInSeconds: input.timeTookInSeconds,
          },
          select: {
            id: true,
          },
        }),

        // Create answers in batch
        tx.answer.createMany({
          data: answers.map(a => ({
            isCorrect: a.isCorrect,
            resultId,
            questionId: a.questionId,
            selectedAnswerIndex: a.selectedAnswerIndex,
          })),
        }),

        // Update quiz analytics
        tx.quizAnalytics.upsert({
          where: { quizId: input.quizId },
          create: {
            quizId: input.quizId,
            averageScore: totalCorrectAnswers,
            averageTime: input.timeTookInSeconds,
            timesTaken: 1,
            totalFailed: isPassed ? 0 : 1,
            totalPassed: isPassed ? 1 : 0,
          },
          update: {
            timesTaken: newTimesTaken,
            ...(isPassed ? { totalPassed: { increment: 1 } } : { totalFailed: { increment: 1 } }),
            averageScore: newAverageScore,
            averageTime: newAverageTime,
          },
        }),

        // Update quiz times taken
        tx.quiz.update({
          where: {
            id: input.quizId,
          },
          data: {
            timesTaken: { increment: 1 },
          },
          select: {
            id: true,
          },
        }),

        // Update user stats using atomic increments
        tx.stats.upsert({
          where: {
            profileId: input.profileId,
          },
          update: {
            totalCorrectAnswers: { increment: totalCorrectAnswers },
            totalIncorrectAnswers: { increment: totalIncorrectAnswers },
            totalTimeSpentInSeconds: { increment: input.timeTookInSeconds },
          },
          create: {
            profileId: input.profileId,
            totalCorrectAnswers: totalCorrectAnswers,
            totalIncorrectAnswers: totalIncorrectAnswers,
            totalTimeSpentInSeconds: input.timeTookInSeconds,
          },
        }),
      ]);

      return { id: resultId };
    });

    const { data, error } = await tryCatch(txPromise);

    if (error) {
      console.error(error.stack);
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Transaction failed" });
    }

    return data;
  });
