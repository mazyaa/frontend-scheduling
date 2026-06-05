import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Training Saya - Instruktur",
  description: "Daftar training yang Anda ampu",
};

export default function InstrukturMyTrainingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
