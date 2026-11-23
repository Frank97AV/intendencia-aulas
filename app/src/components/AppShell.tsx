import type { UsuarioSesion } from "@/lib/session";
import { iniciales } from "@/lib/format";
import { ROL_LABEL } from "@/lib/types";
import type { ReactNode } from "react";
import { salir } from "@/app/actions";
import { SidebarNav, type NavItem } from "./SidebarNav";

export function AppShell({
  usuario,
  items,
  children,
}: {
  usuario: UsuarioSesion;
  items: NavItem[];
  children: ReactNode;
}) {
  const contexto = usuario.unidadNombre ?? ROL_LABEL[usuario.rol];

  return (
    <div className="min-h-screen bg-slate-100">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-brand-900 text-white lg:flex">
        <div className="flex items-center gap-3 border-b border-white/10 px-5 py-5">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-white/10 text-sm font-bold ring-1 ring-white/20">
            IA
          </div>
          <div>
            <p className="text-sm font-semibold leading-tight">Intendencia de Aulas</p>
            <p className="text-[11px] text-white/60">MVP demo · v0.1</p>
          </div>
        </div>

        <SidebarNav items={items} />

        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-500 text-xs font-bold">
              {iniciales(usuario.nombre)}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{usuario.nombre}</p>
              <p className="truncate text-[11px] text-white/60">{usuario.correo}</p>
            </div>
          </div>
          <p className="mt-2 text-[11px] uppercase tracking-wide text-white/50">
            {ROL_LABEL[usuario.rol]}
            {usuario.unidadNombre ? ` · ${usuario.unidadNombre}` : ""}
          </p>
          <form action={salir} className="mt-3">
            <button
              type="submit"
              className="w-full rounded-lg border border-white/15 px-3 py-1.5 text-xs font-semibold text-white/80 transition hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Cerrar sesión
            </button>
          </form>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur lg:px-8">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-brand-600">
              {ROL_LABEL[usuario.rol]}
            </p>
            <p className="text-sm font-semibold text-slate-900">{contexto}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-semibold text-amber-800">
              Entorno de demostración
            </span>
            <span className="hidden rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-medium text-slate-600 sm:inline">
              {usuario.correo}
            </span>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
