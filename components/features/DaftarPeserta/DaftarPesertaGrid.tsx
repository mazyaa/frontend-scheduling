"use client";

import { Suspense, useState, useCallback } from "react";

import DaftarPesertaJadwalView from "./DaftarPesertaJadwalView";
import DaftarPesertaView from "./DaftarPesertaView";

import GridBackground from "@/components/GridBackground";
import Navbar from "@/components/layouts/Navbar/Navbar";
import FooterSection from "@/components/landing/FooterSection";

const DaftarPesertaGrid = () => {
  const [selectedJadwalId, setSelectedJadwalId] = useState<string | null>(null);

  const handleSelectJadwal = useCallback((id: string) => {
    setSelectedJadwalId(id);
  }, []);

  const handleBack = useCallback(() => {
    setSelectedJadwalId(null);
  }, []);

  return (
    <>
      <Suspense fallback={null}>
        <Navbar />
        <div className="relative flex flex-col items-center justify-start gap-4 py-8 md:py-16 min-h-screen">
          <GridBackground />
          {selectedJadwalId ? (
            <div className="w-full max-w-6xl mx-auto px-4 z-10">
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <DaftarPesertaView
                  jadwalTrainingId={selectedJadwalId}
                  onBack={handleBack}
                />
              </div>
            </div>
          ) : (
            <DaftarPesertaJadwalView onSelectJadwal={handleSelectJadwal} />
          )}
        </div>
        <FooterSection />
      </Suspense>
    </>
  );
};

export default DaftarPesertaGrid;
