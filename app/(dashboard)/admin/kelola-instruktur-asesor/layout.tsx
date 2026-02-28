import { Metadata } from "next";

import DashboardLayout from "@/features/dashboard/components/DashboardLayout/DashboardLayout";
import { IRouteLayout } from "@/types/layout";

export const metadata: Metadata = {
  title: "Kelola Instruktur & Asesor",
  description:
    "Memuat seluruh data instruktur & Asesor yang tersedia untuk dikelola.",
  icons: { icon: "/images/general/veritrust-logo.png" },
};

const KelolaInstrukturAsesorRouteLayout = ({ children }: IRouteLayout) => {
  return (
    <DashboardLayout
      description={
        <>
          Memuat seluruh data{" "}
          <span className="text-brand">instruktur & asesor</span> yang tersedia
          untuk dikelola.
        </>
      }
      title="Kelola Instruktur & Asesor"
      type="admin"
    >
      {children}
    </DashboardLayout>
  );
};

export default KelolaInstrukturAsesorRouteLayout;
