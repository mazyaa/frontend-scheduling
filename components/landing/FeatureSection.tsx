"use client";

import FeatureCard from "./FeatureCard";

const CalendarIcon = ({ size = 56 }: { size?: number }) => (
  <svg
    fill="none"
    height={size}
    viewBox="0 0 24 24"
    width={size}
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      height="16"
      rx="2"
      stroke="currentColor"
      strokeWidth="1.5"
      width="18"
      x="3"
      y="5"
    />
    <path
      d="M16 3v4M8 3v4M3 11h18"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="1.5"
    />
    <circle cx="12" cy="16" r="1" fill="currentColor" />
  </svg>
);

const CertificateIcon = ({ size = 56 }: { size?: number }) => (
  <svg
    fill="none"
    height={size}
    viewBox="0 0 24 24"
    width={size}
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      height="14"
      rx="2"
      stroke="currentColor"
      strokeWidth="1.5"
      width="18"
      x="3"
      y="5"
    />
    <path
      d="M8 5V3h8v2"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="1.5"
    />
    <path
      d="M12 10v4m0 0l-2-2m2 2l2-2"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
    />
  </svg>
);

const UsersIcon = ({ size = 56 }: { size?: number }) => (
  <svg
    fill="none"
    height={size}
    viewBox="0 0 24 24"
    width={size}
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="9" cy="7" r="3" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="17" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M3 21c0-3.5 2.5-5.5 6-5.5s6 2 6 5.5"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="1.5"
    />
    <path
      d="M15 15.5c2.5 0 5 1.5 5 4"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="1.5"
    />
  </svg>
);

const ShieldCheckIcon = ({ size = 56 }: { size?: number }) => (
  <svg
    fill="none"
    height={size}
    viewBox="0 0 24 24"
    width={size}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2l8 4v5c0 5.25-3.5 9.74-8 11-4.5-1.26-8-5.75-8-11V6l8-4z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="M9 12l2 2 4-4"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
    />
  </svg>
);

const features = [
  {
    icon: <CalendarIcon />,
    title: "Penjadwalan Pelatihan Terstruktur",
    description:
      "Sistem menyediakan pengelolaan jadwal yang lebih rapi dan tertata, sehingga setiap sesi pelatihan dapat diatur dan dipantau dengan lebih mudah.",
  },
  {
    icon: <CertificateIcon />,
    title: "Penerbitan Sertifikat Digital Otomatis",
    description:
      "Sertifikat digital atau E-Sertifikat dapat diterbitkan secara cepat dan efisien melalui sistem berdasarkan penilaian asesor, dan tanpa proses manual yang memakan waktu.",
  },
  {
    icon: <UsersIcon />,
    title: "Manajemen Peserta yang Efisien",
    description:
      "Informasi peserta disimpan secara terorganisir, memudahkan administrasi dan pemantauan, serta fitur import batch memastikan efisiensi dan keterhubungan data.",
  },
  {
    icon: <ShieldCheckIcon />,
    title: "Pemeriksaan Keabsahan Sertifikat",
    description:
      "Fitur verifikasi menyediakan pemeriksaan keaslian e-sertifikat melalui nomor identifikasi unik, mendukung transparansi dan validasi informasi.",
  },
];

const FeatureSection = () => {
  return (
    <section className="relative z-[999] w-full py-20 sm:py-24 md:py-32 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="mb-12 sm:mb-16 text-center font-bold">
          <span className="block text-4xl sm:text-5xl md:text-6xl bg-gradient-to-r from-cyan-400 to-teal-500 bg-clip-text text-transparent">
            Fitur Utama Sistem
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {features.map((feature) => (
            <FeatureCard
              key={feature.title}
              description={feature.description}
              icon={feature.icon}
              title={feature.title}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
