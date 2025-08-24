"use client";

import { api } from "@/trpc/react";
import type { INTEREST } from "@prisma/client";
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
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Marquee } from "./ui/marquee";

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
          "border-border/50 bg-card/50 relative h-full overflow-hidden rounded-2xl border backdrop-blur-sm",
          "p-6 shadow-sm transition-all duration-300 ease-out",
          "hover:shadow-primary/5 hover:border-primary/20 hover:bg-card hover:shadow-lg",
          "hover:-translate-y-1 hover:scale-[1.02]",
          "focus-within:ring-primary/20 focus-within:ring-2 focus-within:ring-offset-2"
        )}
      >
        {/* Header Section */}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className="bg-primary/10 group-hover:bg-primary/15 flex-shrink-0 rounded-xl p-2 transition-colors">
              <Icon className="text-primary h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-foreground group-hover:text-primary mb-1 text-base leading-tight font-semibold transition-colors">
                {topic}
              </h3>
              <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">{category}</p>
            </div>
          </div>
        </div>

        {/* Description */}
        <blockquote className="text-muted-foreground mb-4 line-clamp-2 text-sm leading-relaxed">
          {description}
        </blockquote>

        {/* Footer Section */}
        <footer className="border-border/30 flex items-center justify-between border-t pt-4">
          <div className="flex items-center gap-2">
            {Profile?.name && (
              <>
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="bg-muted text-xs">{getInitials(Profile.name)}</AvatarFallback>
                </Avatar>
                <span className="text-muted-foreground text-xs font-medium">by {Profile.name}</span>
              </>
            )}
          </div>

          <div className="text-muted-foreground flex items-center gap-1 text-xs">
            <span className="font-medium">{questionCount}</span>
            <span>questions</span>
          </div>
        </footer>

        {/* Subtle gradient overlay on hover */}
        <div className="from-primary/[0.02] pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
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
      <div className="from-background pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r"></div>
      <div className="from-background pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l"></div>
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
