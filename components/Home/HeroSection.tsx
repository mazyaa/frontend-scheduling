"use client";

import { Button } from "@heroui/button";

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden">
      {/* Background Grid */}
      <div
        className="
          absolute inset-0
          bg-[linear-gradient(to_right,#d8eeee_1px,transparent_1px),linear-gradient(to_bottom,#d8eeee_1px,transparent_1px)]
          bg-[size:95px_95px]
        "
      />

      {/* Accent Boxes */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-cyan-100/50" />
      <div className="absolute top-36 left-24 w-32 h-32 bg-cyan-100/50" />
      <div className="absolute top-20 right-20 w-32 h-32 bg-cyan-100/50" />
      <div className="absolute bottom-32 left-0 w-32 h-32 bg-cyan-100/50" />
      <div className="absolute bottom-20 right-0 w-32 h-32 bg-cyan-100/50" />

      <div className="relative container mx-auto px-6 py-24">
        <div className="mx-auto max-w-5xl rounded-3xl bg-white p-10 shadow-xl">
          <h1 className="text-center font-bold leading-tight">
            <span className="block text-6xl text-sky-400">
              Pelatihan Terjadwal
            </span>

            <span className="block text-6xl text-teal-600">
              Sertifikat Terbit Digital
            </span>
          </h1>

          <p className="mx-auto mt-8 max-w-3xl text-center text-2xl text-teal-700">
            Platform ini dirancang untuk memastikan penjadwalan pelatihan
            berlangsung secara tertata, sekaligus menyediakan fasilitas
            penerbitan sertifikat digital yang mudah dan cepat.
          </p>

          <div className="mt-8 flex justify-center">
            <Button
              className="border-teal-500 text-teal-600"
              radius="full"
              variant="bordered"
            >
              E-Sertifikat Palsu? Coba aja → Cek Keabsahan E-Sertifikat
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
