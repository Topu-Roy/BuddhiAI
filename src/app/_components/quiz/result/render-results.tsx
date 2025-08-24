import { api } from "@/trpc/server";
import { CheckCircle, Clock, Home, RotateCcw, Trophy, XCircle } from "lucide-react";
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
  const profile = await api.profile.getProfileInfo();
  const { data: result, error } = await tryCatch(api.quiz.getResult({ profileId: profile.id, resultId }));

  if (!result || error) notFound();

  const total = result.Quiz._count.questions;
  const percentage = Math.round((result.correctAnswer / total) * 100);
  const fmtTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className="container mx-auto max-w-4xl px-4 py-4">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-xl font-semibold sm:text-2xl md:text-3xl">{result.Quiz.topic}</h1>
        <p className="text-muted-foreground">Quiz Results</p>
      </div>

      {/* Score Overview */}
      <Card className="border-border p-4 shadow-lg">
        <CardContent className="p-0">
          <div className="flex flex-col items-center justify-between gap-4 lg:flex-row">
            <div className="relative text-center lg:text-left">
              <div className="mb-3 flex items-center justify-center gap-3 lg:justify-start">
                <div className="bg-primary/10 border-primary/20 rounded-full border p-3">
                  <Trophy className="text-primary h-6 w-6" />
                </div>
                <div>
                  <div className="text-foreground text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                    {percentage}%
                  </div>
                  <p className="text-muted-foreground text-sm font-medium sm:text-base">Overall Score</p>
                </div>
              </div>
            </div>

            <div className="flex w-full flex-col items-center justify-between gap-4 md:flex-row">
              <div className="flex w-full items-center justify-between gap-4">
                <div className="group flex-1 rounded-xl border border-emerald-200/60 bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-5 text-center transition-all duration-200 hover:shadow-md dark:border-emerald-800/40 dark:from-emerald-950/30 dark:to-emerald-900/20">
                  <div className="mb-2 flex items-center justify-center gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    <div className="text-2xl font-bold text-emerald-600 sm:text-3xl dark:text-emerald-400">
                      {result.correctAnswer}
                    </div>
                  </div>
                  <p className="text-xs font-medium text-emerald-700 sm:text-sm dark:text-emerald-300">Correct</p>
                </div>

                <div className="group flex-1 rounded-xl border border-red-200/60 bg-gradient-to-br from-red-50 to-red-100/50 p-5 text-center transition-all duration-200 hover:shadow-md dark:border-red-800/40 dark:from-red-950/30 dark:to-red-900/20">
                  <div className="mb-2 flex items-center justify-center gap-2">
                    <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                    <div className="text-2xl font-bold text-red-600 sm:text-3xl dark:text-red-400">
                      {result.incorrectAnswer}
                    </div>
                  </div>
                  <p className="text-xs font-medium text-red-700 sm:text-sm dark:text-red-300">Incorrect</p>
                </div>
              </div>

              <div className="group from-muted/40 to-muted/20 border-border/60 w-full rounded-xl border bg-gradient-to-br p-5 text-center transition-all duration-200 hover:shadow-md">
                <div className="mb-2 flex items-center justify-center gap-2">
                  <Clock className="text-muted-foreground h-5 w-5" />
                  <div className="text-foreground text-2xl font-bold sm:text-3xl">
                    {fmtTime(result.timeTookInSeconds)}
                  </div>
                </div>
                <p className="text-muted-foreground text-xs font-medium sm:text-sm">Time Taken</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator className="my-8" />

      {/* Questions Review */}
      <div className="mb-8">
        <h2 className="mb-6 text-2xl font-bold">Review answers</h2>
        <div className="space-y-6">
          {result.Quiz.questions.map((q, i) => {
            const ans = result.answers.find(a => a.Question.localId === q.localId);
            const userIdx = ans?.selectedAnswerIndex;
            const isCorrect = userIdx === q.correctAnswerIndex;

            return (
              <Card key={q.localId} className="dark:bg-card/40 bg-card shadow-md">
                <CardHeader>
                  <div className="flex items-center justify-between gap-4">
                    <div className="bg-primary/20 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-medium">
                      {i + 1}
                    </div>
                    {isCorrect ? (
                      <div className="flex items-center justify-center rounded-full bg-green-600/20 p-1.5">
                        <CheckCircle size={18} className="text-green-600" />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center rounded-full bg-red-600/20 p-1.5">
                        <XCircle size={18} className="text-red-600" />
                      </div>
                    )}
                  </div>

                  <CardTitle>
                    <p className="text-foreground pt-2 text-base">{q.question}</p>
                  </CardTitle>
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
                            <Badge
                              variant="secondary"
                              className="bg-green-400/10 text-green-700 outline outline-green-700/70"
                            >
                              Correct
                            </Badge>
                          )}
                          {idx === userIdx && !isCorrect && (
                            <Badge
                              variant="secondary"
                              className="bg-red-700/10 text-red-700 outline-red-700/70 dark:bg-red-200/10"
                            >
                              Your answer
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <div className="bg-muted-foreground h-1.5 w-1.5 rounded-full"></div>
                      <p className="text-foreground/80 text-sm font-semibold">Explanation</p>
                    </div>
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
          <Link href={`/quiz/history?page=1`}>
            <RotateCcw className="mr-2 h-4 w-4" />
            My history
          </Link>
        </Button>
        <Button variant="outline" size="lg" asChild>
          <Link href={`/quiz/explore?page=1`}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Explore more
          </Link>
        </Button>
      </div>
    </div>
  );
}

export function ResultSkeleton() {
  const questionPlaceholders = Array.from({ length: 3 });

  return (
    <div className="min-h-[92dvh]">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <Skeleton className="mx-auto mb-2 h-9 w-48" />
          <Skeleton className="mx-auto h-5 w-28" />
        </div>

        {/* Score Overview */}
        <Card className="border-border bg-transparent p-4 shadow-lg">
          <CardContent className="p-0">
            <div className="flex flex-col items-center justify-between gap-4 lg:flex-row">
              {/* Left side – Overall score */}
              <div className="relative text-center lg:text-left">
                <div className="mb-3 flex items-center justify-center gap-3 lg:justify-start">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div>
                    <Skeleton className="h-10 w-20 sm:h-12 md:h-14 lg:h-16" />
                    <Skeleton className="mt-1 h-4 w-24" />
                  </div>
                </div>
              </div>

              {/* Right side – metrics */}
              <div className="flex w-full flex-col items-center justify-between gap-4 md:flex-row">
                <div className="flex w-full items-center justify-between gap-4">
                  {/* Correct */}
                  <div className="group flex-1 rounded-xl border p-5 text-center">
                    <div className="mb-2 flex items-center justify-center gap-2">
                      <Skeleton className="h-5 w-5 rounded-full" />
                      <Skeleton className="h-8 w-8 sm:h-9 sm:w-9" />
                    </div>
                    <Skeleton className="mx-auto h-4 w-16" />
                  </div>

                  {/* Incorrect */}
                  <div className="group flex-1 rounded-xl border p-5 text-center">
                    <div className="mb-2 flex items-center justify-center gap-2">
                      <Skeleton className="h-5 w-5 rounded-full" />
                      <Skeleton className="h-8 w-8 sm:h-9 sm:w-9" />
                    </div>
                    <Skeleton className="mx-auto h-4 w-16" />
                  </div>
                </div>

                {/* Time Taken */}
                <div className="group w-full rounded-xl border p-5 text-center">
                  <div className="mb-2 flex items-center justify-center gap-2">
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <Skeleton className="h-8 w-16 sm:h-9 sm:w-20" />
                  </div>
                  <Skeleton className="mx-auto h-4 w-16" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator className="my-8" />

        {/* Questions Review */}
        <div className="mb-8">
          <Skeleton className="mb-6 h-8 w-24" />

          <div className="space-y-6">
            {questionPlaceholders.map((_, i) => (
              <Card key={i} className="bg-transparent">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-6 flex-1" />
                    <Skeleton className="h-5 w-5 rounded-full" />
                  </div>
                </CardHeader>

                <CardContent>
                  {/* 4 answer lines */}
                  <div className="mb-4 space-y-2">
                    {Array.from({ length: 4 }).map((_, j) => (
                      <Skeleton key={j} className="h-11 w-full" />
                    ))}
                  </div>

                  {/* Explanation block */}
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-11 w-40" />
          ))}
        </div>
      </div>
    </div>
  );
}
