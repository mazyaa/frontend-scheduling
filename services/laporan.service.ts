import { endpoint } from "./endpoint.constant";

import instance from "@/lib/axios/instance";

export const laporanServices = {
  getLaporanSertifikat: (params?: string) =>
    instance.get(`${endpoint.LAPORAN}/sertifikat?${params || ""}`),

  getLaporanPeserta: (params?: string) =>
    instance.get(`${endpoint.LAPORAN}/peserta?${params || ""}`),
};
