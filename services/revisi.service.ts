import { endpoint } from "./endpoint.constant";

import instance from "@/lib/axios/instance";

const formDataHeader = {
  headers: {
    "Content-type": "multipart/form-data",
  },
};

export const revisiServices = {
  uploadRevisiAdmin: (penilaianId: string, payload: FormData) =>
    instance.put(
      `${endpoint.E_SERTIFIKAT}/${penilaianId}/revisi`,
      payload,
      formDataHeader,
    ),

  downloadRevisiAdmin: (penilaianId: string) =>
    instance.get(`${endpoint.E_SERTIFIKAT}/${penilaianId}/revisi/download`, {
      responseType: "blob",
    }),

  uploadRevisiPeserta: (penilaianId: string, payload: FormData) =>
    instance.put(
      `${endpoint.E_SERTIFIKAT}/${penilaianId}/revisi-peserta`,
      payload,
      formDataHeader,
    ),

  downloadRevisiPeserta: (penilaianId: string) =>
    instance.get(
      `${endpoint.E_SERTIFIKAT}/${penilaianId}/revisi-peserta/download`,
      {
        responseType: "blob",
      },
    ),

  setujuiRevisi: (penilaianId: string) =>
    instance.put(`${endpoint.E_SERTIFIKAT}/${penilaianId}/setujui`),

  tolakRevisi: (penilaianId: string) =>
    instance.put(`${endpoint.E_SERTIFIKAT}/${penilaianId}/tolak`),
};
