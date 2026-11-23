import Link from "next/link";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { fmtFechaHora, fmtHora } from "@/lib/format";
import { Card, CardHeader, EstadoBadge, PageIntro, btnSecondary } from "@/components/ui";
import { detalleDeVersion, obtenerVersion } from "@/services/solicitudes";

export const dynamic = "force-dynamic";

export default async function VersionDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const usuario = await requireRole(["SOLICITANTE"]);
  const { id } = await params;
  const idVersion = Number(id);
  if (!Number.isInteger(idVersion)) notFound();

  const version = await obtenerVersion(idVersion);
  if (!version) notFound();
  if (!usuario.idUnidad || version.solicitud.idUnidad !== usuario.idUnidad) notFound();

  const filas = await detalleDeVersion(version.version.id);

  return (
    <div className="space-y-6">
      <PageIntro
        titulo={`Versión ${version.version.numeroVersion} · ${version.cicloNombre}`}
        descripcion={`${version.unidadNombre} · guardada por ${version.autorNombre} el ${fmtFechaHora(version.version.fechaVersion)}${version.version.numeroVersion === 1 ? " · Programación de inicio" : ""}`}
        accion={
          <div className="flex flex-wrap gap-2">
            <Link href={`/solicitante/versiones?sol=${version.solicitud.id}`} className={btnSecondary}>Volver al historial</Link>
            <a href={`/api/exportar/version/${version.version.id}?formato=xlsx`} className={btnSecondary}>Exportar Excel</a>
          </div>
        }
      />

      <Card>
        <CardHeader
          titulo="Fotografía de la versión"
          descripcion={version.version.observacion ?? "Sin comentario de versión"}
          accion={<EstadoBadge estado={version.solicitud.estado} />}
        />
        <div className="tabla-scroll">
          <table className="w-full min-w-[1100px] border-collapse text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-3 py-3 font-semibold">#</th>
                <th className="px-3 py-3 font-semibold">Clave curso</th>
                <th className="px-3 py-3 font-semibold">Horario</th>
                <th className="px-3 py-3 font-semibold">Vacantes</th>
                <th className="px-3 py-3 font-semibold">Docentes</th>
                <th className="px-3 py-3 font-semibold">Secuencia</th>
                <th className="px-3 py-3 font-semibold">Día</th>
                <th className="px-3 py-3 font-semibold">Horas</th>
                <th className="px-3 py-3 font-semibold">Formato</th>
                <th className="px-3 py-3 font-semibold">Tipo aula</th>
                <th className="px-3 py-3 font-semibold">Facultad / Programa</th>
                <th className="px-3 py-3 font-semibold">Obs.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filas.map((f, i) => (
                <tr key={f.idDetalle} className="hover:bg-slate-50/60">
                  <td className="px-3 py-3 text-slate-400">{i + 1}</td>
                  <td className="px-3 py-3"><p className="font-semibold text-slate-800">{f.clave}</p><p className="text-xs text-slate-500">{f.nombreCurso}</p></td>
                  <td className="px-3 py-3 text-slate-600">{f.horario ?? "—"}</td>
                  <td className="px-3 py-3 text-slate-600">{f.vacantes}</td>
                  <td className="px-3 py-3 text-slate-600">{f.docentes ?? "—"}</td>
                  <td className="px-3 py-3 text-slate-600">{f.secuencia ?? "—"}</td>
                  <td className="px-3 py-3 text-slate-600">{f.dia ?? "—"}</td>
                  <td className="px-3 py-3 text-slate-600">{fmtHora(f.horaInicio)} – {fmtHora(f.horaFin)}</td>
                  <td className="px-3 py-3 text-slate-600">{f.formatoCurso ?? "—"}</td>
                  <td className="px-3 py-3 text-slate-600">{f.tipoAulaSolicitado ?? "—"}</td>
                  <td className="px-3 py-3 text-slate-600">{f.facultadPrograma ?? "—"}</td>
                  <td className="px-3 py-3 text-slate-600">{f.observacionesFacultad ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <p className="text-xs text-slate-500">Esta versión es inmutable. Para corregir, el solicitante guarda una nueva versión mientras la ventana esté habilitada.</p>
    </div>
  );
}
