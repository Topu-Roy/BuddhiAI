"use client";

import { api } from "@/trpc/react";
import { SeedStats } from "./seed-stats";
import { SeedOperationCard } from "./seed-operation-card";
import { Separator } from "@/components/ui/separator";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SeedDashboard() {
  const utils = api.useUtils();

  const handleRefresh = () => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    utils.seed.getStats.invalidate();
  };

  const seedQuizMutation = api.seed.generateQuiz.useMutation({
    onSuccess: () => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      utils.seed.getStats.invalidate();
    },
  });

  const clearQuizzesMutation = api.seed.clearQuizzes.useMutation({
    onSuccess: () => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      utils.seed.getStats.invalidate();
    },
  });

  const resetDatabaseMutation = api.seed.resetDatabase.useMutation({
    onSuccess: () => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      utils.seed.getStats.invalidate();
    },
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Seed Management</h2>
          <p className="text-muted-foreground">Manage database seeding operations</p>
        </div>
        <Button variant="outline" size="icon" onClick={handleRefresh}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      <SeedStats />

      <Separator />

      <div>
        <h3 className="mb-4 text-lg font-semibold">Operations</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <SeedOperationCard
            title="Seed Quizzes"
            description="Generate 7 quizzes with 70 questions from seed data"
            actionLabel="Seed Now"
            mutationFn={() => seedQuizMutation.mutateAsync()}
          />

          <SeedOperationCard
            title="Clear Quizzes"
            description="Delete all quizzes, questions, and analytics data"
            actionLabel="Clear Data"
            isDanger
            confirmTitle="Clear All Quizzes?"
            confirmDescription="This will permanently delete all 70 questions and 7 quizzes. This action cannot be undone."
            mutationFn={() => clearQuizzesMutation.mutateAsync()}
          />

          <SeedOperationCard
            title="Reset Database"
            description="Clear all seeded data including results and profiles"
            actionLabel="Reset All"
            isDanger
            confirmTitle="Reset Entire Database?"
            confirmDescription="This will delete all quizzes, results, and profiles. Only user accounts will be preserved. This action cannot be undone."
            mutationFn={() => resetDatabaseMutation.mutateAsync()}
          />
        </div>
      </div>
    </div>
  );
}