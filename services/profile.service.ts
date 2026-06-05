import { endpoint } from "./endpoint.constant";

import instance from "@/lib/axios/instance";

export interface IProfile {
  nama: string;
  email: string;
}

export interface IChangePassword {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const profileServices = {
  getProfile: () => instance.get(`${endpoint.PROFILE}`),

  updateProfile: (payload: Record<string, unknown>) =>
    instance.put(`${endpoint.PROFILE}`, payload),

  changePassword: (payload: Record<string, unknown>) =>
    instance.put(`${endpoint.PROFILE}/change-password`, payload),
};
