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

  return (
    <div className="from-background to-muted/50 min-h-screen bg-gradient-to-br p-6">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <div className="space-y-2 text-center">
          <h1 className="text-foreground text-4xl font-bold">Quiz History</h1>
          <p className="text-muted-foreground">Track your learning progress and achievements</p>
        </div>

        {/* Profile History */}
        <History page={page} />
      </div>
    </div>
  );
}
