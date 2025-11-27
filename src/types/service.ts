export interface ServiceRecord {
  data: string;
  tipo: string;
  placa: string;
  chassi: string;
  cliente: string;
  valor: string;
}

export const FIELD_LABELS: Record<keyof ServiceRecord, string> = {
  data: "Data do Serviço",
  tipo: "Tipo",
  placa: "Placa",
  chassi: "Chassi",
  cliente: "Cliente",
  valor: "Valor",
};

export const FIELD_ORDER: (keyof ServiceRecord)[] = [
  "data",
  "tipo",
  "placa",
  "chassi",
  "cliente",
  "valor",
];
