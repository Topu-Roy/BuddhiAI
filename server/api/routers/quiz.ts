import { createTRPCRouter } from "@/server/api/trpc";
import { checkIfAlreadyTakenProcedure } from "../procedures/quiz/checkIfAlreadyTakenProcedure";
import { generateQuizProcedure } from "../procedures/quiz/generateQuizProcedure";
import { getPaginatedQuizProcedure } from "../procedures/quiz/getPaginatedQuizProcedure";
import { getManyQuizProcedure, getQuizProcedure } from "../procedures/quiz/getQuizProcedure";
import { getResultProcedure } from "../procedures/quiz/getResultProcedure";
import { submitQuizResultProcedure } from "../procedures/quiz/submitQuizResultProcedure";

export const quizRouter = createTRPCRouter({
  /**
   * * generateQuiz
   *
   * Uses Gemini 2.0 to generate 10 MCQs, then stores the quiz + analytics and
   * enforces a 10-quiz daily limit per user. Returns the freshly created quiz.
   */
  generateQuiz: generateQuizProcedure,

  /**
   * * getQuiz
   *
   * Public endpoint that returns one quiz, its questions, creator info and
   * the latest five attempt summaries for quick insight.
   */
  getQuiz: getQuizProcedure,

  /**
   * * getManyQuiz
   *
   * Public endpoint that returns one quizId, some basic info and creator info.
   */
  getManyQuiz: getManyQuizProcedure,

  /**
   * * getPaginatedQuiz
   *
   * Infinite-scroll friendly feed: latest quizzes sorted newest → oldest,
   * returned 9 items per page, plus total count.
   */
  getPaginatedQuiz: getPaginatedQuizProcedure,

  /**
   * * getResult
   *
   * Personal result detail: score, time spent, each answer vs correct choice,
   * explanations, and the full original quiz for review.
   */
  getResult: getResultProcedure,

  /**
   * * submitQuizResult
   *
   * Atomic transaction that:
   *   – saves the user’s answers & score
   *   – updates quiz-wide analytics (avg score/time, pass/fail counts)
   *   – increments user-level stats (total correct/incorrect/time)
   * Returns the new result ID for navigation.
   */
  submitQuizResult: submitQuizResultProcedure,

  /**
   * * checkIfAlreadyTaken
   *
   * Returns the result ID immediately if the user has already completed the
   * quiz (useful for preventing duplicates).
   */
  checkIfAlreadyTaken: checkIfAlreadyTakenProcedure,
});
