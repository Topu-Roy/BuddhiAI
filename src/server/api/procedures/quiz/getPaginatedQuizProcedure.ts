import { TRPCError } from "@trpc/server";
import { number, object } from "zod";
import { tryCatch } from "@/lib/helpers/try-catch";
import { publicProcedure } from "../../trpc";

export const EXPLORE_ITEMS_PER_PAGE = 9;

export const getPaginatedQuizProcedure = publicProcedure
  .input(object({ page: number().nonnegative() }))
  .query(async ({ ctx, input }) => {
    const skip = input.page < 2 ? 0 : input.page * EXPLORE_ITEMS_PER_PAGE;

    const { data, error } = await tryCatch(
      Promise.all([
        ctx.db.quiz.count(),
        ctx.db.quiz.findMany({
          select: {
            id: true,
            topic: true,
            description: true,
            timesTaken: true,
            createdAt: true,
            createdWith: true,
            questions: {
              select: {
                id: true,
              },
            },
            Profile: {
              select: {
                name: true,
              },
            },
          },
          take: 9,
          skip,
        }),
      ])
    );

    if (error)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to get data from the database",
      });

    const [quizCount, quizzes] = data;
    const totalPages = Math.floor(quizCount / EXPLORE_ITEMS_PER_PAGE);

    return {
      totalPages,
      quizzes,
      totalQuizzes: quizCount,
    };
  });
