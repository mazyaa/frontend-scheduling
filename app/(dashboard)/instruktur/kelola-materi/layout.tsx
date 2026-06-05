import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kelola Materi",
  description: "Kelola materi training untuk instruktur.",
  icons: { icon: "/images/general/veritrust-logo.png" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
