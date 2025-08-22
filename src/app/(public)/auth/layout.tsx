import { getServerAuthSession } from "@/auth/auth";
import { redirect } from "next/navigation";

export default async function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await getServerAuthSession();

  if (session?.user.id) {
    redirect("/dashboard");
  }

  return (
    <div className="relative">
      {/* Azure Depths */}
      <div
        className="fixed inset-0 -z-10 hidden opacity-80 dark:block"
        style={{
          background: "radial-gradient(125% 125% at 50% 10%, #000000 40%, #010133 100%)",
        }}
      ></div>

      {/* Cool Blue Glow Right */}
      <div
        className="fixed inset-0 -z-10 dark:hidden"
        style={{
          background: "#ffffff",
          backgroundImage: `
        radial-gradient(
          circle at top right,
          rgba(70, 130, 180, 0.5),
          transparent 70%
        )
      `,
          filter: "blur(80px)",
          backgroundRepeat: "no-repeat",
        }}
      ></div>

      <div className="z-10">{children}</div>
    </div>
  );
}
