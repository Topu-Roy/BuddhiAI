"use client";

import { useState } from "react";
import { LOGO_URL } from "@/assets/AssetUrl";
import { useSession } from "@/auth/auth-client";
import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { LogoText } from "../logo-text";
import { ModeToggle } from "../mode-toggle";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { SignOutButton } from "./sign-out-button";

export function NavButtons() {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <>
      {session ? (
        <>
          <Button variant="outline" asChild className="h-8 lg:h-10">
            <Link href={"/dashboard"}>Dashboard</Link>
          </Button>

          <ProfileAvatar email={session.user.email} image={session.user.image ?? ""} name={session.user.name} />
        </>
      ) : (
        <>
          <Button className="h-8 lg:hidden" asChild>
            <Link href={"/auth/sign-in"}>Sign In</Link>
          </Button>

          <Button variant="outline" className="hidden lg:block" asChild>
            <Link href={"/auth/sign-in"}>Sign In</Link>
          </Button>

          <Button className="hidden lg:block" asChild>
            <Link href={"/auth/sign-up"}>Get Started</Link>
          </Button>
        </>
      )}

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger className="lg:hidden">
          <Menu size={22} className="text-primary" />
        </SheetTrigger>
        <SheetContent className="px-4">
          <SheetHeader>
            <div className="inline-flex items-center justify-start gap-2">
              <Link href={"/"}>
                <Image
                  className="aspect-square size-8 lg:size-12"
                  src={LOGO_URL}
                  height={100}
                  width={100}
                  alt="BuddhiAI"
                />
              </Link>
              <SheetTitle>
                <Link href={"/"}>
                  <LogoText />
                </Link>
              </SheetTitle>
              <ModeToggle />
            </div>
          </SheetHeader>

          {session ? (
            <>
              <Button onClick={() => setOpen(false)} variant={"outline"} className="w-full" asChild>
                <Link className="w-full" href={"/dashboard"}>
                  Dashboard
                </Link>
              </Button>
              <Button onClick={() => setOpen(false)} variant={"outline"} className="w-full" asChild>
                <Link className="w-full" href={"/quiz/explore?page=1"}>
                  Explore
                </Link>
              </Button>
              <Button onClick={() => setOpen(false)} variant={"outline"} className="w-full" asChild>
                <Link className="w-full" href={"/quiz/history?page=1"}>
                  History
                </Link>
              </Button>
              <Button onClick={() => setOpen(false)} variant={"outline"} className="w-full" asChild>
                <Link className="w-full" href={"/profile"}>
                  Profile
                </Link>
              </Button>
              <SignOutButton />
            </>
          ) : (
            <>
              <Button onClick={() => setOpen(false)} variant="outline" asChild>
                <Link href={"/auth/sign-in"}>Sign In</Link>
              </Button>

              <Button onClick={() => setOpen(false)} asChild>
                <Link href={"/auth/sign-up"}>Get Started</Link>
              </Button>
            </>
          )}
          <SheetFooter className="w-full text-center">
            <span className="text-card-foreground/60 text-sm font-semibold">Made with 💖 by Topu</span>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}

function ProfileAvatar({ email, image, name }: { name: string; email: string; image: string }) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className="cursor-pointer">
        <Avatar className="border-border size-10 border-2">
          <AvatarImage src={image ?? ""} />
          <AvatarFallback>
            {name
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
            <AvatarImage src={image ?? ""} />
            <AvatarFallback>
              {name
                ?.split(" ")
                .map(n => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-semibold">{name}</p>
            <p className="text-muted-foreground text-xs">{email}</p>
          </div>
        </div>

        <Separator />

        <Button onClick={() => setOpen(false)} variant={"outline"} className="w-full" asChild>
          <Link className="w-full" href={"/dashboard"}>
            Dashboard
          </Link>
        </Button>
        <Button onClick={() => setOpen(false)} variant={"outline"} className="w-full" asChild>
          <Link className="w-full" href={"/quiz/explore?page=1"}>
            Explore
          </Link>
        </Button>
        <Button onClick={() => setOpen(false)} variant={"outline"} className="w-full" asChild>
          <Link className="w-full" href={"/quiz/history?page=1"}>
            History
          </Link>
        </Button>
        <Button onClick={() => setOpen(false)} variant={"outline"} className="w-full" asChild>
          <Link className="w-full" href={"/profile"}>
            Profile
          </Link>
        </Button>
        <SignOutButton />
      </PopoverContent>
    </Popover>
  );
}
