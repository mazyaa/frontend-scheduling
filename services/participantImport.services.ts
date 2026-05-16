import { endpoint } from "./endpoint.constant";

import instance from "@/lib/axios/instance";
import { IParticipantImportPayload } from "@/types/participantImport";

export const participantImportServices = {
  preview: (payload: FormData) =>
    instance.post(`${endpoint.PARTICIPANT_IMPORT}/preview`, payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  commit: (jadwalTrainingId: string, payload: IParticipantImportPayload[]) =>
    instance.post(`${endpoint.PARTICIPANT_IMPORT}/commit`, {
      jadwalTrainingId,
      participants: payload,
    }),
};
