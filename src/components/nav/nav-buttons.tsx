"use client";

import { useSession } from "@/auth/auth-client";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { SignOutButton } from "./sign-out-button";

export function NavButtons() {
  const { data: session, isPending } = useSession();

  if (isPending || !session) {
    return (
      <>
        <Button variant="outline" asChild>
          <Link href={"/auth/sign-in"}>Sign In</Link>
        </Button>

        <Button asChild>
          <Link href={"/auth/sign-up"}>Get Started</Link>
        </Button>
      </>
    );
  }

  return (
    <>
      <Button variant="outline" asChild>
        <Link href={"/dashboard"}>Dashboard</Link>
      </Button>

      <Popover>
        <PopoverTrigger asChild className="cursor-pointer">
          <Avatar className="border-border size-10 border-2">
            <AvatarImage src={session.user.image ?? ""} />
            <AvatarFallback>
              {session.user.name
                ?.split(" ")
                .map(n => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </PopoverTrigger>
        <PopoverContent className="flex w-full flex-col items-center gap-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src={session.user.image ?? ""} />
              <AvatarFallback>
                {session.user.name
                  ?.split(" ")
                  .map(n => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold">{session.user.name}</p>
              <p className="text-muted-foreground text-xs">{session.user.email}</p>
            </div>
          </div>

          <Separator />

          <Button variant={"outline"} className="w-full" asChild>
            <Link className="w-full" href={"/dashboard"}>
              Dashboard
            </Link>
          </Button>
          <Button variant={"outline"} className="w-full" asChild>
            <Link className="w-full" href={"/quiz/explore?page=1"}>
              Explore
            </Link>
          </Button>
          <Button variant={"outline"} className="w-full" asChild>
            <Link className="w-full" href={"/quiz/history?page=1"}>
              History
            </Link>
          </Button>
          <Button variant={"outline"} className="w-full" asChild>
            <Link className="w-full" href={"/profile"}>
              Profile
            </Link>
          </Button>
          <SignOutButton />
        </PopoverContent>
      </Popover>
    </>
  );
}
