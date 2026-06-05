import { endpoint } from "./endpoint.constant";

import instance from "@/lib/axios/instance";

export const penilaianServices = {
  getMyStatusPenilaian: (params?: string) =>
    instance.get(`${endpoint.PENILAIAN}/my-status?${params || ""}`),

  getPenilaianByJadwal: (jadwalTrainingId: string, params?: string) =>
    instance.get(
      `${endpoint.PENILAIAN}/${jadwalTrainingId}/penilaian?${params || ""}`,
    ),
};
