import { iniciarSesionDemo } from "@/app/actions";
import { Alerta, btnPrimary } from "@/components/ui";
import { iniciales } from "@/lib/format";
import { listarUsuarios } from "@/services/catalogos";
import { ROL_LABEL, type Rol } from "@/lib/types";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const usuarios = await listarUsuarios();
  const activos = usuarios.filter((u) => u.autorizado && u.activo);
  const pendientes = usuarios.filter((u) => !u.autorizado);

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.1fr_1fr]">
      <section className="relative hidden flex-col justify-between overflow-hidden bg-brand-900 px-10 py-12 text-white lg:flex">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-500/30 blur-2xl" />
        <div className="absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-accent-500/20 blur-3xl" />

        <div className="relative">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-white/10 text-sm font-bold ring-1 ring-white/20">
              IA
            </div>
            <div>
              <p className="text-sm font-semibold">Intendencia de Aulas</p>
              <p className="text-xs text-white/60">Transformación Digital</p>
            </div>
          </div>

          <h1 className="mt-16 max-w-lg text-4xl font-bold leading-tight tracking-tight">
            Programación académica ordenada, versionada y trazable.
          </h1>
          <p className="mt-4 max-w-md text-base leading-relaxed text-white/70">
            Las unidades académicas registran cursos, horarios y vacantes. Intendencia asigna las
            aulas. Todo queda versionado, sin planillas dispersas.
          </p>

          <ul className="mt-10 space-y-4 text-sm text-white/80">
            {[
              "Una solicitud por unidad y ciclo, con historial completo.",
              "Importación Excel con vista previa y validación previa.",
              "Asignación de aulas con control de capacidad.",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-400/20 text-[10px] font-bold text-emerald-200">
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-white/50">
          MVP de demostración · Datos ficticios · 23 de noviembre de 2026
        </p>
      </section>

      <section className="flex flex-col justify-center px-5 py-10 sm:px-10 lg:px-14">
        <div className="mx-auto w-full max-w-xl">
          <div className="mb-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">
              Login Google simulado
            </span>
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
              Elige una cuenta para ingresar
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Esta pantalla reemplaza a Google OAuth en la demo. La identidad no otorga permisos:
              la autorización, el rol y la unidad se validan en la base de datos local.
            </p>
          </div>

          {error ? (
            <div className="mb-5">
              <Alerta tipo="error">{decodeURIComponent(error)}</Alerta>
            </div>
          ) : null}

          <div className="space-y-3">
            {activos.map((usuario) => (
              <form
                key={usuario.id}
                action={iniciarSesionDemo}
                className="group flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-brand-200 hover:shadow"
              >
                <input type="hidden" name="idUsuario" value={usuario.id} />
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand-50 text-sm font-bold text-brand-700 ring-1 ring-brand-100">
                  {iniciales(usuario.nombre)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900">{usuario.nombre}</p>
                  <p className="truncate text-xs text-slate-500">{usuario.correo}</p>
                  <p className="mt-1 text-[11px] font-medium uppercase tracking-wide text-brand-600">
                    {ROL_LABEL[usuario.rol as Rol]}
                    {usuario.unidadNombre ? ` · ${usuario.unidadNombre}` : ""}
                  </p>
                </div>
                <button type="submit" className={`${btnPrimary} shrink-0`}>
                  Entrar
                </button>
              </form>
            ))}
          </div>

          {pendientes.length > 0 ? (
            <div className="mt-8">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Cuentas pendientes de autorización
              </p>
              <div className="mt-3 space-y-3">
                {pendientes.map((usuario) => (
                  <div
                    key={usuario.id}
                    className="flex items-center gap-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4"
                  >
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-slate-200 text-sm font-bold text-slate-500">
                      {iniciales(usuario.nombre)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-700">{usuario.nombre}</p>
                      <p className="truncate text-xs text-slate-500">{usuario.correo}</p>
                    </div>
                    <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-600">
                      Pendiente
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs text-slate-500">
                El administrador puede autorizar estas cuentas desde{" "}
                <span className="font-medium">Administración → Usuarios</span>.
              </p>
            </div>
          ) : null}

          <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-5 text-xs text-slate-500">
            <span>Los datos se reinician con <code className="rounded bg-slate-100 px-1">npm run db:reset</code></span>
            <Link className="font-semibold text-brand-700 hover:underline" href="/presentacion">
              Ver presentación del proyecto →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
