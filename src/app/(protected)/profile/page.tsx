import { Suspense } from "react";
import { getProfileWithNotFoundCheck } from "@/server/helpers/profile";
import { BookOpen, CalendarDays, GraduationCap, Mail, Trophy, User } from "lucide-react";
// import { unstable_cache } from "next/cache";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { EditDialog } from "../../_components/profile/edit-dialog";

export default function RenderProfileScreen() {
  return (
    <Suspense fallback={<ProfileScreenLoader />}>
      <ProfileScreen />
    </Suspense>
  );
}

async function ProfileScreen() {
  // const cached = unstable_cache(
  //   async () => {
  //     return await getProfileWithNotFoundCheck();
  //   },
  //   [],
  //   { tags: [""] }
  // );
  const { profile } = await getProfileWithNotFoundCheck();

  return (
    <div className="bg-background p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header Card */}
        <Card>
          <CardContent className="flex flex-row items-center justify-between">
            <div className="flex flex-col items-center space-y-4 text-center sm:flex-row sm:space-y-0 sm:space-x-6 sm:text-left">
              <Avatar className="h-24 w-24 sm:h-32 sm:w-32">
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
            <EditDialog profile={profile} />
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <GraduationCap className="h-5 w-5" />
                <span>Education & Interests</span>
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
              <Separator />
              <div>
                <h3 className="text-muted-foreground mb-3 text-sm font-medium tracking-wide">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((interest, index) => (
                    <Badge key={index} variant="secondary" className="text-sm">
                      {interest.charAt(0).toUpperCase() + interest.slice(1).toLocaleLowerCase()}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quiz Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="h-5 w-5" />
                <span>Quiz Statistics</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 text-center">
                  <div className="bg-primary/10 mx-auto flex h-12 w-12 items-center justify-center rounded-full">
                    <BookOpen className="text-primary h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{profile._count.quizzesCreated}</p>
                    <p className="text-muted-foreground text-sm">Quizzes Created</p>
                  </div>
                </div>
                <div className="space-y-2 text-center">
                  <div className="bg-secondary/50 mx-auto flex h-12 w-12 items-center justify-center rounded-full">
                    <Trophy className="text-secondary-foreground h-6 w-6" />
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
            <CardTitle>Account Details</CardTitle>
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
    <div className="bg-background p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header Card */}
        <Card>
          <CardContent className="flex flex-row items-center justify-between">
            <div className="flex flex-col items-center space-y-4 text-center sm:flex-row sm:space-y-0 sm:space-x-6 sm:text-left">
              <Skeleton className="h-24 w-24 rounded-full sm:h-32 sm:w-32" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-8 w-48" />
                <div className="flex flex-col space-y-1 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-4 w-40" />
              </div>
            </div>
            <Skeleton className="h-10 w-24" />
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Education & Interests */}
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-48" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Skeleton className="mb-1 h-4 w-28" />
                <Skeleton className="h-6 w-32" />
              </div>
              <Skeleton className="h-[1px] w-full" />
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
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-40" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="space-y-2 text-center">
                    <Skeleton className="mx-auto h-12 w-12 rounded-full" />
                    <Skeleton className="mx-auto h-7 w-8" />
                    <Skeleton className="mx-auto h-4 w-28" />
                  </div>
                ))}
              </div>
              <Skeleton className="h-[1px] w-full" />
              <div className="text-center">
                <Skeleton className="mx-auto h-4 w-36" />
                <Skeleton className="mx-auto mt-1 h-6 w-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Account Details */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i}>
                  <Skeleton className="mb-1 h-4 w-20" />
                  <Skeleton className="h-4 w-full font-mono" />
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
