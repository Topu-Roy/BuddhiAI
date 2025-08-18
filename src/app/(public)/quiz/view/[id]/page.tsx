import { Suspense } from "react";
import { QuizDetailSkeleton, RenderView } from "@/app/_components/quiz/view/render-view";
import { notFound } from "next/navigation";

export default async function ResultScreen({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (!id) notFound();

  return (
    <Suspense fallback={<QuizDetailSkeleton />}>
      <RenderView quizId={id} />
    </Suspense>
  );
}
