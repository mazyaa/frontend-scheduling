import { Metadata } from "next";

import DashboardLayout from "@/features/dashboard/components/DashboardLayout/DashboardLayout";
import { IRouteLayout } from "@/types/layout";

export const metadata: Metadata = {
  title: "Kelola Laporan",
  description: "Menampilkan keseluruhan data laporan training..",
  icons: { icon: "/images/general/veritrust-logo.png" },
};

const KelolaLaporanRouteLayout = ({ children }: IRouteLayout) => {
  return (
    <DashboardLayout
      description={
        <>
          Menampilkan keseluruhan data{" "}
          <span className="text-brand">laporan training</span>.
        </>
      }
      title="Kelola Laporan"
      type="admin"
    >
      {children}
    </DashboardLayout>
  );
};

export default KelolaLaporanRouteLayout;
