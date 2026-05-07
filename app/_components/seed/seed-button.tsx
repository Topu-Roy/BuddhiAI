"use client";

import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";

export function SeedButton() {
  const { mutate: seedDb, isPending, isError, error } = api.seed.generateQuiz.useMutation();

  return (
    <>
      {isError && <p className="mt-2 text-sm text-destructive">Failed to seed: {error.message}</p>}

      <Button onClick={() => seedDb()} disabled={isPending}>
        {isPending ? "Seeding…" : "Seed Database"}
      </Button>
    </>
  );
}
