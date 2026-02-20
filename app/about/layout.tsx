import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "about",
  description: "about page",
  icons: { icon: "/images/general/veritrust-logo.png" },
};

export default function AboutLayout({ children }: { children: ReactNode }) {
  return children;
}
