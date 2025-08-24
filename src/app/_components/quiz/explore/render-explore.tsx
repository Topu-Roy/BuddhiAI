import { api } from "@/trpc/server";
import { Clock, HeartCrack } from "lucide-react";
import { tryCatch } from "@/lib/helpers/try-catch";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";

export async function RenderExplorePage({ page }: { page: number }) {
  const { data, error } = await tryCatch(api.quiz.getPaginatedQuiz({ page }));

  if (error) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-10">
        <h2 className="text-3xl font-bold tracking-tight">Explore Quizzes</h2>
        <div className="flex w-full flex-col items-center justify-center pt-14">
          <HeartCrack className="text-destructive" />
          <p className="text-destructive mt-8">Could not load quizzes.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl p-4">
      <h2 className="pb-8 text-xl font-bold tracking-tight lg:text-3xl">Explore Quizzes</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.quizzes.map(q => (
          <QuizCard key={q.id} quiz={q} />
        ))}
      </div>

      {data.quizzes.length === 0 ? (
        <>
          <div className="flex w-full flex-col items-center justify-center pt-14">
            <HeartCrack className="text-destructive" />
            <p className="text-destructive text-lg font-medium">No quizzes yet.</p>
            <Button variant={"outline"} className="mt-4" disabled>
              Create your own
            </Button>
          </div>
        </>
      ) : null}

      <Pagination className="pt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href={`/quiz/explore?page=${Math.max(1, page - 1)}`}
              aria-disabled={page <= 1}
              className={cn({
                "pointer-events-none opacity-50": page <= 1,
              })}
            />
          </PaginationItem>

          {/* Generate page numbers around current page */}
          {(() => {
            const maxVisible = 5;
            const totalPagesToUse = data.totalPages;
            let startPage = Math.max(1, page - Math.floor(maxVisible / 2));
            const endPage = Math.min(totalPagesToUse, startPage + maxVisible - 1);

            // Adjust start if we're near the end
            if (endPage - startPage + 1 < maxVisible) {
              startPage = Math.max(1, endPage - maxVisible + 1);
            }

            return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map(index => (
              <PaginationItem key={index}>
                <PaginationLink href={`/quiz/explore?page=${index}`} isActive={index === page}>
                  {index}
                </PaginationLink>
              </PaginationItem>
            ));
          })()}

          {/* Show ellipsis and last page if needed */}
          {data.totalPages > 5 && page < data.totalPages - 2 && (
            <>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink isActive={false} href={`/quiz/explore?page=${data.totalPages}`}>
                  {data.totalPages}
                </PaginationLink>
              </PaginationItem>
            </>
          )}

          <PaginationItem>
            <PaginationNext
              aria-disabled={page >= data.totalPages}
              href={`/quiz/explore?page=${Math.min(data.totalPages, page + 1)}`}
              className={cn({
                "pointer-events-none opacity-50": page >= data.totalPages,
              })}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </main>
  );
}

type QuizCardProps = {
  quiz: {
    id: string;
    topic: string;
    timesTaken: number;
    description: string;
    createdWith: string;
    createdAt: Date;
    Profile: {
      name: string;
    } | null;
    questions: {
      id: string;
    }[];
  };
};

function QuizCard({ quiz }: QuizCardProps) {
  return (
    <Card key={quiz.id} className="flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg">{quiz.topic}</CardTitle>
        <CardDescription className="line-clamp-2">{quiz.description}</CardDescription>
      </CardHeader>

      <CardContent className="flex-1">
        <div className="text-muted-foreground flex items-center justify-between gap-2 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{quiz.questions.length} questions</span>
          </div>
          <Badge variant="outline" className="text-muted-foreground ml-2 shrink-0">
            {quiz.createdWith ?? "-"}
          </Badge>
        </div>
      </CardContent>

      <CardFooter className="justify-between">
        <Badge variant="outline" className="text-muted-foreground px-3 py-2">
          {quiz.timesTaken.toLocaleString()} taken
        </Badge>
        <Button size="sm" asChild>
          <a href={`/quiz/view/${quiz.id}`}>Start</a>
        </Button>
      </CardFooter>
    </Card>
  );
}

export function ExploreSkeleton() {
  return (
    <main className="mx-auto max-w-7xl p-4 px-4">
      <Skeleton className="mb-10 h-9 w-48" />
      {/* Grid of 9 skeleton cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="flex flex-col rounded-xl border shadow">
            <div className="flex flex-col space-y-1.5 p-6">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="mt-2 h-4 w-full" />
              <Skeleton className="mt-2 h-4 w-4/5" />
            </div>

            <div className="flex-1 p-6 pt-0">
              <div className="flex items-center justify-between gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <Skeleton className="size-4 rounded-full" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
            </div>

            <div className="flex items-center justify-between p-6 pt-0">
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-8 w-16" />
            </div>
          </div>
        ))}
      </div>
      {/* Pagination skeleton */}
      <Pagination className="py-8">
        <PaginationContent>
          <PaginationItem>
            <Skeleton className="h-8 w-16" />
          </PaginationItem>

          <div className="flex items-center justify-center gap-4 px-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <PaginationItem key={i}>
                <Skeleton className="size-8" />
              </PaginationItem>
            ))}
          </div>

          <PaginationItem>
            <Skeleton className="h-8 w-16" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </main>
  );
}
