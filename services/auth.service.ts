import { ILogin } from "@/types/Auth";
import { endpoint } from "./endpoint.constant";
import instance from "@/lib/axios/instance";

export const authServices = {
    login: (payload: ILogin) => 
        instance.post(`${endpoint.AUTH}/login`, payload),
    getProfileWithToken: (token: string) => 
        instance.get(`${endpoint.AUTH}/me`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
};