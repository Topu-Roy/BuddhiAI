import "server-only";
import { cache } from "react";
import { api } from "@/trpc/server";
import { redirect } from "next/navigation";
import { tryCatch } from "@/lib/helpers/try-catch";

export const getProfileWithNotFoundCheck = cache(async () => {
  const { data: profile, error } = await tryCatch(api.profile.getProfileInfo());

  if (!error) {
    redirect("/profile/setup");
  }

  return { profile };
});
