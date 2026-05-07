"use client";

/* eslint-disable react/no-children-prop */
import { useEffect } from "react";
import { useForm } from "@tanstack/react-form";
import { LOGO_URL } from "@/assets/AssetUrl";
import type { EDUCATION_LEVEL, INTEREST } from "@/generated/prisma/enums";
import { updateOrCreateProfileInputSchema } from "@/server/schema/profile";
import { api } from "@/trpc/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "nextjs-toploader/app";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { LogoText } from "@/components/logo-text";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { FieldDescription, FieldError, FieldLabel, Field as UIField } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileSetupPage() {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();
  const {
    mutate: updateMutation,
    isPending: pendingUpdate,
    isError,
    error,
  } = api.profile.createOrUpdate.useMutation();

  const form = useForm({
    defaultValues: {
      name: session?.user.name ?? "",
      email: session?.user.email ?? "",
      age: 18,
      educationLevel: "COLLAGE" as EDUCATION_LEVEL,
      interests: [] as unknown as INTEREST[],
    },
    validators: { onSubmit: updateOrCreateProfileInputSchema },
    async onSubmit({ value }) {
      const payload = {
        ...value,
        userId: session!.user.id,
      };

      updateMutation(payload, {
        onSuccess: () => {
          toast.success("Profile updated successfully");
          router.push("/dashboard");
        },
        onError(error) {
          if (error.data?.code === "INTERNAL_SERVER_ERROR") toast.error("Internal server error");
        },
      });
    },
  });

  useEffect(() => {
    if (!isPending && session?.user) {
      form.reset({
        name: session.user.name ?? "",
        email: session.user.email ?? "",
        age: 18,
        educationLevel: "COLLAGE" as EDUCATION_LEVEL,
        interests: [] as unknown as INTEREST[],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, isPending]);

  const educationLevels = [
    "HIGH_SCHOOL",
    "COLLAGE",
    "BACHELORS",
    "MASTERS",
    "PhD",
    "OTHER",
  ] satisfies EDUCATION_LEVEL[];

  const interestsList = [
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
  ] as const satisfies readonly INTEREST[];

  if (isPending || !session?.user) {
    return <CompleteProfileLoader />;
  }

  return (
    <div className="flex min-h-[92dvh] items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex w-full items-center justify-center gap-2">
            <Link href={"/"}>
              <Image
                className="aspect-square size-8 lg:size-12"
                src={LOGO_URL}
                height={100}
                width={100}
                alt="BuddhiAI"
              />
            </Link>
            <LogoText className="text-xl" />
          </div>
          <CardTitle className="text-2xl font-bold">Complete Your Profile</CardTitle>
          <CardDescription>Help us personalize your quiz experience</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={e => {
              e.preventDefault();
              // eslint-disable-next-line @typescript-eslint/no-floating-promises
              form.handleSubmit();
            }}
            className="space-y-6"
          >
            {/* Name */}
            <form.Field
              name="name"
              children={field => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <UIField data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Full Name</FieldLabel>
                    <Input
                      id={field.name}
                      placeholder={session?.user.name ?? "Ada Lovelace"}
                      value={field.state.value}
                      onChange={e => field.handleChange(e.target.value)}
                      onBlur={() => field.handleBlur()}
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </UIField>
                );
              }}
            />

            {/* Email */}
            <form.Field
              name="email"
              children={field => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <UIField data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                    <Input
                      id={field.name}
                      disabled
                      type="email"
                      placeholder={session?.user.email ?? "ada@lovelace.com"}
                      value={field.state.value}
                      onChange={e => field.handleChange(e.target.value)}
                      onBlur={() => field.handleBlur()}
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </UIField>
                );
              }}
            />

            <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-2">
              {/* Age */}
              <form.Field
                name="age"
                children={field => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <UIField data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Age</FieldLabel>
                      <Input
                        id={field.name}
                        type="number"
                        value={field.state.value}
                        onChange={e => field.handleChange(Number(e.target.value))}
                        onBlur={() => field.handleBlur()}
                        aria-invalid={isInvalid}
                      />
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </UIField>
                  );
                }}
              />

              {/* Education Level */}
              <form.Field
                name="educationLevel"
                children={field => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <UIField data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Education Level</FieldLabel>
                      <Select onValueChange={value => field.handleChange(value!)} value={field.state.value}>
                        <SelectTrigger className="w-full border border-border">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {educationLevels.map(level => (
                            <SelectItem key={level} value={level}>
                              {level.charAt(0).toUpperCase() +
                                level.slice(1).toLocaleLowerCase().replace("_", " ")}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </UIField>
                  );
                }}
              />
            </div>

            {/* Interests */}
            <form.Field
              name="interests"
              children={field => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <UIField data-invalid={isInvalid}>
                    <div className="mb-4">
                      <FieldLabel className="text-base">Interests</FieldLabel>
                      <FieldDescription>Select at least 3 topics you enjoy.</FieldDescription>
                    </div>
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                      {interestsList.map(interest => (
                        <div key={interest} className="flex items-center space-x-2">
                          <Checkbox
                            id={interest}
                            className="cursor-pointer border border-border"
                            checked={field.state.value?.includes(interest) ?? false}
                            onCheckedChange={checked => {
                              const current = field.state.value ?? [];
                              if (checked) {
                                field.handleChange([...current, interest]);
                              } else {
                                field.handleChange(current.filter(v => v !== interest));
                              }
                            }}
                          />
                          <Label htmlFor={interest} className="text-sm">
                            {interest.charAt(0).toUpperCase() + interest.slice(1).toLocaleLowerCase()}
                          </Label>
                        </div>
                      ))}
                    </div>
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </UIField>
                );
              }}
            />

            {/* Error banner */}
            {isError && (
              <Alert variant="destructive">
                <AlertDescription>{error.message}</AlertDescription>
              </Alert>
            )}

            {/* Submit */}
            <Button type="submit" className="w-full" disabled={form.state.isSubmitting || pendingUpdate}>
              {pendingUpdate ? "Saving…" : "Complete Setup"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function CompleteProfileLoader() {
  return (
    <div className="flex min-h-[92dvh] items-center justify-center p-4">
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
