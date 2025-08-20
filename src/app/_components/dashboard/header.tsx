"use client";

import { api } from "@/trpc/react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function Header() {
  const { data: profile, isLoading, isError, refetch } = api.profile.getProfileInfo.useQuery();

  if (isLoading) {
    return (
      <div className="mb-10 space-y-3">
        <Skeleton className="h-10 w-sm" />
        <Skeleton className="h-8 w-xs" />
      </div>
    );
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

  return (
    <header className="mb-10">
      <h1 className="text-4xl font-bold tracking-tight">Hey, {profile.name} 👋</h1>
      <p className="text-foreground/50 mt-1">Ready for your next challenge?</p>
    </header>
  );
}
