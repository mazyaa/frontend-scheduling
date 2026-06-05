export interface ISertifikatPerBulan {
  bulan: string;
  tahun: number;
  total: number;
}

export interface IDashboardData {
  totalSertifikat: number;
  totalPeserta: number;
  totalInstruktur: number;
  totalAsesor: number;
  sertifikatPerBulan: ISertifikatPerBulan[];
}
