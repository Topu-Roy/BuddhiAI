import { api, HydrateClient } from "@/trpc/server";
import { redirect } from "next/navigation";
import { TakeQuiz } from "./take-quiz";

export async function RenderTakeQuiz({ quizId }: { quizId: string }) {
  const [result] = await Promise.all([
    api.quiz.checkIfAlreadyTaken({ quizId }),
    api.profile.getProfileInfo.prefetch(),
    api.quiz.getQuiz.prefetch({ quizId }),
  ]);

  if (result) redirect(`/quiz/results/${result.id}`);

  return (
    <HydrateClient>
      <TakeQuiz quizId={quizId} />
    </HydrateClient>
  );
}
