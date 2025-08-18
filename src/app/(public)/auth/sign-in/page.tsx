import { Brain } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SignInForm } from "../../../_components/auth/sign-in-form";

export default function SignInScreen() {
  return (
    <div className="bg-background flex items-center justify-center p-4">
      <Card className="ma-auto mt-16 w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <Brain className="text-primary h-12 w-12" />
          </div>
          <CardTitle className="text-2xl font-bold">Quiz Generator AI</CardTitle>
          <CardDescription>Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <SignInForm />

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              {"Don't have an account? "}
              <Link href="/auth/sign-up" className="text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
