import Link from "next/link";
import { notFound } from "next/navigation";
import { cambiarEstadoSolicitudAccion } from "@/app/actions";
import { QueryAlert, parametro } from "@/components/QueryAlert";
import { Card, CardHeader, EstadoBadge, PageIntro, btnSecondary } from "@/components/ui";
import { requireRole } from "@/lib/auth";
import { fmtFechaHora, fmtHora } from "@/lib/format";
import { detalleDeVersion, listarVersiones, obtenerSolicitud, obtenerVersionVigente } from "@/services/solicitudes";

export const dynamic = "force-dynamic";

export default async function AdminSolicitudDetallePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ ok?: string; error?: string }>;
}) {
  await requireRole(["ADMIN"]);
  const { id } = await params;
  const query = await searchParams;
  const idSolicitud = Number(id);
  if (!Number.isInteger(idSolicitud)) notFound();

  const data = await obtenerSolicitud(idSolicitud);
  if (!data) notFound();
  const vigente = await obtenerVersionVigente(idSolicitud);
  const filas = vigente ? await detalleDeVersion(vigente.id) : [];
  const versiones = await listarVersiones(idSolicitud);

  return (
    <div className="space-y-6">
      <PageIntro
        titulo={data.unidadNombre}
        descripcion={`Ciclo ${data.ciclo.nombre} · Solicitud #${idSolicitud}`}
        accion={<div className="flex gap-2 items-center"><EstadoBadge estado={data.solicitud.estado} /><Link href="/admin/solicitudes" className={btnSecondary}>Volver</Link></div>}
      />
      <QueryAlert ok={parametro(query.ok)} error={parametro(query.error)} />

      <Card>
        <CardHeader titulo="Versión vigente" descripcion={vigente ? `v${vigente.numeroVersion} · ${fmtFechaHora(vigente.fechaVersion)} · ${vigente.autorNombre}` : "Sin versiones"} />
        <div className="tabla-scroll">
          <table className="w-full min-w-[1100px] border-collapse text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-3 py-3 font-semibold">#</th><th className="px-3 py-3 font-semibold">Aula</th><th className="px-3 py-3 font-semibold">Clave curso</th><th className="px-3 py-3 font-semibold">Horario</th><th className="px-3 py-3 font-semibold">Vacantes</th><th className="px-3 py-3 font-semibold">Docentes</th><th className="px-3 py-3 font-semibold">Secuencia</th><th className="px-3 py-3 font-semibold">Día</th><th className="px-3 py-3 font-semibold">Horas</th><th className="px-3 py-3 font-semibold">Formato</th><th className="px-3 py-3 font-semibold">Tipo aula</th><th className="px-3 py-3 font-semibold">Facultad / Programa</th><th className="px-3 py-3 font-semibold">Obs.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filas.map((f, i) => (
                <tr key={f.idDetalle} className="hover:bg-slate-50/60">
                  <td className="px-3 py-3 text-slate-400">{i + 1}</td>
                  <td className="px-3 py-3 text-slate-500">{f.aulaCodigo ?? "Pendiente"}</td>
                  <td className="px-3 py-3"><p className="font-semibold text-slate-800">{f.clave}</p><p className="text-xs text-slate-500">{f.nombreCurso}</p></td>
                  <td className="px-3 py-3">{f.horario ?? "—"}</td>
                  <td className="px-3 py-3">{f.vacantes}</td>
                  <td className="px-3 py-3">{f.docentes ?? "—"}</td>
                  <td className="px-3 py-3">{f.secuencia ?? "—"}</td>
                  <td className="px-3 py-3">{f.dia ?? "—"}</td>
                  <td className="px-3 py-3">{fmtHora(f.horaInicio)}–{fmtHora(f.horaFin)}</td>
                  <td className="px-3 py-3">{f.formatoCurso ?? "—"}</td>
                  <td className="px-3 py-3">{f.tipoAulaSolicitado ?? "—"}</td>
                  <td className="px-3 py-3">{f.facultadPrograma ?? "—"}</td>
                  <td className="px-3 py-3">{f.observacionesFacultad ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filas.length === 0 ? <p className="px-5 py-8 text-center text-sm text-slate-500">Sin filas registradas.</p> : null}
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <Card>
          <CardHeader titulo="Historial de versiones" descripcion="v1 = programación de inicio. Las versiones son inmutables." />
          <div className="tabla-scroll">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-4 py-3 font-semibold">Versión</th><th className="px-4 py-3 font-semibold">Fecha</th><th className="px-4 py-3 font-semibold">Autor</th><th className="px-4 py-3 font-semibold">Comentario</th><th className="px-4 py-3 font-semibold">Exportar</th></tr></thead>
              <tbody className="divide-y divide-slate-100">
                {versiones.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50/60">
                    <td className="px-4 py-3 font-semibold text-slate-800">v{v.numeroVersion}{v.numeroVersion === 1 ? <span className="ml-2 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold uppercase text-blue-700">Inicio</span> : null}</td>
                    <td className="px-4 py-3 text-slate-600">{fmtFechaHora(v.fechaVersion)}</td>
                    <td className="px-4 py-3 text-slate-600">{v.autorNombre}</td>
                    <td className="px-4 py-3 text-slate-600">{v.observacion ?? "—"}</td>
                    <td className="px-4 py-3"><a className="text-xs font-semibold text-brand-700 hover:underline" href={`/api/exportar/version/${v.id}?formato=xlsx`}>Excel</a></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
          <CardHeader titulo="Mantenimiento" descripcion="Estado administrativo del registro" />
          <div className="space-y-2 p-5">
            {(["REGISTRADA", "CERRADA", "BORRADOR"] as const).map((estado) => (
              <form key={estado} action={cambiarEstadoSolicitudAccion}>
                <input type="hidden" name="idSolicitud" value={idSolicitud} />
                <input type="hidden" name="estado" value={estado} />
                <button type="submit" className={`${btnSecondary} w-full`}>Marcar {estado.toLowerCase()}</button>
              </form>
            ))}
            <p className="pt-2 text-xs text-slate-500">La asignación de aula por administrador se habilitará en una fase posterior.</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
