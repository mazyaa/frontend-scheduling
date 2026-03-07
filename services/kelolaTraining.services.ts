import { endpoint } from "./endpoint.constant";

import { IKelolaTraining } from "@/types/kelolaTraining";
import instance from "@/lib/axios/instance";

export const kelolaTrainingServices = {
  getAllTraining: (params?: string) =>
    instance.get(`${endpoint.KELOLA_TRAINING}?${params}`),
  getTrainingById: (id: string) =>
    instance.get(`${endpoint.KELOLA_TRAINING}/$${id}`),
  addTraining: (payload: Omit<"IKelolaTraining", "id">) =>
    instance.post(`${endpoint.KELOLA_TRAINING}`, payload),
  updateTraining: (id: string, payload: Omit<IKelolaTraining, "id">) =>
    instance.put(`${endpoint.KELOLA_TRAINING}/$${id}`, payload),
  deleteTraining: (id: string) =>
    instance.delete(`${endpoint.KELOLA_TRAINING}/$${id}`),
};
