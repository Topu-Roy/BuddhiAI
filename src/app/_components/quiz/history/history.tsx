"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import { Calendar, CheckCircle, Clock, GraduationCap, Heart, Trophy, User, Users, X, XCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
  const { data: profile, error: profileError } = api.profile.getProfileInfo.useQuery();

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
      <div className="flex min-h-[50vh] w-full items-center justify-center">
        <div className="space-y-2 text-center">
          <div className="bg-destructive/10 mx-auto flex size-12 items-center justify-center rounded-full p-2">
            <X size={18} className="text-destructive" />
          </div>
          <p className="text-destructive text-2xl font-semibold">{"Couldn't load history"}</p>
          <p className="text-destructive">{error?.message}</p>
          <p className="text-muted-foreground pb-4">Please refresh or try again later.</p>
          <Button variant={"outline"} asChild>
            <Link href={"/dashboard"}>Dashboard</Link>
          </Button>
        </div>
      </div>
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

  return (
    <>
      {/* Profile Info Card */}
      <Card className="bg-card/80 border-0 shadow-lg backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-6">
            <Avatar className="border-background h-20 w-20 border-4 shadow-lg">
              <AvatarImage src={profile.image ?? ""} alt={profile.name} />
              <AvatarFallback className="from-primary to-primary/80 text-primary-foreground bg-gradient-to-br text-xl font-semibold">
                {profile.name
                  ?.split(" ")
                  .map(n => n[0])
                  .join("") ?? "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-foreground text-2xl font-bold">{profile.name}</h2>
              <p className="text-muted-foreground mt-1 flex items-center gap-2">
                <User className="h-4 w-4" />
                {profile.email}
              </p>
              <div className="text-muted-foreground mt-2 flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Age {profile.age}
                </span>
                <span className="flex items-center gap-1">
                  <GraduationCap className="h-4 w-4" />
                  {profile.educationLevel}
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-4">
            <div>
              <h3 className="text-foreground mb-2 flex items-center gap-2 text-sm font-semibold">
                <Heart className="h-4 w-4" />
                Interests
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interest, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  >
                    {interest.charAt(0) + interest.slice(1).toLowerCase()}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <Card className="bg-primary text-primary-foreground border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-foreground/80 text-sm font-medium">Total Quizzes</p>
                <p className="text-3xl font-bold">{totalQuizzes}</p>
              </div>
              <Trophy className="text-primary-foreground/60 h-8 w-8" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-green-600 text-white shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-100">Average Score</p>
                <p className="text-3xl font-bold">{averageScore}%</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-violet-600 text-white shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-violet-100">Correct Answers</p>
                <p className="text-3xl font-bold">{totalCorrect}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-violet-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-orange-600 text-white shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-100">Time Spent</p>
                <p className="text-3xl font-bold">{formatTime(totalTimeSpent)}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabbed History */}
      <Tabs value={activeTab} onValueChange={value => setActiveTab(value as TabType)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="taken" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Taken Quizzes
          </TabsTrigger>
          <TabsTrigger value="created" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Created Quizzes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="taken">
          <Card className="bg-card/80 border-0 shadow-lg backdrop-blur-sm">
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
                        const total = quiz.correctAnswer + quiz.incorrectAnswer;

                        return (
                          <div key={quiz.id}>
                            <div className="bg-muted/50 hover:bg-muted/70 flex items-center justify-between rounded-lg p-4 transition-colors">
                              <div className="flex items-center gap-4">
                                <div
                                  className={`rounded-full border px-3 py-1 font-semibold ${getScoreColor(percentage)}`}
                                >
                                  {percentage}%
                                </div>
                                <div>
                                  <h3 className="text-foreground font-semibold">
                                    {quiz.Quiz.topic}
                                    <span className="text-foreground/50 pl-4 text-sm">
                                      ({quiz.Quiz.Profile?.name ? ` ${quiz.Quiz.Profile?.name} ` : " Unknown "})
                                    </span>
                                  </h3>
                                  <div className="text-muted-foreground mt-1 flex items-center gap-4 text-sm">
                                    <span className="flex items-center gap-1">
                                      <CheckCircle className="h-4 w-4 text-green-600" />
                                      {quiz.correctAnswer} correct
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <XCircle className="h-4 w-4 text-red-600" />
                                      {quiz.incorrectAnswer} incorrect
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Clock className="h-4 w-4" />
                                      {formatTime(quiz.timeTookInSeconds)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-muted-foreground text-sm">{formatDate(quiz.createdAt)}</p>
                                <p className="text-muted-foreground/80 text-xs">
                                  {quiz.correctAnswer}/{total} questions
                                </p>
                              </div>
                            </div>
                          </div>
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
          <Card className="bg-card/80 border-0 shadow-lg backdrop-blur-sm">
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
                          <div className="bg-muted/50 hover:bg-muted/70 flex items-center justify-between rounded-lg p-4 transition-colors">
                            <div className="flex items-center gap-4">
                              <div className="rounded-full border border-blue-200 bg-blue-100 px-3 py-1 font-semibold text-blue-800">
                                <Users className="mr-1 inline h-4 w-4" />
                                {quiz.timesTaken}
                              </div>
                              <div>
                                <h3 className="text-foreground font-semibold">{quiz.topic}</h3>
                                <div className="text-muted-foreground mt-1 flex items-center gap-4 text-sm">
                                  <span className="flex items-center gap-1">
                                    <Trophy className="h-4 w-4" />
                                    {quiz.timesTaken} times taken
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <User className="h-4 w-4" />
                                    By {createdHistory.name}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="space-y-4 text-right">
                              <p className="text-muted-foreground text-xs">{formatDate(quiz.createdAt)}</p>
                              <Button variant="outline" size="sm" asChild>
                                <Link href={`/quiz/view/${quiz.id}`}>View Quiz</Link>
                              </Button>
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
    </>
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
        <div key={i} className="flex items-center justify-between rounded-lg p-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-14 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-48 rounded" />
              <div className="flex gap-4">
                <Skeleton className="h-4 w-20 rounded" />
                <Skeleton className="h-4 w-24 rounded" />
                <Skeleton className="h-4 w-16 rounded" />
              </div>
            </div>
          </div>
          <Skeleton className="h-4 w-16 rounded" />
        </div>
      ))}
    </div>
  );
}

