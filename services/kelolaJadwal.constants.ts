import { endpoint } from "./endpoint.constant";

import { IKelolaJadwal } from "@/types/kelolaJadwal";
import instance from "@/lib/axios/instance";

export const kelolaJadwalServices = {
  getAllSchedules: (params?: string) =>
    instance.get(`${endpoint.JADWAL}?${params}`),
  getScheduleById: (id: string) => instance.get(`${endpoint.JADWAL}/${id}`),
  addSchedule: (payload: Omit<IKelolaJadwal, "id">) =>
    instance.post(`${endpoint.JADWAL}`, payload),
  updateSchedule: (id: string, payload: Omit<IKelolaJadwal, "id">) =>
    instance.put(`${endpoint.JADWAL}/${id}`, payload),
  deleteSchedule: (id: string) => instance.delete(`${endpoint.JADWAL}/${id}`),
};
