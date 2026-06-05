import { endpoint } from "./endpoint.constant";

import instance from "@/lib/axios/instance";

export interface IVerifySertifikat {
  nomorSertifikat: string;
}

export const sertifikatVerifyServices = {
  verifySertifikat: (payload: IVerifySertifikat) =>
    instance.post(`${endpoint.SERTIFIKAT_VERIFY}/verify`, payload),
};
