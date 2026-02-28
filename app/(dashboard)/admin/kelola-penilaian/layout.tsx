import { Metadata } from "next";

import DashboardLayout from "@/features/dashboard/components/DashboardLayout/DashboardLayout";
import { IRouteLayout } from "@/types/layout";

export const metadata: Metadata = {
  title: "Kelola Penilaian Peserta",
  description:
    "Mengelola penilaian peserta untuk memastikan hasil evaluasi tercatat secara  terstruktur.",
  icons: { icon: "/images/general/veritrust-logo.png" },
};

const KelolaPenilaianRouteLayout = ({ children }: IRouteLayout) => {
  return (
    <DashboardLayout
      description={
        <>
          Mengelola <span className="text-brand">penilaian peserta</span> untuk
          memastikan hasil evaluasi tercatat secara terstruktur.
        </>
      }
      title="Kelola Penilaian Peserta"
      type="admin"
    >
      {children}
    </DashboardLayout>
  );
};

export default KelolaPenilaianRouteLayout;
