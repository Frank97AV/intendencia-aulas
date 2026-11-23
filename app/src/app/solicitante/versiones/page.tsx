import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { fmtFechaHora } from "@/lib/format";
import { EstadoBadge, Card, CardHeader, PageIntro, Vacio, btnSecondary } from "@/components/ui";
import { listarVersiones, solicitudesDeUnidad } from "@/services/solicitudes";

export const dynamic = "force-dynamic";

export default async function VersionesPage({
  searchParams,
}: {
  searchParams: Promise<{ sol?: string }>;
}) {
  const usuario = await requireRole(["SOLICITANTE"]);
  const { sol } = await searchParams;

  const lista = usuario.idUnidad ? await solicitudesDeUnidad(usuario.idUnidad) : [];
  const objetivo =
    lista.find((s) => String(s.idSolicitud) === sol) ??
    lista.find((s) => s.actual) ??
    lista[0];

  const versiones = objetivo ? await listarVersiones(objetivo.idSolicitud) : [];

  return (
    <div className="space-y-6">
      <PageIntro
        titulo="Versiones e historial"
        descripcion="Cada guardado es una fotografía completa e inmutable. Las correcciones generan una versión nueva."
        accion={
          <Link href="/solicitante/solicitud" className={btnSecondary}>
            Ir a la programación
          </Link>
        }
      />

      {lista.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {lista.map((s) => (
            <Link
              key={s.idSolicitud}
              href={`/solicitante/versiones?sol=${s.idSolicitud}`}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                objetivo?.idSolicitud === s.idSolicitud
                  ? "border-brand-600 bg-brand-700 text-white"
                  : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              {s.cicloNombre}
              {s.actual ? " Â· activo" : ""}
            </Link>
          ))}
        </div>
      ) : null}

      {objetivo ? (
        <Card>
          <CardHeader
            titulo={`Versiones del ciclo ${objetivo.cicloNombre}`}
            descripcion={`${versiones.length} versiones guardadas Â· estado actual de la solicitud`}
            accion={<EstadoBadge estado={objetivo.estado} />}
          />
          <div className="tabla-scroll">
            <table className="w-full min-w-[820px] border-collapse text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">VersiÃ³n</th>
                  <th className="px-5 py-3 font-semibold">Fecha</th>
                  <th className="px-5 py-3 font-semibold">Autor</th>
                  <th className="px-5 py-3 font-semibold">Comentario</th>
                  <th className="px-5 py-3 font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {versiones.map((v, i) => (
                  <tr key={v.id} className="hover:bg-slate-50/60">
                    <td className="px-5 py-3 font-semibold text-slate-800">
                      v{v.numeroVersion}
                      {i === 0 ? (
                        <span className="ml-2 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-700 ring-1 ring-emerald-200">Vigente</span>
                      ) : null}
                      {v.numeroVersion === 1 ? (
                        <span className="ml-2 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold uppercase text-blue-700 ring-1 ring-blue-200">Inicio</span>
                      ) : null}
                    </td>
                    <td className="px-5 py-3 text-slate-600">{fmtFechaHora(v.fechaVersion)}</td>
                    <td className="px-5 py-3 text-slate-600">{v.autorNombre}</td>
                    <td className="px-5 py-3 text-slate-600">{v.observacion ?? "â€”"}</td>
                    <td className="px-5 py-3">
                      <div className="flex flex-wrap items-center gap-3">
                        <Link
                          href={`/solicitante/versiones/${v.id}`}
                          className="text-xs font-semibold text-brand-700 hover:underline"
                        >
                          Ver detalle â†’
                        </Link>
                        <a
                          href={`/api/exportar/version/${v.id}?formato=xlsx`}
                          className="text-xs font-semibold text-slate-600 hover:underline"
                        >
                          Excel
                        </a>
                        <a
                          href={`/api/exportar/version/${v.id}?formato=csv`}
                          className="text-xs font-semibold text-slate-600 hover:underline"
                        >
                          CSV
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {versiones.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-slate-500">
              Esta solicitud aÃºn no tiene versiones guardadas.
            </p>
          ) : null}
        </Card>
      ) : (
        <Vacio
          titulo="TodavÃ­a no hay solicitudes"
          detalle="Cuando guardes tu primera programaciÃ³n aparecerá aquí el historial de versiones."
        />
      )}
    </div>
  );
}

