import { TRPCError } from "@trpc/server";
import { number, object } from "zod";
import { tryCatch } from "@/lib/helpers/try-catch";
import { protectedProcedure } from "../../trpc";

export const HISTORY_ITEM_PER_PAGE = 9;

export const getPaginatedCreatedHistoryProcedure = protectedProcedure
  .input(object({ page: number().nonnegative() }))
  .query(async ({ ctx, input }) => {
    const skip = input.page < 2 ? 0 : input.page * 9;

    const { data, error } = await tryCatch(
      ctx.db.profile.findUnique({
        where: {
          userId: ctx.user.id,
        },
        select: {
          _count: {
            select: {
              quizzesCreated: true,
            },
          },
          id: true,
          name: true,
          quizzesCreated: {
            select: {
              id: true,
              timesTaken: true,
              topic: true,
              createdAt: true,
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

    const totalPages = Math.ceil(data._count.quizzesCreated / HISTORY_ITEM_PER_PAGE);

    return { ...data, totalPages };
  });
