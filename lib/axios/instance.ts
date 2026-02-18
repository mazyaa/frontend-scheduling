import environtment from "@/config/env";
import axios from "axios";
import { getSession } from 'next-auth/react';
import { ISessionExtended } from "@/types/Auth";

const headers = {
    "Content-Type": "application/json",
};

const instance = axios.create({
    baseURL: environtment.API_URL,
    headers,
    timeout: 60 * 1000, // 60 seconds, after this, the request will be aborted
});

instance.interceptors.request.use(
    async (request) => {
        const session = await getSession() as ISessionExtended; // get the current session, and cast it to ISessionExtended
        if (session && session.accessToken) {
            request.headers.Authorization = `Bearer ${session.accessToken}`; // set the Authorization header with the access token
        }

        return request; // return the modified request
    },
    (error) => Promise.reject(error) // reject the error if the request fails
)

instance.interceptors.response.use(
    (response) => response, // return the response if it's successful
    (error) => Promise.reject(error) // reject the error if the response fails
)

export default instance;
