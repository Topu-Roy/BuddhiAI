import { TRPCError } from "@trpc/server";
import { object, string } from "zod";
import { tryCatch } from "@/lib/helpers/try-catch";
import { publicProcedure } from "../../trpc";

export const getQuizProcedure = publicProcedure
  .input(object({ quizId: string().nonempty() }))
  .query(async ({ ctx, input }) => {
    const { data, error } = await tryCatch(
      Promise.all([
        ctx.db.quiz.findFirst({
          where: {
            id: input.quizId,
          },
          select: {
            _count: {
              select: {
                questions: true,
                results: true,
              },
            },
            id: true,
            timesTaken: true,
            createdAt: true,
            category: true,
            createdWith: true,
            description: true,
            topic: true,
            questions: {
              select: {
                id: true,
                localId: true,
                question: true,
                options: true,
              },
            },
            results: {
              take: 5,
              orderBy: {
                updatedAt: "desc",
              },
              select: {
                id: true,
                correctAnswer: true,
                timeTookInSeconds: true,
                createdAt: true,
                Profile: {
                  select: {
                    name: true,
                  },
                },
              },
            },
            Profile: {
              select: {
                name: true,
              },
            },
          },
        }),
        ctx.db.quizAnalytics.findFirst({
          where: {
            quizId: input.quizId,
          },
        }),
      ])
    );

    if (error) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to fetch quiz" });

    const [quiz, analytics] = data;

    if (!quiz) throw new TRPCError({ code: "NOT_FOUND", message: "Quiz not found" });
    if (!analytics) throw new TRPCError({ code: "NOT_FOUND", message: "Analytics not found" });

    return { quiz, analytics };
  });
