import { api, HydrateClient } from "@/trpc/server";
import { notFound, redirect } from "next/navigation";
import { tryCatch } from "@/lib/helpers/try-catch";
import { TakeQuiz } from "./take-quiz";

export async function RenderTakeQuiz({ quizId }: { quizId: string }) {
  // First check if quiz exists before doing other operations
  const { data: quiz, error: quizError } = await tryCatch(api.quiz.getQuiz({ quizId }));

  // If quiz doesn't exist, return 404
  if (quizError || !quiz) {
    notFound();
  }

  // Now safely check if already taken and prefetch other data
  const { data, error } = await tryCatch(
    Promise.all([api.quiz.checkIfAlreadyTaken({ quizId }), api.profile.getProfileInfo.prefetch()])
  );

  if (error) notFound();

  const [result] = data;

  if (result) redirect(`/quiz/results/${result.id}`);

  return (
    <HydrateClient>
      <TakeQuiz quizId={quizId} />
    </HydrateClient>
  );
}
