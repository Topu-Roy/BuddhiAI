import { updateOrCreateProfileInputSchema } from "@/server/schema/profile";
import { TRPCError } from "@trpc/server";
import { tryCatch } from "@/lib/helpers/try-catch";
import { protectedProcedure } from "../../trpc";

export const createOrUpdateProcedure = protectedProcedure
  .input(updateOrCreateProfileInputSchema)
  .mutation(async ({ ctx, input }) => {
    const { data, error } = await tryCatch(
      ctx.db.profile.upsert({
        where: {
          userId: ctx.user.id,
        },
        create: {
          userId: ctx.user.id,
          name: input.name,
          email: input.email,
          age: input.age,
          educationLevel: input.educationLevel,
          interests: input.interests,
        },
        update: {
          userId: ctx.user.id,
          name: input.name,
          email: input.email,
          age: input.age,
          educationLevel: input.educationLevel,
          interests: input.interests,
        },
        select: {
          quizzesCreated: {
            select: {
              id: true,
            },
          },
        },
      })
    );

    if (error) {
      console.error(error.stack);
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to create or update profile" });
    }

    return data;
  });
