"use client";

import { api } from "@/trpc/react";
import { Smile } from "lucide-react";
import { ErrorCard } from "@/components/error-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ProfileCard() {
  const { data: profile, isLoading, isError, refetch } = api.profile.getProfileInfo.useQuery();

  if (isLoading) {
    return <ProfileCardSkelton />;
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
    <Card className="shadow-sm">
      <CardHeader className="border-border border-b !pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="bg-primary/10 flex size-8 items-center justify-center rounded-full">
            <Smile size={18} className="text-primary" />
          </div>
          Profile details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-foreground/50 text-sm">Education</p>
          <p className="font-medium">
            {profile.educationLevel.charAt(0).toUpperCase() + profile.educationLevel.slice(1).toLowerCase()}
          </p>
        </div>
        <div>
          <p className="text-foreground/50 text-sm">Age</p>
          <p className="font-medium">{profile.age} years</p>
        </div>
        <div>
          <p className="text-foreground/50 text-sm">Interests</p>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {profile.interests.map(interest => (
              <Badge
                className="border-border text-card-foreground/80 bg-primary/10 border text-xs sm:text-sm"
                key={interest}
              >
                {interest.charAt(0).toUpperCase() + interest.slice(1).toLowerCase()}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ProfileCardSkelton() {
  return (
    <Card className="bg-transparent shadow-sm">
      <CardHeader className="border-border border-b !pb-4">
        <div className="flex items-center gap-2">
          <Skeleton className="size-8 rounded-full" />
          <Skeleton className="h-5 w-32" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Skeleton className="mb-1 h-4 w-16" />
          <Skeleton className="h-5 w-24" />
        </div>
        <div>
          <Skeleton className="mb-1 h-4 w-8" />
          <Skeleton className="h-5 w-12" />
        </div>
        <div>
          <Skeleton className="mb-1 h-4 w-14" />
          <div className="mt-1 flex flex-wrap gap-1.5">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-6 w-16 rounded-full" />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
