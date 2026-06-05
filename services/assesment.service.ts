import { endpoint } from "./endpoint.constant";

import { ICreateAssesment } from "@/types/Asessment";
import instance from "@/lib/axios/instance";

export const assesmentServices = {
  createAssesment: (payload: Omit<ICreateAssesment, "id">) =>
    instance.post(`${endpoint.ASSESMENT}`, payload),

  getAllAssesmentBySchedule: (id: string, params?: string) =>
    instance.get(`${endpoint.ASSESMENT}/${id}/all-assesment?${params || ""}`),

  getAllPenilaian: (params?: string) =>
    instance.get(`${endpoint.PENILAIAN}?${params || ""}`),

  getPenilaianByJadwal: (jadwalTrainingId: string, params?: string) =>
    instance.get(
      `${endpoint.PENILAIAN}/${jadwalTrainingId}/penilaian?${params || ""}`,
    ),

  getAssesmentById: (id: string) => instance.get(`${endpoint.ASSESMENT}/${id}`),

  updateAssesment: (
    id: string,
    payload: Partial<Omit<ICreateAssesment, "id">>,
  ) => instance.put(`${endpoint.ASSESMENT}/${id}`, payload),

  deleteAssesment: (id: string) =>
    instance.delete(`${endpoint.ASSESMENT}/${id}`),
};
