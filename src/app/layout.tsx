import "@/styles/globals.css";
import { Provider } from "@/providers/provider";
import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { Navbar } from "@/components/nav/nav-bar";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Quizcraft - Create and take quizzes on any topic.",
  description:
    "Quizcraft is your AI-powered quiz-making sidekick. Enter a topic, choose a difficulty, and get unique multiple-choice questions in seconds. Perfect for teachers, trivia hosts, students, or just curious minds. Share your quiz, save your scores, and keep learning the fun way. Craft Quizzes in Seconds. Test Minds for Hours.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`} suppressHydrationWarning>
      <body>
        <Provider>
          <Navbar />
          {children}
          <Toaster />
        </Provider>
      </body>
    </html>
  );
}
