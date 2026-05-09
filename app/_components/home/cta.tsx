"use client";

import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export function CTA() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <>
        <Button size="lg" className="w-full sm:w-auto">
          <Link href={"/auth/sign-in"}>Get started</Link>
        </Button>
        <Button variant="outline" size="lg" className="w-full text-black sm:w-auto dark:text-foreground">
          <Link href={"/quiz/explore?page=1"}>Explore</Link>
        </Button>
      </>
    );
  }

  return (
    <>
      {session?.user.id ? (
        <>
          <Button size="lg" className="w-full sm:w-auto">
            <Link href={"/dashboard"}>Start Learning Now</Link>
          </Button>
          <Button variant="outline" size="lg" className="w-full text-black sm:w-auto dark:text-foreground">
            <Link href={"/quiz/explore?page=1"}>Explore</Link>
          </Button>
        </>
      ) : (
        <>
          <Button size="lg" className="w-full sm:w-auto">
            <Link href={"/auth/sign-in"}>Get started</Link>
          </Button>
          <Button variant="outline" size="lg" className="w-full text-black sm:w-auto dark:text-foreground">
            <Link href={"/quiz/explore?page=1"}>Explore</Link>
          </Button>
        </>
      )}
    </>
  );
}
