import { AppShell } from "@/components/AppShell";
import { requireRole } from "@/lib/auth";

export const dynamic = "force-dynamic";

const items = [
  { href: "/admin", label: "Panel general", exact: true },
  { href: "/admin/solicitudes", label: "Solicitudes registradas" },
  { href: "/admin/usuarios", label: "Usuarios y autorización" },
  { href: "/admin/ciclos", label: "Ciclos y ventanas" },
  { href: "/admin/cursos", label: "Catálogo de cursos" },
  { href: "/admin/aulas", label: "Inventario de aulas" },
  { href: "/admin/metricas", label: "Métricas" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const usuario = await requireRole(["ADMIN"]);
  return (
    <AppShell usuario={usuario} items={items}>
      {children}
    </AppShell>
  );
}
