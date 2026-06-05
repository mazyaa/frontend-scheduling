import { endpoint } from "./endpoint.constant";

import instance from "@/lib/axios/instance";

export const dashboardServices = {
  getDashboard: (params?: string) =>
    instance.get(`${endpoint.DASHBOARD}?${params || ""}`),
};
