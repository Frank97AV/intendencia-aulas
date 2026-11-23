import type { Aula, Ciclo, Curso } from "@db/schema";
import { z } from "zod";
import { DIAS, FORMATOS, TIPOS_AULA, type ActionResult, type FilaInput } from "./types";

const HORA = /^([01]\d|2[0-3]):[0-5]\d$/;

const filaSchema = z.object({
  idCurso: z.coerce.number().int().positive().nullish(),
  claveCurso: z.string().trim().min(1, "La clave del curso es obligatoria").max(50),
  nombreCurso: z.string().trim().max(200).nullish(),
  secuencia: z.string().trim().max(30).nullish(),
  horario: z.string().trim().min(3, "El horario debe tener al menos 3 caracteres").max(50),
  vacantes: z.coerce.number().int().min(1, "Las vacantes deben ser al menos 1").max(500),
  docentes: z.string().trim().max(500).nullish(),
  dia: z.string().trim().nullish(),
  horaInicio: z.string().trim().nullish(),
  horaFin: z.string().trim().nullish(),
  formatoCurso: z.string().trim().nullish(),
  tipoAulaSolicitado: z.string().trim().nullish(),
  facultadPrograma: z.string().trim().min(1, "La facultad/programa es obligatoria").max(180),
  observacionesFacultad: z.string().trim().max(2000).nullish(),
});

export type FilaNormalizada = {
  idCurso: number | null;
  claveCurso: string;
  nombreCurso: string | null;
  secuencia: string | null;
  horario: string;
  vacantes: number;
  docentes: string | null;
  dia: string | null;
  horaInicio: string | null;
  horaFin: string | null;
  formatoCurso: string | null;
  tipoAulaSolicitado: string | null;
  facultadPrograma: string;
  observacionesFacultad: string | null;
};

export type ResultadoValidacion =
  | { ok: true; filas: FilaNormalizada[] }
  | { ok: false; errores: string[] };

function limpio(valor: string | null | undefined): string | null {
  if (valor == null) return null;
  const t = valor.trim();
  return t.length ? t : null;
}

export function normalizarHora(valor: string | null | undefined): string | null {
  const t = limpio(valor);
  if (!t) return null;
  return t.length === 5 ? t : t.slice(0, 5);
}

/**
 * Reglas de validación de programación (RN-12, RN-14, sección 11).
 * Se ejecutan SIEMPRE en servidor; el cliente solo replica para UX.
 */
export function validarFilas(
  filas: unknown,
  _cursos?: Curso[],
  _idUnidad?: number,
): ResultadoValidacion {
  if (!Array.isArray(filas) || filas.length === 0) {
    return { ok: false, errores: ["Debe registrar al menos una fila de programación."] };
  }
  if (filas.length > 200) {
    return { ok: false, errores: ["El máximo permitido es 200 filas por versión."] };
  }

  const errores: string[] = [];
  const normalizadas: FilaNormalizada[] = [];
  const vistos = new Map<string, number>();

  filas.forEach((fila, indice) => {
    const numero = indice + 1;
    const parsed = filaSchema.safeParse(fila);

    if (!parsed.success) {
      errores.push(`Fila ${numero}: ${parsed.error.issues[0]?.message ?? "datos inválidos"}.`);
      return;
    }

    const d = parsed.data;
    const claveCurso = limpio(d.claveCurso)?.toUpperCase() ?? "";
    const nombreCurso = limpio(d.nombreCurso);
    const diaRaw = limpio(d.dia)?.toUpperCase() ?? null;
    const diaMapa: Record<string, string> = { LUN: "LUN", MAR: "MAR", MIE: "MIE", MIER: "MIE", MIÉ: "MIE", JUE: "JUE", JUEV: "JUE", VIE: "VIE", VIER: "VIE", SAB: "SAB" };
    const dia = diaRaw ? (diaMapa[diaRaw] ?? diaMapa[diaRaw.slice(0, 3)] ?? diaRaw) : null;
    const formato = limpio(d.formatoCurso);
    const tipoAula = limpio(d.tipoAulaSolicitado);
    const facultadPrograma = limpio(d.facultadPrograma);
    const horario = limpio(d.horario) ?? "";
    const inicio = normalizarHora(d.horaInicio);
    const fin = normalizarHora(d.horaFin);

    if (!claveCurso) {
      errores.push(`Fila ${numero}: la clave del curso es obligatoria.`);
    }
    if (horario.length < 3) {
      errores.push(`Fila ${numero}: el horario debe tener al menos 3 caracteres.`);
    }
    if (dia && !(DIAS as readonly string[]).includes(dia)) {
      errores.push(`Fila ${numero}: el día "${dia}" no es válido. Use LUN, MAR, MIE, JUE, VIE o SAB.`);
    }
    if (formato && !(FORMATOS as readonly string[]).includes(formato)) {
      errores.push(`Fila ${numero}: el formato "${formato}" no es válido.`);
    }
    if (tipoAula && !(TIPOS_AULA as readonly string[]).includes(tipoAula)) {
      errores.push(`Fila ${numero}: el tipo de aula "${tipoAula}" no es válido.`);
    }
    if (!facultadPrograma) {
      errores.push(`Fila ${numero}: la facultad/programa es obligatoria.`);
    }
    if (inicio && !HORA.test(inicio)) {
      errores.push(`Fila ${numero}: la hora de inicio debe tener formato HH:mm (24 horas).`);
    }
    if (fin && !HORA.test(fin)) {
      errores.push(`Fila ${numero}: la hora de fin debe tener formato HH:mm (24 horas).`);
    }
    if (inicio && fin && fin <= inicio) {
      errores.push(`Fila ${numero}: la hora de fin debe ser posterior a la hora de inicio.`);
    }

    if (claveCurso && dia && inicio) {
      const claveDup = `${claveCurso}|${dia}|${inicio}|${horario}|${limpio(d.secuencia) ?? ""}`;
      const previa = vistos.get(claveDup);
      if (previa) {
        errores.push(`Fila ${numero}: duplica la programación de la fila ${previa}.`);
      } else {
        vistos.set(claveDup, numero);
      }
    }

    normalizadas.push({
      idCurso: d.idCurso ?? null,
      claveCurso,
      nombreCurso,
      secuencia: limpio(d.secuencia),
      horario,
      vacantes: d.vacantes,
      docentes: limpio(d.docentes),
      dia,
      horaInicio: inicio,
      horaFin: fin,
      formatoCurso: formato,
      tipoAulaSolicitado: tipoAula,
      facultadPrograma: facultadPrograma ?? "",
      observacionesFacultad: limpio(d.observacionesFacultad),
    });
  });

  if (errores.length > 0) return { ok: false, errores };
  return { ok: true, filas: normalizadas };
}

