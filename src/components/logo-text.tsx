import { Pacifico } from "next/font/google";
import { cn } from "@/lib/utils";

const pacifico = Pacifico({
  subsets: [],
  variable: "--font-pacifico",
  weight: ["400"],
});

export function LogoText({ className }: { className?: string }) {
  return (
    <h2 className={cn("tracking-widest", pacifico.className, className)}>
      Buddhi<span className="text-primary">AI</span>
    </h2>
  );
}
