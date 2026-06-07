interface DaftarPesertaColumn {
  uid: string;
  label: string;
  isSummary?: boolean;
}

export const LIST_DAFTAR_PESERTA: DaftarPesertaColumn[] = [
  {
    uid: "name",
    label: "NAMA",
    isSummary: true,
  },
  {
    uid: "email",
    label: "EMAIL",
    isSummary: true,
  },
  {
    uid: "noWa",
    label: "NO. WHATSAPP",
    isSummary: true,
  },
  {
    uid: "training",
    label: "TRAINING DIIKUTI",
    isSummary: true,
  },
  {
    uid: "aksi",
    label: "AKSI",
    isSummary: false,
  },
];
