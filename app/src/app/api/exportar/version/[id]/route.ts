import { getSessionUser } from "@/lib/session";
import { fmtHora } from "@/lib/format";
import { detalleDeVersion, obtenerVersion } from "@/services/solicitudes";
import * as XLSX from "xlsx";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const usuario = await getSessionUser();
  if (!usuario) return new Response("No autorizado", { status: 401 });

  const { id } = await params;
  const idVersion = Number(id);
  if (!Number.isInteger(idVersion)) return new Response("Versión inválida", { status: 400 });

  const version = await obtenerVersion(idVersion);
  if (!version) return new Response("Versión no encontrada", { status: 404 });

  if (
    usuario.rol === "SOLICITANTE" &&
    (!usuario.idUnidad || version.solicitud.idUnidad !== usuario.idUnidad)
  ) {
    return new Response("Prohibido", { status: 403 });
  }

  const filas = await detalleDeVersion(idVersion);
  const incluirInternos = usuario.rol === "ADMIN";
  const fechaExportacion = new Intl.DateTimeFormat("es-PE", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "America/Lima",
  }).format(new Date());

  const datos = filas.map((f, indice) => {
    const base: Record<string, string | number> = {
      Solicitud: version.solicitud.id,
      Ciclo: version.cicloNombre,
      Unidad: version.unidadNombre,
      Versión: version.version.numeroVersion,
      "#": indice + 1,
    };
    if (incluirInternos) {
      base["Aula"] = f.aulaCodigo ?? "Pendiente";
    }
    Object.assign(base, {
      "Clave curso": f.clave,
      "Nombre del curso": f.nombreCurso,
      Secuencia: f.secuencia ?? "",
      Horario: f.horario ?? "",
      Vacantes: f.vacantes,
      Docentes: f.docentes ?? "",
      "Día": f.dia ?? "",
      "Hora inicio": fmtHora(f.horaInicio) === "—" ? "" : fmtHora(f.horaInicio),
      "Hora fin": fmtHora(f.horaFin) === "—" ? "" : fmtHora(f.horaFin),
      Formato: f.formatoCurso ?? "",
      "Tipo de aula solicitado": f.tipoAulaSolicitado ?? "",
      "Facultad / Programa": f.facultadPrograma ?? "",
      "Observaciones": f.observacionesFacultad ?? "",
      "Fecha de exportación": fechaExportacion,
    });
    if (incluirInternos) {
      base["Observaciones de Intendencia"] = f.observacionesIntendencia ?? "";
    }
    return base;
  });

  const hoja = XLSX.utils.json_to_sheet(datos);
  hoja["!cols"] = Object.keys(datos[0] ?? {}).map((clave) => ({
    wch: Math.min(Math.max(clave.length + 2, 12), 42),
  }));

  const libro = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(libro, hoja, "Programación");

  const baseNombre = `${version.unidadNombre}-${version.cicloNombre}-v${version.version.numeroVersion}`
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();

  const formato = new URL(request.url).searchParams.get("formato") === "csv" ? "csv" : "xlsx";

  if (formato === "csv") {
    const csv = `\uFEFF${XLSX.utils.sheet_to_csv(hoja)}`;
    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${baseNombre}.csv"`,
        "Cache-Control": "no-store",
      },
    });
  }

  const buffer = XLSX.write(libro, { type: "buffer", bookType: "xlsx" }) as Buffer;
  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${baseNombre}.xlsx"`,
      "Cache-Control": "no-store",
    },
  });
}
