"use client";

import type { getProfileByUserId } from "@/server/helpers/profile";
import { updateOrCreateProfileInputSchema } from "@/server/schema/profile";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import type { EDUCATION_LEVEL, INTEREST } from "@prisma/client";
import { Edit } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type z from "zod";
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

export function EditDialog({ profile }: { profile: NonNullable<Awaited<ReturnType<typeof getProfileByUserId>>> }) {
  const router = useRouter();
  const {
    mutate: updateMutation,
    isPending: pendingUpdate,
    isError,
    error,
  } = api.profile.createOrUpdate.useMutation({
    onSuccess: () => {
      toast.success("✅ Profile updated successfully, redirecting...");
      router.refresh();
    },
    onError: error => {
      if (error.data?.code === "INTERNAL_SERVER_ERROR") toast.error("❌ Internal server error");
    },
  });

  const form = useForm<z.infer<typeof updateOrCreateProfileInputSchema>>({
    resolver: zodResolver(updateOrCreateProfileInputSchema),
    defaultValues: {
      name: profile.name ?? "",
      email: profile.email ?? "",
      age: profile.age,
      educationLevel: profile.educationLevel,
      interests: profile.interests,
    },
  });

  function onSubmit(values: z.infer<typeof updateOrCreateProfileInputSchema>) {
    const payload = {
      ...values,
      userId: profile.userId,
    };

    updateMutation(payload);
  }

  return (
    <Dialog>
      <DialogTrigger
        asChild
        className="border-border bg-foreground/5 size-10 cursor-pointer rounded-full border p-2"
      >
        <Edit size={18} className="text-foreground/80" />
      </DialogTrigger>
      <DialogOverlay className="backdrop-blur-sm transition-all duration-300" />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit your personal Information</DialogTitle>
          <DialogDescription className="border-border border-b pb-4">
            This Information will be used to make the questions more personalized.
          </DialogDescription>
        </DialogHeader>

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
                    <Input placeholder={profile.name ?? "Ada Lovelace"} {...field} />
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
                    <Input
                      disabled={true}
                      type="email"
                      placeholder={profile.email ?? "ada@lovelace.com"}
                      {...field}
                    />
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
                        <SelectTrigger className="w-full">
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
                          <SelectItem key={level} value={level} className="cursor-pointer">
                            {level.replace("_", " ").charAt(0) + level.replace("_", " ").slice(1).toLowerCase()}
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
                                className="cursor-pointer"
                                checked={field.value?.includes(interest)}
                                onCheckedChange={checked =>
                                  checked
                                    ? field.onChange([...field.value, interest])
                                    : field.onChange(field.value?.filter(v => v !== interest))
                                }
                              />
                            </FormControl>
                            <Label htmlFor={interest} className="cursor-pointer text-sm">
                              {interest.charAt(0) + interest.slice(1).toLowerCase()}
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
            <div className="flex w-full items-center justify-between gap-2">
              <Button
                type="reset"
                variant={"outline"}
                onClick={() => form.reset()}
                className="flex-1"
                disabled={form.formState.isSubmitting || pendingUpdate}
              >
                Reset
              </Button>
              <Button type="submit" className="flex-1" disabled={form.formState.isSubmitting || pendingUpdate}>
                {pendingUpdate ? "Saving…" : "Complete Setup"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
