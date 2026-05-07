"use client";

import { useMutation } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";

export function useGoogleSignInMutation() {
  return useMutation({
    mutationFn: async ({ callbackURL }: { callbackURL: string }) => {
      await authClient.signIn.social({
        provider: "google",
        callbackURL,
      });
    },
  });
}

export function useGithubSignInMutation() {
  return useMutation({
    mutationFn: async ({ callbackURL }: { callbackURL: string }) => {
      await authClient.signIn.social({
        provider: "github",
        callbackURL,
      });
    },
  });
}
