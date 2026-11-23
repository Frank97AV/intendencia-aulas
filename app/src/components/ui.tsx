import { ESTADO_BADGE, ESTADO_LABEL, type EstadoSolicitud } from "@/lib/types";
import type { ReactNode } from "react";

export const btnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-lg bg-brand-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 disabled:cursor-not-allowed disabled:opacity-50";

export const btnSecondary =
  "inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600";

export const btnDanger =
  "inline-flex items-center justify-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500";

export const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100";

export const labelClass = "block text-xs font-semibold uppercase tracking-wide text-slate-600";

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-xl border border-slate-200 bg-white shadow-sm ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({
  titulo,
  descripcion,
  accion,
}: {
  titulo: string;
  descripcion?: string;
  accion?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
      <div>
        <h2 className="text-base font-semibold text-slate-900">{titulo}</h2>
        {descripcion ? <p className="mt-0.5 text-sm text-slate-500">{descripcion}</p> : null}
      </div>
      {accion}
    </div>
  );
}

export function EstadoBadge({ estado }: { estado: string }) {
  const key = (estado in ESTADO_LABEL ? estado : "BORRADOR") as EstadoSolicitud;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${ESTADO_BADGE[key]}`}
    >
      {ESTADO_LABEL[key]}
    </span>
  );
}

export function StatCard({
  etiqueta,
  valor,
  detalle,
  tono = "neutro",
}: {
  etiqueta: string;
  valor: ReactNode;
  detalle?: string;
  tono?: "neutro" | "ok" | "alerta" | "info";
}) {
  const tonos: Record<string, string> = {
    neutro: "border-slate-200",
    ok: "border-emerald-200",
    alerta: "border-amber-200",
    info: "border-sky-200",
  };
  return (
    <Card className={`p-5 ${tonos[tono]}`}>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{etiqueta}</p>
      <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{valor}</p>
      {detalle ? <p className="mt-1 text-xs text-slate-500">{detalle}</p> : null}
    </Card>
  );
}

export function Alerta({
  tipo,
  children,
}: {
  tipo: "ok" | "error" | "info" | "warn";
  children: ReactNode;
}) {
  const estilos = {
    ok: "border-emerald-200 bg-emerald-50 text-emerald-900",
    error: "border-rose-200 bg-rose-50 text-rose-900",
    info: "border-sky-200 bg-sky-50 text-sky-900",
    warn: "border-amber-200 bg-amber-50 text-amber-900",
  }[tipo];
  return (
    <div role={tipo === "error" ? "alert" : "status"} className={`rounded-lg border px-4 py-3 text-sm ${estilos}`}>
      {children}
    </div>
  );
}

export function Vacio({ titulo, detalle }: { titulo: string; detalle?: string }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
      <p className="text-sm font-semibold text-slate-700">{titulo}</p>
      {detalle ? <p className="mt-1 text-sm text-slate-500">{detalle}</p> : null}
    </div>
  );
}

export function PageIntro({
  titulo,
  descripcion,
  accion,
}: {
  titulo: string;
  descripcion?: string;
  accion?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">{titulo}</h1>
        {descripcion ? <p className="mt-1 max-w-2xl text-sm text-slate-600">{descripcion}</p> : null}
      </div>
      {accion}
    </div>
  );
}
