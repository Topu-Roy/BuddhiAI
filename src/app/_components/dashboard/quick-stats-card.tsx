"use client";

import { api } from "@/trpc/react";
import { Target, X } from "lucide-react";
import { Button } from "@/components/ui/button";
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
      <Card className="flex items-center justify-center">
        <div className="space-y-2 text-center">
          <div className="bg-destructive/10 mx-auto flex size-12 items-center justify-center rounded-full p-2">
            <X size={18} className="text-destructive" />
          </div>
          <p className="text-destructive text-2xl font-semibold">{"Couldn't load data"}</p>
          <p className="text-muted-foreground pb-4">Please refresh or try again later.</p>
          <Button onClick={() => refetch()} variant={"outline"}>
            Refresh
          </Button>
        </div>
      </Card>
    );
  }

  const timeSpent = formatTime(profile.Stats?.totalTimeSpentInSeconds ?? 0);

  return (
    <Card className="shadow-sm">
      <CardHeader className="border-border border-b pb-4!">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Target className="h-4 w-4 text-emerald-500" />
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
    <Card className="shadow-sm">
      <CardHeader className="border-border border-b pb-4!">
        <Skeleton className="h-6 w-28" />
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
