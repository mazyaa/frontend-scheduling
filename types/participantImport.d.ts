export interface IParticipantImportPayload {
  name: string;
  email: string;
  noWa: string;
  password?: string | null;
  keahlian?: string | null;
  instansi?: string | null;
  fileCv?: string | null;
  fileIjazah?: string | null;
  fileSuratRekomendasi?: string | null;
  fileKtp?: string | null;
  fileFoto?: string | null;
  fileBuktiBayar?: string | null;
  fileBuktiFollow?: string | null;
}
