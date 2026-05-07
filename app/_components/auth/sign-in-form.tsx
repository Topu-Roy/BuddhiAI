/* eslint-disable react/no-children-prop */
"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "nextjs-toploader/app";
import { toast } from "sonner";
import { email, object, string } from "zod";
import { authClient } from "@/lib/auth-client";
import { GoogleSignInButton } from "@/components/google-sign-in-button";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const signInSchema = object({
  email: email({ error: "Invalid email" }),
  password: string({ error: "Password required" })
    .min(8, { error: "Must be within 8 to 30 characters" })
    .max(30, { error: "Must be within 8 to 30 characters" }),
});

function useSignInWithEmail() {
  return useMutation({
    mutationFn: ({ email, password, callbackURL }: { email: string; password: string; callbackURL: string }) =>
      authClient.signIn.email({
        email,
        password,
        callbackURL,
      }),
  });
}

export function SignInForm() {
  const router = useRouter();
  const { mutate: signInWithEmail, isPending } = useSignInWithEmail();

  const form = useForm({
    defaultValues: { email: "", password: "" },
    validators: { onSubmit: signInSchema },
    async onSubmit({ value }) {
      try {
        signInWithEmail(
          { email: value.email, password: value.password, callbackURL: "/dashboard" },
          {
            onSuccess: () => router.push("/dashboard"),
            onError: error => toast.error(`Authentication failed - ${error.message}`),
          }
        );
      } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : "Unknown error";
        toast.error(`Authentication failed - ${msg}`);
      }
    },
  });

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        void form.handleSubmit();
      }}
      className="space-y-8"
    >
      <form.Field
        name="email"
        children={field => {
          const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel htmlFor={field.name}>Email</FieldLabel>
              <Input
                id={field.name}
                placeholder="example@email.com"
                value={field.state.value}
                onChange={e => field.handleChange(e.target.value)}
                onBlur={() => field.handleBlur()}
                aria-invalid={isInvalid}
              />
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          );
        }}
      />

      <form.Field
        name="password"
        children={field => {
          const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel htmlFor={field.name}>Password</FieldLabel>
              <Input
                id={field.name}
                type="password"
                placeholder="********"
                value={field.state.value}
                onChange={e => field.handleChange(e.target.value)}
                onBlur={() => field.handleBlur()}
                aria-invalid={isInvalid}
              />
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          );
        }}
      />

      <div className="flex w-full flex-col items-center gap-4">
        <Button type="submit" disabled={isPending} className="h-10 w-full">
          {isPending ? "Signing in" : "Sign in"}
        </Button>

        <GoogleSignInButton className="h-10 w-full" />
      </div>
    </form>
  );
}
