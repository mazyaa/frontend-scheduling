import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profil - Asesor",
  description: "Kelola profil Anda",
};

export default function AsesorProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
