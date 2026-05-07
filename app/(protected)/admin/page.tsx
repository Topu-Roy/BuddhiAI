import { AdminDashboard } from "@/app/_components/admin/admin-dashboard";
import { notFound } from "next/navigation";
import { getServerSession } from "@/lib/auth";

export default async function AdminScreen() {
  const session = await getServerSession();

  if (session?.user.role !== "admin") notFound();

  return (
    <div className="container mx-auto max-w-6xl py-8">
      <AdminDashboard />
    </div>
  );
}
