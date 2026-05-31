export interface IDiuploadOleh {
  id: string;
  name: string;
  role: string;
}

export interface IMateri {
  id: string;
  namaMateri: string;
  jadwalTraining: string;
  detailHariTraining: string;
  fileMateri: string | null;
  diuploadOleh: IDiuploadOleh;
}

export interface ICreateMateri {
  detailJadwalTrainingId: string;
  judul: string;
  file?: File;
}
