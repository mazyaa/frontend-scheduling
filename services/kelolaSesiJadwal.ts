import { endpoint } from "./endpoint.constant";

import { IKelolaSesiJadwal } from "@/types/kelolaSesiJadwal";
import instance from "@/lib/axios/instance";

export const kelolaSesiJadwalServices = {
  createSingleSessionSchedule: (payload: Omit<IKelolaSesiJadwal, "id">) =>
    instance.post(`${endpoint.SESSIONSCHEDULE}/single`, payload),
  createMultipleSessionSchedule: (id: string) =>
    instance.post(`${endpoint.SESSIONSCHEDULE}/${id}/batch`),
  getSessionScheduleByDetailJadwalId: (id: string) =>
    instance.get(`${endpoint.SESSIONSCHEDULE}/${id}`),
  updateSessionSchedule: (
    id: string,
    payload: Partial<Omit<IKelolaSesiJadwal, "id">>,
  ) => instance.put(`${endpoint.SESSIONSCHEDULE}/${id}`, payload),
  deleteSessionSchedule: (id: string) =>
    instance.delete(`${endpoint.SESSIONSCHEDULE}/${id}`),
  getAllSessionScheduleByDetailScheduleId: (id: string, params?: string) =>
    instance.get(`${endpoint.SESSIONSCHEDULE}/${id}/all?${params}`),
};
