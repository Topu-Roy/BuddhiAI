import { randomUUID } from "crypto";
import { adminProcedure, createTRPCRouter } from "@/server/api/trpc";
import type { INTEREST, PrismaPromise } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { initialQuizData } from "data";
import { tryCatch } from "@/lib/helpers/try-catch";

export const seedRouter = createTRPCRouter({
  generateQuiz: adminProcedure.mutation(async ({ ctx }) => {
    //*================[ run all in one atomic transaction ]================
    const { data, error } = await tryCatch(
      ctx.db.$transaction(async tx => {
        const txOps: Array<PrismaPromise<unknown>> = [];

        for (const item of initialQuizData) {
          const quizId = randomUUID();

          //*=======================[ Create Quiz row ]=======================
          txOps.push(
            tx.quiz.create({
              data: {
                id: quizId,
                createdWith: "gemini-2.5-flash",
                timesTaken: 0,
                profileId: ctx.profile.id,
                topic: item.topic,
                description: item.description,
                category: item.category as INTEREST,
                questions: {
                  create: item.questions.map(q => ({
                    question: q.question,
                    localId: q.localId,
                    options: q.options,
                    correctAnswerIndex: q.correctAnswerIndex,
                    explanation: q.explanation,
                  })),
                },
              },
              select: { id: true },
            })
          );

          //* ========[ Create QuizAnalytics row with the SAME quizId ]==========
          txOps.push(
            tx.quizAnalytics.create({
              data: {
                quizId, // <-- manually set
                totalPassed: 0,
                totalFailed: 0,
                averageScore: 0,
                averageTime: 0,
                timesTaken: 0,
              },
            })
          );
        }

        //* ================[ Execute all promises all at once ]==================
        await Promise.all(txOps);

        return true;
      })
    );

    if (error) {
      console.error("Bulk seed failed:", error);
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to seed quizzes" });
    }

    console.log(`Quizzes seeded successfully - Status => ${data}`);
    return data;
  }),
});
