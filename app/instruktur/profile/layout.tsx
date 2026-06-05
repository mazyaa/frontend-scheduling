import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profil - Instruktur",
  description: "Kelola profil Anda",
};

export default function InstrukturProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
