import { InventarioAulas } from "@/components/InventarioAulas";
import { QueryAlert, parametro } from "@/components/QueryAlert";
import { PageIntro } from "@/components/ui";
import { requireRole } from "@/lib/auth";
import { listarAulas } from "@/services/catalogos";

export const dynamic = "force-dynamic";

export default async function AdminAulasPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string }>;
}) {
  await requireRole(["ADMIN"]);
  const query = await searchParams;
  const aulas = await listarAulas();

  return (
    <div className="space-y-6">
      <PageIntro
        titulo="Inventario de aulas"
        descripcion="Inventario institucional compartido con Intendencia. Las aulas se desactivan sin borrar registros históricos."
      />
      <QueryAlert ok={parametro(query.ok)} error={parametro(query.error)} />
      <InventarioAulas aulas={aulas} destino="/admin/aulas" />
    </div>
  );
}
