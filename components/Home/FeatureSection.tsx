"use client";

import React from "react";
import { FeatureCard } from "./FeatureCard";

// Local lightweight SVG icon components to avoid dependency on 'lucide-react'
const CalendarDays = ({ size = 24 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="3"
      y="5"
      width="18"
      height="16"
      rx="2"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M16 3v4M8 3v4M3 11h18"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const Award = ({ size = 24 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M8 13l-2 6 6-3 6 3-2-6"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Users = ({ size = 24 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M16 11c1.657 0 3-1.567 3-3.5S17.657 4 16 4s-3 1.567-3 3.5S14.343 11 16 11zM8 11c1.657 0 3-1.567 3-3.5S9.657 4 8 4 5 5.567 5 7.5 6.343 11 8 11z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2 20c0-2.5 3.582-4.5 8-4.5s8 2 8 4.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const BadgeCheck = ({ size = 24 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2l2.09 4.26L18 8l-3 2.18L16.18 14 12 11.77 7.82 14 9 10.18 6 8l3.91-1.74L12 2z"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9 13l2 2 4-4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const features = [
  {
    icon: <CalendarDays size={60} />,
    title: "Penjadwalan Pelatihan Terstruktur",
    description:
      "Sistem menyediakan pengelolaan jadwal yang lebih rapi dan tertata sehingga setiap sesi pelatihan dapat diatur dan dipantau dengan mudah.",
  },
  {
    icon: <Award size={60} />,
    title: "Penerbitan Sertifikat Digital Otomatis",
    description:
      "Sertifikat digital dapat diterbitkan secara cepat dan efisien melalui sistem berdasarkan hasil penilaian asesor.",
  },
  {
    icon: <Users size={60} />,
    title: "Manajemen Peserta yang Efisien",
    description:
      "Informasi peserta disimpan secara terorganisir sehingga memudahkan administrasi dan pemantauan pelatihan.",
  },
  {
    icon: <BadgeCheck size={60} />,
    title: "Pemeriksaan Keabsahan Sertifikat",
    description:
      "Verifikasi sertifikat melalui nomor identifikasi unik untuk mendukung transparansi dan validasi informasi.",
  },
];

export const FeatureSection = () => {
  return (
    <section className="container mx-auto px-6 py-24">
      <h2 className="mb-16 text-center text-5xl font-bold">
        <span className="text-sky-400">Fitur Utama</span>{" "}
        <span className="text-teal-600">Sistem</span>
      </h2>

      <div className="grid gap-10 md:grid-cols-2">
        {features.map((feature) => (
          <FeatureCard
            key={feature.title}
            description={feature.description}
            icon={feature.icon}
            title={feature.title}
          />
        ))}
      </div>
    </section>
  );
};
