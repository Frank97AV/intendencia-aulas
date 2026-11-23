import { activarCicloAccion, crearCicloAccion, desactivarCicloAccion } from "@/app/actions";
import { QueryAlert, parametro } from "@/components/QueryAlert";
import { Card, CardHeader, PageIntro, btnPrimary, btnSecondary, inputClass, labelClass } from "@/components/ui";
import { requireRole } from "@/lib/auth";
import { fmtFecha, fmtFechaHora } from "@/lib/format";
import { listarCiclos } from "@/services/catalogos";

export const dynamic = "force-dynamic";

function fechaLocal(d: Date): string {
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
}

export default async function AdminCiclosPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string }>;
}) {
  await requireRole(["ADMIN"]);
  const query = await searchParams;
  const ciclos = await listarCiclos();
  const ahora = new Date();

  return (
    <div className="space-y-6">
      <PageIntro
        titulo="Ciclos y ventanas"
        descripcion="Solo un ciclo puede estar activo. La ventana controla cuándo las unidades pueden registrar o editar su programación."
      />

      <QueryAlert ok={parametro(query.ok)} error={parametro(query.error)} />

      <Card>
        <CardHeader titulo="Crear ciclo académico" descripcion="Defina el período y la ventana de recepción de solicitudes." />
        <form action={crearCicloAccion} className="grid gap-4 p-5 lg:grid-cols-3">
          <div>
            <label htmlFor="nombre" className={labelClass}>
              Nombre del ciclo
            </label>
            <input id="nombre" name="nombre" required className={`${inputClass} mt-1`} placeholder="2027-I" />
          </div>
          <div>
            <label htmlFor="fechaInicio" className={labelClass}>
              Inicio académico
            </label>
            <input id="fechaInicio" name="fechaInicio" type="date" required className={`${inputClass} mt-1`} />
          </div>
          <div>
            <label htmlFor="fechaFin" className={labelClass}>
              Fin académico
            </label>
            <input id="fechaFin" name="fechaFin" type="date" required className={`${inputClass} mt-1`} />
          </div>
          <div>
            <label htmlFor="inicioSolicitudes" className={labelClass}>
              Apertura de solicitudes
            </label>
            <input
              id="inicioSolicitudes"
              name="inicioSolicitudes"
              type="datetime-local"
              required
              defaultValue={fechaLocal(ahora)}
              className={`${inputClass} mt-1`}
            />
          </div>
          <div>
            <label htmlFor="finSolicitudes" className={labelClass}>
              Cierre de solicitudes
            </label>
            <input
              id="finSolicitudes"
              name="finSolicitudes"
              type="datetime-local"
              required
              defaultValue={fechaLocal(new Date(ahora.getTime() + 14 * 86400000))}
              className={`${inputClass} mt-1`}
            />
          </div>
          <div className="flex items-end">
            <button type="submit" className={btnPrimary}>
              Crear ciclo
            </button>
          </div>
        </form>
      </Card>

      <Card>
        <CardHeader titulo="Ciclos registrados" descripcion={`${ciclos.length} ciclos · los históricos se conservan`} />
        <div className="tabla-scroll">
          <table className="w-full min-w-[860px] border-collapse text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3 font-semibold">Ciclo</th>
                <th className="px-5 py-3 font-semibold">Período académico</th>
                <th className="px-5 py-3 font-semibold">Ventana de solicitudes</th>
                <th className="px-5 py-3 font-semibold">Estado</th>
                <th className="px-5 py-3 font-semibold">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ciclos.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/60">
                  <td className="px-5 py-3 font-semibold text-slate-800">{c.nombre}</td>
                  <td className="px-5 py-3 text-slate-600">
                    {fmtFecha(c.fechaInicio)} – {fmtFecha(c.fechaFin)}
                  </td>
                  <td className="px-5 py-3 text-slate-600">
                    {fmtFechaHora(c.inicioSolicitudes)} → {fmtFechaHora(c.finSolicitudes)}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${
                        c.activo
                          ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                          : "bg-slate-100 text-slate-600 ring-slate-200"
                      }`}
                    >
                      {c.activo ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <form action={c.activo ? desactivarCicloAccion : activarCicloAccion}>
                      <input type="hidden" name="idCiclo" value={c.id} />
                      <button type="submit" className={btnSecondary}>
                        {c.activo ? "Desactivar" : "Activar"}
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
