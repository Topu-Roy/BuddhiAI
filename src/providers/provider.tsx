"use client";

import { TRPCReactProvider } from "@/trpc/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import NextTopLoader from "nextjs-toploader";

export function Provider({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <TRPCReactProvider>
      <NextThemesProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <NextTopLoader
          color="#155dfc"
          initialPosition={0.1}
          crawlSpeed={100}
          height={3}
          crawl={true}
          showSpinner={false}
          speed={300}
          zIndex={1600}
          showAtBottom={false}
        />
        {children}
      </NextThemesProvider>
    </TRPCReactProvider>
  );
}
