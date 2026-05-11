import { endpoint } from "./endpoint.constant";

import instance from "@/lib/axios/instance";

export const kredensialServices = {
  createCredential: (id: string) =>
    instance.post(`${endpoint.CREDENTIAL}/${id}/send-credential`),
};
