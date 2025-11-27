import { useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Upload, FileSpreadsheet } from "lucide-react";
import { ServiceRecord, FIELD_LABELS, FIELD_ORDER } from "@/types/service";
import * as XLSX from "xlsx";

interface FileImportFormProps {
  onSubmit: (records: ServiceRecord[]) => Promise<void>;
  isLoading: boolean;
}

export function FileImportForm({ onSubmit, isLoading }: FileImportFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const downloadTemplate = () => {
    const headers = FIELD_ORDER.map((field) => FIELD_LABELS[field]);
    const ws = XLSX.utils.aoa_to_sheet([headers]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    
    // Set column widths
    ws["!cols"] = headers.map(() => ({ wch: 20 }));
    
    XLSX.writeFile(wb, "template_servicos.xlsx");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const data = new Uint8Array(event.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json<string[]>(worksheet, { header: 1 });

      // Skip header row
      const records: ServiceRecord[] = jsonData.slice(1).map((row) => ({
        data: String(row[0] || ""),
        tipo: String(row[1] || ""),
        placa: String(row[2] || ""),
        chassi: String(row[3] || ""),
        cliente: String(row[4] || ""),
        valor: String(row[5] || ""),
      })).filter((record) => FIELD_ORDER.some((field) => record[field].trim() !== ""));

      if (records.length > 0) {
        await onSubmit(records);
      }
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <Card className="card-hover">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-accent/10">
            <FileSpreadsheet className="h-5 w-5 text-accent" />
          </div>
          <div>
            <CardTitle className="text-lg">Importar Arquivo</CardTitle>
            <CardDescription>Baixe o template e importe preenchido</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={downloadTemplate} variant="outline" className="w-full">
          <Download className="mr-2 h-4 w-4" />
          Baixar Template Excel
        </Button>
        
        <div className="relative">
          <Input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileUpload}
            disabled={isLoading}
            className="cursor-pointer"
          />
        </div>
        
        <p className="text-xs text-muted-foreground text-center">
          Aceita arquivos .xlsx e .xls
        </p>
      </CardContent>
    </Card>
  );
}
