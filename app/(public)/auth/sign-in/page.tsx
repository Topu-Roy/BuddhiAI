import { LOGO_URL } from "@/assets/AssetUrl";
import Image from "next/image";
import Link from "next/link";
import { GithubSignInButton } from "@/components/github-sign-in-button";
import { GoogleSignInButton } from "@/components/google-sign-in-button";
import { LogoText } from "@/components/logo-text";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SignInScreen() {
  return (
    <div className="flex w-full items-center justify-center p-4">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader className="lg:text-center">
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
          <CardDescription className="text-lg">Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <GithubSignInButton />
          <GoogleSignInButton />
        </CardContent>
      </Card>
    </div>
  );
}
