import { LOGO_URL } from "@/assets/AssetUrl";
import Image from "next/image";
import Link from "next/link";
import { GithubSignInButton } from "@/components/github-sign-in-button";
import { GoogleSignInButton } from "@/components/google-sign-in-button";
import { LogoText } from "@/components/logo-text";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function SignInScreen() {
  return (
    <div className="flex min-h-[92dvh] w-full items-center justify-center p-4">
      <Card className="mx-auto w-full max-w-md border-border/50 shadow-lg">
        <CardHeader className="space-y-1 pb-2 text-center">
          <div className="flex flex-col items-center gap-3 pb-2">
            <Link href="/" className="transition hover:opacity-80">
              <Image className="aspect-square size-12" src={LOGO_URL} height={100} width={100} alt="BuddhiAI" />
            </Link>
            <LogoText className="text-2xl font-bold" />
          </div>
          <CardTitle className="text-xl font-semibold">Welcome back</CardTitle>
          <CardDescription>Sign in to continue your learning journey</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-3">
            <GoogleSignInButton className="flex h-11 w-full items-center justify-center gap-4" />
            <GithubSignInButton className="flex h-11 w-full items-center justify-center gap-4" />
          </div>

          <p className="text-center text-sm text-muted-foreground">
            New to BuddhiAI?{" "}
            <a href="/auth/sign-in" className="font-medium text-primary underline-offset-4 hover:underline">
              Create an account
            </a>
          </p>

          <Separator />

          <p className="text-center text-xs text-muted-foreground">
            By signing in, you agree to our <a className="underline-offset-4 hover:underline">Terms of Service</a>{" "}
            and <a className="underline-offset-4 hover:underline">Privacy Policy</a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
