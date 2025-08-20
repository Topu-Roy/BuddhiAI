import { api } from "@/trpc/server";
import { notFound, redirect } from "next/navigation";
import { tryCatch } from "@/lib/helpers/try-catch";

export default async function ProtectedLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { data: profile, error } = await tryCatch(api.profile.getProfileInfo());

  if (error) {
    notFound();
  }

  if (!profile.id) {
    redirect("/profile/setup");
  }

  return <>{children}</>;
}
