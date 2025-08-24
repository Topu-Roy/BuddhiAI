"use client";

import { api } from "@/trpc/react";
import { ErrorCard } from "@/components/error-card";
import { Skeleton } from "@/components/ui/skeleton";

export function Header() {
  const { data: profile, isLoading, isError, refetch } = api.profile.getProfileInfo.useQuery();

  if (isLoading) {
    return (
      <div className="mb-8">
        <Skeleton className="h-7 w-40 sm:h-8 lg:h-10" />
        <Skeleton className="mt-2 h-4 w-60 sm:w-64 lg:h-5" />
      </div>
    );
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

  return (
    <header className="mb-8">
      <h1 className="text-xl font-bold tracking-tight sm:text-2xl lg:text-4xl">Hey, {profile.name} 👋</h1>
      <p className="text-foreground/50 mt-1 text-sm lg:text-base">Ready for your next challenge?</p>
    </header>
  );
}
