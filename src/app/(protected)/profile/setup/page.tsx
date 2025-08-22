"use client";

import { useEffect } from "react";
import { useSession } from "@/auth/auth-client";
import { updateOrCreateProfileInputSchema } from "@/server/schema/profile";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import type { EDUCATION_LEVEL, INTEREST } from "@prisma/client";
import { Brain } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type z from "zod";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileSetupPage() {
  const router = useRouter();

  const { data: session, isPending } = useSession();
  const {
    mutate: updateMutation,
    isPending: pendingUpdate,
    isError,
    error,
  } = api.profile.createOrUpdate.useMutation({
    onSuccess: () => {
      toast.success("✅ Profile updated successfully");
      router.push("/dashboard");
    },
    onError(error) {
      if (error.data?.code === "INTERNAL_SERVER_ERROR") toast.error("❌ Internal server error");
    },
  });

  const form = useForm<z.infer<typeof updateOrCreateProfileInputSchema>>({
    resolver: zodResolver(updateOrCreateProfileInputSchema),
    defaultValues: {
      name: session?.user.name ?? "",
      email: session?.user.email ?? "",
      age: 18,
      educationLevel: "HIGH_SCHOOL",
      interests: [],
    },
  });

  function onSubmit(values: z.infer<typeof updateOrCreateProfileInputSchema>) {
    const payload = {
      ...values,
      userId: session!.user.id,
    };

    updateMutation(payload);
  }

  useEffect(() => {
    if (isPending) return;

    if (session?.user) {
      console.log(session.user);

      form.reset(
        {
          name: session.user.name,
          email: session.user.email,
          age: 18,
          educationLevel: "HIGH_SCHOOL",
          interests: [],
        },
        { keepDefaultValues: false }
      );
    }

    if (!session?.user.id) {
      router.push("/auth/sign-in");
    }
  }, [session, isPending, router, form]);

  if (isPending) {
    return <CompleteProfileLoader />;
  }

  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <Brain className="text-primary h-12 w-12" />
          </div>
          <CardTitle className="text-2xl font-bold">Complete Your Profile</CardTitle>
          <CardDescription>Help us personalize your quiz experience</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder={session?.user.name ?? "Ada Lovelace"} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder={session?.user.email ?? "ada@lovelace.com"} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-2">
                {/* Age */}
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Education Level */}
                <FormField
                  control={form.control}
                  name="educationLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Education Level</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="border-border w-full border">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {(
                            [
                              "HIGH_SCHOOL",
                              "COLLAGE",
                              "BACHELORS",
                              "MASTERS",
                              "PhD",
                              "OTHER",
                            ] satisfies EDUCATION_LEVEL[]
                          ).map(level => (
                            <SelectItem key={level} value={level}>
                              {level.charAt(0).toUpperCase() +
                                level.slice(1).toLocaleLowerCase().replace("_", " ")}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Interests */}
              <FormField
                control={form.control}
                name="interests"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-base">Interests</FormLabel>
                      <FormDescription>Select at least 3 topics you enjoy.</FormDescription>
                    </div>
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                      {(
                        [
                          "SCIENCE",
                          "TECHNOLOGY",
                          "HISTORY",
                          "LITERATURE",
                          "MATHEMATICS",
                          "GEOGRAPHY",
                          "SPORTS",
                          "ENTERTAINMENT",
                          "POLITICS",
                          "ART",
                          "MUSIC",
                          "PHILOSOPHY",
                          "OTHER",
                        ] as const satisfies readonly INTEREST[]
                      ).map(interest => (
                        <FormField
                          key={interest}
                          control={form.control}
                          name="interests"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2">
                              <FormControl>
                                <Checkbox
                                  id={interest}
                                  className="border-border cursor-pointer border"
                                  checked={field.value?.includes(interest)}
                                  onCheckedChange={checked =>
                                    checked
                                      ? field.onChange([...field.value, interest])
                                      : field.onChange(field.value?.filter(v => v !== interest))
                                  }
                                />
                              </FormControl>
                              <Label htmlFor={interest} className="text-sm">
                                {interest.charAt(0).toUpperCase() + interest.slice(1).toLocaleLowerCase()}
                              </Label>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Error banner */}
              {isError && (
                <Alert variant="destructive">
                  <AlertDescription>{error.message}</AlertDescription>
                </Alert>
              )}

              {/* Submit */}
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting || pendingUpdate}>
                {pendingUpdate ? "Saving…" : "Complete Setup"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

function CompleteProfileLoader() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <Skeleton className="mx-auto mb-4 h-12 w-12 rounded-full" />
          <Skeleton className="mx-auto mb-2 h-7 w-48" />
          <Skeleton className="mx-auto h-4 w-64" />
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-10 w-full" />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Age */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-8" />
              <Skeleton className="h-10 w-full" />
            </div>

            {/* Education Level */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>

          {/* Interests */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-48" />
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {Array.from({ length: 13 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <Skeleton className="h-4 w-4 rounded" />
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}
