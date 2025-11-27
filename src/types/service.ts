export interface ServiceRecord {
  data: string;
  tipo: string;
  placa: string;
  chassi: string;
  cliente: string;
  valor: string;
  tecnico: string;
}

export const FIELD_LABELS: Record<keyof ServiceRecord, string> = {
  data: "Data do Serviço",
  tipo: "Tipo",
  placa: "Placa",
  chassi: "Chassi",
  cliente: "Cliente",
  valor: "Valor",
  tecnico: "Nome Técnico/Empresa",
};

export const FIELD_ORDER: (keyof ServiceRecord)[] = [
  "data",
  "tipo",
  "placa",
  "chassi",
  "cliente",
  "valor",
  "tecnico",
];
