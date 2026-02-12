import "@/styles/globals.css";
import { Metadata } from "next";
import clsx from "clsx"; // for merging class names

import { Providers } from "./providers";

import { siteConfig } from "@/config/site";
import AppShell from "@/components/AppShell";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/images/general/veritrust-logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={clsx(
          "min-h-screen text-foreground bg-white font-sans antialiased",
          poppins.className,
        )}
      >
        <Providers>
          <div className="relative flex flex-col h-screen">
            <AppShell className="flex-1">{children}</AppShell>
          </div>
        </Providers>
      </body>
    </html>
  );
}
