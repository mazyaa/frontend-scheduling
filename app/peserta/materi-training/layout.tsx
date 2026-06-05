import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Materi Training",
  description: "Lihat dan unduh materi training yang sudah diikuti.",
  icons: { icon: "/images/general/veritrust-logo.png" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
