import { getResultInputSchema } from "@/server/schema/quiz";
import { TRPCError } from "@trpc/server";
import { unstable_cache as nextCache } from "next/cache";
import { tryCatch } from "@/lib/helpers/try-catch";
import { protectedProcedure } from "../../trpc";

export const getResultProcedure = protectedProcedure.input(getResultInputSchema).query(async ({ ctx, input }) => {
  const cached = nextCache(
    async () => {
      const { data, error } = await tryCatch(
        Promise.all([
          // To check if the provided profileId has a profile
          ctx.db.profile.findUnique({
            where: {
              id: input.profileId,
            },
            select: {
              id: true,
            },
          }),

          // Fetch the result for the profileId
          ctx.db.result.findUnique({
            where: {
              id: input.resultId,
              profileId: input.profileId,
            },
            select: {
              id: true,
              correctAnswer: true,
              incorrectAnswer: true,
              profileId: true,
              timeTookInSeconds: true,
              answers: {
                select: {
                  selectedAnswerIndex: true,
                  Question: {
                    select: {
                      localId: true,
                      correctAnswerIndex: true,
                      explanation: true,
                      question: true,
                      options: true,
                    },
                  },
                },
              },
              Quiz: {
                select: {
                  _count: { select: { questions: true } },
                  id: true,
                  topic: true,
                  questions: {
                    orderBy: {
                      localId: "asc",
                    },
                    select: {
                      id: true,
                      localId: true,
                      correctAnswerIndex: true,
                      question: true,
                      explanation: true,
                      options: true,
                    },
                  },
                },
              },
            },
          }),
        ])
      );

      if (error)
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to get data from the database" });

      // Check if the data is actually present
      const [profile, result] = data;

      if (!profile) throw new TRPCError({ code: "NOT_FOUND", message: "Profile not found" });
      if (!result) throw new TRPCError({ code: "NOT_FOUND", message: "Result not found" });

      return result;
    },
    [`result-data-${input.resultId}`],
    {
      tags: [`result-data-${input.resultId}`],
    }
  );

  return await cached();
});
