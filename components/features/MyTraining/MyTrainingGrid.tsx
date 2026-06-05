"use client";

import { Suspense } from "react";

import MyTraining from "./MyTraining";

import GridBackground from "@/components/GridBackground";
import Navbar from "@/components/layouts/Navbar/Navbar";

const MyTrainingGrid = () => {
  return (
    <>
      <Suspense fallback={null}>
        <Navbar />
        <section className="relative flex flex-col items-center justify-start gap-4 py-8 md:py-16 min-h-screen">
          <GridBackground />
          <MyTraining isGridUI={true} />
        </section>
      </Suspense>
    </>
  );
};

export default MyTrainingGrid;
