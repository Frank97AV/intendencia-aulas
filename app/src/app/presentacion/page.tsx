import { PRESENTACION } from "@/demo/presentacion";
import { Card } from "@/components/ui";
import Link from "next/link";

export const metadata = {
  title: "Presentación · Intendencia de Aulas",
};

const estadoEstilo: Record<string, string> = {
  Listo: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  "En curso": "bg-amber-50 text-amber-800 ring-amber-200",
  Pendiente: "bg-slate-100 text-slate-600 ring-slate-200",
};

export default function PresentacionPage() {
  const p = PRESENTACION;

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-brand-900 text-xs font-bold text-white">
              IA
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Intendencia de Aulas</p>
              <p className="text-[11px] text-slate-500">{p.version}</p>
            </div>
          </div>
          <nav aria-label="Secciones" className="hidden items-center gap-5 text-sm text-slate-600 md:flex">
            <a className="hover:text-brand-700" href="#alcance">Alcance</a>
            <a className="hover:text-brand-700" href="#flujo">Flujo</a>
            <a className="hover:text-brand-700" href="#features">Features</a>
            <a className="hover:text-brand-700" href="#arquitectura">Arquitectura</a>
            <a className="hover:text-brand-700" href="#pendientes">Pendientes</a>
          </nav>
          <Link
            href="/login"
            className="rounded-lg bg-brand-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-900"
          >
            Abrir la demo
          </Link>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden bg-brand-900 text-white">
          <div className="absolute -right-32 top-0 h-96 w-96 rounded-full bg-brand-500/25 blur-3xl" />
          <div className="absolute -bottom-40 left-10 h-96 w-96 rounded-full bg-accent-500/15 blur-3xl" />
          <div className="relative mx-auto max-w-6xl px-5 py-20">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/60">{p.kicker}</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
              {p.titulo}
            </h1>
            <p className="mt-4 max-w-2xl text-xl text-white/85">{p.subtitulo}</p>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/60">{p.descripcion}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/login"
                className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-brand-900 shadow transition hover:bg-brand-50"
              >
                Probar el MVP
              </Link>
              <a
                href="#features"
                className="rounded-lg border border-white/25 px-5 py-2.5 text-sm font-semibold text-white/90 transition hover:bg-white/10"
              >
                Ver alcance
              </a>
            </div>

            <dl className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {p.cifras.map((c) => (
                <div key={c.etiqueta} className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <dt className="text-[11px] uppercase tracking-wide text-white/50">{c.etiqueta}</dt>
                  <dd className="mt-1 text-3xl font-bold">{c.valor}</dd>
                </div>
              ))}
            </dl>

            <p className="mt-10 text-xs text-white/40">{p.fecha} · {p.version}</p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-16">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-600">El problema</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                Hoy la programación vive en archivos que nadie puede auditar.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-600">{p.objetivo}</p>
            </div>
            <ul className="space-y-3">
              {p.problema.map((item) => (
                <li key={item} className="flex gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-rose-100 text-xs font-bold text-rose-600">
                    !
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="alcance" className="border-y border-slate-200 bg-slate-50">
          <div className="mx-auto max-w-6xl px-5 py-16">
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-600">Alcance</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Qué incluye este MVP</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <Card className="p-6">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-emerald-700">Incluido</h3>
                <ul className="mt-4 space-y-2.5 text-sm text-slate-700">
                  {p.alcance.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-0.5 text-emerald-600">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </Card>
              <Card className="p-6">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Fuera de esta fase</h3>
                <ul className="mt-4 space-y-2.5 text-sm text-slate-600">
                  {p.fuera.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-0.5 text-slate-400">—</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-6 rounded-lg bg-slate-50 p-3 text-xs text-slate-500">
                  El diseño deja preparadas las interfaces para conectar Google OAuth, SIPUC y el
                  dashboard institucional sin rehacer el dominio.
                </p>
              </Card>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-600">Actores</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Tres roles, permisos separados</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {p.roles.map((rol, i) => (
              <Card key={rol.nombre} className="p-6">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-50 text-sm font-bold text-brand-700">
                  {i + 1}
                </span>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">{rol.nombre}</h3>
                <p className="mt-1 text-sm text-slate-600">{rol.descripcion}</p>
                <ul className="mt-4 space-y-1.5 text-xs text-slate-600">
                  {rol.permisos.map((permiso) => (
                    <li key={permiso}>· {permiso}</li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </section>

        <section id="flujo" className="border-y border-slate-200 bg-slate-50">
          <div className="mx-auto max-w-6xl px-5 py-16">
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-600">Flujo</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              De la solicitud a la asignación, sin perder el rastro
            </h2>
            <ol className="mt-10 grid gap-4 md:grid-cols-5">
              {p.flujo.map((paso) => (
                <li key={paso.paso} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <span className="text-xs font-bold text-brand-500">{paso.paso}</span>
                  <p className="mt-2 text-sm font-semibold text-slate-900">{paso.titulo}</p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600">{paso.detalle}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-6xl px-5 py-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-600">Catálogo funcional</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">14 features del MVP</h2>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {p.features.map((f) => (
              <div key={f.id} className="flex items-start justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wide text-brand-600">{f.id}</p>
                  <p className="mt-1 text-sm font-medium text-slate-800">{f.nombre}</p>
                </div>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${estadoEstilo[f.estado]}`}>
                  {f.estado}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section id="arquitectura" className="border-y border-slate-200 bg-brand-900 text-white">
          <div className="mx-auto max-w-6xl px-5 py-16">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/50">Arquitectura</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight">PostgreSQL como fuente única de verdad</h2>
            <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-3">
                {p.stack.map((s) => (
                  <div key={s.capa} className="flex flex-col gap-1 rounded-xl border border-white/10 bg-white/5 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wide text-white/50">{s.capa}</span>
                    <span className="text-sm text-white/90">{s.tecnologia}</span>
                  </div>
                ))}
              </div>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-white/60">Garantías de diseño</h3>
                <ul className="mt-4 space-y-2.5 text-sm text-white/80">
                  {p.garantias.map((g) => (
                    <li key={g} className="flex gap-2">
                      <span className="mt-0.5 text-emerald-300">✓</span>
                      {g}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section id="pendientes" className="mx-auto max-w-6xl px-5 py-16">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-600">Decisiones abiertas</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                Lo que falta validar con Intendencia
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                El MVP fija supuestos explícitos y configurables. Estas definiciones del documento
                (PD-01…PD-14) se resuelven antes de producción.
              </p>
              <ul className="mt-6 space-y-2 text-sm text-slate-700">
                {p.pendientes.map((item) => (
                  <li key={item} className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-600">Guion de demo</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Probarlo en 5 pasos</h2>
              <ol className="mt-6 space-y-3">
                {p.demo.map((paso, i) => (
                  <li key={paso} className="flex gap-3 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-700 text-xs font-bold text-white">
                      {i + 1}
                    </span>
                    {paso}
                  </li>
                ))}
              </ol>
              <Link
                href="/login"
                className="mt-6 inline-flex rounded-lg bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-900"
              >
                Iniciar la demostración →
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-8 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>{p.aviso}</p>
          <p>Documentación Integral v1.0 · {p.fecha}</p>
        </div>
      </footer>
    </div>
  );
}
