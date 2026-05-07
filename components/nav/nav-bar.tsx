import { LOGO_URL } from "@/assets/AssetUrl";
import Image from "next/image";
import Link from "next/link";
import { LogoText } from "../logo-text";
import { ModeToggle } from "../mode-toggle";
import { NavButtons } from "./nav-buttons";

export function Navbar() {
  return (
    <header className="bg-card z-20 border-b shadow-sm">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-[8dvh] items-center justify-between">
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

            <Link href={"/"}>
              <LogoText className="lg:text-2xl" />
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden lg:block">
              <ModeToggle />
            </div>
            <NavButtons />
          </div>
        </div>
      </nav>
    </header>
  );
}
