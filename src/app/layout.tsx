import "@/styles/globals.css";
import { Provider } from "@/providers/provider";
import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { Navbar } from "@/components/nav/nav-bar";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "BuddhiAI - Fuel Your Brain with Smart Quizzes",
  description:
    "BuddhiAI lets you create, explore, and take bite-sized AI-powered quizzes in seconds. Perfect for learning, fun, or challenging friends. Fast, fun, and addictive — 10 questions, unlimited smarts!",
  keywords: [
    "BuddhiAI",
    "AI quizzes",
    "quiz maker",
    "online quizzes",
    "brain games",
    "learning app",
    "MCQs",
    "trivia",
    "educational",
    "challenge friends",
  ],
  authors: [{ name: "Topu Roy", url: "https://topuroy.dev" }],
  creator: "Topu Roy",
  publisher: "BuddhiAI",
  robots: "index, follow",
  openGraph: {
    type: "website",
    title: "BuddhiAI - Fuel Your Brain with Smart Quizzes",
    description:
      "Create, explore, and take AI-powered quizzes instantly. Track your scores, challenge friends, and climb the leaderboard. Fast, fun, and addictive!",
    url: "https://buddhiai.com",
    siteName: "BuddhiAI",
    images: [
      {
        url: "https://bwjcur3siq.ufs.sh/f/j7HvSadRZFfQxYHWBvoYVLAR8WIPC709sH6laUyFSiuGOfpK",
        width: 1200,
        height: 630,
        alt: "BuddhiAI - Smart AI Quizzes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BuddhiAI - Fuel Your Brain with Smart Quizzes",
    description:
      "10 questions, unlimited smarts. AI-powered quizzes for learning, fun, or challenging friends. Fast, fun, and addictive!",
    images: ["https://bwjcur3siq.ufs.sh/f/j7HvSadRZFfQxYHWBvoYVLAR8WIPC709sH6laUyFSiuGOfpK"],
    creator: "@topuroy",
  },
  manifest: "/manifest.json",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  variable: "--font-geist-sans",
  weight: ["400", "500", "600", "700"],
});

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`} suppressHydrationWarning>
      <body className="relative">
        <Provider>
          <Navbar />
          {children}
          <Toaster />
        </Provider>
      </body>
    </html>
  );
}
