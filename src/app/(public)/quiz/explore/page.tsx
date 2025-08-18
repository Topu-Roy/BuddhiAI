import { Suspense } from "react";
import { redirect } from "next/navigation";
import { ExploreSkeleton, RenderExplorePage } from "../../../_components/quiz/explore/render-explore";

type Props = {
  searchParams: Promise<{
    page?: string;
  }>;
};

export default async function ExploreScreen({ searchParams }: Props) {
  const params = await searchParams;
  const page = Number(params.page) ?? 1;

  if (!page) redirect("/quiz/explore?page=1");

  return (
    <Suspense fallback={<ExploreSkeleton />}>
      <RenderExplorePage page={page} />
    </Suspense>
  );
}
