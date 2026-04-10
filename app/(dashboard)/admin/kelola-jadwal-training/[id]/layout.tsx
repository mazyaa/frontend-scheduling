import { Metadata } from "next";

import DashboardLayout from "@/components/layouts/DashboardLayout";
import { IRouteLayout } from "@/types/layout";

export const metadata: Metadata = {
  title: "Detail Jadwal Training",
  description:
    "Mengatur detail jadwal pelatihan agar seluruh sesi tersusun dan mudah dipantau.",
  icons: { icon: "/images/general/veritrust-logo.png" },
};

const DetailJadwalTrainingRouteLayout = ({ children }: IRouteLayout) => {
  return (
    <DashboardLayout
      description={
        <>
          Mengatur <span className="text-brand">detail jadwal pelatihan</span>{" "}
          agar seluruh sesi tersusun dan mudah dipantau.
        </>
      }
      title="Detail Jadwal Training"
      type="admin"
    >
      {children}
    </DashboardLayout>
  );
};

export default DetailJadwalTrainingRouteLayout;
