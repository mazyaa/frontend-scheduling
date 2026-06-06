export interface IMyJadwalTraining {
  id: string;
  namaTraining: string;
  startDate: string;
  endDate: string;
  duration: number;
  meetingLink: string;
  batch: string;
}

export interface IMyDetailJadwal {
  id: string;
  jadwalTrainingId: string;
  hariKe: number;
  hari: string;
  jadwalTraining?: {
    training?: {
      namaTraining?: string;
    };
  };
  instruktur?: { name: string } | null;
  asesor?: { name: string } | null;
}

export interface IMySesiJadwal {
  id: string;
  detailJadwalTrainingId: string;
  jamMulai: string;
  jamSelesai: string;
  aktivitas: string;
  pic: string;
}
