import { Metadata } from "next";
import { ReactNode } from "react";

import DashboardLayout from "@/features/dashboard/components/DashboardLayout/DashboardLayout";

export const metadata: Metadata = {
  title: "Dashboard Direktur",
  description: "Ringkasan informasi utama untuk memantau aktivitas sistem.",
  icons: { icon: "/images/general/veritrust-logo.png" },
};

interface DashboardRouteLayoutProps {
  children: ReactNode;
}

const DashboardRouteLayout = ({ children }: DashboardRouteLayoutProps) => {
  return (
    <DashboardLayout
      description={
        <>
          Ringkasan informasi utama untuk{" "}
          <span className="text-brand">memantau</span> aktivitas sistem.
        </>
      }
      title="Dashboard"
      type="direktur"
    >
      {children}
    </DashboardLayout>
  );
};

export default DashboardRouteLayout;
