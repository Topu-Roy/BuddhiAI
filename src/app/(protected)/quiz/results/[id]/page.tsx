import { Suspense } from "react";
import { Results, ResultSkeleton } from "@/app/_components/quiz/result/render-results";
import { notFound } from "next/navigation";

export default async function ResultScreen({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (!id) notFound();

  return (
    <Suspense fallback={<ResultSkeleton />}>
      <Results resultId={id} />
    </Suspense>
  );
}
