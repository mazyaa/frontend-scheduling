import { Metadata } from "next";

import DashboardLayout from "@/components/layouts/DashboardLayout";
import { IRouteLayout } from "@/types/layout";

export const metadata: Metadata = {
  title: "Dashboard Instruktur",
  description: "Ringkasan informasi utama untuk memantau aktivitas instruktur.",
  icons: { icon: "/images/general/veritrust-logo.png" },
};

const InstrukturDashboardRouteLayout = ({ children }: IRouteLayout) => {
  return (
    <DashboardLayout
      description={
        <>
          Ringkasan informasi utama untuk{" "}
          <span className="text-brand">memantau</span> aktivitas instruktur.
        </>
      }
      title="Dashboard"
      type="instruktur"
    >
      {children}
    </DashboardLayout>
  );
};

export default InstrukturDashboardRouteLayout;
