"use client";

import { GoogleSVG } from "@/assets/icons/googleSVG";
import { toast } from "sonner";
import { useGoogleSignInMutation } from "@/hooks/auth";
import { Button } from "@/components/ui/button";

export function GoogleSignInButton({ className }: { className?: string }) {
  const { mutate: signInWithGoogleMutate, isPending } = useGoogleSignInMutation();

  function handleClick() {
    signInWithGoogleMutate(
      { callbackURL: "/dashboard" },
      {
        onError: error => {
          toast.error(`Failed to sign in with google - ${error.message}`);
        },
      }
    );
  }

  return (
    <Button
      type="button"
      variant={"outline"}
      className={className}
      size={"lg"}
      onClick={handleClick}
      disabled={isPending}
    >
      Sign in with Google <GoogleSVG />
    </Button>
  );
}
