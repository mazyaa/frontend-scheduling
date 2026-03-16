import { endpoint } from "./endpoint.constant";

import instance from "@/lib/axios/instance";
import { IFileUrl } from "@/types/file";

// for setting header content type multipart/form-data because we will send file to backend
const formDataHeader = {
  headers: {
    "Content-type": "multipart/form-data",
  },
};

export const uploadServices = {
  uploadFile: (payload: FormData) =>
    instance.post(`${endpoint.MEDIA}/upload-single`, payload, formDataHeader),
  deleteFile: (payload: IFileUrl) =>
    instance.delete(`${endpoint.MEDIA}/remove`, { data: payload }),
};
