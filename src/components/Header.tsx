import { ClipboardList } from "lucide-react";

export function Header() {
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-primary text-primary-foreground">
            <ClipboardList className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Registro de Serviços
            </h1>
            <p className="text-muted-foreground">
              Cadastre serviços e envie automaticamente para Google Sheets
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
