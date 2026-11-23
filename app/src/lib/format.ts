const TZ = "America/Lima";

export function fmtFecha(valor: Date | string | null | undefined): string {
  if (!valor) return "—";
  const soloFecha = typeof valor === "string" && /^\d{4}-\d{2}-\d{2}$/.test(valor);
  const fecha = soloFecha ? new Date(`${valor}T00:00:00Z`) : typeof valor === "string" ? new Date(valor) : valor;
  if (Number.isNaN(fecha.getTime())) return "—";
  return new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: soloFecha ? "UTC" : TZ,
  }).format(fecha);
}

export function fmtFechaHora(valor: Date | string | null | undefined): string {
  if (!valor) return "—";
  const fecha = typeof valor === "string" ? new Date(valor) : valor;
  if (Number.isNaN(fecha.getTime())) return "—";
  return new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: TZ,
  }).format(fecha);
}

export function fmtHora(valor: string | null | undefined): string {
  if (!valor) return "—";
  return valor.slice(0, 5);
}

export function iniciales(nombre: string): string {
  return nombre
    .replace(/\(.*?\)/g, "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}
