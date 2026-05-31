import { endpoint } from "./endpoint.constant";
import instance from "@/lib/axios/instance";

const formDataHeader = {
  headers: {
    "Content-type": "multipart/form-data",
  },
};

export const materiServices = {
  getAllMateri: (params?: string) =>
    instance.get(`${endpoint.MATERI}/all-materi?${params || ""}`),
  
  getMyMateri: (params?: string) =>
    instance.get(`${endpoint.MATERI}/my-materi?${params || ""}`),

  createMateri: (payload: FormData) =>
    instance.post(`${endpoint.MATERI}/upload`, payload, formDataHeader),

  updateMateri: (id: string, payload: FormData) =>
    instance.put(`${endpoint.MATERI}/${id}`, payload, formDataHeader),

  deleteMateri: (id: string) =>
    instance.delete(`${endpoint.MATERI}/${id}`),

  downloadMateri: (id: string) =>
    instance.get(`${endpoint.MATERI}/${id}/download`, {
      responseType: "blob",
    }),
};
