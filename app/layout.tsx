import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { Provider } from "@/providers/provider";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/nav/nav-bar";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BuddhiAI - Fuel Your Brain with Smart Quizzes",
  description:
    "BuddhiAI lets you create, explore, and take bite-sized AI-powered quizzes in seconds. Perfect for learning, fun, or challenging friends. Fast, fun, and addictive questions, unlimited knowledge!",
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
    description: "AI-powered quizzes for learning, fun, or challenging friends. Fast, fun, and addictive!",
    images: ["https://bwjcur3siq.ufs.sh/f/j7HvSadRZFfQxYHWBvoYVLAR8WIPC709sH6laUyFSiuGOfpK"],
    creator: "@topuroy",
  },
  manifest: "/manifest.json",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", inter.variable)}
    >
      <body className="flex min-h-full flex-col">
        <Provider>
          <Navbar />
          {children}
          <Toaster />
        </Provider>
      </body>
    </html>
  );
}
