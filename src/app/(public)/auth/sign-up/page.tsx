import { SignUpForm } from "@/app/_components/auth/sign-up-form";
import { LOGO_URL } from "@/assets/AssetUrl";
import Image from "next/image";
import Link from "next/link";
import { LogoText } from "@/components/logo-text";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SignUpScreen() {
  return (
    <div className="w-full items-center justify-center p-4">
      <Card className="mx-auto max-w-2xl lg:mt-14">
        <CardHeader className="w-full lg:text-center">
          <CardTitle className="flex w-full items-center justify-start gap-2 lg:justify-center">
            <Link href={"/"}>
              <Image
                className="aspect-square size-8 lg:size-12"
                src={LOGO_URL}
                height={100}
                width={100}
                alt="BuddhiAI"
              />
            </Link>
            <LogoText className="text-xl" />
          </CardTitle>
          <CardDescription className="text-lg">Create your account</CardDescription>
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
