import { TRPCError } from "@trpc/server";
import { tryCatch } from "@/lib/helpers/try-catch";
import { protectedProcedure } from "../../trpc";

export const getProfileInfoProcedure = protectedProcedure.query(async ({ ctx }) => {
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
});
