"use client";

import * as React from "react";
import { HeroUIProvider } from "@heroui/system";
import { useRouter } from "next/navigation";
import { ToastProvider } from "@heroui/toast";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";

import { ToasterProvider } from "@/context/ToasterContext";

export interface ProvidersProps {
  children: React.ReactNode;
}

declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useRouter>["push"]>[1]
    >;
  }
}

const queryClient = new QueryClient();

export function Providers({ children }: ProvidersProps) {
  const router = useRouter();

  return (
    <SessionProvider>
      <ToasterProvider>
        <QueryClientProvider client={queryClient}>
          <HeroUIProvider navigate={router.push}>
            <ToastProvider />
            {children}
          </HeroUIProvider>
        </QueryClientProvider>
      </ToasterProvider>
    </SessionProvider>
  );
}
