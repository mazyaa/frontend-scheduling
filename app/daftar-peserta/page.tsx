"use client";

import { Suspense } from "react";

import DaftarPesertaGrid from "@/components/features/DaftarPeserta/DaftarPesertaGrid";

export default function DaftarPesertaPage() {
  return (
    <Suspense fallback={null}>
      <DaftarPesertaGrid />
    </Suspense>
  );
}
