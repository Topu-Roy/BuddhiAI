import { SeedButton } from "@/app/_components/seed/seed-button";
import { api } from "@/trpc/server";
import { notFound } from "next/navigation";

export default async function SeedScreen() {
  const profile = await api.profile.getProfileInfo();

  // Only allow the seed screen for a specific user (empty e-mail in this example)
  if (profile.email !== "topu.roy.ttr@gmail.com") notFound();

  return (
    <div className="w-full">
      <div className="container mx-auto flex flex-col items-center justify-center space-y-4 pt-[10dvh]">
        <h1 className="text-2xl font-bold">Seed the database</h1>
        <p className="text-muted-foreground text-sm">This action will insert initial quizzes and questions.</p>
        <SeedButton />
      </div>
    </div>
  );
}
