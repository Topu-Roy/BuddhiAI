"use client";

import { useMutation } from "@tanstack/react-query";
import { signIn } from "@/auth/auth-client";

export function useGoogleSignInMutation() {
  return useMutation({
    mutationFn: async ({ callbackURL }: { callbackURL: string }) => {
      await signIn.social({
        provider: "google",
        callbackURL,
      });
    },
  });
}
