import { Suspense } from "react";

import Navbar from "@/components/layouts/Navbar/Navbar";
import GridBackground from "@/components/GridBackground";
import ProfileContainer from "@/components/profile/ProfileContainer";
import FooterSection from "@/components/landing/FooterSection";

export default function InstrukturProfilePage() {
  return (
    <>
      <Suspense fallback={null}>
        <Navbar />
        <section className="relative flex flex-col items-center justify-start gap-4 py-8 md:py-16 min-h-screen">
          <GridBackground />
          <main className="relative z-[999] w-full max-w-4xl mx-auto px-4">
            <ProfileContainer />
          </main>
        </section>
        <FooterSection />
      </Suspense>
    </>
  );
}
