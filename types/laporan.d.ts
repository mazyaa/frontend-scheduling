export interface ILaporanSertifikat {
  id: string;
  namaTraining: string;
  batch: string;
  startDate: string;
  endDate: string;
  totalPeserta: number;
  totalSertifikatTerbit: number;
  totalBelumTerbit: number;
}

export interface ILaporanPeserta {
  id: string;
  namaPeserta: string;
  email: string;
  noWa: string;
  instansi: string;
  namaTraining: string;
  batch: string;
  startDate: string;
  endDate: string;
  statusKompetensi: "kompeten" | "belum_kompeten";
  catatan: string;
  statusRevisi: string;
  createdAt: string;
}
