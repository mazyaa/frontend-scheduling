import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Status Penilaian - Peserta",
  description: "Lihat hasil penilaian training Anda",
};

export default function PesertaPenilaianLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
