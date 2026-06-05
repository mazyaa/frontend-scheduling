export interface ILaporanSertifikat {
  namaTraining: string;
  batch: string;
  totalSertifikat: number;
}

export interface ILaporanPeserta {
  namaPeserta: string;
  namaTraining: string;
  batch: string;
  statusKompetensi: "kompeten" | "belum_kompeten";
}
