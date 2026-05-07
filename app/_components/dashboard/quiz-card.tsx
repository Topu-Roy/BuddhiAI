"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import { BotMessageSquare } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import { toast } from "sonner";
import { ErrorCard } from "@/components/error-card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

export function GenerateQuizCard() {
  const [topic, setTopic] = useState("");
  const router = useRouter();

  const utils = api.useUtils();
  const { data: profile, isLoading, isError, refetch } = api.profile.getProfileInfo.useQuery();
  const { mutate: createQuiz, isPending, isError: isCreateQuizError, error } = api.quiz.generateQuiz.useMutation();

  if (isLoading) {
    return <GenerateQuizCardSkeleton />;
  }

  if (isError || !profile) {
    return (
      <ErrorCard
        error="Oops... Something bad happened"
        prompt="Please refresh or try again later"
        onClick={refetch}
      />
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    if (!profile) return;

    e.preventDefault();
    if (!topic.trim()) return;
    if (topic.trim().length < 2) return;

    createQuiz(
      {
        topic,
        age: profile.age,
        educationLevel: profile.educationLevel,
        interests: profile.interests,
      },
      {
        onError(error) {
          toast.error("Something bad happened - " + error.message);
        },
        onSuccess(data) {
          void utils.profile.getProfileInfo.invalidate();
          void utils.profile.getProfileInfo.refetch();

          void utils.quiz.getPaginatedQuiz.invalidate();
          void utils.quiz.getPaginatedQuiz.refetch();

          void utils.profile.getPaginatedCreatedHistory.invalidate();
          void utils.profile.getPaginatedCreatedHistory.refetch();

          setTopic("");
          router.push(`/quiz/view/${data.id}`);
        },
      }
    );
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="bg-primary/10 flex size-8 items-center justify-center rounded-full">
            <BotMessageSquare size={18} className="text-primary" />
          </div>
          Build a new quiz
        </CardTitle>
        <CardDescription>
          Describe any topic and our AI will craft 10 questions tailored to your level and interests.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div>
            <Label htmlFor="topic" className="pb-1.5">
              Topic
            </Label>
            <Input
              id="topic"
              placeholder="e.g., Photosynthesis, React hooks, WW-II"
              value={topic}
              onChange={e => setTopic(e.target.value)}
              required
              disabled={isPending}
              className="mt-1 placeholder:text-xs sm:placeholder:text-base"
            />
          </div>

          {isCreateQuizError && (
            <Alert variant="destructive">
              <AlertDescription className="text-sm sm:text-base">{error.message}</AlertDescription>
            </Alert>
          )}

          <div className="flex w-full items-center justify-end gap-2">
            <Button
              onClick={() => setTopic("")}
              type="button"
              variant={"outline"}
              className="h-8 sm:h-10"
              disabled={isPending}
            >
              clear
            </Button>
            <Button type="submit" className="h-8 sm:h-10" disabled={isPending}>
              {isPending ? "Generating..." : "Generate Quiz"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function GenerateQuizCardSkeleton() {
  return (
    <Card className="bg-transparent shadow-sm">
      <CardHeader>
        {/* title */}
        <div className="flex items-center gap-4">
          <Skeleton className="size-8 rounded-full" />
          <Skeleton className="h-5 w-36 md:h-6" />
        </div>
        {/* description */}
        <Skeleton className="mt-1 h-4 w-full max-w-sm md:h-5" />
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Topic label & input */}
        <div>
          <Skeleton className="mb-1.5 h-4 w-10 md:h-5" />
          <Skeleton className="h-10 w-full md:h-11" />
        </div>

        {/* Buttons */}
        <div className="flex w-full items-center justify-end gap-2">
          <Skeleton className="h-8 w-16 md:h-10 md:w-20" />
          <Skeleton className="h-8 w-24 md:h-10 md:w-28" />
        </div>
      </CardContent>
    </Card>
  );
}
