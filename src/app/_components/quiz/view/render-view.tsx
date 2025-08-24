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
import { tryCatch } from "@/lib/helpers/try-catch";
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
        <Card className="border-destructive/20 w-full max-w-lg border shadow-lg">
          <CardContent className="pt-6">
            <div className="space-y-4 text-center">
              <div className="bg-destructive/10 mx-auto flex h-12 w-12 items-center justify-center rounded-full">
                <XCircle className="text-destructive h-6 w-6" />
              </div>
              <div>
                <h3 className="text-destructive text-lg font-semibold">Failed to Load Quiz</h3>
                <p className="text-muted-foreground mt-1 text-sm">
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
            <Card className="border-border w-full border shadow-lg">
              {/* Header with gradient background */}
              <CardHeader className="border-border border-b">
                <div className="space-y-3">
                  <CardTitle className="text-2xl leading-tight font-bold">{topic}</CardTitle>

                  <CardDescription className="text-muted-foreground text-base leading-relaxed">
                    {description}
                  </CardDescription>

                  <div className="flex items-center justify-start gap-2">
                    <Badge variant="outline" className="text-muted-foreground shrink-0 tracking-wider">
                      {createdWith.replaceAll("-", " ") ?? "-"}
                    </Badge>
                    <Badge variant="outline" className="text-muted-foreground shrink-0">
                      {category.charAt(0) + category.slice(1).toLocaleLowerCase()}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Enhanced stats grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-card flex flex-col items-center space-y-2 rounded-lg border p-4 text-center">
                    <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                      <Target className="text-primary h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground text-sm font-medium">Questions</p>
                      <p className="text-2xl font-bold">{_count.questions}</p>
                    </div>
                  </div>

                  <div className="bg-card flex flex-col items-center space-y-2 rounded-lg border p-4 text-center">
                    <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                      <Trophy className="text-primary h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground text-sm font-medium">Times Taken</p>
                      <p className="text-2xl font-bold">{timesTaken}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Creator and date info */}
                <div className="bg-muted/50 flex items-center justify-between rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-full">
                      <Brain className="text-muted-foreground h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Created by</p>
                      <p className="text-muted-foreground text-xs">{Profile?.name ?? "Anonymous"}</p>
                    </div>
                  </div>
                  <div className="text-muted-foreground flex items-center space-x-1 text-xs">
                    <Clock className="h-3 w-3" />
                    <span>{formatDistanceToNow(createdAt, { addSuffix: true })}</span>
                  </div>
                </div>
              </CardContent>

              <CardFooter>
                <Button asChild size="lg" className="w-full">
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
                  <div className="bg-primary/10 flex size-10 items-center justify-center rounded-full">
                    <ChartBarBig className="text-primary size-5" />
                  </div>
                  Quiz Analytics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="divide-border flex items-center justify-between divide-x">
                  <div className="flex-1 text-center">
                    <div className="text-2xl font-bold text-green-600">{data.analytics?.averageScore ?? 0}/10</div>
                    <div className="text-muted-foreground text-xs">Avg Score</div>
                  </div>

                  <div className="flex-1 text-center">
                    <div className="text-2xl font-bold text-blue-600">{isNaN(passRate) ? 0 : passRate}%</div>
                    <div className="text-muted-foreground text-xs">Pass Rate</div>
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
                  <div className="bg-primary/10 flex size-10 items-center justify-center rounded-full">
                    <ClipboardClock className="text-primary size-5" />
                  </div>
                  Recent Attempts
                </CardTitle>
                <CardDescription>Latest {_count.results} quiz attempts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {data.quiz?.results.map(taker => (
                  <div
                    key={taker.id}
                    className="bg-card/50 flex items-center justify-between rounded-lg border p-3"
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
                        <div className="text-muted-foreground flex items-center space-x-2 text-xs">
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
                      <div className="text-muted-foreground text-xs">{fmtTime(taker.timeTookInSeconds)}</div>
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
            <div className="border-border w-full rounded-lg border shadow-lg">
              <div className="border-border border-b p-6">
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
