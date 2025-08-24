import { History } from "@/app/_components/quiz/history/history";
import { redirect } from "next/navigation";

type Props = {
  searchParams: Promise<{
    page?: string;
  }>;
};

export default async function HistoryScreen({ searchParams }: Props) {
  const params = await searchParams;
  const page = Number(params.page) ?? 1;

  if (!page) redirect("/quiz/history?page=1");

  return <History page={page} />;
}
