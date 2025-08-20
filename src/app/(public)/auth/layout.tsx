import { getProfileWithNotFoundCheck } from "@/server/helpers/profile";
import { redirect } from "next/navigation";

export default async function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { profile } = await getProfileWithNotFoundCheck();

  if (profile) redirect("/dashboard");

  return <>{children}</>;
}
