import type { Metricas } from "@/services/metricas";
import { Card, CardHeader, StatCard } from "@/components/ui";
import { ESTADO_LABEL, type EstadoSolicitud } from "@/lib/types";

export function MetricasView({ metricas }: { metricas: Metricas }) {
  const cobertura =
    metricas.totalFilas > 0 ? Math.round((metricas.totalAsignadas / metricas.totalFilas) * 100) : 0;
  const estados = Object.entries(metricas.porEstado) as [EstadoSolicitud, number][];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard etiqueta="Solicitudes" valor={metricas.totalSolicitudes} detalle={`${metricas.totalVersiones} versiones guardadas`} />
        <StatCard etiqueta="Filas programadas" valor={metricas.totalFilas} detalle={`${metricas.totalVacantes} vacantes solicitadas`} />
        <StatCard etiqueta="Aulas asignadas" valor={`${cobertura}%`} detalle={`${metricas.totalAsignadas} de ${metricas.totalFilas} filas`} tono="ok" />
        <StatCard etiqueta="Cuentas pendientes" valor={metricas.usuariosPendientes} detalle="Requieren autorización" tono={metricas.usuariosPendientes ? "alerta" : "neutro"} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader titulo="Solicitudes por estado" descripcion="Distribución del ciclo vigente e históricos" />
          <div className="space-y-3 p-5">
            {estados.length === 0 ? (
              <p className="text-sm text-slate-500">Sin solicitudes registradas.</p>
            ) : null}
            {estados.map(([estado, cantidad]) => {
              const pct = Math.round((cantidad / metricas.totalSolicitudes) * 100);
              return (
                <div key={estado}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">{ESTADO_LABEL[estado] ?? estado}</span>
                    <span className="text-slate-500">
                      {cantidad} · {pct}%
                    </span>
                  </div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-brand-600" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <CardHeader titulo="Avance por unidad académica" descripcion="Última versión de cada solicitud" />
          <div className="tabla-scroll">
            <table className="w-full min-w-[560px] border-collapse text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Unidad</th>
                  <th className="px-5 py-3 font-semibold">Solicitudes</th>
                  <th className="px-5 py-3 font-semibold">Filas</th>
                  <th className="px-5 py-3 font-semibold">Asignadas</th>
                  <th className="px-5 py-3 font-semibold">Avance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {metricas.porUnidad.map((u) => {
                  const pct = u.filas ? Math.round((u.asignadas / u.filas) * 100) : 0;
                  return (
                    <tr key={u.unidad} className="hover:bg-slate-50/60">
                      <td className="px-5 py-3 font-medium text-slate-800">{u.unidad}</td>
                      <td className="px-5 py-3 text-slate-600">{u.solicitudes}</td>
                      <td className="px-5 py-3 text-slate-600">{u.filas}</td>
                      <td className="px-5 py-3 text-slate-600">{u.asignadas}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-100">
                            <div className="h-full rounded-full bg-emerald-500" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-xs font-semibold text-slate-600">{pct}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {metricas.porUnidad.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-slate-500">Sin datos por unidad todavía.</p>
          ) : null}
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard etiqueta="Aulas activas" valor={metricas.aulasActivas} detalle={`${metricas.aulasTotal} en inventario`} />
        <StatCard etiqueta="Cursos activos" valor={metricas.cursosActivos} detalle="Catálogo disponible" />
        <StatCard etiqueta="Vacantes totales" valor={metricas.totalVacantes} detalle="Suma de la última versión" />
      </div>
    </div>
  );
}
