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
        <Button variant="outline" size="lg" className="w-full sm:w-auto">
          <Link href={"/quiz/explore"}>Explore</Link>
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
          <Button variant="outline" size="lg" className="w-full sm:w-auto">
            <Link href={"/explore"}>Explore</Link>
          </Button>
        </>
      ) : (
        <>
          <Button size="lg" className="w-full sm:w-auto">
            <Link href={"/sign-in"}>Get started</Link>
          </Button>
          <Button variant="outline" size="lg" className="w-full sm:w-auto">
            <Link href={"/explore"}>Explore</Link>
          </Button>
        </>
      )}
    </>
  );
}
