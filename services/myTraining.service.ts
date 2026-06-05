import { endpoint } from "./endpoint.constant";

import instance from "@/lib/axios/instance";

export const myTrainingServices = {
  getMyTraining: (params?: string) =>
    instance.get(`${endpoint.MY_TRAINING}?${params || ""}`),

  getMyTrainingDetail: (jadwalTrainingId: string, params?: string) =>
    instance.get(
      `${endpoint.MY_TRAINING}/${jadwalTrainingId}/detail?${params || ""}`,
    ),

  getMyTrainingSession: (detailJadwalId: string, params?: string) =>
    instance.get(
      `${endpoint.MY_TRAINING}/${detailJadwalId}/sesi?${params || ""}`,
    ),
};
