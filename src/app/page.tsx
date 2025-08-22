import { CTA } from "@/app/_components/home/cta";
import { BarChart3, Brain, Target, Zap } from "lucide-react";
import DynamicText from "@/components/dynamic-text";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LandingPage() {
  return (
    <div className="bg-background">
      <main>
        {/* Hero Section */}
        <section className="relative flex min-h-[80dvh] w-full items-center justify-center px-4 py-20 sm:px-6 lg:px-8">
          {/* Prismatic Aurora Burst - Multi-layered Gradient */}
          <div
            className="absolute inset-0 z-0"
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

          <div className="z-10 mx-auto max-w-4xl text-center text-white">
            <div className="mb-6 text-4xl font-bold text-balance md:text-6xl">
              Let&apos;s take a bite size Quiz of
              <div className="text-primary">
                <DynamicText />
              </div>
            </div>
            <p className="dark:text-muted-foreground mx-auto mb-8 max-w-2xl text-xl text-white/60">
              Got a topic in mind? Let BuddhiAI whip up a quiz just for you — smart, snappy, and perfectly tuned to
              boost your brainpower
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <CTA />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-card flex min-h-[70dvh] items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <h3 className="text-foreground mb-12 text-center text-3xl font-bold">Why BuddhiAI Rocks</h3>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="text-center">
                  <Brain className="text-primary mx-auto mb-4 h-12 w-12" />
                  <CardTitle>AI-Powered</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    BuddhiAI&apos;s brainy AI whips up unique questions on any topic—fast and clever every time.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-center">
                  <Target className="text-primary mx-auto mb-4 h-12 w-12" />
                  <CardTitle>Personalized</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    Quizzes flex to your level, interests, and goals—because one-size-fits-all is boring.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-center">
                  <Zap className="text-primary mx-auto mb-4 h-12 w-12" />
                  <CardTitle>Instant Feedback</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    Snap! Get immediate answers with clear explanations—no waiting, no guessing.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-center">
                  <BarChart3 className="text-primary mx-auto mb-4 h-12 w-12" />
                  <CardTitle>Track Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    Watch your brain grow with easy-to-read stats and performance insights.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="flex min-h-[70dvh] items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <h3 className="text-foreground mb-12 text-center text-3xl font-bold">How It Works</h3>
            <div className="space-y-8">
              <div className="flex items-center space-x-6">
                <div className="bg-primary text-primary-foreground flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full text-lg font-bold">
                  1
                </div>
                <div>
                  <h4 className="text-foreground mb-2 text-xl font-semibold">Sign Up & Tell Us About You</h4>
                  <p className="text-muted-foreground">
                    Create your account and share your interests and knowledge level. BuddhiAI loves to know its
                    player!
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <div className="bg-primary text-primary-foreground flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full text-lg font-bold">
                  2
                </div>
                <div>
                  <h4 className="text-foreground mb-2 text-xl font-semibold">Pick a Topic</h4>
                  <p className="text-muted-foreground">
                    Type any subject you fancy—history, science, pop culture, or something completely wild—and
                    watch BuddhiAI craft your quiz.
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <div className="bg-primary text-primary-foreground flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full text-lg font-bold">
                  3
                </div>
                <div>
                  <h4 className="text-foreground mb-2 text-xl font-semibold">Take Your Quiz</h4>
                  <p className="text-muted-foreground">
                    Answer 10 questions made just for you. Fast, fun, and smart—perfectly tuned to your brainpower.
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <div className="bg-primary text-primary-foreground flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full text-lg font-bold">
                  4
                </div>
                <div>
                  <h4 className="text-foreground mb-2 text-xl font-semibold">Check & Celebrate</h4>
                  <p className="text-muted-foreground">
                    Get instant results with explanations, track your progress, and flex your growing brainpower.
                    Knowledge = unlocked.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-card flex min-h-[40dvh] items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h3 className="text-card-foreground mb-6 text-3xl font-bold">Ready to Flex Your Brain?</h3>
            <p className="text-card-foreground/80 mb-8 text-xl">
              Join thousands of curious minds testing their smarts with BuddhiAI&apos;s AI-powered quizzes. Fast,
              fun, and brain-boosting!
            </p>
            <Button size="lg">Start Quizzing</Button>
          </div>
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
    </div>
  );
}
