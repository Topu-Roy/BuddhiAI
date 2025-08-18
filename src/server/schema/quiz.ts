import { EDUCATION_LEVEL, INTEREST } from "@prisma/client";
import z from "zod";

export const generateQuizInputSchema = z.object({
  age: z.number().int().min(1).max(120),
  educationLevel: z.nativeEnum(EDUCATION_LEVEL),
  topic: z.string().min(1).max(200),
  interests: z.array(z.nativeEnum(INTEREST)).min(1),
});

// single MCQ
const mcqSchema = z.object({
  id: z.number().int().positive(),
  question: z.string(),
  options: z.array(z.string()).length(4),
  correctAnswerIndex: z.number().int().min(0).max(3),
  explanation: z.string(),
});

// array of 10
export const quizSchema = z.object({
  quiz: z.array(mcqSchema).length(10),
  topic: z.string(),
  description: z.string(),
  category: z.nativeEnum(INTEREST),
});

export const AnswerSchema = z.object({
  questionId: z.string(),
  localId: z.number(),
  selectedAnswerIndex: z.number(),
});

export const submitQuizInputSchema = z.object({
  timeTookInSeconds: z.number().int().nonnegative(),
  quizId: z.string().nonempty(),
  profileId: z.string().nonempty(),
  answers: z.array(AnswerSchema),
});

export const getResultInputSchema = z.object({
  resultId: z.string().nonempty(),
  profileId: z.string().nonempty(),
});
