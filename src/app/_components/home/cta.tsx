import { Suspense } from "react";
import { getServerAuthSession } from "@/auth/auth";
import Link from "next/link";
import { Button } from "../../../components/ui/button";

async function CTAComponent() {
  const session = await getServerAuthSession();

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

export function CTA() {
  return (
    <Suspense
      fallback={
        <>
          <Button size="lg" className="w-full sm:w-auto">
            <Link href={"/sign-in"}>Get started</Link>
          </Button>
          <Button variant="outline" size="lg" className="w-full sm:w-auto">
            <Link href={"/quiz/explore"}>Explore</Link>
          </Button>
        </>
      }
    >
      <CTAComponent />
    </Suspense>
  );
}
