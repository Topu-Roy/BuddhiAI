"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import { BrainCircuit, X } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import { toast } from "sonner";
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
      <Card className="flex items-center justify-center">
        <div className="space-y-2 text-center">
          <div className="bg-destructive/10 mx-auto flex size-12 items-center justify-center rounded-full p-2">
            <X size={18} className="text-destructive" />
          </div>
          <p className="text-destructive text-2xl font-semibold">{"Couldn't load data"}</p>
          <p className="text-muted-foreground pb-4">Please refresh or try again later.</p>
          <Button onClick={() => refetch()} variant={"outline"}>
            Refresh
          </Button>
        </div>
      </Card>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    if (!profile) return;

    e.preventDefault();
    if (!topic.trim()) return;

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

          router.push(`/quiz/view/${data.id}`);
        },
      }
    );
  };

  if (!profile) {
    return (
      <Card className="flex items-center justify-center">
        <div className="space-y-2 text-center">
          <div className="bg-destructive/10 mx-auto flex size-12 items-center justify-center rounded-full p-2">
            <X size={18} className="text-destructive" />
          </div>
          <p className="text-destructive text-2xl font-semibold">{"Couldn't load data"}</p>
          <p className="text-muted-foreground pb-4">Please refresh or try again later.</p>
          <Button onClick={() => utils.profile.getProfileInfo.refetch()} variant={"outline"}>
            Refresh
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <BrainCircuit className="h-6 w-6 text-indigo-500" />
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
              className="mt-1"
            />
          </div>

          {isCreateQuizError && (
            <Alert variant="destructive">
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          )}

          <div className="flex w-full items-center justify-end gap-2">
            <Button
              onClick={() => setTopic("")}
              type="button"
              variant={"outline"}
              className="w-[30%]"
              disabled={isPending}
            >
              Reset
            </Button>
            <Button type="submit" className="w-[30%]" disabled={isPending}>
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
    <Card className="shadow-sm">
      <CardHeader>
        <Skeleton className="h-8 w-md" />
        <Skeleton className="h-4 w-lg" />
      </CardHeader>
      <CardContent>
        <div className="w-full space-y-4">
          <div>
            <Skeleton className="h-4 w-10 pb-1.5" />
            <Skeleton className="mt-1 h-8 w-full" />
          </div>

          <div className="flex w-full items-center justify-end gap-2">
            <Skeleton className="h-8 w-[30%]" />
            <Skeleton className="h-8 w-[30%]" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
