import { endpoint } from "./endpoint.constant";

import instance from "@/lib/axios/instance";

export interface CredentialPayload {
  token: string;
  password?: string;
}

export const setPasswordServices = {
  setPassword: (payload: CredentialPayload) =>
    instance.put(`${endpoint.SETPASSWORD}`, payload),
};
