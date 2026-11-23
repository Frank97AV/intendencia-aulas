import { actualizarUsuarioAccion } from "@/app/actions";
import { QueryAlert, parametro } from "@/components/QueryAlert";
import { Card, PageIntro, btnPrimary, inputClass, labelClass } from "@/components/ui";
import { requireRole } from "@/lib/auth";
import { listarUnidades, listarUsuarios } from "@/services/catalogos";
import { ROLES, ROL_LABEL, type Rol } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminUsuariosPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string }>;
}) {
  await requireRole(["ADMIN"]);
  const query = await searchParams;
  const [usuarios, unidades] = await Promise.all([listarUsuarios(), listarUnidades()]);

  return (
    <div className="space-y-6">
      <PageIntro
        titulo="Usuarios y autorización"
        descripcion="La identidad Google no otorga acceso por sí sola: cada cuenta requiere autorización local, rol y unidad académica."
      />

      <QueryAlert ok={parametro(query.ok)} error={parametro(query.error)} />

      <div className="grid gap-4 lg:grid-cols-2">
        {usuarios.map((u) => (
          <Card key={u.id} className="p-5">
            <form action={actualizarUsuarioAccion} className="space-y-4">
              <input type="hidden" name="idUsuario" value={u.id} />

              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{u.nombre}</p>
                  <p className="text-xs text-slate-500">{u.correo}</p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${
                    u.autorizado
                      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                      : "bg-amber-50 text-amber-800 ring-amber-200"
                  }`}
                >
                  {u.autorizado ? "Autorizado" : "Pendiente"}
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor={`rol-${u.id}`} className={labelClass}>
                    Rol
                  </label>
                  <select
                    id={`rol-${u.id}`}
                    name="rol"
                    defaultValue={u.rol}
                    className={`${inputClass} mt-1`}
                  >
                    {ROLES.map((rol) => (
                      <option key={rol} value={rol}>
                        {ROL_LABEL[rol as Rol]}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor={`unidad-${u.id}`} className={labelClass}>
                    Unidad académica
                  </label>
                  <select
                    id={`unidad-${u.id}`}
                    name="idUnidad"
                    defaultValue={u.idUnidad ?? ""}
                    className={`${inputClass} mt-1`}
                  >
                    <option value="">Sin unidad (global)</option>
                    {unidades.map((unidad) => (
                      <option key={unidad.id} value={unidad.id}>
                        {unidad.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  name="autorizado"
                  defaultChecked={u.autorizado}
                  className="h-4 w-4 rounded border-slate-300 text-brand-700 focus:ring-brand-500"
                />
                Autorizar acceso al sistema
              </label>

              <button type="submit" className={btnPrimary}>
                Guardar cambios
              </button>
            </form>
          </Card>
        ))}
      </div>
    </div>
  );
}
