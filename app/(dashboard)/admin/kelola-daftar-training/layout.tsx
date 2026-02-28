import { Metadata } from "next";

import DashboardLayout from "@/features/dashboard/components/DashboardLayout/DashboardLayout";
import { IRouteLayout } from "@/types/layout";

export const metadata: Metadata = {
  title: "Kelola Daftar Training",
  description: "Memuat seluruh daftar training yang tersedia untuk dikelola.",
  icons: { icon: "/images/general/veritrust-logo.png" },
};

const DaftarTrainingRouteLayout = ({ children }: IRouteLayout) => {
  return (
    <DashboardLayout
      description={
        <>
          Memuat seluruh <span className="text-brand">daftar training</span>{" "}
          yang tersedia untuk dikelola.
        </>
      }
      title="Kelola Daftar Training"
      type="admin"
    >
      {children}
    </DashboardLayout>
  );
};

export default DaftarTrainingRouteLayout;
