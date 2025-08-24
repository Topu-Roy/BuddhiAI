import { CTA } from "@/app/_components/home/cta";
import { Brain } from "lucide-react";
import Link from "next/link";
import { FeaturesBentoGrid } from "@/components/animated-grid";
import DynamicText from "@/components/dynamic-text";
import { QuizMarquee } from "@/components/quiz-marquee";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Highlighter } from "@/components/ui/highlighter";

export default function LandingPage() {
  return (
    <>
      <main>
        {/* Hero Section */}
        <section className="relative flex min-h-[75dvh] w-full flex-col items-center justify-center px-4 py-20 sm:px-6 lg:px-8">
          {/* Prismatic Aurora Burst - Multi-layered Gradient */}
          <div
            className="absolute inset-0 -z-10 hidden dark:block"
            style={{
              background: `
                radial-gradient(ellipse 120% 80% at 70% 20%, rgba(255, 20, 147, 0.15), transparent 50%),
                radial-gradient(ellipse 100% 60% at 30% 10%, rgba(0, 255, 255, 0.12), transparent 60%),
                radial-gradient(ellipse 90% 70% at 50% 0%, rgba(138, 43, 226, 0.18), transparent 65%),
                radial-gradient(ellipse 110% 50% at 80% 30%, rgba(255, 215, 0, 0.08), transparent 40%),
                #000000
              `,
            }}
          ></div>

          {/* Cool Blue Glow Top */}
          <div
            className="absolute inset-0 z-0 dark:hidden"
            style={{
              background: "#ffffff",
              backgroundImage: `
                radial-gradient(
                  circle at top center,
                  rgba(70, 130, 180, 0.5),
                  transparent 70%
                )
              `,
              filter: "blur(80px)",
              clipPath: "inset(0 0 0 0)",
              backgroundRepeat: "no-repeat",
            }}
          ></div>

          <div className="z-10 mx-auto max-w-4xl px-4 text-center">
            {/* Heading */}
            <h1 className="mb-4 text-3xl leading-tight font-bold text-balance sm:text-4xl md:text-5xl lg:text-6xl">
              Let&apos;s take a{" "}
              <Highlighter action="underline" strokeWidth={3} color="oklch(0.6818 0.1584 243.3540)">
                bite-size
              </Highlighter>{" "}
              Quiz of
              <span className="text-primary block sm:inline">
                <DynamicText />
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-muted-foreground mx-auto mb-8 max-w-lg text-base sm:max-w-xl sm:text-lg md:text-xl">
              Got a topic in mind? Let BuddhiAI whip up a quiz just for you — smart, snappy, and perfectly tuned to
              boost your brainpower
            </p>

            {/* CTA */}
            <div className="flex flex-col items-center justify-center gap-3 px-12 sm:flex-row sm:px-4 md:px-0">
              <CTA />
            </div>
          </div>
        </section>

        {/* Quiz Marquee Section */}
        <section className="pb-8">
          <QuizMarquee />
        </section>

        {/* Features Section */}
        <section className="bg-accent dark:bg-card/40 px-4 py-16">
          <FeaturesBentoGrid />
        </section>

        {/* How It Works Section */}
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8 text-center text-balance">
              <h2 className="text-foreground mb-4 text-3xl font-bold">How It Works</h2>
              <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
                Get started with BuddhiAI in four simple steps
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {steps.map((step, index) => (
                <div key={index} className="relative">
                  <div className="bg-card h-full rounded-xl border p-6 transition-shadow hover:shadow-lg">
                    <div className="mb-4 flex items-center">
                      <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-lg text-lg font-bold">
                        {step.number}
                      </div>
                    </div>
                    <h3 className="text-foreground mb-3 text-lg font-semibold">{step.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                  </div>

                  {/* Connection line for desktop */}
                  {index < steps.length - 1 && (
                    <div className="bg-border absolute top-12 -right-4 hidden h-px w-8 lg:block" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-accent dark:bg-card/40 flex items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
          <Card className="relative mx-auto flex h-[50dvh] max-w-6xl items-center justify-center rounded-lg px-12 text-center">
            <div className="z-10 flex h-full flex-col items-center justify-center">
              <h3 className="text-card-foreground mb-4 text-3xl font-bold">Ready to farm some brilliancy?</h3>
              <p className="text-card-foreground/80 mb-8 w-2/3 text-balance">
                Join thousands of curious minds testing their smarts with BuddhiAI&apos;s AI-powered quizzes. Fast,
                fun, and brain-boosting!
              </p>
              <Button size="lg" className="mx-auto max-w-sm">
                <Link href={"/dashboard"}>Start Quizzing</Link>
              </Button>
            </div>
            <BackgroundBeams />
          </Card>
        </section>
      </main>

      <footer className="bg-background py-8">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mb-4 flex items-center justify-center">
            <Brain className="text-muted-foreground mr-2 h-6 w-6" />
            <span className="text-foreground font-semibold">BuddhiAI</span>
          </div>
          <p className="text-muted-foreground">
            © 2025 BuddhiAI. Making brains smarter, one AI-powered quiz at a time.
          </p>
        </div>
      </footer>
    </>
  );
}

const steps = [
  {
    number: "01",
    title: "Sign Up",
    description: "Create your account and tell us your interests and knowledge level.",
  },
  {
    number: "02",
    title: "Pick a Topic",
    description: "Choose any subject and watch BuddhiAI craft your personalized quiz.",
  },
  {
    number: "03",
    title: "Take Your Quiz",
    description: "Answer 10 questions perfectly tuned to your brainpower.",
  },
  {
    number: "04",
    title: "Track Progress",
    description: "Get instant results with explanations and celebrate your growth.",
  },
];
