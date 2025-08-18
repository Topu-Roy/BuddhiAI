import "server-only";
import { cache } from "react";
import { env } from "@/env";
import { db } from "@/server/db";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { headers } from "next/headers";

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  socialProviders: {
    google: {
      clientId: env.AUTH_GOOGLE_CLIENT_ID,
      clientSecret: env.AUTH_GOOGLE_SECRET,
    },
  },
});

export const getServerAuthSession = cache(async () => {
  const session = await auth.api.getSession({ headers: await headers() });

  return session;
});
