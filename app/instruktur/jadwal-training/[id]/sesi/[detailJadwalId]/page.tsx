"use client";

import { Suspense } from "react";

import SesiJadwal from "@/components/features/MyJadwalTraining/SesiJadwal/SesiJadwal";

import GridBackground from "@/components/GridBackground";
import Navbar from "@/components/layouts/Navbar/Navbar";

export default function InstrukturSesiJadwalPage() {
  return (
    <Suspense fallback={null}>
      <Navbar />
      <section className="relative flex flex-col items-center justify-start gap-4 py-8 md:py-16 min-h-screen">
        <GridBackground />
        <div className="w-full max-w-6xl mx-auto px-4 z-10">
          <SesiJadwal role="instruktur" />
        </div>
      </section>
    </Suspense>
  );
}
