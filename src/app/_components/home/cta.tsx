"use client";

import { useSession } from "@/auth/auth-client";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CTA() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <>
        <Button size="lg" className="w-full sm:w-auto">
          <Link href={"/sign-in"}>Get started</Link>
        </Button>
        <Button variant="outline" size="lg" className="dark:text-foreground w-full text-black sm:w-auto">
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
          <Button variant="outline" size="lg" className="dark:text-foreground w-full text-black sm:w-auto">
            <Link href={"/quiz/explore?page=1"}>Explore</Link>
          </Button>
        </>
      ) : (
        <>
          <Button size="lg" className="w-full sm:w-auto">
            <Link href={"/auth/sign-in"}>Get started</Link>
          </Button>
          <Button variant="outline" size="lg" className="dark:text-foreground w-full text-black sm:w-auto">
            <Link href={"/quiz/explore?page=1"}>Explore</Link>
          </Button>
        </>
      )}
    </>
  );
}
