"use client";

import { Button } from "@heroui/button";
import Link from "next/link";

import GridBackground from "@/components/GridBackground";

const HomeSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <GridBackground />

      <div className="relative z-[999] w-full max-w-[900px] mx-auto px-4 sm:px-6 py-20">
        <div className="rounded-[32px] bg-white p-8 sm:p-12 md:p-16 shadow-xl">
          <h1 className="text-center font-bold leading-tight">
            <span className="block text-4xl sm:text-6xl md:text-7xl bg-gradient-to-r from-cyan-400 to-teal-500 bg-clip-text text-transparent">
              Pelatihan Terjadwal
            </span>
            <span className="block text-4xl sm:text-6xl md:text-7xl text-teal-600 mt-2">
              Sertifikat Terbit Digital
            </span>
          </h1>

          <p className="mx-auto mt-8 max-w-3xl text-center text-lg sm:text-xl md:text-2xl text-teal-700 leading-relaxed">
            Platform ini dirancang untuk memastikan penjadwalan pelatihan
            berlangsung secara tertata, sekaligus menyediakan fasilitas
            penerbitan sertifikat digital yang mudah dan cepat.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              as={Link}
              className="bg-teal-500 text-white font-semibold px-8"
              href="/cek-sertifikat"
              radius="full"
            >
              E-Sertifikat Palsu?
            </Button>
            <Button
              as={Link}
              className="border-teal-500 text-teal-600 font-semibold px-8"
              href="/cek-sertifikat"
              radius="full"
              variant="bordered"
            >
              Coba aja &rarr; Cek Keabsahan E-Sertifikat
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeSection;
