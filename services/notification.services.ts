import { endpoint } from "./endpoint.constant";

import { INotify } from "@/types/notify";
import instance from "@/lib/axios/instance";

export const notifyServices = {
  createNotification: (id: string): Promise<Partial<INotify>> =>
    instance.post(`/${id}/${endpoint.NOTIFY}`),
};