/** RN-10: capacidad >= vacantes; además aula activa y compatible. */
export function validarAsignaciones(
  filas: { numero: number; idAula: number | null; vacantes: number; tipoAulaSolicitado: string | null }[],
  aulas: Aula[],
): { ok: true } | { ok: false; errores: string[] } {
  const errores: string[] = [];
  const mapa = new Map(aulas.map((a) => [a.id, a]));

  for (const fila of filas) {
    if (fila.idAula == null) continue;
    const aula = mapa.get(fila.idAula);
    if (!aula) {
      errores.push(`Fila ${fila.numero}: el aula seleccionada no existe.`);
      continue;
    }
    if (!aula.activo) {
      errores.push(`Fila ${fila.numero}: el aula ${aula.codigo} está inactiva.`);
    }
    if (aula.capacidad < fila.vacantes) {
      errores.push(
        `Fila ${fila.numero}: el aula ${aula.codigo} tiene capacidad ${aula.capacidad} y se solicitaron ${fila.vacantes} vacantes.`,
      );
    }
    if (fila.tipoAulaSolicitado === "Híbrido" && aula.tipoAula !== "Híbrido") {
      errores.push(`Fila ${fila.numero}: se solicitó aula híbrida y ${aula.codigo} es ${aula.tipoAula}.`);
    }
  }

  return errores.length ? { ok: false, errores } : { ok: true };
}

// ---------------------------------------------------------------------------
// Ventana de solicitudes y estados (RN-06, RN-07, sección 11)
// ---------------------------------------------------------------------------

export type EstadoVentana = "PROXIMA" | "ABIERTA" | "CERRADA";

export function estadoVentana(
  ciclo: Pick<Ciclo, "inicioSolicitudes" | "finSolicitudes">,
  ahora: Date = new Date(),
): EstadoVentana {
  if (ahora < ciclo.inicioSolicitudes) return "PROXIMA";
  if (ahora > ciclo.finSolicitudes) return "CERRADA";
  return "ABIERTA";
}

export const VENTANA_LABEL: Record<EstadoVentana, string> = {
  PROXIMA: "Aún no abre",
  ABIERTA: "Ventana abierta",
  CERRADA: "Ventana cerrada",
};

export const ESTADOS_EDITABLES = ["BORRADOR", "REGISTRADA"] as const;

export function puedeEditarSolicitud(
  ciclo: Pick<Ciclo, "activo" | "inicioSolicitudes" | "finSolicitudes">,
  estado: string,
): { permitido: boolean; motivo?: string } {
  if (!ciclo.activo) return { permitido: false, motivo: "El ciclo no está activo." };
  if (estado === "CERRADA") return { permitido: false, motivo: "La solicitud está cerrada." };
  const ventana = estadoVentana(ciclo);
  if (ventana === "PROXIMA") return { permitido: false, motivo: "La ventana de solicitudes aún no abre." };
  if (ventana === "CERRADA")
    return { permitido: false, motivo: "La ventana de solicitudes está cerrada." };
  // Durante la ventana habilitada, el solicitante puede editar/guardar nuevas versiones.
  return { permitido: true };
}

/** @deprecated usar puedeEditarSolicitud */
export const puedeEditarUnidad = puedeEditarSolicitud;

export function resultado(
  ok: boolean,
  message?: string,
  errores?: string[],
): ActionResult {
  return { ok, message, errores };
}
