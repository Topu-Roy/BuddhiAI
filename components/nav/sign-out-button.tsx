"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "nextjs-toploader/app";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  const router = useRouter();
  const { mutate: runSignOut, isPending } = useMutation({
    mutationFn: () => authClient.signOut(),
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
      className="w-full hover:bg-red-800/80! hover:text-background dark:hover:text-foreground"
      onClick={() => runSignOut()}
    >
      {isPending ? "Signing out" : "Sign out"}
    </Button>
  );
}
