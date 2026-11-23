import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { fmtFecha, fmtFechaHora } from "@/lib/format";
import { estadoVentana, puedeEditarSolicitud, VENTANA_LABEL } from "@/lib/rules";
import { cicloActivo } from "@/services/catalogos";
import {
  detalleDeVersion,
  listarVersiones,
  obtenerSolicitudDeUnidad,
  obtenerVersionVigente,
  solicitudesDeUnidad,
} from "@/services/solicitudes";
import {
  btnPrimary,
  btnSecondary,
  Card,
  CardHeader,
  EstadoBadge,
  PageIntro,
  StatCard,
  Vacio,
} from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function SolicitantePage() {
  const usuario = await requireRole(["SOLICITANTE"]);
  const ciclo = await cicloActivo();

  if (!ciclo) {
    return (
      <div className="space-y-6">
        <PageIntro titulo="Panel del solicitante" descripcion="No hay un ciclo académico activo." />
        <Vacio
          titulo="Sin ciclo activo"
          detalle="El administrador debe crear y activar un ciclo con su ventana de solicitudes para comenzar."
        />
      </div>
    );
  }

  const solicitud = usuario.idUnidad ? await obtenerSolicitudDeUnidad(usuario.idUnidad, ciclo.id) : null;
  const vigente = solicitud ? await obtenerVersionVigente(solicitud.id) : null;
  const versiones = solicitud ? await listarVersiones(solicitud.id) : [];
  const filas = vigente ? await detalleDeVersion(vigente.id) : [];
  const historicas = usuario.idUnidad ? await solicitudesDeUnidad(usuario.idUnidad) : [];

  const estado = solicitud?.estado ?? "BORRADOR";
  const permiso = puedeEditarSolicitud(ciclo, estado);
  const ventana = estadoVentana(ciclo);
  const nombreCorto = usuario.nombre.split(" (")[0];
  const inicio = versiones.length > 0 ? versiones[versiones.length - 1] : null;

  return (
    <div className="space-y-6">
      <PageIntro
        titulo={`Hola, ${nombreCorto}`}
        descripcion={`Registro de programación del ciclo ${ciclo.nombre} para ${usuario.unidadNombre ?? "su unidad académica"}.`}
        accion={
          <div className="flex flex-wrap gap-2">
            <Link href="/solicitante/importar" className={btnSecondary}>Importar Excel</Link>
            <Link href="/solicitante/solicitud" className={btnPrimary}>
              {permiso.permitido ? "Editar registro" : "Ver registro"}
            </Link>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard etiqueta="Ciclo activo" valor={ciclo.nombre} detalle={`${fmtFecha(ciclo.fechaInicio)} – ${fmtFecha(ciclo.fechaFin)}`} />
        <StatCard
          etiqueta="Ventana de habilitación"
          valor={VENTANA_LABEL[ventana]}
          detalle={`${fmtFechaHora(ciclo.inicioSolicitudes)} → ${fmtFechaHora(ciclo.finSolicitudes)}`}
          tono={ventana === "ABIERTA" ? "ok" : ventana === "PROXIMA" ? "alerta" : "neutro"}
        />
        <StatCard
          etiqueta="Estado del registro"
          valor={solicitud ? <EstadoBadge estado={solicitud.estado} /> : "Sin iniciar"}
          detalle={solicitud ? `Actualizado ${fmtFechaHora(solicitud.actualizadoEn)}` : "Se crea al guardar la primera versión"}
        />
        <StatCard
          etiqueta="Programación de inicio"
          valor={inicio ? `v${inicio.numeroVersion}` : "—"}
          detalle={inicio ? fmtFechaHora(inicio.fechaVersion) : "Aún sin versiones"}
          tono={inicio ? "info" : "neutro"}
        />
      </div>

      {!permiso.permitido ? (
        <div role="status" className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <p className="font-semibold">El registro está en modo lectura</p>
          <p className="mt-0.5">{permiso.motivo}</p>
        </div>
      ) : (
        <div role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          <p className="font-semibold">Puede editar y enviar versiones mientras la ventana esté habilitada</p>
          <p className="mt-0.5">Cada guardado genera una nueva versión. La v1 se conserva como programación de inicio.</p>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <CardHeader
            titulo="Mi solicitud del ciclo"
            descripcion="Cada envío crea una versión completa e inmutable."
            accion={solicitud ? <EstadoBadge estado={solicitud.estado} /> : null}
          />
          <div className="p-5">
            {solicitud ? (
              <dl className="grid gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Versiones guardadas</dt>
                  <dd className="mt-1 text-2xl font-bold text-slate-900">{versiones.length}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Filas en versión vigente</dt>
                  <dd className="mt-1 text-2xl font-bold text-slate-900">{filas.length}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Vacantes solicitadas</dt>
                  <dd className="mt-1 text-2xl font-bold text-slate-900">{filas.reduce((acc, f) => acc + f.vacantes, 0)}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Versión vigente</dt>
                  <dd className="mt-1 text-2xl font-bold text-slate-900">{vigente ? `v${vigente.numeroVersion}` : "—"}</dd>
                </div>
              </dl>
            ) : (
              <div className="rounded-lg bg-slate-50 p-5 text-sm text-slate-600">
                <p className="font-semibold text-slate-800">Aún no has registrado programación.</p>
                <p className="mt-1">Agrega filas manualmente o importa el Excel. Al guardar se creará la v1, que quedará como programación de inicio.</p>
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-2">
              <Link href="/solicitante/solicitud" className={btnPrimary}>{permiso.permitido ? "Editar registro" : "Ver registro"}</Link>
              <Link href="/solicitante/importar" className={btnSecondary}>Importar Excel</Link>
              <Link href="/solicitante/versiones" className={btnSecondary}>Historial de versiones</Link>
              {vigente ? <a href={`/api/exportar/version/${vigente.id}?formato=xlsx`} className={btnSecondary}>Exportar vigente</a> : null}
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader titulo="Cómo funciona" descripcion="Reglas clave del registro" />
          <ol className="space-y-4 p-5 text-sm text-slate-600">
            {[
              "Registra la programación con los campos principales: clave curso, horario, vacantes, docente(s), secuencia, día, horas, formato, tipo de aula, facultad/programa y observaciones.",
              "Puedes editar y volver a enviar mientras la ventana del ciclo esté habilitada.",
              "Cada envío crea una nueva versión; la v1 es la programación de inicio.",
              "El administrador puede revisar y dar mantenimiento al registro.",
            ].map((texto, i) => (
              <li key={texto} className="flex gap-3">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-50 text-xs font-bold text-brand-700">{i + 1}</span>
                {texto}
              </li>
            ))}
          </ol>
        </Card>
      </div>

      <Card>
        <CardHeader titulo="Historial por ciclo" descripcion="Los ciclos anteriores se conservan y no se eliminan." />
        <div className="tabla-scroll">
          <table className="w-full min-w-[780px] border-collapse text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3 font-semibold">Ciclo</th>
                <th className="px-5 py-3 font-semibold">Estado</th>
                <th className="px-5 py-3 font-semibold">Versiones</th>
                <th className="px-5 py-3 font-semibold">Filas</th>
                <th className="px-5 py-3 font-semibold">Actualizada</th>
                <th className="px-5 py-3 font-semibold">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {historicas.map((s) => (
                <tr key={s.idSolicitud} className="hover:bg-slate-50/60">
                  <td className="px-5 py-3 font-medium text-slate-800">
                    {s.cicloNombre}
                    {s.actual ? <span className="ml-2 rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-bold uppercase text-brand-700">Activo</span> : null}
                  </td>
                  <td className="px-5 py-3"><EstadoBadge estado={s.estado} /></td>
                  <td className="px-5 py-3 text-slate-600">{s.versiones}</td>
                  <td className="px-5 py-3 text-slate-600">{s.filas}</td>
                  <td className="px-5 py-3 text-slate-600">{fmtFechaHora(s.actualizadoEn)}</td>
                  <td className="px-5 py-3">
                    <Link href={`/solicitante/versiones?sol=${s.idSolicitud}`} className="text-xs font-semibold text-brand-700 hover:underline">Ver versiones →</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {historicas.length === 0 ? <p className="px-5 py-8 text-center text-sm text-slate-500">Todavía no hay solicitudes registradas para su unidad.</p> : null}
      </Card>
    </div>
  );
}
