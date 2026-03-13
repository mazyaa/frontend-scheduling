export interface IKelolaInstrukturAsesor {
  id: string;
  name: string;
  email: string;
  noWa: string;
  role: "instruktur" | "asesor";
  keahlian: string;
}
