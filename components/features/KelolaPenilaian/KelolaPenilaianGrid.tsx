"use client";

import Link from "next/link";
import { FaArrowLeftLong } from "react-icons/fa6";

import KelolaPenilaian from "./KelolaPenilaian";

interface KelolaPenilaianGridProps {
  scheduleId?: string;
}

const KelolaPenilaianGrid = ({ scheduleId }: KelolaPenilaianGridProps) => {
  return (
    <section className="w-full max-w-6xl mx-auto px-4 z-10">
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <div className="mb-6">
          <Link
            className="flex flex-row items-center gap-2 py-2 px-4 group"
            href="/"
          >
            <FaArrowLeftLong className="text-brand transition-transform duration-300 group-hover:-translate-x-1" />
            <p className="text-brand font-medium transition-transform duration-300 group-hover:scale-105">
              Kembali Ke -{" "}
              <span className="text-white bg-brand rounded-xl p-1.5 inline-block transition-transform duration-300 group-hover:scale-105">
                Beranda
              </span>
            </p>
          </Link>
          <h1 className="text-3xl font-bold text-brand mb-2">
            Kelola Penilaian
          </h1>
          <p className="text-gray-600">
            Kelola penilaian peserta untuk setiap sesi training.
          </p>
        </div>

        <KelolaPenilaian scheduleId={scheduleId} />
      </div>
    </section>
  );
};

export default KelolaPenilaianGrid;
