import { crearCursoAccion, toggleCursoAccion } from "@/app/actions";
import { QueryAlert, parametro } from "@/components/QueryAlert";
import { Card, CardHeader, PageIntro, btnPrimary, btnSecondary, inputClass, labelClass } from "@/components/ui";
import { requireRole } from "@/lib/auth";
import { listarCursos, listarUnidades } from "@/services/catalogos";

export const dynamic = "force-dynamic";

export default async function AdminCursosPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string; q?: string; unidad?: string }>;
}) {
  await requireRole(["ADMIN"]);
  const query = await searchParams;
  const [cursos, unidades] = await Promise.all([listarCursos(), listarUnidades()]);

  const texto = (parametro(query.q) ?? "").trim().toLowerCase();
  const filtroUnidad = parametro(query.unidad) ?? "";
  const filtrados = cursos.filter((c) => {
    const coincideTexto =
      !texto ||
      c.clave.toLowerCase().includes(texto) ||
      c.nombreCurso.toLowerCase().includes(texto);
    const coincideUnidad = !filtroUnidad || String(c.idUnidad ?? "") === filtroUnidad;
    return coincideTexto && coincideUnidad;
  });

  return (
    <div className="space-y-6">
      <PageIntro
        titulo="Catálogo de cursos"
        descripcion="La clave identifica el curso y se conserva como texto. Los cursos con referencias se desactivan, no se eliminan."
      />

      <QueryAlert ok={parametro(query.ok)} error={parametro(query.error)} />

      <Card>
        <CardHeader titulo="Registrar curso" descripcion="La clave debe ser única en todo el catálogo." />
        <form action={crearCursoAccion} className="grid gap-4 p-5 lg:grid-cols-4">
          <div>
            <label htmlFor="clave" className={labelClass}>
              Clave
            </label>
            <input id="clave" name="clave" required className={`${inputClass} mt-1`} placeholder="IS-601" />
          </div>
          <div className="lg:col-span-2">
            <label htmlFor="nombreCurso" className={labelClass}>
              Nombre del curso
            </label>
            <input
              id="nombreCurso"
              name="nombreCurso"
              required
              className={`${inputClass} mt-1`}
              placeholder="Arquitectura de Software"
            />
          </div>
          <div>
            <label htmlFor="idUnidad" className={labelClass}>
              Unidad propietaria
            </label>
            <select id="idUnidad" name="idUnidad" className={`${inputClass} mt-1`}>
              <option value="">Compartido / sin unidad</option>
              {unidades.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className="lg:col-span-4">
            <button type="submit" className={btnPrimary}>
              Crear curso
            </button>
          </div>
        </form>
      </Card>

      <Card>
        <CardHeader titulo="Cursos registrados" descripcion={`${filtrados.length} de ${cursos.length} cursos`} />
        <form method="get" className="flex flex-wrap items-end gap-3 border-b border-slate-100 px-5 py-4">
          <div className="min-w-[220px] flex-1">
            <label htmlFor="q" className={labelClass}>
              Buscar por clave o nombre
            </label>
            <input id="q" name="q" defaultValue={texto} className={`${inputClass} mt-1`} placeholder="IS-101" />
          </div>
          <div className="min-w-[200px]">
            <label htmlFor="unidad" className={labelClass}>
              Unidad
            </label>
            <select id="unidad" name="unidad" defaultValue={filtroUnidad} className={`${inputClass} mt-1`}>
              <option value="">Todas</option>
              {unidades.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.nombre}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className={btnSecondary}>
            Filtrar
          </button>
        </form>

        <div className="tabla-scroll">
          <table className="w-full min-w-[820px] border-collapse text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3 font-semibold">Clave</th>
                <th className="px-5 py-3 font-semibold">Nombre</th>
                <th className="px-5 py-3 font-semibold">Unidad</th>
                <th className="px-5 py-3 font-semibold">Estado</th>
                <th className="px-5 py-3 font-semibold">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtrados.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/60">
                  <td className="px-5 py-3 font-semibold text-slate-800">{c.clave}</td>
                  <td className="px-5 py-3 text-slate-700">{c.nombreCurso}</td>
                  <td className="px-5 py-3 text-slate-600">{c.unidadNombre ?? "Compartido"}</td>
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
                    <form action={toggleCursoAccion}>
                      <input type="hidden" name="idCurso" value={c.id} />
                      <input type="hidden" name="activo" value={c.activo ? "false" : "true"} />
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
        {filtrados.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-slate-500">No hay cursos que coincidan con el filtro.</p>
        ) : null}
      </Card>
    </div>
  );
}
