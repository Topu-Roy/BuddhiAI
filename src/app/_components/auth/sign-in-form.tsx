"use client";

import { useMutation } from "@tanstack/react-query";
import { signIn } from "@/auth/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "nextjs-toploader/app";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { email, object, string, type infer as Infer } from "zod";
import { GoogleSignInButton } from "@/components/google-sign-in-button";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
      signIn.email({
        email: email,
        password: password,
        callbackURL: callbackURL,
      }),
  });
}

export function SignInForm() {
  const router = useRouter();
  const { mutate: signInWithEmail, isPending } = useSignInWithEmail();

  const form = useForm<Infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: Infer<typeof signInSchema>) {
    signInWithEmail(
      {
        email: values.email,
        password: values.password,
        callbackURL: "/dashboard",
      },
      {
        onSuccess: () => {
          router.push("/dashboard");
        },
        onError: error => {
          toast.error(`Authentication failed - ${error.message}`);
        },
      }
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="example@email.com" {...field} />
              </FormControl>
              <FormDescription>Put your email address</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="********" {...field} />
              </FormControl>
              <FormDescription>Put your password</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex w-full flex-col items-center gap-4">
          <Button type="submit" className="h-10 w-full">
            {isPending ? "Signing in" : "Sign in"}
          </Button>

          <GoogleSignInButton className="h-10 w-full" />
        </div>
      </form>
    </Form>
  );
}
