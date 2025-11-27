import { useState } from "react";
import { Header } from "@/components/Header";
import { ServiceForm } from "@/components/ServiceForm";
import { BulkPasteForm } from "@/components/BulkPasteForm";
import { FileImportForm } from "@/components/FileImportForm";
import { ServiceRecord } from "@/types/service";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Settings, AlertCircle, CheckCircle2 } from "lucide-react";

const Index = () => {
  const [webhookUrl, setWebhookUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const sendToGoogleSheets = async (records: ServiceRecord[]) => {
    if (!webhookUrl.trim()) {
      toast({
        title: "Erro",
        description: "Configure a URL do webhook antes de enviar.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors",
        body: JSON.stringify({ records }),
      });

      toast({
        title: "Sucesso!",
        description: `${records.length} registro(s) enviado(s) para o Google Sheets.`,
      });
    } catch (error) {
      console.error("Erro ao enviar:", error);
      toast({
        title: "Erro",
        description: "Falha ao enviar dados. Verifique a URL do webhook.",
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
        {/* Webhook Configuration */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted">
                <Settings className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <CardTitle className="text-lg">Configuração do Webhook</CardTitle>
                <CardDescription>
                  Cole a URL do webhook do Google Apps Script ou Zapier
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="webhook">URL do Webhook</Label>
              <Input
                id="webhook"
                type="url"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://script.google.com/macros/s/..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Status Alert */}
        {!webhookUrl && (
          <Alert className="mb-8 border-destructive/50 bg-destructive/10">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <AlertDescription className="text-destructive">
              Configure a URL do webhook acima para habilitar o envio de dados.
            </AlertDescription>
          </Alert>
        )}

        {webhookUrl && (
          <Alert className="mb-8 border-success/50 bg-success/10">
            <CheckCircle2 className="h-4 w-4 text-success" />
            <AlertDescription className="text-success">
              Webhook configurado. Pronto para enviar dados!
            </AlertDescription>
          </Alert>
        )}

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
                  Preencha os campos um por um e clique em enviar. Ideal para registros únicos.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-secondary">2. Colagem em Massa</h4>
                <p className="text-muted-foreground">
                  Copie várias linhas do Excel e cole no campo de texto. As colunas são separadas por tabulação.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-accent">3. Importar Arquivo</h4>
                <p className="text-muted-foreground">
                  Baixe o template, preencha no Excel e faça upload do arquivo para envio em lote.
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
