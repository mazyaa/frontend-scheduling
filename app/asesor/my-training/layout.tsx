import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Training Saya - Asesor",
  description: "Daftar training yang Anda nilai",
};

export default function AsesorMyTrainingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
