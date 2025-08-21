import { Suspense } from "react";
import { QuizDetailSkeleton, RenderView } from "@/app/_components/quiz/view/render-view";
import { api } from "@/trpc/server";
import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";

export const dynamicParams = true; // allow “unknown” ids at runtime
export const revalidate = 120; // ISR – regenerate in the background after 2 minutes

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const { id } = await params;

  // fetch data
  const data = await api.quiz.getQuiz({ quizId: id });
  if (!data) return { title: "Quiz not found" };

  const { quiz, analytics } = data;

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images ?? [];

  return {
    // === REQUIRED FIELDS ===
    title: `${quiz.topic} | BuddhiAI`,
    description:
      quiz.description ??
      `Test your knowledge with this ${quiz.category} quiz featuring ${quiz._count.questions} questions.`,

    // === RECOMMENDED FIELDS ===
    keywords: [
      quiz.topic,
      quiz.category,
      "quiz",
      "trivia",
      "knowledge test",
      "interactive quiz",
      "learning",
      ...quiz.topic.split(" ").filter(Boolean),
    ],
    authors: quiz.Profile ? [{ name: quiz.Profile.name }] : [{ name: "BuddhiAI" }],
    creator: quiz.Profile?.name ?? "BuddhiAI",
    publisher: "BuddhiAI",
    applicationName: "BuddhiAI",
    generator: "Next.js",

    // === OPENGRAPH (Facebook, LinkedIn, etc.) ===
    openGraph: {
      title: quiz.topic,
      description: quiz.description,
      url: `https://yourdomain.com/quiz/view/${id}`,
      siteName: "BuddhiAI",
      images: [
        {
          url: "https://bwjcur3siq.ufs.sh/f/j7HvSadRZFfQxYHWBvoYVLAR8WIPC709sH6laUyFSiuGOfpK",
          width: 1200,
          height: 630,
          alt: `${quiz.topic} - quiz preview`,
        },
        ...previousImages,
      ],
      locale: "en_US",
      type: "website",
    },

    // === TWITTER CARD ===
    twitter: {
      card: "summary_large_image",
      title: quiz.topic,
      description: quiz.description,
      images: ["https://bwjcur3siq.ufs.sh/f/j7HvSadRZFfQxYHWBvoYVLAR8WIPC709sH6laUyFSiuGOfpK"],
      creator: quiz.Profile?.name ?? "@buddhiai",
      site: "@buddhiai",
    },

    // === ROBOTS & SEO ===
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },

    // === ADDITIONAL OPTIONAL FIELDS ===
    icons: { icon: "/favicon.ico" },
    category: quiz.category,

    // === STRUCTURED DATA (JSON-LD) === // TODO: Update name
    other: {
      "quiz-info": JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Quiz",
        name: quiz.topic,
        description: quiz.description,
        numberOfQuestions: quiz._count.questions,
        category: quiz.category,
        author: {
          "@type": "Person",
          name: quiz.Profile?.name ?? "BuddhiAI",
        },
        dateCreated: quiz.createdAt.toISOString(),
        timesTaken: analytics.timesTaken,
        averageScore: analytics.averageScore,
        totalPassed: analytics.totalPassed,
        totalFailed: analytics.totalFailed,
      }),
    },
  };
}

export default async function ResultScreen({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (!id) notFound();

  return (
    <Suspense fallback={<QuizDetailSkeleton />}>
      <RenderView quizId={id} />
    </Suspense>
  );
}
