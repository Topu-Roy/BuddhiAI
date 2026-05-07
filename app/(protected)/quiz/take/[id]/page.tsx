import { Suspense } from "react";
import { RenderTakeQuiz } from "@/app/_components/quiz/take/prefetch-take-quiz";
import { TakeQuizSkeleton } from "@/app/_components/quiz/take/take-quiz";

export default async function TakeQuizPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <Suspense fallback={<TakeQuizSkeleton />}>
      <RenderTakeQuiz quizId={id} />
    </Suspense>
  );
}
