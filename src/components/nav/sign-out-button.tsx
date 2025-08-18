"use client";

import { useMutation } from "@tanstack/react-query";
import { signOut } from "@/auth/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "../ui/button";

export function SignOutButton() {
  const router = useRouter();
  const { mutate: runSignOut, isPending } = useMutation({
    mutationFn: () => signOut(),
    onError: () => {
      toast.error("❌ Server error while singing out");
    },
    onSuccess: () => {
      router.refresh();
    },
  });

  return (
    <Button
      variant={"outline"}
      disabled={isPending}
      className="hover:text-background dark:hover:text-foreground w-full hover:bg-red-800/80!"
      onClick={() => runSignOut()}
    >
      {isPending ? "Signing out" : "Sign out"}
    </Button>
  );
}
