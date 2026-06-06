"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import FeatureCard from "./FeatureCard";

const features = [
  {
    icon: (
      <Image
        alt="Calendar"
        height={56}
        src="/flying-icon/calendarIcon.png"
        width={56}
      />
    ),
    title: "Penjadwalan Pelatihan Terstruktur",
    description:
      "Sistem menyediakan pengelolaan jadwal yang lebih rapi dan tertata, sehingga setiap sesi pelatihan dapat diatur dan dipantau dengan lebih mudah.",
  },
  {
    icon: (
      <Image
        alt="Certificate"
        height={56}
        src="/flying-icon/certificateIcon.png"
        width={56}
      />
    ),
    title: "Penerbitan Sertifikat Digital Otomatis",
    description:
      "Sertifikat digital atau E-Sertifikat dapat diterbitkan secara cepat dan efisien melalui sistem berdasarkan penilaian asesor, dan tanpa proses manual yang memakan waktu.",
  },
  {
    icon: (
      <Image
        alt="Presentation"
        height={56}
        src="/flying-icon/presentationIcon.png"
        width={56}
      />
    ),
    title: "Manajemen Peserta yang Efisien",
    description:
      "Informasi peserta disimpan secara terorganisir, memudahkan administrasi dan pemantauan, serta fitur import batch memastikan efisiensi dan keterhubungan data.",
  },
  {
    icon: (
      <Image
        alt="Verified"
        height={56}
        src="/flying-icon/trueIcon.png"
        width={56}
      />
    ),
    title: "Pemeriksaan Keabsahan Sertifikat",
    description:
      "Fitur verifikasi menyediakan pemeriksaan keaslian e-sertifikat melalui nomor identifikasi unik, mendukung transparansi dan validasi informasi.",
  },
];

const FeatureSection = () => {
  return (
    <section className="relative z-[999] w-full py-20 sm:py-24 md:py-32 px-4 sm:px-6 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        <div
          className="absolute -top-20 -left-20 w-80 h-80 rounded-full"
          style={{
            background: "radial-gradient(circle, #1e8279 0%, transparent 70%)",
            filter: "blur(60px)",
            opacity: 0.06,
          }}
        />
        <div
          className="absolute -bottom-32 -right-20 w-96 h-96 rounded-full"
          style={{
            background: "radial-gradient(circle, #38bdf8 0%, transparent 70%)",
            filter: "blur(80px)",
            opacity: 0.06,
          }}
        />
        <div
          className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full"
          style={{
            background: "radial-gradient(circle, #0d9488 0%, transparent 70%)",
            filter: "blur(50px)",
            opacity: 0.04,
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          className="mb-12 sm:mb-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <h2 className="font-bold">
            <span className="block text-4xl sm:text-5xl md:text-6xl bg-gradient-to-r from-cyan-400 to-teal-500 bg-clip-text text-transparent">
              Fitur Utama Sistem
            </span>
          </h2>
          <p className="mt-4 text-gray-500 text-sm sm:text-base max-w-2xl mx-auto">
            Semua fitur dirancang untuk memudahkan penjadwalan, penerbitan
            sertifikat, dan manajemen peserta secara end-to-end.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8"
          initial="hidden"
          variants={{
            visible: { transition: { staggerChildren: 0.12 } },
          }}
          viewport={{ once: true, margin: "-80px" }}
          whileInView="visible"
        >
          {features.map((feature, _index) => (
            <motion.div
              key={feature.title}
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5, ease: "easeOut" },
                },
              }}
            >
              <FeatureCard
                horizontal
                description={feature.description}
                icon={feature.icon}
                title={feature.title}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeatureSection;
