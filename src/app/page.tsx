import { CTA } from "@/app/_components/home/cta";
import { BarChart3, Brain, Target, Zap } from "lucide-react";
import DynamicText from "@/components/dynamic-text";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: Brain,
    title: "AI-Powered",
    desc: "BuddhiAI's brainy AI whips up unique questions on any topic—fast and clever every time.",
  },
  {
    icon: Target,
    title: "Personalized",
    desc: "Quizzes flex to your level, interests, and goals—because one-size-fits-all is boring.",
  },
  {
    icon: Zap,
    title: "Instant Feedback",
    desc: "Snap! Get immediate answers with clear explanations—no waiting, no guessing.",
  },
  {
    icon: BarChart3,
    title: "Track Progress",
    desc: "Watch your brain grow with easy-to-read stats and performance insights.",
  },
];

export default function LandingPage() {
  return (
    <div className="bg-background">
      <main>
        {/* Hero Section */}
        <section className="relative flex min-h-[85dvh] w-full items-center justify-center px-4 py-20 sm:px-6 lg:px-8">
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

          <div className="z-10 mx-auto max-w-4xl px-4 text-center">
            {/* Heading */}
            <h1 className="mb-4 text-3xl leading-tight font-bold text-balance sm:text-4xl md:text-5xl lg:text-6xl">
              Let&apos;s take a bite-size Quiz of
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

        {/* Features Section */}
        <section className="bg-card flex min-h-[75dvh] items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
          <div className="z-10 mx-auto max-w-6xl">
            <h3 className="text-foreground mb-12 text-center text-3xl font-bold sm:text-4xl">
              Why BuddhiAI Rocks
            </h3>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {features.map(({ icon: Icon, title, desc }) => (
                <Card key={title} className="bg-card/60 backdrop-blur-sm">
                  <CardHeader className="text-center">
                    <Icon className="text-primary mx-auto mb-4 h-12 w-12" />
                    <CardTitle className="text-lg">{title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center text-sm">{desc}</CardDescription>
                  </CardContent>
                </Card>
              ))}
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
