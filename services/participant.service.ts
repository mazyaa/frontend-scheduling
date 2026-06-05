import { endpoint } from "./endpoint.constant";

import { IParticipant } from "@/types/participant";
import instance from "@/lib/axios/instance";

export const participantServices = {
  getAllParticipant: (params?: string) =>
    instance.get(`${endpoint.PARTICIPANT}?${params}`),
  getParticipantById: (id: string) =>
    instance.get(`${endpoint.PARTICIPANT}/${id}`),
  getParticipantBySchedule: (id: string, params?: string) =>
    instance.get(`${endpoint.PARTICIPANT}/schedule/${id}?${params || ""}`),
  createParticipant: (payload: Omit<IParticipant, "id">) =>
    instance.post(`${endpoint.PARTICIPANT}`, payload),
  updateParticipant: (id: string, payload: Partial<Omit<IParticipant, "id">>) =>
    instance.put(`${endpoint.PARTICIPANT}/${id}`, payload),
  deleteParticipant: (id: string) =>
    instance.delete(`${endpoint.PARTICIPANT}/${id}`),
};
