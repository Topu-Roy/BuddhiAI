import { Brain } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SignUpForm } from "../../../_components/auth/sign-up-form";

export default function SignUpScreen() {
  return (
    <div className="bg-background w-full items-center justify-center p-4">
      <Card className="mx-auto mt-14 max-w-2xl">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <Brain className="text-primary h-12 w-12" />
          </div>

          <CardTitle className="text-2xl font-bold">Quiz Generator AI</CardTitle>
          <CardDescription>Create your account</CardDescription>
        </CardHeader>
        <CardContent>
          <SignUpForm />
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/auth/sign-in" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
