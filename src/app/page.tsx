import React from "react";
import { CTA } from "@/app/_components/home/cta";
import { BarChart3, Brain, Target, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LandingPage() {
  return (
    <div className="bg-background">
      <main>
        {/* Hero Section */}
        <section className="flex min-h-[70dvh] items-center justify-center px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-foreground mb-6 text-4xl font-bold md:text-6xl">
              Test Your Knowledge with <span className="text-primary">AI-Generated MCQ</span>
            </h2>
            <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-xl">
              Enter any topic and let our AI create personalized quizzes tailored to your knowledge level and
              interests.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <CTA />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-card flex min-h-[70dvh] items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <h3 className="text-foreground mb-12 text-center text-3xl font-bold">Why Choose Quiz Generator AI?</h3>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="text-center">
                  <Brain className="text-primary mx-auto mb-4 h-12 w-12" />
                  <CardTitle>AI-Powered</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    Advanced AI generates unique, relevant questions on any topic you choose.
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
                    Quizzes adapt to your education level, age, and interests for optimal learning.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-center">
                  <Zap className="text-primary mx-auto mb-4 h-12 w-12" />
                  <CardTitle>Instant Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    Get immediate feedback with detailed explanations for every answer.
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
                    Monitor your learning journey with comprehensive performance analytics.
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
                  <h4 className="text-foreground mb-2 text-xl font-semibold">Sign Up & Complete Profile</h4>
                  <p className="text-muted-foreground">
                    Create your account and tell us about your interests and education level.
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <div className="bg-primary text-primary-foreground flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full text-lg font-bold">
                  2
                </div>
                <div>
                  <h4 className="text-foreground mb-2 text-xl font-semibold">Enter Your Topic</h4>
                  <p className="text-muted-foreground">
                    Type in any subject you want to be quizzed on - from history to science to pop culture.
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <div className="bg-primary text-primary-foreground flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full text-lg font-bold">
                  3
                </div>
                <div>
                  <h4 className="text-foreground mb-2 text-xl font-semibold">Take the Quiz</h4>
                  <p className="text-muted-foreground">
                    Answer 10 AI-generated questions tailored to your knowledge level.
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <div className="bg-primary text-primary-foreground flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full text-lg font-bold">
                  4
                </div>
                <div>
                  <h4 className="text-foreground mb-2 text-xl font-semibold">Review & Learn</h4>
                  <p className="text-muted-foreground">
                    Get instant results with explanations and track your progress over time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-card flex min-h-[40dvh] items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h3 className="text-card-foreground mb-6 text-3xl font-bold">Ready to Challenge Yourself?</h3>
            <p className="text-card-foreground/80 mb-8 text-xl">
              Join thousands of learners who are expanding their knowledge with AI-powered quizzes.
            </p>
            <Button size="lg">Get Started for Free</Button>
          </div>
        </section>
      </main>

      <footer className="bg-muted py-8">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mb-4 flex items-center justify-center">
            <Brain className="text-muted-foreground mr-2 h-6 w-6" />
            <span className="text-foreground font-semibold">Quiz Generator AI</span>
          </div>
          <p className="text-muted-foreground">
            © 2024 Quiz Generator AI. Empowering learning through artificial intelligence.
          </p>
        </div>
      </footer>
    </div>
  );
}
