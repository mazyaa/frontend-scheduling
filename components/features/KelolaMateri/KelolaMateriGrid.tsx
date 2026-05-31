"use client";

import { Suspense } from "react";
import KelolaMateri from "./KelolaMateri";
import GridBackground from "@/components/GridBackground";
import Navbar from "@/components/layouts/Navbar/Navbar";
import { FooterSection } from "@/components/Home/FooterSection";

const KelolaMateriGrid = () => {
  return (
    <>
      <Suspense fallback={null}>
        <Navbar />
        <section className="relative flex flex-col items-center justify-start gap-4 py-8 md:py-16 min-h-screen">
          <GridBackground />
          <KelolaMateri isGridUI={true} />
        </section>
      </Suspense>
    </>
  );
};

export default KelolaMateriGrid;
