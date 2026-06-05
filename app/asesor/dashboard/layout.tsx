import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - Asesor",
  description: "Dashboard Asesor",
};

export default function AsesorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
