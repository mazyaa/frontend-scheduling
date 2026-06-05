import { endpoint } from "./endpoint.constant";

import instance from "@/lib/axios/instance";

export const eSertifikatServices = {
  getAllSertifikat: (params?: string) =>
    instance.get(`${endpoint.E_SERTIFIKAT}?${params || ""}`),

  getAllPesertaBySertifikat: (id: string, params?: string) =>
    instance.get(`${endpoint.E_SERTIFIKAT}/${id}/all-peserta?${params || ""}`),

  publishSertifikat: (penilaianId: string) =>
    instance.post(`${endpoint.E_SERTIFIKAT}/${penilaianId}/publish`),

  downloadSertifikat: (penilaianId: string) =>
    instance.get(`${endpoint.E_SERTIFIKAT}/${penilaianId}/download`, {
      responseType: "blob",
    }),
};
