import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { fmtFechaHora } from "@/lib/format";
import { Card, CardHeader, EstadoBadge, PageIntro, Vacio } from "@/components/ui";
import { listarCiclos } from "@/services/catalogos";
import { bandejaSolicitudes } from "@/services/solicitudes";

export const dynamic = "force-dynamic";

export default async function AdminSolicitudesPage({ searchParams }: { searchParams: Promise<{ ciclo?: string }> }) {
  await requireRole(["ADMIN"]);
  const { ciclo } = await searchParams;
  const cicloId = ciclo ? Number(ciclo) : null;
  const ciclos = await listarCiclos();
  const lista = await bandejaSolicitudes(Number.isInteger(cicloId) ? cicloId : null);

  return (
    <div className="space-y-6">
      <PageIntro
        titulo="Solicitudes registradas"
        descripcion="Mantenimiento y seguimiento de registros por ciclo. La asignación de aula se contempla en una fase posterior."
      />

      <div className="flex flex-wrap gap-2">
        <Link href="/admin/solicitudes" className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${!cicloId ? "border-brand-600 bg-brand-700 text-white" : "border-slate-300 bg-white text-slate-700"}`}>Todos</Link>
        {ciclos.map((c) => (
          <Link key={c.id} href={`/admin/solicitudes?ciclo=${c.id}`} className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${cicloId === c.id ? "border-brand-600 bg-brand-700 text-white" : "border-slate-300 bg-white text-slate-700"}`}>
            {c.nombre}{c.activo ? " · activo" : ""}
          </Link>
        ))}
      </div>

      {lista.length === 0 ? (
        <Vacio titulo="No hay solicitudes" detalle="Aún no se han registrado solicitudes para el filtro seleccionado." />
      ) : (
        <Card>
          <CardHeader titulo="Registros" descripcion={`${lista.length} solicitud(es)`} />
          <div className="tabla-scroll">
            <table className="w-full min-w-[900px] border-collapse text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Unidad</th>
                  <th className="px-5 py-3 font-semibold">Ciclo</th>
                  <th className="px-5 py-3 font-semibold">Estado</th>
                  <th className="px-5 py-3 font-semibold">Versión</th>
                  <th className="px-5 py-3 font-semibold">Filas</th>
                  <th className="px-5 py-3 font-semibold">Actualizada</th>
                  <th className="px-5 py-3 font-semibold">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {lista.map((s) => (
                  <tr key={s.idSolicitud} className="hover:bg-slate-50/60">
                    <td className="px-5 py-3 font-medium text-slate-800">{s.unidadNombre}</td>
                    <td className="px-5 py-3 text-slate-600">{s.cicloNombre}</td>
                    <td className="px-5 py-3"><EstadoBadge estado={s.estado} /></td>
                    <td className="px-5 py-3 text-slate-600">{s.versionVigente ? `v${s.versionVigente}` : "—"}</td>
                    <td className="px-5 py-3 text-slate-600">{s.filas}</td>
                    <td className="px-5 py-3 text-slate-600">{fmtFechaHora(s.actualizadoEn)}</td>
                    <td className="px-5 py-3"><Link href={`/admin/solicitudes/${s.idSolicitud}`} className="text-xs font-semibold text-brand-700 hover:underline">Ver detalle →</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
