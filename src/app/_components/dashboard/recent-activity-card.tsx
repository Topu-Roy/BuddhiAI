"use client";

import { api } from "@/trpc/react";
import { BrushCleaning, Calendar, Clock, Ellipsis, History, Repeat, Target } from "lucide-react";
import Link from "next/link";
import { ErrorCard } from "@/components/error-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// ---------- Utility ----------
const formatDate = (d: Date) =>
  new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(d));

const formatTime = (s: number) => {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
};

export function RecentActivityCard() {
  const { data: profile, isLoading, isError, refetch } = api.profile.getProfileInfo.useQuery();

  if (isLoading) {
    return <RecentActivityCardSkelton />;
  }

  if (isError || !profile) {
    return (
      <ErrorCard
        error="Oops... Something bad happened"
        prompt="Please refresh or try again later"
        onClick={refetch}
      />
    );
  }

  const created = profile.quizzesCreated;
  const taken = profile.quizzesTaken;

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="bg-primary/10 flex size-8 items-center justify-center rounded-full">
            <History size={18} className="text-primary" />
          </div>
          Recent Activity
        </CardTitle>
        <CardDescription>Your latest quizzes created & taken.</CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="created">
          <TabsList>
            <TabsTrigger value="created" className="flex items-center gap-1.5 px-4 py-2">
              <Repeat size={14} /> Created
            </TabsTrigger>
            <TabsTrigger value="taken" className="flex items-center gap-1.5 px-4 py-2">
              <Target size={14} /> Taken
            </TabsTrigger>
          </TabsList>

          {/* ---------- Created ---------- */}
          <TabsContent value="created">
            {!created.length ? (
              <div className="text-muted-foreground flex flex-col items-center justify-center gap-2 py-10">
                <div className="bg-destructive/10 flex size-10 items-center justify-center rounded-full">
                  <BrushCleaning size={18} className="text-destructive/80" />
                </div>
                <p>No quizzes created yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {created.map(quiz => (
                  <div key={quiz.id} className="flex items-center justify-between rounded-md border p-3 text-sm">
                    <div>
                      <p className="font-semibold">{quiz.topic}</p>
                      <div className="text-foreground/50 mt-1 flex items-center gap-3 text-xs">
                        <span className="flex items-center gap-1">
                          <Repeat size={12} /> {quiz.timesTaken} taken
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar size={12} /> {formatDate(quiz.createdAt)}
                        </span>
                      </div>
                    </div>

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant={"outline"}>
                          <Ellipsis />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="flex max-w-[10rem] flex-col items-center justify-center gap-2">
                        <Button className="w-full" variant={"outline"} asChild>
                          <Link href={`/quiz/view/${quiz.id}`}>View</Link>
                        </Button>
                        <Button className="w-full" variant={"outline"} asChild>
                          <Link href={`/quiz/take/${quiz.id}`}>Take</Link>
                        </Button>
                      </PopoverContent>
                    </Popover>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* ---------- Taken ---------- */}
          <TabsContent value="taken">
            {!taken.length ? (
              <div className="text-muted-foreground flex flex-col items-center justify-center gap-2 py-10">
                <div className="bg-destructive/10 flex size-10 items-center justify-center rounded-full">
                  <BrushCleaning size={18} className="text-destructive/80" />
                </div>
                <p>No quizzes taken yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {taken.map(result => {
                  const total = result.correctAnswer + result.incorrectAnswer;
                  const score = Math.round((result.correctAnswer / total) * 100);
                  return (
                    <div key={result.id} className="rounded-md border p-3 text-sm">
                      <div className="flex flex-row items-center justify-between">
                        <div>
                          <p className="line-clamp-1 truncate font-semibold">{result.Quiz.topic}</p>
                          <div className="text-foreground/50 mt-1 flex items-center justify-between gap-3 text-xs">
                            <Badge variant={score >= 80 ? "default" : "secondary"}>{score}%</Badge>
                            <span className="flex items-center gap-1">
                              <Clock size={12} /> {formatTime(result.timeTookInSeconds)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar size={12} /> {formatDate(result.createdAt)}
                            </span>
                          </div>
                        </div>

                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant={"outline"}>
                              <Ellipsis />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="flex max-w-[10rem] flex-col items-center justify-center gap-2">
                            <Button className="w-full" variant={"outline"} asChild>
                              <Link href={`/quiz/view/${result.Quiz.id}`}>View</Link>
                            </Button>
                            <Button className="w-full" variant={"outline"} asChild>
                              <Link href={`/quiz/results/${result.id}`}>Result</Link>
                            </Button>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function RecentActivityCardSkelton() {
  return (
    <Card className="bg-transparent">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Skeleton className="size-8 rounded-full" />
          <Skeleton className="h-6 w-32" />
        </div>
        <Skeleton className="h-4 w-52" />
      </CardHeader>

      <CardContent>
        <div className="border-border inline-flex flex-row items-center justify-between gap-2 rounded-md border p-1">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-20" />
        </div>

        <div className="mt-4 space-y-3">
          {Array.from({ length: 4 }).map((q, i) => (
            <div key={i} className="border-border rounded-md border p-3">
              <Skeleton className="h-4 w-14" />
              <div className="mt-1 inline-flex w-full items-center justify-start gap-3">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
