import { Suspense } from "react";
import { getProfileWithNotFoundCheck } from "@/server/helpers/profile";
import { ScanFace } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export async function RenderProfileCard() {
  return (
    <Suspense fallback={<ProfileCardSkelton />}>
      <ProfileCard />
    </Suspense>
  );
}

async function ProfileCard() {
  const { profile } = await getProfileWithNotFoundCheck();

  return (
    <Card className="shadow-sm">
      <CardHeader className="border-border border-b !pb-4">
        <CardTitle className="inline-flex flex-row items-center gap-2 text-lg">
          <ScanFace size={16} className="text-sky-400" /> Profile
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
              <Badge className="border-border text-foreground border bg-transparent text-xs" key={interest}>
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
    <Card>
      <CardHeader className="border-border border-b !pb-4">
        <Skeleton className="h-8 w-20" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Skeleton className="mb-1 h-4 w-16" />
          <Skeleton className="h-7 w-24" />
        </div>
        <div>
          <Skeleton className="mb-1 h-4 w-16" />
          <Skeleton className="h-7 w-24" />
        </div>
        <div>
          <Skeleton className="mb-1 h-4 w-16" />
          <div className="flex flex-row gap-1.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton className="h-8 w-10" key={i} />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// if (isError || !profile) {
//   return (
//     <Card className="flex items-center justify-center">
//       <div className="space-y-2 text-center">
//         <div className="bg-destructive/10 mx-auto flex size-12 items-center justify-center rounded-full p-2">
//           <X size={18} className="text-destructive" />
//         </div>
//         <p className="text-destructive text-2xl font-semibold">{"Couldn't load data"}</p>
//         <p className="text-muted-foreground pb-4">Please refresh or try again later.</p>
//         <Button onClick={() => refetch()} variant={"outline"}>
//           Refresh
//         </Button>
//       </div>
//     </Card>
//   );
// }
