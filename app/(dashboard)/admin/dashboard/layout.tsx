import { Metadata } from "next";

import DashboardLayout from "@/components/layouts/DashboardLayout";
import { IRouteLayout } from "@/types/layout";

export const metadata: Metadata = {
  title: "Dashboard Admin",
  description: "Ringkasan informasi utama untuk memantau aktivitas sistem.",
  icons: { icon: "/images/general/veritrust-logo.png" },
};

const DashboardRouteLayout = ({ children }: IRouteLayout) => {
  return (
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
};

export default DashboardRouteLayout;
