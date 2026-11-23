import { crearAulaAccion, toggleAulaAccion } from "@/app/actions";
import type { Aula } from "@db/schema";
import { btnPrimary, btnSecondary, Card, CardHeader, inputClass, labelClass } from "@/components/ui";
import { TIPOS_AULA } from "@/lib/types";

export function InventarioAulas({ aulas, destino }: { aulas: Aula[]; destino: string }) {
  const activas = aulas.filter((a) => a.activo).length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader
          titulo="Registrar nueva aula"
          descripcion="El inventario es administrado por Intendencia. Las aulas se desactivan, no se eliminan."
        />
        <form action={crearAulaAccion} className="grid gap-4 p-5 sm:grid-cols-4">
          <div>
            <label htmlFor="codigo" className={labelClass}>
              Código
            </label>
            <input id="codigo" name="codigo" required className={`${inputClass} mt-1`} placeholder="A-104" />
          </div>
          <div>
            <label htmlFor="capacidad" className={labelClass}>
              Capacidad
            </label>
            <input
              id="capacidad"
              name="capacidad"
              type="number"
              min={0}
              required
              className={`${inputClass} mt-1`}
              placeholder="40"
            />
          </div>
          <div>
            <label htmlFor="tipoAula" className={labelClass}>
              Tipo
            </label>
            <select id="tipoAula" name="tipoAula" required className={`${inputClass} mt-1`}>
              {TIPOS_AULA.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button type="submit" className={btnPrimary}>
              Crear aula
            </button>
          </div>
        </form>
      </Card>

      <Card>
        <CardHeader
          titulo="Inventario de aulas"
          descripcion={`${aulas.length} aulas registradas · ${activas} activas`}
          accion={<span className="text-xs text-slate-500">Capacidad y tipo condicionan la asignación</span>}
        />
        <div className="tabla-scroll">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3 font-semibold">Código</th>
                <th className="px-5 py-3 font-semibold">Capacidad</th>
                <th className="px-5 py-3 font-semibold">Tipo</th>
                <th className="px-5 py-3 font-semibold">Estado</th>
                <th className="px-5 py-3 font-semibold">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {aulas.map((aula) => (
                <tr key={aula.id} className="hover:bg-slate-50/60">
                  <td className="px-5 py-3 font-semibold text-slate-800">{aula.codigo}</td>
                  <td className="px-5 py-3 text-slate-700">{aula.capacidad}</td>
                  <td className="px-5 py-3 text-slate-700">{aula.tipoAula}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${
                        aula.activo
                          ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                          : "bg-slate-100 text-slate-600 ring-slate-200"
                      }`}
                    >
                      {aula.activo ? "Activa" : "Inactiva"}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <form action={toggleAulaAccion}>
                      <input type="hidden" name="idAula" value={aula.id} />
                      <input type="hidden" name="activo" value={aula.activo ? "false" : "true"} />
                      <button type="submit" className={btnSecondary}>
                        {aula.activo ? "Desactivar" : "Activar"}
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {aulas.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-slate-500">
            No hay aulas registradas todavía.
          </p>
        ) : null}
      </Card>
    </div>
  );
}
