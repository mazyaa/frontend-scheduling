import { Metadata } from "next";

import DashboardLayout from "@/features/dashboard/components/DashboardLayout/DashboardLayout";
import { IRouteLayout } from "@/types/layout";

export const metadata: Metadata = {
  title: "Kelola Jadwal Training",
  description:
    "Mengatur jadwal pelatihan agar seluruh sesi tersusun dan mudah dipantau.",
  icons: { icon: "/images/general/veritrust-logo.png" },
};

const KelolaJadwalTrainingRouteLayout = ({ children }: IRouteLayout) => {
  return (
    <DashboardLayout
      description={
        <>
          Mengatur <span className="text-brand">jadwal pelatihan</span> agar
          seluruh sesi tersusun dan mudah dipantau.
        </>
      }
      title="Kelola Jadwal Training"
      type="admin"
    >
      {children}
    </DashboardLayout>
  );
};

export default KelolaJadwalTrainingRouteLayout;
