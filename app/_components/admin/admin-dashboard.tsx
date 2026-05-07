"use client";

import { SeedOperationCard } from "@/app/_components/seed/seed-operation-card";
import { api } from "@/trpc/react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AdminStats } from "./admin-stats";
import { UserTable } from "./user-table";

export function AdminDashboard() {
  const utils = api.useUtils();

  const handleRefresh = () => {
    void utils.seed.getStats.invalidate();
    void utils.seed.getUsers.invalidate();
  };

  const seedQuizMutation = api.seed.generateQuiz.useMutation({
    onSuccess: () => {
      void utils.seed.getStats.invalidate();
    },
  });

  const clearQuizzesMutation = api.seed.clearQuizzes.useMutation({
    onSuccess: () => {
      void utils.seed.getStats.invalidate();
    },
  });

  const resetDatabaseMutation = api.seed.resetDatabase.useMutation({
    onSuccess: () => {
      void utils.seed.getStats.invalidate();
    },
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Admin Dashboard</h2>
          <p className="text-muted-foreground">Manage database and users</p>
        </div>
        <Button variant="outline" size="icon" onClick={handleRefresh}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      <AdminStats />

      <Separator />

      <div>
        <h3 className="mb-4 text-lg font-semibold">Database Operations</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <SeedOperationCard
            title="Seed Quizzes"
            description="Generate 7 quizzes with 70 questions from seed data"
            actionLabel="Seed Now"
            mutationFn={() => seedQuizMutation.mutateAsync()}
          />

          <SeedOperationCard
            title="Clear Quizzes"
            description="Delete all quizzes, questions, and analytics"
            actionLabel="Clear Data"
            isDanger
            confirmTitle="Clear All Quizzes?"
            confirmDescription="This will permanently delete all quizzes and questions. This action cannot be undone."
            mutationFn={() => clearQuizzesMutation.mutateAsync()}
          />

          <SeedOperationCard
            title="Reset Database"
            description="Clear all data including results and profiles"
            actionLabel="Reset All"
            isDanger
            confirmTitle="Reset Entire Database?"
            confirmDescription="This will delete all quizzes, results, and profiles. Only user accounts will be preserved."
            mutationFn={() => resetDatabaseMutation.mutateAsync()}
          />
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="mb-4 text-lg font-semibold">User Management</h3>
        <UserTable />
      </div>
    </div>
  );
}
