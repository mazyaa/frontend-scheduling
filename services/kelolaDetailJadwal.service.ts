import { endpoint } from "./endpoint.constant";

import { IDetailJadwal } from "@/types/detailKelolaJadwal";
import instance from "@/lib/axios/instance";

export const kelolaDetailJadwalServices = {
  getAllDetailJadwal: (id: string, params?: string) =>
    instance.get(
      `${endpoint.DETAIL_JADWAL}/${id}/all-detail-schedules?${params}`,
    ),
  createDetailJadwal: (id: string, payload: Omit<IDetailJadwal, "id">) =>
    instance.put(`${endpoint.DETAIL_JADWAL}/${id}`, payload),
  getDetailScheduleById: (id: string) =>
    instance.get(`${endpoint.DETAIL_JADWAL}/${id}`),
  updateDetailJadwal: (
    id: string,
    payload: Partial<Omit<IDetailJadwal, "id">>,
  ) => instance.put(`${endpoint.DETAIL_JADWAL}/${id}`, payload),
};
