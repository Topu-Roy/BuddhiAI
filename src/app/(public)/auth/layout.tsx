import { getServerAuthSession } from "@/auth/auth";
import { redirect } from "next/navigation";

export default async function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await getServerAuthSession();

  if (session?.user.id) redirect("/dashboard");
  return <>{children}</>;
}
