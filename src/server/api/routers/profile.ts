import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { updateOrCreateProfileInputSchema } from "@/server/schema/profile";
import { TRPCError } from "@trpc/server";
import z from "zod";
import { tryCatch } from "@/lib/helpers/try-catch";

export const HISTORY_ITEM_PER_PAGE = 9;

export const profileRouter = createTRPCRouter({
  getProfileInfo: protectedProcedure.query(async ({ ctx }) => {
    const { data, error } = await tryCatch(
      ctx.db.profile.findUnique({
        where: {
          userId: ctx.user.id,
        },
        select: {
          _count: {
            select: {
              quizzesTaken: true,
              quizzesCreated: true,
            },
          },
          id: true,
          userId: true,
          email: true,
          name: true,
          age: true,
          educationLevel: true,
          interests: true,
          image: true,
          createdAt: true,
          Stats: {
            select: {
              id: true,
              totalCorrectAnswers: true,
              totalIncorrectAnswers: true,
              totalTimeSpentInSeconds: true,
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
            take: 5,
            orderBy: {
              createdAt: "desc",
            },
          },
          quizzesCreated: {
            select: {
              id: true,
              category: true,
              topic: true,
              timesTaken: true,
              createdAt: true,
            },
            take: 5,
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      })
    );

    if (error) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to fetch profile data" });
    if (!data) throw new TRPCError({ code: "NOT_FOUND", message: "Profile not found" });

    return data;
  }),

  getPaginatedTakenHistory: protectedProcedure
    .input(z.object({ page: z.number().nonnegative() }))
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
    }),

  getPaginatedCreatedHistory: protectedProcedure
    .input(z.object({ page: z.number().nonnegative() }))
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
    }),

  createOrUpdate: protectedProcedure.input(updateOrCreateProfileInputSchema).mutation(async ({ ctx, input }) => {
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
  }),
});
