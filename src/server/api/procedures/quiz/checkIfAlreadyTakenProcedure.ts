import { TRPCError } from "@trpc/server";
import { object, string } from "zod";
import { tryCatch } from "@/lib/helpers/try-catch";
import { protectedProcedure } from "../../trpc";

export const checkIfAlreadyTakenProcedure = protectedProcedure
  .input(object({ quizId: string().nonempty() }))
  .query(async ({ ctx, input }) => {
    const profile = await tryCatch(
      ctx.db.profile.findUnique({
        where: {
          userId: ctx.user.id,
        },
        select: {
          id: true,
        },
      })
    );

    if (profile.error) {
      console.error(profile.error.stack);
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to query profile" });
    }

    if (!profile.data?.id) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Profile not found" });
    }

    const result = await tryCatch(
      ctx.db.result.findFirst({
        where: {
          profileId: profile.data?.id,
          quizId: input.quizId,
        },
        select: {
          id: true,
        },
      })
    );

    if (result.error) {
      console.error(result.error.stack);
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to query result" });
    }

    return result.data;
  });
