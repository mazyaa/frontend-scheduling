import "@/styles/globals.css";
import { Metadata } from "next";
import clsx from "clsx";

import { Providers } from "./providers";

import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { Navbar } from "@/components/navbar";
import AppShell from "@/components/ui/AppShell/AppShell";
import { ToasterProvider } from "@/context/ToasterContext";

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
          "min-h-screen text-foreground bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <ToasterProvider>
            <div className="relative flex flex-col h-screen">
              <Navbar />
              <AppShell>
                {children}
              </AppShell>
              <footer className="w-full flex items-center justify-center py-3">
                footer
              </footer>
            </div>
          </ToasterProvider>
        </Providers>
      </body>
    </html>
  );
}