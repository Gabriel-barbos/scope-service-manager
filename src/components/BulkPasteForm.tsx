import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ClipboardPaste, Send } from "lucide-react";
import { ServiceRecord, FIELD_ORDER } from "@/types/service";

interface BulkPasteFormProps {
  onSubmit: (records: ServiceRecord[]) => Promise<void>;
  isLoading: boolean;
}

export function BulkPasteForm({ onSubmit, isLoading }: BulkPasteFormProps) {
  const [pasteData, setPasteData] = useState("");

  const parseExcelPaste = (text: string): ServiceRecord[] => {
    const lines = text.trim().split("\n");
    const records: ServiceRecord[] = [];

    for (const line of lines) {
      const values = line.split("\t");
      if (values.length >= 6) {
        records.push({
          data: values[0]?.trim() || "",
          tipo: values[1]?.trim() || "",
          placa: values[2]?.trim() || "",
          chassi: values[3]?.trim() || "",
          cliente: values[4]?.trim() || "",
          valor: values[5]?.trim() || "",
        });
      }
    }

    return records;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const records = parseExcelPaste(pasteData);
    if (records.length > 0) {
      await onSubmit(records);
      setPasteData("");
    }
  };

  const parsedRecords = parseExcelPaste(pasteData);
  const isValid = parsedRecords.length > 0;

  return (
    <Card className="card-hover">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-secondary/10">
            <ClipboardPaste className="h-5 w-5 text-secondary" />
          </div>
          <div>
            <CardTitle className="text-lg">Colagem em Massa</CardTitle>
            <CardDescription>Cole dados copiados do Excel (com tabulações)</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Textarea
              value={pasteData}
              onChange={(e) => setPasteData(e.target.value)}
              placeholder={`Cole aqui os dados do Excel no formato:\nData\tTipo\tPlaca\tChassi\tCliente\tValor`}
              className="min-h-[150px] font-mono text-sm"
            />
            {pasteData && (
              <p className="text-sm text-muted-foreground">
                {parsedRecords.length} registro(s) detectado(s)
              </p>
            )}
          </div>
          <Button type="submit" disabled={!isValid || isLoading} variant="secondary" className="w-full">
            <Send className="mr-2 h-4 w-4" />
            {isLoading ? "Enviando..." : `Enviar ${parsedRecords.length} Registro(s)`}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
