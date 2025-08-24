"use client";

import { EditDialog } from "@/app/_components/profile/edit-dialog";
import { api } from "@/trpc/react";
import { BookOpen, CalendarDays, GraduationCap, Mail, Smile, Trophy, User } from "lucide-react";
import { ErrorCard } from "@/components/error-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export default function Profile() {
  const { data: profile, isLoading, isError, refetch } = api.profile.getProfileInfo.useQuery();

  if (isLoading) {
    return <ProfileScreenLoader />;
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
    <div className="p-4 md:p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header Card */}
        <Card>
          <CardContent className="relative">
            <div className="flex flex-col items-center space-y-4 text-center sm:flex-row sm:space-y-0 sm:space-x-6 sm:text-left">
              <Avatar className="border-border h-24 w-24 border sm:h-32 sm:w-32">
                <AvatarImage src={profile.image ?? ""} alt={profile.name} />
                <AvatarFallback className="text-2xl font-semibold">{getInitials(profile.name)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">{profile.name}</h1>
                <div className="text-muted-foreground flex flex-col space-y-1 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
                  <div className="flex items-center justify-center space-x-2 sm:justify-start">
                    <Mail className="h-4 w-4" />
                    <span className="text-sm">{profile.email}</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2 sm:justify-start">
                    <User className="h-4 w-4" />
                    <span className="text-sm">{profile.age} years old</span>
                  </div>
                </div>
                <div className="text-muted-foreground flex items-center justify-center space-x-2 sm:justify-start">
                  <CalendarDays className="h-4 w-4" />
                  <span className="text-sm">Member since {formatDate(profile.createdAt)}</span>
                </div>
              </div>
            </div>
            <div className="absolute top-[3%] right-[3%] md:top-[50%] md:-translate-y-1/2">
              <EditDialog profile={profile} />
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Personal Information */}
          <Card>
            <CardHeader className="border-border border-b">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="bg-primary/10 flex size-8 items-center justify-center rounded-full">
                  <GraduationCap size={18} className="text-primary" />
                </div>
                Education & Interests
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-muted-foreground text-sm font-medium tracking-wide">Education Level</h3>
                <p className="mt-1 text-lg font-medium">
                  {profile.educationLevel.charAt(0).toUpperCase() +
                    profile.educationLevel.slice(1).toLocaleLowerCase().replace("_", " ")}
                </p>
              </div>
              <div>
                <h3 className="text-muted-foreground mb-3 text-sm font-medium tracking-wide">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((interest, index) => (
                    <Badge key={index} variant="secondary" className="bg-primary/10 text-foreground/80 text-xs">
                      {interest.charAt(0).toUpperCase() + interest.slice(1).toLocaleLowerCase()}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quiz Statistics */}
          <Card>
            <CardHeader className="border-border border-b">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="bg-primary/10 flex size-8 items-center justify-center rounded-full">
                  <Trophy size={18} className="text-primary" />
                </div>
                Quiz Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="divide-border flex items-center justify-between divide-x">
                <div className="flex-1 space-y-2 text-center">
                  <div className="bg-primary/10 mx-auto flex h-12 w-12 items-center justify-center rounded-full">
                    <BookOpen className="text-primary h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{profile._count.quizzesCreated}</p>
                    <p className="text-muted-foreground text-sm">Quizzes Created</p>
                  </div>
                </div>

                <div className="flex-1 space-y-2 text-center">
                  <div className="bg-primary/10 mx-auto flex h-12 w-12 items-center justify-center rounded-full">
                    <Trophy className="text-primary h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{profile._count.quizzesTaken}</p>
                    <p className="text-muted-foreground text-sm">Quizzes Taken</p>
                  </div>
                </div>
              </div>
              <Separator />
              <div className="text-center">
                <p className="text-muted-foreground text-sm">Quiz Success Rate</p>
                <p className="mt-1 text-lg font-semibold">
                  {profile._count.quizzesCreated > 0
                    ? Math.round(
                        (profile._count.quizzesCreated /
                          (profile._count.quizzesCreated + profile._count.quizzesTaken)) *
                          100
                      )
                    : 0}
                  % Creator
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Account Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="bg-primary/10 flex size-8 items-center justify-center rounded-full">
                <Smile size={18} className="text-primary" />
              </div>
              Account details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="text-muted-foreground text-sm font-medium tracking-wide uppercase">User ID</h3>
                <p className="mt-1 font-mono text-sm">{profile.userId}</p>
              </div>
              <div>
                <h3 className="text-muted-foreground text-sm font-medium tracking-wide uppercase">Account ID</h3>
                <p className="mt-1 font-mono text-sm">{profile.id}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ProfileScreenLoader() {
  return (
    <div className="p-4 md:p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* ------------------------------------------------------------------ */}
        {/* Header Card Skeleton                                               */}
        {/* ------------------------------------------------------------------ */}
        <Card className="bg-transparent">
          <CardContent className="relative">
            <div className="flex flex-col items-center space-y-4 text-center sm:flex-row sm:space-y-0 sm:space-x-6 sm:text-left">
              {/* Avatar */}
              <Skeleton className="h-24 w-24 rounded-full sm:h-32 sm:w-32" />

              {/* Text block */}
              <div className="flex-1 space-y-2">
                <Skeleton className="mx-auto h-8 w-48 sm:mx-0" />
                <div className="flex flex-col items-center space-y-1 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-28" />
                </div>
                <Skeleton className="mx-auto h-4 w-36 sm:mx-0" />
              </div>
            </div>

            {/* Edit button */}
            <Skeleton className="absolute top-[3%] right-[3%] h-10 w-10 rounded-md md:top-1/2 md:-translate-y-1/2" />
          </CardContent>
        </Card>

        {/* ------------------------------------------------------------------ */}
        {/* Grid: Education & Quiz Statistics                                  */}
        {/* ------------------------------------------------------------------ */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Education & Interests */}
          <Card className="bg-transparent">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-5 w-40" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Skeleton className="h-4 w-28" />
                <Skeleton className="mt-1 h-6 w-36" />
              </div>
              <div>
                <Skeleton className="mb-3 h-4 w-16" />
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-6 w-16 rounded-full" />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quiz Statistics */}
          <Card className="bg-transparent">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-5 w-32" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex divide-x">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="flex-1 space-y-2 text-center">
                    <Skeleton className="mx-auto h-12 w-12 rounded-full" />
                    <Skeleton className="mx-auto h-7 w-10" />
                    <Skeleton className="mx-auto h-4 w-24" />
                  </div>
                ))}
              </div>

              <Separator />
              <div className="text-center">
                <Skeleton className="mx-auto h-4 w-32" />
                <Skeleton className="mx-auto mt-1 h-6 w-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* Account Details                                                    */}
        {/* ------------------------------------------------------------------ */}
        <Card className="bg-transparent">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-5 w-28" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i}>
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="mt-1 h-5 w-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

const formatDate = (dateString: string | Date) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase();
};
