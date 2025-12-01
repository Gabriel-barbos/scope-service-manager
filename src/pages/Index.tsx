import { useState } from "react";
import { Header } from "@/components/Header";
import { ServiceForm } from "@/components/ServiceForm";
import { BulkPasteForm } from "@/components/BulkPasteForm";
import { FileImportForm } from "@/components/FileImportForm";
import { ServiceRecord } from "@/types/service";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FIXED_WEBHOOK_URL = "https://script.google.com/macros/s/AKfycby4TxFTSQoga79Oi8XMAIKiru5cxtMIveHxkJguQES_3QFGGdlHO3fhQZJr1TD7Byoz9g/exec"
const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const sendToGoogleSheets = async (records: ServiceRecord[]) => {
    setIsLoading(true);

    try {
      await fetch(FIXED_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors",
        body: JSON.stringify({ records }),
      });

      toast({
        title: "Sucesso!",
        description: `${records.length} serviço(s) enviado(s) com sucesso.`,
      });
    } catch (error) {
      console.error("Erro ao enviar:", error);
      toast({
        title: "Erro",
        description: "Falha ao enviar dados.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSingleSubmit = async (record: ServiceRecord) => {
    await sendToGoogleSheets([record]);
  };

  const handleBulkSubmit = async (records: ServiceRecord[]) => {
    await sendToGoogleSheets(records);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">

        {/* Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ServiceForm onSubmit={handleSingleSubmit} isLoading={isLoading} />
          <BulkPasteForm onSubmit={handleBulkSubmit} isLoading={isLoading} />
          <FileImportForm onSubmit={handleBulkSubmit} isLoading={isLoading} />
        </div>

        {/* Instructions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg">Como usar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div>
                <h4 className="font-semibold mb-2 text-primary">1. Formulário Individual</h4>
                <p className="text-muted-foreground">
                  Preencha os campos e clique em enviar. Ideal para registros únicos.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-secondary">2. Colagem em Massa</h4>
                <p className="text-muted-foreground">
                  Cole várias linhas do Excel. As colunas devem estar separadas por tabulação.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-accent">3. Importar Arquivo</h4>
                <p className="text-muted-foreground">
                  Use o template Excel para enviar vários serviços de uma vez.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

      </main>
    </div>
  );
};

export default Index;
