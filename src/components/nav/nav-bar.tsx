import { Suspense } from "react";
import { Pacifico } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { ModeToggle } from "../mode-toggle";
import { Skeleton } from "../ui/skeleton";
import { NavButtons } from "./nav-buttons";

const pacifico = Pacifico({
  subsets: [],
  variable: "--font-pacifico",
  weight: ["400"],
});

export function Navbar() {
  return (
    <header className="bg-card border-b shadow-sm">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-[8dvh] items-center justify-between">
          <div className="inline-flex items-center justify-start gap-2">
            <Link
              href={"/"}
              className="bg-primary inline-flex size-12 items-center justify-center rounded-full p-1"
            >
              <Image
                className="size-8"
                src={"https://bwjcur3siq.ufs.sh/f/j7HvSadRZFfQCcnsEOxNESncf5r1kAu2bvV9G4dqle0hosZN"}
                height={100}
                width={100}
                alt="BuddhiAI"
              />
            </Link>

            <Link href={"/"}>
              <h1 className={`text-2xl ${pacifico.className} tracking-widest`}>
                Buddhi<span className="text-blue-500">AI</span>
              </h1>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <ModeToggle />

            <Suspense
              fallback={
                <>
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="size-8 rounded-full" />
                </>
              }
            >
              <NavButtons />
            </Suspense>
          </div>
        </div>
      </nav>
    </header>
  );
}
