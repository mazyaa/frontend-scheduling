import { Metadata } from "next";

import DashboardLayout from "@/features/dashboard/components/DashboardLayout/DashboardLayout";
import { IRouteLayout } from "@/types/layout";

export const metadata: Metadata = {
  title: "Kelola Materi Training",
  description:
    "Mengelola informasi dan dokumen materi pelatihan guna mendukung proses pembelajaran yang terorganisir.",
  icons: { icon: "/images/general/veritrust-logo.png" },
};

const KelolaMateriTrainingRouteLayout = ({ children }: IRouteLayout) => {
  return (
    <DashboardLayout
      description={
        <>
          Mengelola informasi dan dokumen{" "}
          <span className="text-brand">materi pelatihan</span> guna mendukung
          proses pembelajaran yang terorganisir.
        </>
      }
      title="Kelola Materi Training"
      type="admin"
    >
      {children}
    </DashboardLayout>
  );
};

export default KelolaMateriTrainingRouteLayout;
