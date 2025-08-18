"use client";

import { useState } from "react";
import { signUp } from "@/auth/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
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

const signUpSchema = z
  .object({
    email: z.string({ required_error: "Email is required" }).trim().email({ message: "Invalid email" }),
    firstName: z
      .string({ required_error: "First name is required" })
      .min(2, { message: "Must be within 2 to 20 characters" })
      .max(20, { message: "Must be within 2 to 20 characters" }),
    lastName: z
      .string({ required_error: "Last name is required" })
      .min(2, { message: "Must be within 2 to 20 characters" })
      .max(20, { message: "Must be within 2 to 20 characters" }),
    password: z
      .string({ required_error: "Password required" })
      .min(8, { message: "Must be within 8 to 30 characters" })
      .max(30, { message: "Must be within 8 to 30 characters" }),
    confirmPassword: z
      .string({ required_error: "Password required" })
      .min(8, { message: "Must be within 8 to 30 characters" })
      .max(30, { message: "Must be within 8 to 30 characters" }),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(values: z.infer<typeof signUpSchema>) {
    void signUp.email({
      email: values.email,
      name: `${values.firstName} ${values.lastName}`,
      password: values.password,
      callbackURL: "/dashboard",
      fetchOptions: {
        onError: ctx => {
          toast.error(`Authentication failed - ${ctx.error.message}`);
        },
      },
    });
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
          <Button type="submit" size={"lg"} className="w-full">
            Register
          </Button>
        </div>
      </form>
    </Form>
  );
}
