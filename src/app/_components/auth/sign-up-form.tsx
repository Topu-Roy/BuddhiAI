"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { signUp } from "@/auth/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
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

const signUpSchema = object({
  email: email({ error: "Invalid email" }),
  firstName: string({ error: "First name is required" })
    .min(2, { error: "Must be within 2 to 20 characters" })
    .max(20, { error: "Must be within 2 to 20 characters" }),
  lastName: string({ error: "Last name is required" })
    .min(2, { error: "Must be within 2 to 20 characters" })
    .max(20, { error: "Must be within 2 to 20 characters" }),
  password: string({ error: "Password required" })
    .min(8, { error: "Must be within 8 to 30 characters" })
    .max(30, { error: "Must be within 8 to 30 characters" }),
  confirmPassword: string({ error: "Password required" })
    .min(8, { error: "Must be within 8 to 30 characters" })
    .max(30, { error: "Must be within 8 to 30 characters" }),
}).refine(({ password, confirmPassword }) => password === confirmPassword, {
  error: "Passwords do not match",
  path: ["confirmPassword"],
});

function useSignUpWithEmail() {
  return useMutation({
    mutationFn: ({
      email,
      name,
      password,
      callbackURL,
    }: {
      email: string;
      name: string;
      password: string;
      callbackURL: string;
    }) =>
      signUp.email({
        name: name,
        email: email,
        password: password,
        callbackURL: callbackURL,
        fetchOptions: {
          onError: ctx => {
            toast.error(`Authentication failed - ${ctx.error.message}`);
          },
        },
      }),
  });
}

export function SignUpForm() {
  const router = useRouter();
  const { mutate: signUpWithEmail, isPending } = useSignUpWithEmail();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const form = useForm<Infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(values: Infer<typeof signUpSchema>) {
    signUpWithEmail(
      {
        email: values.email,
        name: `${values.firstName} ${values.lastName}`,
        password: values.password,
        callbackURL: "/dashboard",
      },
      {
        onSuccess: () => {
          router.push("/dashboard");
        },
        onError(error) {
          toast.error(`Authentication failed - ${error.message}`);
        },
      }
    );
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Email <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="example@email.com" {...field} />
              </FormControl>
              <FormDescription>Put your email address</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  First name <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
                </FormControl>
                <FormDescription>Put your first name</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Last name <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} />
                </FormControl>
                <FormDescription>Put your last name</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Password <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="********"
                    {...field}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </FormControl>
              <FormDescription>Put your password</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Confirm password <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="********"
                    {...field}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </FormControl>
              <FormDescription>Confirm your password</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-2">
          <GoogleSignInButton className="w-full" />
          <Button disabled={isPending} type="submit" size={"lg"} className="w-full">
            {isPending ? "Signing up" : "Register"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
