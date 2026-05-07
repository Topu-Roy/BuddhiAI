import { api } from "@/trpc/server";
import {
  Brain,
  Calendar,
  ChartBarBig,
  CheckCircle,
  ClipboardClock,
  Clock,
  Play,
  Target,
  Trophy,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDistanceToNow } from "@/lib/helpers/formatDistanceToNow";
import { tryCatch } from "@/lib/try-catch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

const fmtTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

export async function RenderView({ quizId }: { quizId: string }) {
  const { data, error } = await tryCatch(api.quiz.getQuiz({ quizId }));

  if (error) {
    return (
      <div className="flex w-full items-center justify-center px-4 pt-32">
        <Card className="w-full max-w-lg border border-destructive/20 shadow-lg">
          <CardContent className="pt-6">
            <div className="space-y-4 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                <XCircle className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-destructive">Failed to Load Quiz</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  There was an error loading the quiz. Please try again or refresh the page
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data) notFound();

  const { id, topic, timesTaken, description, createdWith, createdAt, category, _count, Profile } = data.quiz;
  const passRate = data.analytics ? Math.round((data.analytics.totalPassed / data.analytics.timesTaken) * 100) : 0;

  return (
    <div className="mx-auto flex w-full max-w-5xl justify-center p-4">
      <div className="w-full max-w-7xl">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Main Quiz Card */}
          <div className="lg:col-span-2">
            <Card className="w-full border border-border shadow-lg">
              {/* Header with gradient background */}
              <CardHeader className="border-b border-border">
                <div className="space-y-3">
                  <CardTitle className="text-2xl leading-tight font-bold">{topic}</CardTitle>

                  <CardDescription className="text-base leading-relaxed text-muted-foreground">
                    {description}
                  </CardDescription>

                  <div className="flex items-center justify-start gap-2">
                    <Badge variant="outline" className="shrink-0 tracking-wider text-muted-foreground">
                      {createdWith.replaceAll("-", " ") ?? "-"}
                    </Badge>
                    <Badge variant="outline" className="shrink-0 text-muted-foreground">
                      {category.charAt(0) + category.slice(1).toLocaleLowerCase()}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Enhanced stats grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col items-center space-y-2 rounded-lg border bg-card p-4 text-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Target className="h-5 w-5 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Questions</p>
                      <p className="text-2xl font-bold">{_count.questions}</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-center space-y-2 rounded-lg border bg-card p-4 text-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Trophy className="h-5 w-5 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Times Taken</p>
                      <p className="text-2xl font-bold">{timesTaken}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Creator and date info */}
                <div className="flex items-center justify-between rounded-lg bg-muted/50">
                  <div className="flex items-center space-x-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                      <Brain className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Created by</p>
                      <p className="text-xs text-muted-foreground">{Profile?.name ?? "Anonymous"}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{formatDistanceToNow(createdAt, { addSuffix: true })}</span>
                  </div>
                </div>
              </CardContent>

              <CardFooter>
                <Button size="lg" className="w-full">
                  <Link href={`/quiz/take/${id}`} className="flex items-center space-x-2">
                    <Play className="h-5 w-5" />
                    <span>Start Quiz</span>
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Quiz Analytics Sidebar */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-1">
            {/* Quiz Statistics */}
            <Card className="border shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                    <ChartBarBig className="size-5 text-primary" />
                  </div>
                  Quiz Analytics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between divide-x divide-border">
                  <div className="flex-1 text-center">
                    <div className="text-2xl font-bold text-green-600">{data.analytics?.averageScore ?? 0}/10</div>
                    <div className="text-xs text-muted-foreground">Avg Score</div>
                  </div>

                  <div className="flex-1 text-center">
                    <div className="text-2xl font-bold text-blue-600">{isNaN(passRate) ? 0 : passRate}%</div>
                    <div className="text-xs text-muted-foreground">Pass Rate</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Performance</span>
                    <span>{data.analytics?.averageScore ?? 0}0%</span>
                  </div>
                  <Progress value={(data.analytics?.averageScore ?? 0) * 10} className="h-2" max={10} />
                </div>
              </CardContent>
            </Card>

            {/* Recent Quiz Takers */}
            <Card className="border shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                    <ClipboardClock className="size-5 text-primary" />
                  </div>
                  Recent Attempts
                </CardTitle>
                <CardDescription>Latest {_count.results} quiz attempts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {data.quiz?.results.map(taker => (
                  <div
                    key={taker.id}
                    className="flex items-center justify-between rounded-lg border bg-card/50 p-3"
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {taker.Profile.name
                            .split(" ")
                            .map(n => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{taker.Profile.name}</p>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDistanceToNow(taker.createdAt, { addSuffix: true })}</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1 text-right">
                      <div className="flex items-center space-x-1">
                        {taker.correctAnswer >= 6 ? (
                          <CheckCircle className="h-3 w-3 text-green-500" />
                        ) : (
                          <XCircle className="h-3 w-3 text-red-500" />
                        )}
                        <span
                          className={`text-sm font-semibold ${taker.correctAnswer >= 6 ? "text-green-600" : "text-red-600"}`}
                        >
                          {taker.correctAnswer}0%
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">{fmtTime(taker.timeTookInSeconds)}</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export function QuizDetailSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-5xl justify-center p-4">
      <div className="w-full max-w-7xl">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Main Quiz Card */}
          <div className="lg:col-span-2">
            <div className="w-full rounded-lg border border-border shadow-lg">
              <div className="border-b border-border p-6">
                <Skeleton className="mb-3 h-7 w-3/4" />
                <Skeleton className="mb-3 h-5 w-full" />
                <Skeleton className="h-4 w-1/2" />
              </div>

              <div className="space-y-6 p-6">
                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2].map(i => (
                    <div key={i} className="flex flex-col items-center space-y-2 rounded-lg border p-4">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-7 w-8" />
                    </div>
                  ))}
                </div>

                <Skeleton className="h-px w-full" />

                {/* Creator & date */}
                <div className="flex items-center justify-between rounded-lg p-3">
                  <div className="flex items-center space-x-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div>
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-24" />
                </div>

                <Skeleton className="h-11 w-full" />
              </div>
            </div>
          </div>

          {/* Sidebar cards */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-1">
            {[1, 2].map(card => (
              <div key={card} className="rounded-lg border p-4">
                <div className="mb-4 flex items-center gap-2">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <Skeleton className="h-5 w-32" />
                </div>

                {/* Analytics stats */}
                <div className="space-y-4">
                  {card === 1 && (
                    <>
                      <div className="flex items-center justify-between divide-x">
                        <div className="flex-1 space-y-1 text-center">
                          <Skeleton className="mx-auto h-7 w-10" />
                          <Skeleton className="mx-auto h-3 w-16" />
                        </div>
                        <Skeleton className="h-8 w-px" />
                        <div className="flex-1 space-y-1 text-center">
                          <Skeleton className="mx-auto h-7 w-10" />
                          <Skeleton className="mx-auto h-3 w-16" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-2 w-full" />
                      </div>
                    </>
                  )}

                  {/* Recent attempts */}
                  {card === 2 &&
                    Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                        <div className="flex items-center space-x-3">
                          <Skeleton className="h-8 w-8 rounded-full" />
                          <div>
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-3 w-16" />
                          </div>
                        </div>
                        <div className="space-y-1 text-right">
                          <Skeleton className="h-4 w-8" />
                          <Skeleton className="h-3 w-12" />
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
