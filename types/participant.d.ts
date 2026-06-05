export interface IJadwalTrainingRingkas {
  id: string;
  trainingId: string;
  startDate: string;
  duration: number;
  meetingLink: string;
  batch: string;
  training?: {
    id: string;
    namaTraining: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface IPesertaTraining {
  id: string;
  userId: string;
  jadwalTrainingId: string;
  jadwalTraining: IJadwalTrainingRingkas;
  createdAt?: string;
  updatedAt?: string;
}

export interface IProfilPeserta {
  id: string;
  userId: string;
  instansi?: string | null;
  fileCv?: string | null;
  fileIjazah?: string | null;
  fileSuratRekomendasi?: string | null;
  fileKtp?: string | null;
  fileFoto?: string | null;
  fileBuktiBayar?: string | null;
  fileBuktiFollow?: string | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface IParticipant {
  id: string;
  name: string;
  image?: string | null;
  email: string;
  noWa: string;
  role?: string;
  keahlian?: string | null;
  password?: string | null;
  jadwalTrainingId?: string;
  profilPeserta?: IProfilPeserta;
  pesertaTraining?: IPesertaTraining[];
  createdAt?: Date | string;
  updatedAt?: Date | string;
}
