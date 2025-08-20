import { createTRPCRouter } from "@/server/api/trpc";
import { createOrUpdateProcedure } from "../procedures/profile/createOrUpdateProcedure";
import { getPaginatedCreatedHistoryProcedure } from "../procedures/profile/getPaginatedCreatedHistoryProcedure";
import { getPaginatedTakenHistoryProcedure } from "../procedures/profile/getPaginatedTakenHistoryProcedure";
import { getProfileInfoProcedure } from "../procedures/profile/getProfileInfoProcedure";

export const profileRouter = createTRPCRouter({
  /**
   * * getProfileInfo
   *
   * Returns the current user’s profile plus quick stats and the 5 most-recent
   * quizzes they took and created.
   */
  getProfileInfo: getProfileInfoProcedure,

  /**
   * * getPaginatedTakenHistory
   *
   * Returns one page of quizzes the user has taken, ordered newest → oldest.
   * Accepts a page index (0-based).
   */
  getPaginatedTakenHistory: getPaginatedTakenHistoryProcedure,

  /**
   * * getPaginatedCreatedHistory
   *
   * Returns one page of quizzes the user has created, ordered newest → oldest.
   * Accepts a page index (0-based).
   */
  getPaginatedCreatedHistory: getPaginatedCreatedHistoryProcedure,

  /**
   * * createOrUpdate
   *
   * Creates the user’s profile on first use, or updates it on subsequent calls.
   * Accepts name, age, education level and interests.
   */
  createOrUpdate: createOrUpdateProcedure,
});
