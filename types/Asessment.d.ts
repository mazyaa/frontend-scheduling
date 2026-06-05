type StatusKompetensi = "kompeten" | "belum_kompeten";

export interface ICreateAssesment {
  id: string;
  userId: string;
  jadwalTrainingId: string;
  statusKompetensi: StatusKompetensi;
  catatan: string;
}
