import { endpoint } from "./endpoint.constant";

import { IKelolaInstrukturAsesor } from "@/types/kelolaInstrukturAsesor";
import instance from "@/lib/axios/instance";

export const kelolaInstrukturAsesorServices = {
  getAllInstrukturAndAsesor: (params?: string) =>
    instance.get(`${endpoint.KELOLA_INSTRUKTUR_ASESOR}?${params}`),
  getInstrukturOrAsesorById: (id: string) =>
    instance.get(`${endpoint.KELOLA_INSTRUKTUR_ASESOR}/${id}`),
  addInstrukturOrAsesor: (payload: Omit<IKelolaInstrukturAsesor, "id">) =>
    instance.post(`${endpoint.KELOLA_INSTRUKTUR_ASESOR}`, payload),
  updateInstrukturOrAsesor: (
    id: string,
    payload: Omit<IKelolaInstrukturAsesor, "id">,
  ) => instance.put(`${endpoint.KELOLA_INSTRUKTUR_ASESOR}/${id}`, payload),
  deleteInstrukturOrAsesor: (id: string) =>
    instance.delete(`${endpoint.KELOLA_INSTRUKTUR_ASESOR}/${id}`),
};
