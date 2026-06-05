import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Training Saya - Peserta",
  description: "Daftar training yang Anda ikuti",
};

export default function PesertaMyTrainingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
