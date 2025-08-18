import { randomUUID } from "crypto";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";
import {
  generateQuizInputSchema,
  getResultInputSchema,
  quizSchema,
  submitQuizInputSchema,
} from "@/server/schema/quiz";
import { google } from "@ai-sdk/google";
import { TRPCError } from "@trpc/server";
import { generateObject } from "ai";
import { unstable_cache as nextCache } from "next/cache";
import z from "zod";
import { tryCatch } from "@/lib/helpers/try-catch";

export const EXPLORE_ITEMS_PER_PAGE = 9 as const;

export const quizRouter = createTRPCRouter({
  generateQuiz: protectedProcedure.input(generateQuizInputSchema).mutation(async ({ ctx, input }) => {
    // Get user profile and how many quiz this user has already created
    const { data: profile, error: profileError } = await tryCatch(
      ctx.db.profile.findUnique({
        where: {
          userId: ctx.user.id,
        },
        select: {
          _count: { select: { quizzesCreated: true } },
          id: true,
        },
      })
    );

    if (profileError) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to query profile" });
    if (!profile) throw new TRPCError({ code: "NOT_FOUND", message: "Profile not found" });

    if (profile._count.quizzesCreated > 10) {
      throw new TRPCError({
        code: "TOO_MANY_REQUESTS",
        message: "You have exceeded the limit of 10 quizzes you can cerate per day", // Todo
      });
    }

    // Generate quiz using AI
    const { data: generatedQuiz, error: generatedQuizError } = await tryCatch(
      generateObject({
        model: google("gemini-2.0-flash"),
        schema: quizSchema,
        prompt:
          `Generate exactly 10 multiple-choice questions about ${input.topic}. ` +
          `The questions should be short, logical and appropriate for any person for the age of ${input.age} and education level of ${input.educationLevel.toLowerCase().replace("_", " ")}. ` +
          `This person is also interested in ${input.interests.join(", ").toLowerCase()}. ` +
          "Keep a human and friendly tone if possible. " +
          "id => 1 to 10, not duplicate, " +
          "question => 1 to 10, " +
          "options => exactly 4 options, 1 correct and 3 incorrect, " +
          "correctAnswerIndex => index of the correct option, 0 or 1 or 2 or 3, " +
          "explanation => Short explainer why the answer is correct, " +
          "topic => 2 to 5 word title for this MCQ quiz keep it short and simple, " +
          "description => a short but engaging description for this MCQ quiz, don't make it too big, make it compact.",
      })
    );

    if (generatedQuizError) {
      console.error(generatedQuizError);
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to generate quiz using AI" });
    }

    // Manually Create id (PK) for the rows to get rid of subsequent requests
    const quizAnalyticsId = randomUUID();
    const quizId = randomUUID();

    // Store quiz and analytics in database
    const { data: transaction, error: transactionError } = await tryCatch(
      ctx.db.$transaction(async tx => {
        const [analytic, quiz] = await Promise.all([
          tx.quizAnalytics.create({
            data: {
              id: quizAnalyticsId,
              quizId,
              totalPassed: 0,
              totalFailed: 0,
              averageScore: 0,
              averageTime: 0,
              timesTaken: 0,
            },
            select: {
              id: true,
            },
          }),
          tx.quiz.create({
            data: {
              id: quizId,
              createdWith: "gemini-2.5-flash",
              timesTaken: 0,
              profileId: profile.id,
              topic: generatedQuiz.object.topic,
              description: generatedQuiz.object.description,
              category: generatedQuiz.object.category,
              questions: {
                create: generatedQuiz.object.quiz.map(question => ({
                  question: question.question,
                  localId: question.id,
                  options: question.options,
                  correctAnswerIndex: question.correctAnswerIndex,
                  explanation: question.explanation,
                })),
              },
              quizAnalyticsId,
            },
            select: {
              id: true,
            },
          }),
        ]);

        return { analytic, quiz };
      })
    );

    if (transactionError) {
      console.error(transactionError.stack);
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to store transaction in database" });
    }

    return transaction.quiz;
  }),

  getQuiz: publicProcedure.input(z.object({ quizId: z.string().nonempty() })).query(async ({ ctx, input }) => {
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
  }),

  getPaginatedQuiz: publicProcedure
    .input(z.object({ page: z.number().nonnegative() }))
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
    }),

  getResult: protectedProcedure.input(getResultInputSchema).query(async ({ ctx, input }) => {
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
  }),

  submitQuizResult: protectedProcedure.input(submitQuizInputSchema).mutation(async ({ ctx, input }) => {
    // =================================[ Get the quiz ]=================================
    const { data: promiseData, error: quizError } = await tryCatch(
      Promise.all([
        ctx.db.quiz.findFirst({
          where: {
            id: input.quizId,
          },
          select: {
            id: true,
            _count: {
              select: {
                questions: true,
              },
            },
            questions: {
              select: {
                localId: true,
                correctAnswerIndex: true,
              },
            },
          },
        }),
        ctx.db.profile.findUnique({
          where: {
            userId: ctx.user.id,
          },
          select: {
            id: true,
            _count: {
              select: {
                quizzesCreated: true,
                quizzesTaken: true,
              },
            },
          },
        }),
      ])
    );

    if (quizError) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to fetch quiz" });

    const [quiz, profile] = promiseData;

    if (!quiz) throw new TRPCError({ code: "NOT_FOUND", message: "Quiz not found" });
    if (!profile) throw new TRPCError({ code: "NOT_FOUND", message: "Profile not found" });

    // =================================[ Calculate pass mark ]=================================
    const PASS_PERCENTAGE = 60 as const; //* 60% to pass
    const PASSING_SCORE = (PASS_PERCENTAGE / 100) * quiz._count.questions;

    // ===================[ Calculate correct, incorrect answers and answers ]===================
    let totalCorrectAnswers = 0;
    let totalIncorrectAnswers = 0;

    quiz.questions.forEach(q => {
      const answer = input.answers.find(item => item.localId === q.localId);

      if (answer && q.correctAnswerIndex === answer.selectedAnswerIndex) {
        totalCorrectAnswers++;
      } else {
        totalIncorrectAnswers++;
      }
    });

    const answers = input.answers.map(item => {
      const question = quiz.questions.find(q => q.localId === item.localId);
      const isCorrect = item.selectedAnswerIndex === question?.correctAnswerIndex;

      return { ...item, isCorrect };
    });

    /**
     * * ===========[ Tasks ]===========
     *
     * 1. Create result
     * 2. Create answers
     * 3. Update or create analytics
     * 4. Update stats of profile
     * 5. Update timesTaken of the quiz
     * 6. Return created result id
     * 7. Invalidate related cached queries after transaction // TODO
     */
    const txPromise = ctx.db.$transaction(async tx => {
      //* =================[ Get required data for operations ]=================
      const initialDbQueries = await Promise.all([
        tx.quizAnalytics.findFirst({
          where: { quizId: input.quizId },
          select: {
            totalPassed: true,
            totalFailed: true,
            averageTime: true,
            averageScore: true,
            timesTaken: true,
          },
        }),
        tx.result.create({
          data: {
            profileId: input.profileId,
            quizId: input.quizId,
            correctAnswer: totalCorrectAnswers,
            incorrectAnswer: totalIncorrectAnswers,
            timeTookInSeconds: input.timeTookInSeconds,
          },
          select: {
            id: true,
          },
        }),
        tx.stats.findFirst({
          where: {
            profileId: input.profileId,
          },
          select: {
            totalCorrectAnswers: true,
            totalIncorrectAnswers: true,
            totalTimeSpentInSeconds: true,
            profileId: true,
          },
        }),
      ]);

      const [analytics, result, stats] = initialDbQueries;

      //* =======================[ Calculate new values ]=======================
      const currentTimesTaken = analytics?.timesTaken ?? 0;
      const newTimesTaken = currentTimesTaken + 1;

      const newAverageScore = analytics
        ? Math.round((analytics.averageScore * currentTimesTaken + totalCorrectAnswers) / newTimesTaken)
        : totalCorrectAnswers;

      const newAverageTime = analytics
        ? Math.round((analytics.averageTime * currentTimesTaken + input.timeTookInSeconds) / newTimesTaken)
        : input.timeTookInSeconds;

      const isPassed = totalCorrectAnswers >= PASSING_SCORE;

      //* =======================[ Update with new values ]=======================
      await Promise.all([
        tx.quizAnalytics.upsert({
          where: { quizId: input.quizId },
          create: {
            quizId: input.quizId,
            averageScore: totalCorrectAnswers,
            averageTime: input.timeTookInSeconds,
            timesTaken: 1,
            totalFailed: isPassed ? 0 : 1,
            totalPassed: isPassed ? 1 : 0,
          },
          update: {
            timesTaken: newTimesTaken,
            ...(isPassed ? { totalPassed: { increment: 1 } } : { totalFailed: { increment: 1 } }),
            averageScore: newAverageScore,
            averageTime: newAverageTime,
          },
        }),
        tx.answer.createMany({
          data: answers.map(a => ({
            isCorrect: a.isCorrect,
            resultId: result.id,
            questionId: a.questionId,
            selectedAnswerIndex: a.selectedAnswerIndex,
          })),
        }),
        tx.quiz.update({
          where: {
            id: input.quizId,
          },
          data: {
            timesTaken: { increment: 1 },
          },
          select: {
            id: true,
          },
        }),
        tx.stats.upsert({
          where: {
            profileId: input.profileId,
          },
          update: {
            totalCorrectAnswers: (stats?.totalCorrectAnswers ?? 0) + totalCorrectAnswers,
            totalIncorrectAnswers: (stats?.totalIncorrectAnswers ?? 0) + totalIncorrectAnswers,
            totalTimeSpentInSeconds: (stats?.totalTimeSpentInSeconds ?? 0) + input.timeTookInSeconds,
          },
          create: {
            profileId: input.profileId,
            totalCorrectAnswers: totalCorrectAnswers,
            totalIncorrectAnswers: totalIncorrectAnswers,
            totalTimeSpentInSeconds: input.timeTookInSeconds,
          },
        }),
      ]);

      return result;
    });

    const { data, error } = await tryCatch(txPromise);

    if (error) {
      console.error(error.stack);
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Transaction failed" });
    }

    return data;
  }),

  checkIfAlreadyTaken: protectedProcedure
    .input(z.object({ quizId: z.string().nonempty() }))
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
    }),
});
