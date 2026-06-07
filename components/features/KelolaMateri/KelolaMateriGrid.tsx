"use client";

import { Suspense } from "react";

import KelolaMateri from "./KelolaMateri";

import GridBackground from "@/components/GridBackground";
import Navbar from "@/components/layouts/Navbar/Navbar";
import FooterSection from "@/components/landing/FooterSection";

const KelolaMateriGrid = () => {
  return (
    <>
      <Suspense fallback={null}>
        <Navbar />
        <section className="relative flex flex-col gap-4 py-8 md:py-16 min-h-screen">
          <GridBackground />
          <KelolaMateri isGridUI={true} />
        </section>
        <FooterSection />
      </Suspense>
    </>
  );
};

export default KelolaMateriGrid;
