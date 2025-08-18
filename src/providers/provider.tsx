"use client";

import { TRPCReactProvider } from "@/trpc/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/next/app";

export function Provider({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <TRPCReactProvider>
      <NuqsAdapter>
        <NextThemesProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </NextThemesProvider>
      </NuqsAdapter>
    </TRPCReactProvider>
  );
}
