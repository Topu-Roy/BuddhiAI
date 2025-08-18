import { Suspense } from "react";
import { Brain } from "lucide-react";
import Link from "next/link";
import { ModeToggle } from "../mode-toggle";
import { Skeleton } from "../ui/skeleton";
import { NavButtons } from "./nav-buttons";

export function Navbar() {
  return (
    <header className="bg-card border-b shadow-sm">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href={"/"} className="flex items-center">
            <Brain className="text-primary mr-3 h-8 w-8" />
            <h1 className="text-xl font-bold">Quizardly</h1>
          </Link>

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
