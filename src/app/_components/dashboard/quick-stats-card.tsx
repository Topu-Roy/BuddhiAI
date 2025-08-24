"use client";

import { api } from "@/trpc/react";
import { ChartSpline } from "lucide-react";
import { ErrorCard } from "@/components/error-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return { minutes, remainingSeconds };
};

export function QuickStatsCard() {
  const { data: profile, isLoading, isError, refetch } = api.profile.getProfileInfo.useQuery();

  if (isLoading) {
    return <QuickStatsCardSkelton />;
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

  const timeSpent = formatTime(profile.Stats?.totalTimeSpentInSeconds ?? 0);

  return (
    <Card className="shadow-sm">
      <CardHeader className="border-border border-b pb-4!">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="bg-primary/10 flex size-8 items-center justify-center rounded-full">
            <ChartSpline size={18} className="text-primary" />
          </div>
          Quick Stats
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-foreground/50">Quizzes Taken</span>
          <span className="font-medium">{profile._count.quizzesTaken}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-foreground/50">Quizzes Created</span>
          <span className="font-medium">{profile._count.quizzesCreated}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-foreground/50">Time spent</span>

          <span className="font-medium tracking-[0.4rem]">{`${timeSpent.minutes}:${timeSpent.remainingSeconds}`}</span>
        </div>
      </CardContent>
    </Card>
  );
}

function QuickStatsCardSkelton() {
  return (
    <Card className="bg-transparent shadow-sm">
      <CardHeader className="border-border border-b pb-4!">
        <div className="flex items-center gap-2">
          <Skeleton className="size-8 rounded-full" />
          <Skeleton className="h-6 w-28" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between text-sm">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="mb-1 h-4 w-16" />
        </div>
        <div className="flex justify-between text-sm">
          <Skeleton className="h-6 w-28" />
          <Skeleton className="mb-1 h-4 w-16" />
        </div>
        <div className="flex justify-between text-sm">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="mb-1 h-4 w-16" />
        </div>
      </CardContent>
    </Card>
  );
}
