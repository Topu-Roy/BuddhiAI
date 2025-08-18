"use client";

import { useEffect, useState } from "react";
import type { AnswerSchema } from "@/server/schema/quiz";
import { api } from "@/trpc/react";
import { CheckCircle, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type z from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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

  // TODO

  //   if (isLoading || isProfileLoading) return <div>Loading...</div>;
  //   if (isError) return <div>Error</div>;
  if (!data) return <div>No quiz found</div>;

  const { quiz } = data;

  const progress = ((current + 1) / quiz._count.questions) * 100;
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
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-8">
      {/* Progress & Timer */}
      <div className="bg-background/80 sticky top-0 z-10 py-3 backdrop-blur">
        <div className="flex items-center justify-between text-sm font-medium">
          <span>
            Question {current + 1} / {quiz.questions.length}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={14} />
            {Math.floor(time / 60)}:{String(time % 60).padStart(2, "0")}
          </span>
        </div>
        <Progress value={progress} className="mt-2" />
      </div>

      {/* Question */}
      <Card key={question.id} className="rounded-2xl shadow-xl">
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
                      ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30"
                      : "border-transparent hover:border-slate-300 dark:hover:border-slate-600"
                  )}
                >
                  <RadioGroupItem value={String(idx)} id={`${question.localId}-${idx}`} />
                  <span className="flex-1">{opt}</span>
                  {isSelected && <CheckCircle className="h-5 w-5 text-indigo-500" />}
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
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-8">
      {/* Sticky progress & timer */}
      <div className="bg-background/80 sticky top-0 z-10 py-3 backdrop-blur">
        <div className="flex items-center justify-between text-sm font-medium">
          <Skeleton className="h-4 w-28 rounded" />
          <Skeleton className="h-4 w-16 rounded" />
        </div>
        <Skeleton className="mt-2 h-2 w-full rounded" />
      </div>

      {/* Question card */}
      <Card className="rounded-2xl shadow-xl">
        <CardHeader>
          <Skeleton className="h-6 w-3/4 rounded" />
        </CardHeader>

        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-xl" />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-9 w-24 rounded-md" />
        <Skeleton className="h-9 w-20 rounded-md" />
      </div>
    </div>
  );
}
