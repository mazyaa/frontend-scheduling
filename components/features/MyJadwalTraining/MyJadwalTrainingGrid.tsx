"use client";

import { Suspense } from "react";

import MyJadwalTraining from "./MyJadwalTraining";

import GridBackground from "@/components/GridBackground";
import Navbar from "@/components/layouts/Navbar/Navbar";
import FooterSection from "@/components/landing/FooterSection";

interface PropTypes {
  role: string;
}

const MyJadwalTrainingGrid = ({ role }: PropTypes) => {
  return (
    <>
      <Suspense fallback={null}>
        <Navbar />
        <section className="relative flex flex-col items-center justify-start gap-4 py-8 md:py-16 min-h-screen">
          <GridBackground />
          <MyJadwalTraining isGridUI={true} role={role} />
        </section>
        <FooterSection />
      </Suspense>
    </>
  );
};

export default MyJadwalTrainingGrid;
