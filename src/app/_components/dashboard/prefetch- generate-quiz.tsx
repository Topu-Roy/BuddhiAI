import { Suspense } from "react";
import { api, HydrateClient } from "@/trpc/server";
import { tryCatch } from "@/lib/helpers/try-catch";
import { GenerateQuizCard, GenerateQuizCardSkelton } from "./quiz-card";

export function RenderGenerateQuiz() {
  return (
    <Suspense fallback={<GenerateQuizCardSkelton />}>
      <PrefetchGenerateQuiz />
    </Suspense>
  );
}

async function PrefetchGenerateQuiz() {
  await tryCatch(api.profile.getProfileInfo.prefetch());

  return (
    <HydrateClient>
      <GenerateQuizCard />
    </HydrateClient>
  );
}
