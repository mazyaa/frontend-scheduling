import { Metadata } from "next";

import { IRouteLayout } from "@/types/layout";
import DashboardLayout from "@/features/dashboard/components/DashboardLayout/DashboardLayout";

export const metadata: Metadata = {
  title: "Kelola Data Peserta",
  description:
    "Mengelola data peserta yang terdaftar untuk memastikan informasi tersusun rapi dan mudah dikelola.",
  icons: { icon: "/images/general/veritrust-logo.png" },
};

const KelolaPesertaRouteLayout = ({ children }: IRouteLayout) => {
  return (
    <DashboardLayout
      description={
        <>
          Mengelola <span className="text-brand">data peserta</span> yang
          terdaftar untuk memastikan informasi tersusun rapi dan mudah dikelola.
        </>
      }
      title="Kelola Data Peserta"
      type="admin"
    >
      {children}
    </DashboardLayout>
  );
};

export default KelolaPesertaRouteLayout;
