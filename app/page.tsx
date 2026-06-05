"use client";

import { Suspense } from "react";

import Navbar from "@/components/layouts/Navbar/Navbar";
import HomeSection from "@/components/landing/HomeSection";
import FeatureSection from "@/components/landing/FeatureSection";
import FooterSection from "@/components/landing/FooterSection";

export default function Home() {
  return (
    <>
      <Suspense fallback={null}>
        <Navbar />
        <HomeSection />
        <FeatureSection />
        <FooterSection />
      </Suspense>
    </>
  );
}
