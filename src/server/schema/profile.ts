import { EDUCATION_LEVEL, INTEREST } from "@prisma/client";
import { array, email, number, object, string, enum as zodEnum } from "zod";

export const updateOrCreateProfileInputSchema = object({
  name: string({ error: "Name is required" }).min(1, { message: "Name is required" }),
  email: email({ message: "Invalid email address" }),
  age: number({ error: "Age is required" })
    .int({ message: "Age must be a whole number" })
    .nonnegative({ message: "Age must be a positive number" })
    .min(1, { message: "Age must be at least 1" }),
  educationLevel: zodEnum(EDUCATION_LEVEL, {
    error: "Education level is required",
  }),
  interests: array(zodEnum(INTEREST), {
    error: "Interests are required",
  }).min(1, { message: "At least one interest is required" }),
});
