import { Metadata } from "next";
import React from "react";

import DashboardLayout from "@/features/dashboard/components/DashboardLayout/DashboardLayout";

export const metadata: Metadata = {
  title: "Login",
  description: "Masuk ke akun",
  icons: { icon: "/images/general/veritrust-logo.png" },
};

const DashboardLayoutPage = ({ children }: { children: React.ReactNode }) => (
  <DashboardLayout
    description={
      <>
        Ringkasan informasi utama untuk{" "}
        <span className="text-brand">memantau</span> aktivitas sistem.
      </>
    }
    title="Dashboard"
    type="admin"
  >
    {children}
  </DashboardLayout>
);

export default DashboardLayoutPage;
