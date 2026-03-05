"use client";

import { Suspense } from "react";

import GridBackground from "@/components/GridBackground";
import Navbar from "@/components/layouts/Navbar/Navbar";

export default function Home() {
  return (
    <>
      <Suspense fallback={null}>
        <Navbar />
        <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
          <GridBackground />
          <h1 className="text-3xl font-bold text-center text-brand z-999">
            Welcome to Veritrust Scheduling App
          </h1>
          <footer className="w-full flex items-center text-brand justify-center py-3 mt-auto">
            footer
          </footer>
        </section>
      </Suspense>
    </>
  );
}
