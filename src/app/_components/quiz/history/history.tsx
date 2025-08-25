"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import { BarChart3, Calendar, CheckCircle, Clock, Trophy, User, Users } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ErrorCard } from "@/components/error-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type TabType = "taken" | "created";

export function History({ page = 1 }: { page?: number }) {
  const [activeTab, setActiveTab] = useState<TabType>("taken");
  const [takenPage, setTakenPage] = useState(page);
  const [createdPage, setCreatedPage] = useState(page);

  // Profile query - shared between tabs
  const { data: profile, error: profileError, refetch } = api.profile.getProfileInfo.useQuery();

  // Taken history query
  const {
    data: takenHistory,
    error: takenError,
    isLoading: takenLoading,
  } = api.profile.getPaginatedTakenHistory.useQuery({ page: takenPage }, { enabled: activeTab === "taken" });

  // Created history query
  const {
    data: createdHistory,
    error: createdError,
    isLoading: createdLoading,
  } = api.profile.getPaginatedCreatedHistory.useQuery({ page: createdPage }, { enabled: activeTab === "created" });

  const error = profileError ?? (activeTab === "taken" ? takenError : createdError);
  const isLoading = !profile || (activeTab === "taken" ? takenLoading : createdLoading);

  if (error) {
    return (
      <ErrorCard
        error="Oops... Something bad happened"
        prompt="Please refresh or try again later"
        onClick={refetch}
      />
    );
  }

  if (!profile) {
    return <HistorySkeleton />;
  }

  const totalQuizzes = profile._count.quizzesTaken;
  const totalCorrect = profile.Stats?.totalCorrectAnswers ?? 0;
  const totalIncorrect = profile.Stats?.totalIncorrectAnswers ?? 0;
  const averageScore = totalQuizzes > 0 ? getScorePercentage(totalCorrect, totalCorrect + totalIncorrect) : 0;
  const totalTimeSpent = profile.Stats?.totalTimeSpentInSeconds ?? 0;

  const stats = [
    {
      label: "Total Quizzes",
      value: totalQuizzes,
      icon: BarChart3,
      accent: "text-indigo-500",
      bg: "bg-indigo-50 dark:bg-indigo-950/30",
    },
    {
      label: "Average Score",
      value: `${averageScore}%`,
      icon: Trophy,
      accent: "text-emerald-500",
      bg: "bg-emerald-50 dark:bg-emerald-950/30",
    },
    {
      label: "Correct Answers",
      value: totalCorrect,
      icon: CheckCircle,
      accent: "text-violet-500",
      bg: "bg-violet-50 dark:bg-violet-950/30",
    },
    {
      label: "Time Spent",
      value: formatTime(totalTimeSpent),
      icon: Clock,
      accent: "text-amber-500",
      bg: "bg-amber-50 dark:bg-amber-950/30",
    },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-4 p-4">
      {/* Header */}
      <div className="space-y-2 pb-2 text-center">
        <h1 className="text-foreground text-2xl font-bold lg:text-4xl">Quiz History</h1>
        <p className="text-muted-foreground text-sm leading-2">Track your learning progress and achievements</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, accent, bg }) => (
          <Card key={label} className="!py-2 shadow-sm transition-all duration-300 hover:shadow-md">
            <CardContent className="flex flex-col items-center justify-center gap-2 p-3 text-center sm:flex-row sm:items-center sm:gap-4 sm:p-4 sm:text-left">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${bg} ${accent} transition-transform duration-300 group-hover:scale-110 sm:h-12 sm:w-12 sm:rounded-xl`}
              >
                <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>

              <div>
                <p className="text-muted-foreground text-xs font-medium sm:text-sm">{label}</p>
                <p className="text-foreground text-lg font-semibold sm:text-2xl">{value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabbed History */}
      <Tabs value={activeTab} onValueChange={value => setActiveTab(value as TabType)}>
        <TabsList className="grid h-11.5 w-full grid-cols-2">
          <TabsTrigger value="taken" className="flex h-10 items-center gap-2">
            <Trophy className="h-4 w-4" />
            Taken Quizzes
          </TabsTrigger>
          <TabsTrigger value="created" className="flex h-10 items-center gap-2">
            <Users className="h-4 w-4" />
            Created Quizzes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="taken">
          <Card className="bg-card/80 border-border border shadow-lg backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-foreground text-2xl">Recent Quiz Results</CardTitle>
              <CardDescription>Your latest quiz performances and scores</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading || !takenHistory ? (
                <HistoryContentSkeleton />
              ) : (
                <>
                  <div className="space-y-4">
                    {takenHistory._count.quizzesTaken === 0 ? (
                      <div className="text-muted-foreground py-12 text-center">
                        <Trophy className="text-muted-foreground/50 mx-auto mb-4 h-12 w-12" />
                        <p className="text-lg font-medium">No quizzes taken yet</p>
                        <p className="text-sm">Start taking quizzes to see your history here!</p>
                      </div>
                    ) : (
                      takenHistory.quizzesTaken.map(quiz => {
                        const percentage = getScorePercentage(quiz.correctAnswer, quiz.incorrectAnswer);

                        return (
                          <Link href={`/quiz/results/${quiz.id}`} key={quiz.id} className="group block">
                            <div className="bg-card border-border/50 hover:border-border group-hover:bg-muted/30 rounded-xl border p-4 transition-all duration-200 hover:shadow-md">
                              {/* Mobile Layout */}
                              <div className="flex flex-col gap-4 md:hidden">
                                {/* Score Badge - Prominent on mobile */}
                                <div className="flex items-center justify-between">
                                  <div
                                    className={`inline-flex items-center justify-center rounded-full border px-4 py-2 font-bold ${getScoreColor(percentage)}`}
                                  >
                                    {percentage}%
                                  </div>
                                  <div className="text-right">
                                    <div className="text-muted-foreground flex items-center gap-1 text-sm">
                                      <Calendar className="h-3.5 w-3.5" />
                                      {formatDate(quiz.createdAt)}
                                    </div>
                                  </div>
                                </div>

                                {/* Topic and Author */}
                                <div>
                                  <h3 className="text-foreground mb-1 text-lg leading-tight font-semibold">
                                    {quiz.Quiz.topic}
                                  </h3>
                                  <p className="text-muted-foreground text-sm">
                                    by {quiz.Quiz.Profile?.name ?? "Unknown"}
                                  </p>
                                </div>

                                {/* Stats */}
                                <div className="flex flex-wrap items-center gap-4 text-sm">
                                  <span className="flex items-center gap-1.5">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                    <span className="font-medium">
                                      {quiz.correctAnswer}/{quiz.correctAnswer + quiz.incorrectAnswer}
                                    </span>
                                    <span className="text-muted-foreground">correct</span>
                                  </span>

                                  <span className="flex items-center gap-1.5">
                                    <Clock className="text-muted-foreground h-4 w-4" />
                                    <span className="font-medium">{formatTime(quiz.timeTookInSeconds)}</span>
                                  </span>
                                </div>
                              </div>

                              {/* Desktop Layout */}
                              <div className="hidden md:grid md:grid-cols-12 md:items-center md:gap-6">
                                {/* Left Side - Score (3 columns) */}
                                <div className="col-span-3 lg:col-span-2">
                                  <div
                                    className={`inline-flex items-center justify-center rounded-full border px-4 py-2 font-bold ${getScoreColor(percentage)}`}
                                  >
                                    {percentage}%
                                  </div>
                                </div>

                                {/* Right Side - Details (9 columns) */}
                                <div className="col-span-9 space-y-3 lg:col-span-10">
                                  {/* Topic and Author Row */}
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <h3 className="text-foreground text-lg leading-tight font-semibold">
                                        {quiz.Quiz.topic}
                                      </h3>
                                      <p className="text-muted-foreground mt-0.5 text-sm">
                                        by {quiz.Quiz.Profile?.name ?? "Unknown"}
                                      </p>
                                    </div>
                                    <div className="text-muted-foreground flex items-center gap-1 text-sm">
                                      <Calendar className="h-4 w-4" />
                                      {formatDate(quiz.createdAt)}
                                    </div>
                                  </div>

                                  {/* Stats Row */}
                                  <div className="flex items-center gap-6 text-sm">
                                    <span className="flex items-center gap-2">
                                      <CheckCircle className="h-4 w-4 text-green-600" />
                                      <span className="font-medium">
                                        {quiz.correctAnswer}/{quiz.correctAnswer + quiz.incorrectAnswer}
                                      </span>
                                      <span className="text-muted-foreground">correct</span>
                                    </span>

                                    <span className="flex items-center gap-2">
                                      <Clock className="text-muted-foreground h-4 w-4" />
                                      <span className="font-medium">{formatTime(quiz.timeTookInSeconds)}</span>
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Link>
                        );
                      })
                    )}
                  </div>

                  {takenHistory.totalPages > 1 && (
                    <PaginationComponent
                      currentPage={takenPage}
                      totalPages={takenHistory.totalPages}
                      onPageChange={setTakenPage}
                    />
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="created">
          <Card className="bg-card border-border border shadow-lg backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-foreground text-2xl">Created Quizzes</CardTitle>
              <CardDescription>Quizzes you&apos;ve created and their engagement</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading || !createdHistory ? (
                <HistoryContentSkeleton />
              ) : (
                <>
                  <div className="space-y-4">
                    {createdHistory._count.quizzesCreated === 0 ? (
                      <div className="text-muted-foreground py-12 text-center">
                        <Users className="text-muted-foreground/50 mx-auto mb-4 h-12 w-12" />
                        <p className="text-lg font-medium">No quizzes created yet</p>
                        <p className="text-sm">Create your first quiz to see it here!</p>
                      </div>
                    ) : (
                      createdHistory.quizzesCreated.map(quiz => (
                        <div key={quiz.id}>
                          <div className="bg-card border-border/50 hover:bg-muted/70 flex flex-col items-start justify-between gap-4 rounded-lg border p-4 shadow-md transition-colors sm:flex-row sm:items-center">
                            {/* Left side – untouched */}
                            <div className="flex w-full items-center gap-4">
                              <div className="border-border flex items-center justify-center gap-2 rounded-full border px-3 py-2 font-semibold">
                                <Users className="mr-2 inline h-4 w-4" />
                                {quiz.timesTaken}
                              </div>
                              <div className="flex w-full flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
                                <div className="sm:flex-1">
                                  <h3 className="text-foreground font-semibold">{quiz.topic}</h3>
                                  <div className="text-muted-foreground mt-2 text-sm">
                                    <div className="flex flex-wrap items-center gap-2">
                                      <span className="flex items-center gap-1">
                                        <Trophy className="h-4 w-4" />
                                        {quiz.timesTaken} times taken
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <User className="h-4 w-4" />
                                        By {createdHistory.name}
                                      </span>
                                    </div>
                                    <span className="text-muted-foreground text-xs">
                                      {formatDate(quiz.createdAt)}
                                    </span>
                                  </div>
                                </div>

                                {/* Right side – column on mobile, row on ≥sm */}
                                <Button variant="outline" size="sm" asChild>
                                  <Link href={`/quiz/view/${quiz.id}`}>View Quiz</Link>
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {createdHistory.totalPages > 1 && (
                    <PaginationComponent
                      currentPage={createdPage}
                      totalPages={createdHistory.totalPages}
                      onPageChange={setCreatedPage}
                    />
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function PaginationComponent({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <Pagination className="py-8">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            aria-disabled={currentPage <= 1}
            className={cn({
              "pointer-events-none opacity-50": currentPage <= 1,
            })}
          />
        </PaginationItem>

        {(() => {
          const maxVisible = 5;
          let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
          const endPage = Math.min(totalPages, startPage + maxVisible - 1);

          if (endPage - startPage + 1 < maxVisible) {
            startPage = Math.max(1, endPage - maxVisible + 1);
          }

          return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map(index => (
            <PaginationItem key={index}>
              <PaginationLink onClick={() => onPageChange(index)} isActive={index === currentPage}>
                {index}
              </PaginationLink>
            </PaginationItem>
          ));
        })()}

        {totalPages > 5 && currentPage < totalPages - 2 && (
          <>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink isActive={false} onClick={() => onPageChange(totalPages)}>
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          </>
        )}

        <PaginationItem>
          <PaginationNext
            aria-disabled={currentPage >= totalPages}
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            className={cn({
              "pointer-events-none opacity-50": currentPage >= totalPages,
            })}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

function HistoryContentSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="border-border flex items-center justify-between rounded-md border p-2">
          <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-14 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-28" />
              <div className="flex gap-4">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </div>
          <Skeleton className="h-4 w-16" />
        </div>
      ))}
    </div>
  );
}

export function HistorySkeleton() {
  return (
    <div className="mx-auto max-w-5xl space-y-4 p-4">
      {/* Header */}
      <div className="space-y-2 pb-2 text-center">
        <Skeleton className="mx-auto h-8 w-48 lg:h-10 lg:w-64" />
        <Skeleton className="mx-auto h-4 w-72" />
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="border-border border bg-transparent !py-2">
            <CardContent className="flex flex-col items-center justify-center gap-2 p-3 sm:flex-row sm:items-center sm:gap-4 sm:p-4">
              <Skeleton className="h-10 w-10 rounded-full sm:h-12 sm:w-12" />
              <div className="w-full">
                <Skeleton className="mx-auto h-3 w-20 sm:mx-0 sm:h-4" />
                <Skeleton className="mx-auto mt-1 h-6 w-16 sm:mx-0 sm:h-7" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabbed Content Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Card className="bg-transparent shadow-lg">
          <CardHeader>
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <HistoryContentSkeleton />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Helper functions
const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
};

const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    // hour: "2-digit",
    // minute: "2-digit",
  });
};

const getScorePercentage = (correct: number, incorrect: number) => {
  const total = correct + incorrect;
  return total > 0 ? Math.round((correct / total) * 100) : 0;
};

function getScoreColor(percentage: number): string {
  if (percentage >= 90)
    return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800";
  if (percentage >= 75)
    return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800";
  if (percentage >= 60)
    return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800";
  return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800";
}
