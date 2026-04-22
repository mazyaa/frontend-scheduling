export interface IDetailJadwal {
  id: string;
  jadwalTrainingId: string;
  hari: Date;
  hariKe: number;
  aktivitas: string;
  instrukturId: string | null;
  asesorId: string | null;
  instruktur?: { name: string } | null;
  asesor?: { name: string } | null;
  jadwalTraining?: any;
}
