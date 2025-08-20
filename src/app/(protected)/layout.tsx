import { getServerAuthSession } from "@/auth/auth";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await getServerAuthSession();

  if (!session?.user.id) redirect("/auth/sign-in");

  return <>{children}</>;
}
