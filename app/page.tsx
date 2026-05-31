"use client";

import { Suspense } from "react";

import GridBackground from "@/components/GridBackground";
import Navbar from "@/components/layouts/Navbar/Navbar";
import { HeroSection } from "@/components/Home/HeroSection";
import { FeatureSection } from "@/components/Home/FeatureSection";
import { FooterSection } from "@/components/Home/FooterSection";

export default function Home() {
  return (
    <>
      <Suspense fallback={null}>
        <Navbar />
        <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
          <GridBackground />
          <HeroSection />
          <FeatureSection />
          <FooterSection />
          <footer className="w-full flex items-center text-brand justify-center py-3 mt-auto">
            footer
          </footer>
        </section>
      </Suspense>
    </>
  );
}
