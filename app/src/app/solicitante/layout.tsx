import { AppShell } from "@/components/AppShell";
import { requireRole } from "@/lib/auth";

export const dynamic = "force-dynamic";

const items = [
  { href: "/solicitante", label: "Panel del solicitante", exact: true },
  { href: "/solicitante/solicitud", label: "Mi registro de programación" },
  { href: "/solicitante/importar", label: "Importar Excel" },
  { href: "/solicitante/versiones", label: "Versiones e historial" },
];

export default async function UnidadLayout({ children }: { children: React.ReactNode }) {
  const usuario = await requireRole(["SOLICITANTE"]);
  return (
    <AppShell usuario={usuario} items={items}>
      {children}
    </AppShell>
  );
}

