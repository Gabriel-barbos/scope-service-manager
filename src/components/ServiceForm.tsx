import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Send } from "lucide-react";
import { ServiceRecord, FIELD_LABELS, FIELD_ORDER } from "@/types/service";

interface ServiceFormProps {
  onSubmit: (record: ServiceRecord) => Promise<void>;
  isLoading: boolean;
}

const emptyRecord: ServiceRecord = {
  data: "",
  tipo: "",
  placa: "",
  chassi: "",
  cliente: "",
  valor: "",
};

export function ServiceForm({ onSubmit, isLoading }: ServiceFormProps) {
  const [formData, setFormData] = useState<ServiceRecord>(emptyRecord);

  const handleChange = (field: keyof ServiceRecord, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
    setFormData(emptyRecord);
  };

  const isValid = FIELD_ORDER.every((field) => formData[field].trim() !== "");

  return (
    <Card className="card-hover">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">Formulário Individual</CardTitle>
            <CardDescription>Preencha os campos para registrar um serviço</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FIELD_ORDER.map((field) => (
              <div key={field} className="space-y-2">
                <Label htmlFor={field}>{FIELD_LABELS[field]}</Label>
                <Input
                  id={field}
                  type={field === "data" ? "date" : "text"}
                  value={formData[field]}
                  onChange={(e) => handleChange(field, e.target.value)}
                  placeholder={field === "data" ? "" : `Digite ${FIELD_LABELS[field].toLowerCase()}`}
                />
              </div>
            ))}
          </div>
          <Button type="submit" disabled={!isValid || isLoading} className="w-full">
            <Send className="mr-2 h-4 w-4" />
            {isLoading ? "Enviando..." : "Enviar Serviço"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
