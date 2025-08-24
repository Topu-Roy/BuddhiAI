import { SignInForm } from "@/app/_components/auth/sign-in-form";
import Link from "next/link";
import { LogoText } from "@/components/logo-text";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SignInScreen() {
  return (
    <div className="flex w-full items-center justify-center p-4">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader className="lg:text-center">
          <CardTitle className="flex w-full items-center justify-start gap-2 lg:justify-center">
            <Link href={"/"} className="bg-primary inline-flex size-8 items-center justify-center rounded-full">
              {/* <Image
                  className="size-8"
                  src={LOGO_URL}
                  height={100}
                  width={100}
                  alt="BuddhiAI"
                /> */}
            </Link>
            <LogoText className="text-xl" />
          </CardTitle>
          <CardDescription className="text-lg">Sign in to your account</CardDescription>
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
