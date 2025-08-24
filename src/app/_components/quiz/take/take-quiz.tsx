"use client";

import { useEffect, useState } from "react";
import type { AnswerSchema } from "@/server/schema/quiz";
import { api } from "@/trpc/react";
import { CheckCircle, ChevronLeft, ChevronRight, Clock, Milestone, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "nextjs-toploader/app";
import { toast } from "sonner";
import type z from "zod";
import { cn } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

type Answer = z.infer<typeof AnswerSchema>;

export function TakeQuiz({ quizId }: { quizId: string }) {
  const [time, setTime] = useState(0);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Array<Answer>>([]);
  const router = useRouter();

  const util = api.useUtils();
  const [profile] = api.profile.getProfileInfo.useSuspenseQuery();
  const [data] = api.quiz.getQuiz.useSuspenseQuery({ quizId });
  const { mutate: submitResult, isPending } = api.quiz.submitQuizResult.useMutation({
    onSuccess(data) {
      void util.profile.getProfileInfo.invalidate();
      void util.profile.getProfileInfo.refetch();

      void util.profile.getPaginatedCreatedHistory.invalidate();
      void util.profile.getPaginatedCreatedHistory.refetch();

      void util.profile.getPaginatedTakenHistory.invalidate();
      void util.profile.getPaginatedTakenHistory.refetch();

      void util.quiz.getQuiz.invalidate();
      void util.quiz.getQuiz.refetch();

      router.push(`/quiz/results/${data.id}`);
    },
    onError(error) {
      toast.error("Error while submitting - " + error.message);
    },
  });

  /* Timer */
  useEffect(() => {
    const i = setInterval(() => setTime(t => t + 1), 1000);
    return () => clearInterval(i);
  }, []);

  if (!data)
    return (
      <Card className="flex items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="bg-destructive/10 flex size-8 items-center justify-center rounded-full">
            <X size={18} className="text-destructive/80" />
          </div>
          <p className="text-destructive text-2xl font-semibold">Quiz not found</p>
          <p className="text-muted-foreground pb-4">This quiz might not exist</p>
          <Button variant={"outline"} asChild>
            <Link href={"/quiz/explore?page=1"}>Find more</Link>
          </Button>
        </div>
      </Card>
    );

  const { quiz } = data;

  const progress = answers.length * 10;
  const allAnswered = answers.length === quiz._count.questions;

  /* Handlers */
  function choose({ localId, questionId, selectedAnswerIndex }: Answer) {
    setAnswers(prev => {
      const existingIndex = prev.findIndex(item => item.localId === localId);

      if (existingIndex !== -1) {
        // Update existing answer
        const updated = [...prev];
        updated[existingIndex] = { localId, questionId, selectedAnswerIndex };
        return updated;
      }

      // Add new answer
      return [...prev, { localId, questionId, selectedAnswerIndex }];
    });
  }

  const next = () => current < quiz._count.questions - 1 && setCurrent(current + 1);
  const prev = () => current > 0 && setCurrent(current - 1);

  function handleSubmit() {
    if (!quiz) return toast.warning("Quiz related data missing");
    if (!profile) return toast.warning("Profile related data missing");
    if (answers.length !== data.quiz._count.questions) return toast.warning("Please answer all questions");

    submitResult({
      answers,
      quizId,
      profileId: profile.id,
      timeTookInSeconds: time,
    });
  }

  const question = quiz.questions[current]!;
  const currentAnswer = answers.find(a => a.localId === question.localId);

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-4">
      {/* Title */}
      <div className="flex items-center gap-2 pt-2">
        <div className="bg-primary/10 flex size-8 items-center justify-center rounded-full">
          <Milestone size={18} className="text-primary" />
        </div>
        <h2 className="items-center text-xl font-semibold sm:text-2xl md:text-3xl">{quiz.topic} </h2>
      </div>
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger className="m-0 p-0">About this quiz</AccordionTrigger>
          <AccordionContent>
            <p className="text-muted-foreground text-sm">{quiz.description}</p>
            <p className="text-muted-foreground pt-4 font-semibold">By {quiz.Profile?.name}</p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Separator />

      {/* Progress & Timer */}
      <div>
        <div className="flex items-center justify-between text-sm font-medium">
          <span>
            Answered{" "}
            <span className="pl-3">
              {answers.length} / {quiz.questions.length}
            </span>
          </span>
          <span className="flex items-center gap-1">
            <Clock size={14} />
            {Math.floor(time / 60)}:{String(time % 60).padStart(2, "0")}
          </span>
        </div>
        <Progress value={progress} className="mt-2" />
      </div>

      <div className="flex items-center justify-center gap-1.5 px-4">
        {Array.from({ length: quiz._count.questions }).map((_, index) => {
          const question = quiz.questions[index];
          const isAnswered = answers.some(ans => ans.localId === question?.localId);

          return (
            <div key={index}>
              <Button
                onClick={() => setCurrent(index)}
                className={cn(
                  "bg-accent text-foreground dark:bg-muted border-border !m-0 flex !size-7 flex-1 items-center justify-center rounded-full border !p-0 text-sm sm:!size-8",
                  {
                    "bg-primary dark:bg-primary border-0 text-white": isAnswered,
                    "ring-2 ring-gray-800 dark:ring-white": isAnswered && current === index,
                    "ring-ring ring-2": !isAnswered && current === index,
                  }
                )}
              >
                {index + 1}
              </Button>
            </div>
          );
        })}
      </div>

      {/* Question */}
      <Card key={question.id} className="bg-card/40 rounded-2xl shadow-xl">
        <CardHeader>
          <CardTitle className="text-lg leading-relaxed">{question.question}</CardTitle>
        </CardHeader>

        <CardContent>
          <RadioGroup
            value={currentAnswer ? String(currentAnswer.selectedAnswerIndex) : ""}
            onValueChange={v => {
              const selectedAnswerIndex = parseInt(v);

              choose({
                localId: question.localId,
                questionId: question.id,
                selectedAnswerIndex,
              });
            }}
            className="space-y-3"
          >
            {question.options.map((opt, idx) => {
              const isSelected = currentAnswer?.selectedAnswerIndex === idx;

              return (
                <Label
                  key={idx}
                  htmlFor={`${question.localId}-${idx}`}
                  className={cn(
                    "flex cursor-pointer items-center space-x-3 rounded-xl border-2 p-4 transition-all",
                    isSelected
                      ? "border-primary ring-primary bg-primary/10 ring-2 ring-inset"
                      : "hover:border-border border-transparent"
                  )}
                >
                  <RadioGroupItem
                    value={String(idx)}
                    id={`${question.localId}-${idx}`}
                    className="border-border border"
                  />
                  <span className="flex-1">{opt}</span>
                  {isSelected && <CheckCircle className="text-primary h-5 w-5" />}
                </Label>
              );
            })}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={prev} disabled={current === 0}>
          <ChevronLeft size={16} /> Prev
        </Button>

        {current < quiz.questions.length - 1 ? (
          <Button size="sm" onClick={next}>
            Next <ChevronRight size={16} />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={!allAnswered || isPending}>
            {isPending ? "Submitting…" : "Submit"}
          </Button>
        )}
      </div>
    </div>
  );
}

export function TakeQuizSkeleton() {
  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-4">
      {/* Title */}
      <div className="flex items-center gap-2 pt-2">
        <Skeleton className="size-8 rounded-full" />
        <Skeleton className="h-7 w-48 md:h-9" />
      </div>

      {/* Accordion */}
      <div className="space-y-2">
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-28" />
      </div>

      <Skeleton className="h-px w-full" />

      {/* Progress & Timer */}
      <div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="mt-2 h-2 w-full rounded-full" />
      </div>

      {/* Question dots */}
      <div className="flex items-center justify-center gap-1.5">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="size-8 rounded-full" />
        ))}
      </div>

      {/* Question card */}
      <Card className="border bg-transparent p-6">
        <Skeleton className="mb-4 h-6 w-3/4 rounded" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-24" />
      </div>
    </div>
  );
}
