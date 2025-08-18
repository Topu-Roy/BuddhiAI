import { EDUCATION_LEVEL, INTEREST } from "@prisma/client";
import z from "zod";

export const updateOrCreateProfileInputSchema = z.object({
  name: z.string({ required_error: "Name is required" }).min(1, { message: "Name is required" }),
  email: z.string({ required_error: "Email is required" }).email({ message: "Invalid email address" }),
  age: z
    .number({ required_error: "Age is required", invalid_type_error: "Age must be a number" })
    .int({ message: "Age must be a whole number" })
    .nonnegative({ message: "Age must be a positive number" })
    .min(1, { message: "Age must be at least 1" }),
  educationLevel: z.nativeEnum(EDUCATION_LEVEL, {
    required_error: "Education level is required",
    invalid_type_error: "Invalid education level",
  }),
  interests: z
    .array(z.nativeEnum(INTEREST), {
      required_error: "Interests are required",
      invalid_type_error: "Invalid interest value",
    })
    .min(1, { message: "At least one interest is required" }),
});
