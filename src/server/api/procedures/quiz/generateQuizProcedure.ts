import { randomUUID } from "crypto";
import { generateQuizInputSchema, quizSchema } from "@/server/schema/quiz";
import { google } from "@ai-sdk/google";
import { TRPCError } from "@trpc/server";
import { generateObject } from "ai";
import { tryCatch } from "@/lib/helpers/try-catch";
import { protectedProcedure } from "../../trpc";

export const generateQuizProcedure = protectedProcedure
  .input(generateQuizInputSchema)
  .mutation(async ({ ctx, input }) => {
    // Get user profile and how many quiz this user has already created today (MAX = 10)
    const { data: profile, error: profileError } = await tryCatch(
      ctx.db.profile.findUnique({
        where: {
          userId: ctx.user.id,
        },
        select: {
          id: true,
        },
      })
    );

    if (profileError) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to query profile" });
    if (!profile) throw new TRPCError({ code: "NOT_FOUND", message: "Profile not found" });

    // build the date range for "today"
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const todaysQuizzes = await ctx.db.quiz.count({
      where: {
        profileId: profile.id,
        createdAt: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
    });

    if (todaysQuizzes >= 10) {
      throw new TRPCError({
        code: "TOO_MANY_REQUESTS",
        message: "You have exceeded the limit of 10 quizzes you can cerate per day", // Todo
      });
    }

    // Generate quiz using AI
    const { data: generatedQuiz, error: generatedQuizError } = await tryCatch(
      generateObject({
        model: google("gemini-2.0-flash"),
        schema: quizSchema,
        prompt:
          `Generate exactly 10 multiple-choice questions about ${input.topic}. ` +
          `The questions should be short, logical and appropriate for any person for the age of ${input.age} and education level of ${input.educationLevel.toLowerCase().replace("_", " ")}. ` +
          `This person is also interested in ${input.interests.join(", ").toLowerCase()}. ` +
          "Keep a human and friendly tone if possible. " +
          "id => 1 to 10, not duplicate, " +
          "question => 1 to 10, " +
          "options => exactly 4 options, 1 correct and 3 incorrect, " +
          "correctAnswerIndex => index of the correct option, 0 or 1 or 2 or 3, " +
          "explanation => Short explainer why the answer is correct, " +
          "topic => 2 to 5 word title for this MCQ quiz keep it short and simple, " +
          "description => a short but engaging description for this MCQ quiz, don't make it too big, make it compact.",
      })
    );

    if (generatedQuizError) {
      console.error(generatedQuizError);
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to generate quiz using AI" });
    }

    // Manually Create id (PK) for the rows to get rid of subsequent requests
    const quizAnalyticsId = randomUUID();
    const quizId = randomUUID();

    // Store quiz and analytics in database
    const { data: transaction, error: transactionError } = await tryCatch(
      ctx.db.$transaction(async tx => {
        const [analytic, quiz] = await Promise.all([
          tx.quizAnalytics.create({
            data: {
              id: quizAnalyticsId,
              quizId,
              totalPassed: 0,
              totalFailed: 0,
              averageScore: 0,
              averageTime: 0,
              timesTaken: 0,
            },
            select: {
              id: true,
            },
          }),
          tx.quiz.create({
            data: {
              id: quizId,
              createdWith: "gemini-2.5-flash",
              timesTaken: 0,
              profileId: profile.id,
              topic: generatedQuiz.object.topic,
              description: generatedQuiz.object.description,
              category: generatedQuiz.object.category,
              questions: {
                create: generatedQuiz.object.quiz.map(question => ({
                  question: question.question,
                  localId: question.id,
                  options: question.options,
                  correctAnswerIndex: question.correctAnswerIndex,
                  explanation: question.explanation,
                })),
              },
              quizAnalyticsId,
            },
            select: {
              id: true,
            },
          }),
        ]);

        return { analytic, quiz };
      })
    );

    if (transactionError) {
      console.error(transactionError.stack);
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to store transaction in database" });
    }

    return transaction.quiz;
  });
