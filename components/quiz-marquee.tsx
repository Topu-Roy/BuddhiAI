"use client";

import type { INTEREST } from "@/generated/prisma/enums";
import { api } from "@/trpc/react";
import {
  Atom,
  BookOpen,
  Calculator,
  Drama,
  Globe,
  HelpCircle,
  Landmark,
  Mic2,
  Palette,
  Scroll,
  Swords,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Marquee } from "./marquee";
import { Avatar, AvatarFallback } from "./ui/avatar";

type QuizProp = {
  id: string;
  topic: string;
  category: INTEREST;
  description: string;
  questionCount: number;
  Profile: { name: string } | null;
};

const iconMap: Record<INTEREST, LucideIcon> = {
  SCIENCE: Atom,
  TECHNOLOGY: Atom,
  HISTORY: Scroll,
  LITERATURE: BookOpen,
  MATHEMATICS: Calculator,
  GEOGRAPHY: Globe,
  SPORTS: Trophy,
  ENTERTAINMENT: Drama,
  POLITICS: Landmark,
  ART: Palette,
  MUSIC: Mic2,
  PHILOSOPHY: Swords,
  OTHER: HelpCircle,
};

const QuizCard = ({ id, topic, Profile, category, description, questionCount }: QuizProp) => {
  const Icon = iconMap[category] ?? HelpCircle;

  return (
    <Link href={`/quiz/view/${id}`} className="group block w-sm">
      <div
        className={cn(
          "relative h-full overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm",
          "p-6 shadow-sm transition-all duration-300 ease-out",
          "hover:border-primary/20 hover:bg-card hover:shadow-lg hover:shadow-primary/5",
          "hover:-translate-y-1 hover:scale-[1.02]",
          "focus-within:ring-2 focus-within:ring-primary/20 focus-within:ring-offset-2"
        )}
      >
        {/* Header Section */}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className="shrink-0 rounded-xl bg-primary/10 p-2 transition-colors group-hover:bg-primary/15">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="mb-1 text-base leading-tight font-semibold text-foreground transition-colors group-hover:text-primary">
                {topic}
              </h3>
              <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">{category}</p>
            </div>
          </div>
        </div>

        {/* Description */}
        <blockquote className="mb-4 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {description}
        </blockquote>

        {/* Footer Section */}
        <footer className="flex items-center justify-between border-t border-border/30 pt-4">
          <div className="flex items-center gap-2">
            {Profile?.name && (
              <>
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="bg-muted text-xs">{getInitials(Profile.name)}</AvatarFallback>
                </Avatar>
                <span className="text-xs font-medium text-muted-foreground">by {Profile.name}</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span className="font-medium">{questionCount}</span>
            <span>questions</span>
          </div>
        </footer>

        {/* Subtle gradient overlay on hover */}
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-linear-to-br from-primary/2 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>
    </Link>
  );
};

export function QuizMarquee() {
  const amount = 20;
  const { data, isLoading } = api.quiz.getManyQuiz.useQuery({ amount });

  if (!data || isLoading) return null;

  const firstRow = data.slice(0, 10);
  const secondRow = data.slice(10);

  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
      <Marquee pauseOnHover className="[--duration:60s]">
        {firstRow.map(quiz => (
          <QuizCard
            key={quiz.id}
            Profile={quiz.Profile}
            category={quiz.category}
            description={quiz.description}
            id={quiz.id}
            topic={quiz.topic}
            questionCount={quiz._count.questions}
          />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover className="[--duration:60s]">
        {secondRow.map(quiz => (
          <QuizCard
            key={quiz.id}
            Profile={quiz.Profile}
            category={quiz.category}
            description={quiz.description}
            id={quiz.id}
            topic={quiz.topic}
            questionCount={quiz._count.questions}
          />
        ))}
      </Marquee>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-linear-to-r from-background"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-linear-to-l from-background"></div>
    </div>
  );
}

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase();
};
