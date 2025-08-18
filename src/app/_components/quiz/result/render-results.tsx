import { getProfileWithNotFoundCheck } from "@/server/helpers/profile";
import { api } from "@/trpc/server";
import { CheckCircle, Home, RotateCcw, XCircle } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { tryCatch } from "@/lib/helpers/try-catch";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export async function Results({ resultId }: { resultId: string }) {
  const { profile } = await getProfileWithNotFoundCheck();
  const { data: result, error } = await tryCatch(api.quiz.getResult({ profileId: profile.id, resultId }));

  if (!result || error) notFound();

  const total = result.Quiz._count.questions;
  const percentage = Math.round((result.correctAnswer / total) * 100);
  const fmtTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold">{result.Quiz.topic}</h1>
          <p className="text-muted-foreground">Quiz Results</p>
        </div>

        {/* Score Overview */}
        <Card className="mb-8 py-6">
          <CardContent>
            <div className="divide-border grid gap-6 divide-y md:grid-cols-4 md:divide-x md:divide-y-0">
              <div className="inline-flex flex-col items-center justify-center pb-4 md:pb-0">
                <div className="pb-2 text-4xl font-bold">{percentage}%</div>
                <p className="text-muted-foreground text-sm">Score</p>
              </div>
              <div className="inline-flex flex-col items-center justify-center pb-4 md:pb-0">
                <div className="pb-2 text-2xl font-semibold text-green-600">{result.correctAnswer}</div>
                <p className="text-muted-foreground text-sm">Correct</p>
              </div>
              <div className="inline-flex flex-col items-center justify-center pb-4 md:pb-0">
                <div className="pb-2 text-2xl font-semibold text-red-600">{result.incorrectAnswer}</div>
                <p className="text-muted-foreground text-sm">Incorrect</p>
              </div>
              <div className="inline-flex flex-col items-center justify-center pb-4 md:pb-0">
                <div className="pb-2 text-2xl font-semibold">{fmtTime(result.timeTookInSeconds)}</div>
                <p className="text-muted-foreground text-sm">Time took</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator className="my-8" />

        {/* Questions Review */}
        <div className="mb-8">
          <h2 className="mb-6 text-2xl font-bold">Review</h2>
          <div className="space-y-6">
            {result.Quiz.questions.map((q, i) => {
              const ans = result.answers.find(a => a.Question.localId === q.localId);
              const userIdx = ans?.selectedAnswerIndex;
              const isCorrect = userIdx === q.correctAnswerIndex;

              return (
                <Card
                  key={q.localId}
                  className={cn("bg-background/60", {
                    "bg-red-500/5": !isCorrect,
                    "bg-green-500/5": isCorrect,
                  })}
                >
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="bg-muted flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-medium">
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg leading-relaxed font-medium">{q.question}</CardTitle>
                      </div>
                      {isCorrect ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4 space-y-2">
                      {q.options.map((opt, idx) => (
                        <div
                          key={idx}
                          className={cn("rounded-lg border p-3 text-sm", {
                            "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/50":
                              idx === q.correctAnswerIndex,
                            "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/50":
                              idx === userIdx && !isCorrect,
                          })}
                        >
                          <div className="flex items-center justify-between">
                            <span>
                              {idx === 0
                                ? `A. ${opt}`
                                : idx === 1
                                  ? `B. ${opt}`
                                  : idx === 2
                                    ? `C. ${opt}`
                                    : idx === 3
                                      ? `D. ${opt}`
                                      : `${opt}`}
                            </span>
                            {idx === q.correctAnswerIndex && (
                              <Badge variant="secondary" className="text-green-700">
                                Correct
                              </Badge>
                            )}
                            {idx === userIdx && !isCorrect && (
                              <Badge variant="secondary" className="text-red-700">
                                Your answer
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <p className="mb-1 text-sm font-medium">Explanation</p>
                      <p className="text-muted-foreground text-sm">{q.explanation}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Button asChild size="lg">
            <Link href="/dashboard">
              <Home className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href={`/quiz/history`}>
              <RotateCcw className="mr-2 h-4 w-4" />
              My history
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href={`/quiz/explore`}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Explore more
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export function ResultSkeleton() {
  const questionPlaceholders = Array.from({ length: 3 });

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <Skeleton className="mx-auto mb-2 h-9 w-48" />
          <Skeleton className="mx-auto h-5 w-28" />
        </div>

        {/* Score Overview */}
        <Card className="mb-8 py-6">
          <CardContent>
            <div className="divide-border grid gap-6 divide-y md:grid-cols-4 md:divide-x md:divide-y-0">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="inline-flex flex-col items-center justify-center pb-4 md:pb-0">
                  <Skeleton className="mb-2 h-10 w-16 rounded-md" />
                  <Skeleton className="h-4 w-16 rounded-md" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Separator className="my-8" />

        {/* Questions Review */}
        <div className="mb-8">
          <Skeleton className="mb-6 h-8 w-24" />

          <div className="space-y-6">
            {questionPlaceholders.map((_, i) => (
              <Card key={i} className="bg-background/60">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-6 flex-1 rounded-md" />
                    <Skeleton className="h-5 w-5 rounded-full" />
                  </div>
                </CardHeader>

                <CardContent>
                  {/* 4 answer lines */}
                  <div className="mb-4 space-y-2">
                    {Array.from({ length: 4 }).map((_, j) => (
                      <Skeleton key={j} className="h-11 w-full rounded-lg" />
                    ))}
                  </div>

                  {/* Explanation block */}
                  <Skeleton className="h-20 w-full rounded-lg" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-11 w-40 rounded-md" />
          ))}
        </div>
      </div>
    </div>
  );
}
