import { notFound } from "next/navigation";
import { getServerSession } from "@/lib/auth";
import { SeedDashboard } from "@/app/_components/seed/seed-dashboard";

export default async function SeedScreen() {
  const session = await getServerSession();

  if (session?.user.role !== "admin") notFound();

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <SeedDashboard />
    </div>
  );
}