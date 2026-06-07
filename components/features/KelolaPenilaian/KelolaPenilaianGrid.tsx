"use client";

import { Suspense } from "react";

import KelolaPenilaian from "./KelolaPenilaian";

import GridBackground from "@/components/GridBackground";
import Navbar from "@/components/layouts/Navbar/Navbar";
import FooterSection from "@/components/landing/FooterSection";

interface KelolaPenilaianGridProps {
  scheduleId?: string;
}

const KelolaPenilaianGrid = ({ scheduleId }: KelolaPenilaianGridProps) => {
  return (
    <>
      <Suspense fallback={null}>
        <Navbar />
        <div className="relative flex flex-col items-center justify-start gap-4 py-8 md:py-16 min-h-screen">
          <GridBackground />
          <section className="w-full max-w-6xl mx-auto px-4 z-10">
            <KelolaPenilaian isGridUI scheduleId={scheduleId} />
          </section>
        </div>
        <FooterSection />
      </Suspense>
    </>
  );
};

export default KelolaPenilaianGrid;
