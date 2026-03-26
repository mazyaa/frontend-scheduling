import { Metadata } from "next";

import DashboardLayout from "@/components/layouts/DashboardLayout";
import { IRouteLayout } from "@/types/layout";

export const metadata: Metadata = {
  title: "Kelola E-Sertifikat",
  description: "Mengelola e-sertifikat agar mudah diakses dan juga dikelola.",
  icons: { icon: "/images/general/veritrust-logo.png" },
};

const KelolaESertifikatRouteLayout = ({ children }: IRouteLayout) => {
  return (
    <DashboardLayout
      description={
        <>
          Mengelola <span className="text-brand">e-sertifikat</span> agar mudah
          diakses dan juga dikelola.
        </>
      }
      title="Kelola E-Sertifikat"
      type="admin"
    >
      {children}
    </DashboardLayout>
  );
};

export default KelolaESertifikatRouteLayout;
