import { EDUCATION_LEVEL, INTEREST } from "@prisma/client";
import { array, number, object, string, enum as zodEnum } from "zod";

export const generateQuizInputSchema = object({
  age: number().int().min(1).max(120),
  educationLevel: zodEnum(EDUCATION_LEVEL),
  topic: string().min(1).max(200),
  interests: array(zodEnum(INTEREST)).min(1),
});

// single MCQ
const mcqSchema = object({
  id: number().int().positive(),
  question: string(),
  options: array(string()).length(4),
  correctAnswerIndex: number().int().min(0).max(3),
  explanation: string(),
});

// array of 10
export const quizSchema = object({
  quiz: array(mcqSchema).length(10),
  topic: string(),
  description: string(),
  category: zodEnum(INTEREST),
});

export const AnswerSchema = object({
  questionId: string(),
  localId: number(),
  selectedAnswerIndex: number(),
});

export const submitQuizInputSchema = object({
  timeTookInSeconds: number().int().nonnegative(),
  quizId: string().nonempty(),
  profileId: string().nonempty(),
  answers: array(AnswerSchema),
});

export const getResultInputSchema = object({
  resultId: string().nonempty(),
  profileId: string().nonempty(),
});
