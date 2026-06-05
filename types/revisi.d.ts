export interface IUploadRevisiResponse {
  penilaianId: string;
  fileRevisiAdmin: string;
  status: "pending" | "disetujui" | "ditolak";
}

export interface IStatusKompetensiItem {
  nama: string;
  training: string;
  batch: string;
  statusKompetensi: string;
  fileSertifikat: string | null;
  fileRevisiAdmin: string | null;
  fileRevisiPeserta: string | null;
  statusRevisi: string | null;
}

export interface IUploadRevisiPesertaResponse {
  penilaianId: string;
  fileRevisiPeserta: string;
  status: string;
}