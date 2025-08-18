import { Suspense } from "react";
import { getProfileWithNotFoundCheck } from "@/server/helpers/profile";
import { Skeleton } from "@/components/ui/skeleton";

export function RenderHeader() {
  return (
    <Suspense
      fallback={
        <div className="mb-10 space-y-3">
          <Skeleton className="h-10 w-sm" />
          <Skeleton className="h-8 w-xs" />
        </div>
      }
    >
      <Header />
    </Suspense>
  );
}

async function Header() {
  const { profile } = await getProfileWithNotFoundCheck();

  return (
    <header className="mb-10">
      <h1 className="text-4xl font-bold tracking-tight">Hey, {profile.name} 👋</h1>
      <p className="text-foreground/50 mt-1">Ready for your next challenge?</p>
    </header>
  );
}
