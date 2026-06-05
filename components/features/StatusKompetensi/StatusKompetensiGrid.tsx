"use client";

import { Suspense } from "react";

import StatusKompetensi from "./StatusKompetensi";

import GridBackground from "@/components/GridBackground";
import Navbar from "@/components/layouts/Navbar/Navbar";
import FooterSection from "@/components/landing/FooterSection";

const StatusKompetensiGrid = () => {
  return (
    <>
      <Suspense fallback={null}>
        <Navbar />
        <div className="relative flex flex-col items-center justify-start gap-4 py-8 md:py-16 min-h-screen">
          <GridBackground />
          <StatusKompetensi isGridUI={true} />
        </div>
        <FooterSection />
      </Suspense>
    </>
  );
};

export default StatusKompetensiGrid;
