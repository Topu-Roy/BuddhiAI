import { TRPCError } from "@trpc/server";
import { number, object } from "zod";
import { tryCatch } from "@/lib/helpers/try-catch";
import { protectedProcedure } from "../../trpc";

export const HISTORY_ITEM_PER_PAGE = 9;

export const getPaginatedTakenHistoryProcedure = protectedProcedure
  .input(object({ page: number().nonnegative() }))
  .query(async ({ ctx, input }) => {
    const skip = (input.page - 1) * HISTORY_ITEM_PER_PAGE;

    const { data, error } = await tryCatch(
      ctx.db.profile.findUnique({
        where: {
          userId: ctx.user.id,
        },
        select: {
          _count: {
            select: {
              quizzesTaken: true,
            },
          },
          quizzesTaken: {
            select: {
              id: true,
              correctAnswer: true,
              incorrectAnswer: true,
              timeTookInSeconds: true,
              createdAt: true,
              Quiz: {
                select: {
                  id: true,
                  topic: true,
                  Profile: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
            take: HISTORY_ITEM_PER_PAGE,
            skip,
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      })
    );

    if (error) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to fetch profile data" });
    if (!data) throw new TRPCError({ code: "NOT_FOUND", message: "Profile not found" });

    const totalPages = Math.ceil(data._count.quizzesTaken / HISTORY_ITEM_PER_PAGE);

    return { ...data, totalPages };
  });
