"use client";

import { useSession } from "next-auth/react";
import { Spinner } from "@heroui/spinner";

import StatisticCard from "./StatisticCard";
import MonthlyCertificateChart from "./MonthlyCertificateChart";
import useDashboard from "./useDashboard";

const Dashboard = () => {
  const { status } = useSession();
  const isLoadingSession = status === "loading";

  const { dataDashboard, isLoadingDashboard, isRefetchingDashboard } =
    useDashboard();

  const isLoading =
    isLoadingSession || isLoadingDashboard || isRefetchingDashboard;

  const stats = [
    {
      title: "Jumlah Sertifikat",
      value: dataDashboard?.totalSertifikat || 0,
      icon: "/images/general/trainingIcon.png",
      backgroundLine: "/images/general/lineImage1.png",
      borderColor: "#D8F000",
    },
    {
      title: "Jumlah Peserta",
      value: dataDashboard?.totalPeserta || 0,
      icon: "/images/general/participantIcon.png",
      backgroundLine: "/images/general/lineImage2.png",
      borderColor: "#1828FF",
    },
    {
      title: "Jumlah Instruktur",
      value: dataDashboard?.totalInstruktur || 0,
      icon: "/images/general/instructorIcon.png",
      backgroundLine: "/images/general/lineImage3.png",
      borderColor: "#FF1744",
    },
    {
      title: "Jumlah Asesor",
      value: dataDashboard?.totalAsesor || 0,
      icon: "/images/general/asesorIcon.png",
      backgroundLine: "/images/general/lineImage4.png",
      borderColor: "#FF1744",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner color="primary" size="lg" />
      </div>
    );
  }

  return (
    <section className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatisticCard key={index} {...stat} />
        ))}
      </div>

      <div className="mt-8">
        <MonthlyCertificateChart
          data={dataDashboard?.sertifikatPerBulan || []}
        />
      </div>
    </section>
  );
};

export default Dashboard;
