import { randomUUID } from "crypto";
import { initialQuizData } from "@/assets/data";
import type { INTEREST } from "@/generated/prisma/enums";
import type { PrismaPromise } from "@/generated/prisma/internal/prismaNamespace";
import { adminProcedure, createTRPCRouter } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { tryCatch } from "@/lib/try-catch";
import { z } from "zod";

export const seedRouter = createTRPCRouter({
  getStats: adminProcedure.query(async ({ ctx }) => {
    const [[quizCount, questionCount, resultCount, profileCount], lastQuiz, bannedCount] = await Promise.all([
      Promise.all([
        ctx.db.quiz.count(),
        ctx.db.question.count(),
        ctx.db.result.count(),
        ctx.db.profile.count(),
      ]),
      ctx.db.quiz.findFirst({
        orderBy: { createdAt: "desc" },
        select: { createdAt: true },
      }),
      ctx.db.user.count({
        where: { banned: true },
      }),
    ]);

    return {
      quizCount,
      questionCount,
      resultCount,
      profileCount,
      bannedCount,
      lastSeededAt: lastQuiz?.createdAt ?? null,
    };
  }),

  generateQuiz: adminProcedure.mutation(async ({ ctx }) => {
    const { data, error } = await tryCatch(
      ctx.db.$transaction(async tx => {
        const txOps: Array<PrismaPromise<unknown>> = [];

        for (const item of initialQuizData) {
          const quizId = randomUUID();

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

          txOps.push(
            tx.quizAnalytics.create({
              data: {
                quizId,
                totalPassed: 0,
                totalFailed: 0,
                averageScore: 0,
                averageTime: 0,
                timesTaken: 0,
              },
            })
          );
        }

        await Promise.all(txOps);

        return true;
      })
    );

    if (error) {
      console.error("Bulk seed failed:", error);
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to seed quizzes" });
    }

    console.log(`Quizzes seeded successfully - Status => ${data}`);
    return { success: true, seededAt: new Date() };
  }),

  clearQuizzes: adminProcedure.mutation(async ({ ctx }) => {
    const { data, error } = await tryCatch(
      ctx.db.$transaction(async tx => {
        const quizzes = await tx.quiz.findMany({
          select: { id: true },
        });

        const quizIds = quizzes.map(q => q.id);

        const deleteOps: Array<PrismaPromise<unknown>> = [];

        if (quizIds.length > 0) {
          deleteOps.push(
            tx.quizAnalytics.deleteMany({
              where: { quizId: { in: quizIds } },
            })
          );

          deleteOps.push(
            tx.question.deleteMany({
              where: { quizId: { in: quizIds } },
            })
          );

          deleteOps.push(
            tx.quiz.deleteMany({
              where: { id: { in: quizIds } },
            })
          );
        }

        await Promise.all(deleteOps);

        return { deletedCount: quizIds.length };
      })
    );

    if (error) {
      console.error("Clear quizzes failed:", error);
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to clear quizzes" });
    }

    console.log(`Quizzes cleared successfully - Count => ${data?.deletedCount}`);
    return { success: true, deletedCount: data?.deletedCount ?? 0 };
  }),

  resetDatabase: adminProcedure.mutation(async ({ ctx }) => {
    const { data, error } = await tryCatch(
      ctx.db.$transaction(async tx => {
        const deleteOps: Array<PrismaPromise<unknown>> = [];

        const [quizIds, resultIds, profileIds] = await Promise.all([
          tx.quiz.findMany({ select: { id: true } }),
          tx.result.findMany({ select: { id: true } }),
          tx.profile.findMany({ select: { id: true } }),
        ]);

        const qIds = quizIds.map(q => q.id);
        const rIds = resultIds.map(r => r.id);
        const pIds = profileIds.map(p => p.id);

        if (qIds.length > 0) {
          deleteOps.push(tx.quizAnalytics.deleteMany({ where: { quizId: { in: qIds } } }));
          deleteOps.push(tx.question.deleteMany({ where: { quizId: { in: qIds } } }));
          deleteOps.push(tx.quiz.deleteMany({ where: { id: { in: qIds } } }));
        }

        if (rIds.length > 0) {
          deleteOps.push(tx.answer.deleteMany({ where: { resultId: { in: rIds } } }));
          deleteOps.push(tx.result.deleteMany({ where: { id: { in: rIds } } }));
        }

        if (pIds.length > 0) {
          deleteOps.push(tx.stats.deleteMany({ where: { profileId: { in: pIds } } }));
          deleteOps.push(tx.profile.deleteMany({ where: { id: { in: pIds } } }));
        }

        await Promise.all(deleteOps);

        return {
          quizzesDeleted: qIds.length,
          resultsDeleted: rIds.length,
          profilesDeleted: pIds.length,
        };
      })
    );

    if (error) {
      console.error("Reset database failed:", error);
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to reset database" });
    }

    console.log(`Database reset successfully -`, data);
    return { success: true, ...data };
  }),

  getUsers: adminProcedure.query(async ({ ctx }) => {
    const { data, error } = await tryCatch(
      ctx.db.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          banned: true,
          banReason: true,
          createdAt: true,
          profile: {
            select: {
              id: true,
              educationLevel: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      })
    );

    if (error) {
      console.error("Get users failed:", error);
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to fetch users" });
    }

    return data;
  }),

  toggleBanUser: adminProcedure
    .input(
      z.object({
        userId: z.string().nonempty(),
        banned: z.boolean(),
        banReason: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { error } = await tryCatch(
        ctx.db.user.update({
          where: { id: input.userId },
          data: {
            banned: input.banned,
            banReason: input.banned ? input.banReason ?? "Banned by admin" : null,
          },
          select: { id: true },
        })
      );

      if (error) {
        console.error("Toggle ban failed:", error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to toggle ban" });
      }

      return { success: true, userId: input.userId, banned: input.banned };
    }),
});