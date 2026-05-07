"use client";

/* eslint-disable react/no-children-prop */
import { useForm } from "@tanstack/react-form";
import { type EDUCATION_LEVEL, type INTEREST } from "@/generated/prisma/enums";
import { updateOrCreateProfileInputSchema } from "@/server/schema/profile";
import { api } from "@/trpc/react";
import { Edit } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FieldDescription, FieldError, FieldLabel, Field as UIField } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Profile = {
  name: string;
  id: string;
  email: string;
  userId: string;
  age: number;
  educationLevel: EDUCATION_LEVEL;
  interests: INTEREST[];
};

export function EditDialog({ profile }: { profile: Profile }) {
  const router = useRouter();
  const utils = api.useUtils();
  const {
    mutate: updateMutation,
    isPending: pendingUpdate,
    isError,
    error,
  } = api.profile.createOrUpdate.useMutation({
    onSuccess: () => {
      void utils.profile.getProfileInfo.invalidate();
      void utils.profile.getProfileInfo.refetch();

      toast.success("Profile updated successfully, redirecting...");
      router.refresh();
    },
    onError: error => {
      if (error.data?.code === "INTERNAL_SERVER_ERROR") toast.error("Internal server error");
    },
  });

  const form = useForm({
    defaultValues: {
      name: profile.name ?? "",
      email: profile.email ?? "",
      age: profile.age,
      educationLevel: profile.educationLevel,
      interests: profile.interests,
    },
    validators: { onSubmit: updateOrCreateProfileInputSchema },
    onSubmit: ({ value }) => {
      const payload = {
        ...value,
        userId: profile.userId,
      };
      updateMutation(payload);
    },
  });

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

  return (
    <Dialog>
      <DialogTrigger
          render={
            <button className="size-10 cursor-pointer rounded-full border border-border bg-foreground/5 p-2">
              <Edit size={18} className="text-foreground/80" />
            </button>
          }
        />
      <DialogOverlay className="backdrop-blur-sm transition-all duration-300" />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit your personal Information</DialogTitle>
          <DialogDescription className="border-b border-border pb-4">
            This Information will be used to make the questions more personalized.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={e => {
            e.preventDefault();
            void form.handleSubmit();
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
                    placeholder={profile.name ?? "Ada Lovelace"}
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
                    placeholder={profile.email ?? "ada@lovelace.com"}
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
                          <SelectItem key={level} value={level} className="cursor-pointer">
                            {level.replace("_", " ").charAt(0) + level.replace("_", " ").slice(1).toLowerCase()}
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
                    <FieldLabel className="font-semibold">Interests</FieldLabel>
                    <FieldDescription>Select at least 3 topics you enjoy.</FieldDescription>
                  </div>
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                    {interestsList.map(interest => (
                      <div key={interest} className="flex items-center space-x-2">
                        <Checkbox
                          id={interest}
                          className="cursor-pointer border border-border"
                          checked={(field.state.value as readonly string[] | undefined)?.includes(interest)}
                          onCheckedChange={checked => {
                            const current = (field.state.value as readonly string[] | undefined) ?? [];
                            if (checked) {
                              field.handleChange([...current, interest] as never);
                            } else {
                              field.handleChange(current.filter(v => v !== interest) as never);
                            }
                          }}
                        />
                        <Label htmlFor={interest} className="cursor-pointer text-sm">
                          {interest.charAt(0) + interest.slice(1).toLowerCase()}
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
          <div className="flex w-full items-center justify-between gap-2">
            <Button
              type="button"
              variant={"outline"}
              onClick={() => form.reset()}
              className="flex-1"
              disabled={form.state.isSubmitting || pendingUpdate}
            >
              Reset
            </Button>
            <Button type="submit" className="flex-1" disabled={form.state.isSubmitting || pendingUpdate}>
              {pendingUpdate ? "Saving…" : "Complete Setup"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
