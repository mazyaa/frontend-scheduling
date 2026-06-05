import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profil - Peserta",
  description: "Kelola profil Anda",
};

export default function PesertaProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