export function HistorySkeleton() {
  return (
    <>
      {/* Profile Card */}
      <Card className="bg-card/80 border-0 shadow-lg backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-6">
            <Skeleton className="h-20 w-20 rounded-full border-4" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-7 w-40 rounded" />
              <Skeleton className="h-4 w-56 rounded" />
              <div className="flex gap-4">
                <Skeleton className="h-4 w-20 rounded" />
                <Skeleton className="h-4 w-28 rounded" />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-4">
            <div>
              <Skeleton className="mb-2 h-4 w-16 rounded" />
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-6 w-16 rounded-full" />
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Skeleton className="h-3 w-20 rounded" />
                  <Skeleton className="h-8 w-12 rounded" />
                </div>
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabbed Content Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-10 w-full rounded" />
        <Card className="bg-card/80 border-0 shadow-lg backdrop-blur-sm">
          <CardHeader>
            <Skeleton className="h-7 w-48 rounded" />
            <Skeleton className="h-4 w-64 rounded" />
          </CardHeader>
          <CardContent>
            <HistoryContentSkeleton />
          </CardContent>
        </Card>
      </div>
    </>
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
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getScorePercentage = (correct: number, incorrect: number) => {
  const total = correct + incorrect;
  return total > 0 ? Math.round((correct / total) * 100) : 0;
};

const getScoreColor = (percentage: number) => {
  if (percentage >= 80) return "text-green-600 bg-green-50 border-green-200";
  if (percentage >= 60) return "text-yellow-600 bg-yellow-50 border-yellow-200";
  return "text-red-600 bg-red-50 border-red-200";
};
