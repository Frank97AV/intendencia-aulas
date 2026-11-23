import { getDb } from "@db/index";
import {
  aulas,
  ciclos,
  detalleVersion,
  solicitudes,
  unidades,
  usuarios,
  versiones,
} from "@db/schema";
import { and, asc, desc, eq, inArray, sql } from "drizzle-orm";
import type { AsignacionInput } from "@/lib/types";
import { validarAsignaciones, type FilaNormalizada } from "@/lib/rules";

export class ReglaError extends Error {
  errores: string[];
  constructor(errores: string[]) {
    super(errores.join(" "));
    this.errores = errores;
  }
}

export async function obtenerSolicitudDeUnidad(idUnidad: number, idCiclo: number) {
  const db = await getDb();
  const filas = await db
    .select()
    .from(solicitudes)
    .where(and(eq(solicitudes.idUnidad, idUnidad), eq(solicitudes.idCiclo, idCiclo)))
    .limit(1);
  return filas[0] ?? null;
}

export async function crearSolicitud(idUnidad: number, idCiclo: number) {
  const existente = await obtenerSolicitudDeUnidad(idUnidad, idCiclo);
  if (existente) return existente;

  const db = await getDb();
  try {
    const [creada] = await db
      .insert(solicitudes)
      .values({ idUnidad, idCiclo, estado: "BORRADOR" })
      .returning();
    return creada;
  } catch {
    const reintento = await obtenerSolicitudDeUnidad(idUnidad, idCiclo);
    if (reintento) return reintento;
    throw new Error("No se pudo crear la solicitud.");
  }
}

export async function obtenerSolicitud(idSolicitud: number) {
  const db = await getDb();
  const filas = await db
    .select({
      solicitud: solicitudes,
      unidadNombre: unidades.nombre,
      ciclo: ciclos,
    })
    .from(solicitudes)
    .innerJoin(unidades, eq(solicitudes.idUnidad, unidades.id))
    .innerJoin(ciclos, eq(solicitudes.idCiclo, ciclos.id))
    .where(eq(solicitudes.id, idSolicitud))
    .limit(1);
  return filas[0] ?? null;
}

export async function listarVersiones(idSolicitud: number) {
  const db = await getDb();
  return db
    .select({
      id: versiones.id,
      numeroVersion: versiones.numeroVersion,
      fechaVersion: versiones.fechaVersion,
      observacion: versiones.observacion,
      autorNombre: usuarios.nombre,
      autorCorreo: usuarios.correo,
    })
    .from(versiones)
    .innerJoin(usuarios, eq(versiones.idUsuario, usuarios.id))
    .where(eq(versiones.idSolicitud, idSolicitud))
    .orderBy(desc(versiones.numeroVersion));
}

export async function obtenerVersionVigente(idSolicitud: number) {
  const db = await getDb();
  const filas = await db
    .select({
      id: versiones.id,
      numeroVersion: versiones.numeroVersion,
      fechaVersion: versiones.fechaVersion,
      observacion: versiones.observacion,
      idUsuario: versiones.idUsuario,
      autorNombre: usuarios.nombre,
    })
    .from(versiones)
    .innerJoin(usuarios, eq(versiones.idUsuario, usuarios.id))
    .where(eq(versiones.idSolicitud, idSolicitud))
    .orderBy(desc(versiones.numeroVersion))
    .limit(1);
  return filas[0] ?? null;
}

export async function obtenerVersion(idVersion: number) {
  const db = await getDb();
  const filas = await db
    .select({
      version: versiones,
      solicitud: solicitudes,
      unidadNombre: unidades.nombre,
      cicloNombre: ciclos.nombre,
      autorNombre: usuarios.nombre,
    })
    .from(versiones)
    .innerJoin(solicitudes, eq(versiones.idSolicitud, solicitudes.id))
    .innerJoin(unidades, eq(solicitudes.idUnidad, unidades.id))
    .innerJoin(ciclos, eq(solicitudes.idCiclo, ciclos.id))
    .innerJoin(usuarios, eq(versiones.idUsuario, usuarios.id))
    .where(eq(versiones.id, idVersion))
    .limit(1);
  return filas[0] ?? null;
}

export async function detalleDeVersion(idVersion: number) {
  const db = await getDb();
  return db
    .select({
      idDetalle: detalleVersion.idDetalle,
      idCurso: detalleVersion.idCurso,
      clave: detalleVersion.claveCurso,
      nombreCurso: detalleVersion.nombreCurso,
      secuencia: detalleVersion.secuencia,
      horario: detalleVersion.horario,
      vacantes: detalleVersion.vacantes,
      docentes: detalleVersion.docentes,
      dia: detalleVersion.dia,
      horaInicio: detalleVersion.horaInicio,
      horaFin: detalleVersion.horaFin,
      formatoCurso: detalleVersion.formatoCurso,
      tipoAulaSolicitado: detalleVersion.tipoAulaSolicitado,
      facultadPrograma: detalleVersion.facultadPrograma,
      observacionesFacultad: detalleVersion.observacionesFacultad,
      idAula: detalleVersion.idAula,
      aulaCodigo: aulas.codigo,
      aulaCapacidad: aulas.capacidad,
      observacionesIntendencia: detalleVersion.observacionesIntendencia,
    })
    .from(detalleVersion)
    .leftJoin(aulas, eq(detalleVersion.idAula, aulas.id))
    .where(eq(detalleVersion.idVersion, idVersion))
    .orderBy(asc(detalleVersion.idDetalle));
}

export async function guardarVersion(input: {
  idSolicitud: number;
  idUsuario: number;
  filas: FilaNormalizada[];
  observacion?: string | null;
  estado: string;
}) {
  const db = await getDb();

  return db.transaction(async (tx) => {
    const [fila] = await tx
      .select({ max: sql<number>`coalesce(max(${versiones.numeroVersion}), 0)` })
      .from(versiones)
      .where(eq(versiones.idSolicitud, input.idSolicitud));

    const numero = Number(fila?.max ?? 0) + 1;

    const [version] = await tx
      .insert(versiones)
      .values({
        idSolicitud: input.idSolicitud,
        numeroVersion: numero,
        idUsuario: input.idUsuario,
        observacion: input.observacion ?? null,
      })
      .returning({ id: versiones.id, numeroVersion: versiones.numeroVersion });

    await tx.insert(detalleVersion).values(
      input.filas.map((f) => ({
        idVersion: version.id,
        idCurso: f.idCurso ?? null,
        claveCurso: f.claveCurso,
        nombreCurso: f.nombreCurso ?? null,
        secuencia: f.secuencia,
        horario: f.horario,
        vacantes: f.vacantes,
        docentes: f.docentes,
        dia: f.dia,
        horaInicio: f.horaInicio,
        horaFin: f.horaFin,
        formatoCurso: f.formatoCurso,
        tipoAulaSolicitado: f.tipoAulaSolicitado,
        facultadPrograma: f.facultadPrograma,
        observacionesFacultad: f.observacionesFacultad,
      })),
    );

    await tx
      .update(solicitudes)
      .set({ estado: input.estado, actualizadoEn: new Date() })
      .where(eq(solicitudes.id, input.idSolicitud));

    return { idVersion: version.id, numero: version.numeroVersion };
  });
}

/**
 * Asignación de aulas por Intendencia.
 * Genera una NUEVA versión (no muta la anterior) para preservar RN-08 y
 * registrar autor/fecha del cambio. Si todas las filas quedan con aula,
 * la solicitud pasa a ASIGNADA; si es parcial, permanece EN_REVISION.
 */
export async function asignarAulas(input: {
  idSolicitud: number;
  idUsuario: number;
  asignaciones: AsignacionInput[];
  observacion?: string | null;
}) {
  const db = await getDb();
  const vigente = await obtenerVersionVigente(input.idSolicitud);
  if (!vigente) throw new ReglaError(["La solicitud no tiene una versión para asignar."]);

  const detalles = await detalleDeVersion(vigente.id);
  if (detalles.length === 0) throw new ReglaError(["La versión vigente no tiene filas."]);

  const idsValidos = new Set(detalles.map((d) => d.idDetalle));
  for (const asignacion of input.asignaciones) {
    if (!idsValidos.has(asignacion.idDetalle)) {
      throw new ReglaError(["Una de las filas enviadas no pertenece a la versión vigente."]);
    }
  }

  const mapa = new Map(input.asignaciones.map((a) => [a.idDetalle, a]));
  const filas = detalles.map((d) => {
    const asignacion = mapa.get(d.idDetalle);
    return {
      idCurso: d.idCurso,
      vacantes: d.vacantes,
      tipoAulaSolicitado: d.tipoAulaSolicitado,
      idAula: asignacion ? asignacion.idAula : d.idAula,
      observacionesIntendencia:
        asignacion != null
          ? asignacion.observacionesIntendencia?.trim() || null
          : d.observacionesIntendencia,
      origen: d,
    };
  });

  const aulasDisponibles = await db.select().from(aulas);
  const validacion = validarAsignaciones(
    filas.map((f, i) => ({
      numero: i + 1,
      idAula: f.idAula,
      vacantes: f.vacantes,
      tipoAulaSolicitado: f.tipoAulaSolicitado,
    })),
    aulasDisponibles,
  );
  if (!validacion.ok) throw new ReglaError(validacion.errores);

  const todasAsignadas = filas.every((f) => f.idAula != null);

  return db.transaction(async (tx) => {
    const [fila] = await tx
      .select({ max: sql<number>`coalesce(max(${versiones.numeroVersion}), 0)` })
      .from(versiones)
      .where(eq(versiones.idSolicitud, input.idSolicitud));

    const numero = Number(fila?.max ?? 0) + 1;

    const [version] = await tx
      .insert(versiones)
      .values({
        idSolicitud: input.idSolicitud,
        numeroVersion: numero,
        idUsuario: input.idUsuario,
        observacion: input.observacion?.trim() || "Asignación de aulas por Intendencia",
      })
      .returning({ id: versiones.id, numeroVersion: versiones.numeroVersion });

    await tx.insert(detalleVersion).values(
      filas.map((f) => ({
        idVersion: version.id,
        idCurso: f.origen.idCurso,
        claveCurso: f.origen.clave,
        nombreCurso: f.origen.nombreCurso ?? null,
        secuencia: f.origen.secuencia,
        horario: f.origen.horario,
        vacantes: f.origen.vacantes,
        docentes: f.origen.docentes,
        dia: f.origen.dia,
        horaInicio: f.origen.horaInicio,
        horaFin: f.origen.horaFin,
        formatoCurso: f.origen.formatoCurso,
        tipoAulaSolicitado: f.origen.tipoAulaSolicitado,
        facultadPrograma: f.origen.facultadPrograma,
        observacionesFacultad: f.origen.observacionesFacultad,
        idAula: f.idAula,
        observacionesIntendencia: f.observacionesIntendencia,
      })),
    );

    await tx
      .update(solicitudes)
      .set({ estado: todasAsignadas ? "ASIGNADA" : "EN_REVISION", actualizadoEn: new Date() })
      .where(eq(solicitudes.id, input.idSolicitud));

    return { idVersion: version.id, numero: version.numeroVersion, todasAsignadas };
  });
}

export async function cambiarEstadoSolicitud(idSolicitud: number, estado: string) {
  const db = await getDb();
  await db
    .update(solicitudes)
    .set({ estado, actualizadoEn: new Date() })
    .where(eq(solicitudes.id, idSolicitud));
}

export type ResumenBandeja = {
  idSolicitud: number;
  unidadNombre: string;
  cicloNombre: string;
  estado: string;
  actualizadoEn: Date;
  versionVigente: number | null;
  fechaVersion: Date | null;
  autor: string | null;
  filas: number;
  asignadas: number;
  vacantes: number;
};

export async function bandejaSolicitudes(cicloId?: number | null): Promise<ResumenBandeja[]> {
  const db = await getDb();
  const lista = await db
    .select({
      idSolicitud: solicitudes.id,
      unidadNombre: unidades.nombre,
      cicloNombre: ciclos.nombre,
      estado: solicitudes.estado,
      actualizadoEn: solicitudes.actualizadoEn,
      cicloId: ciclos.id,
    })
    .from(solicitudes)
    .innerJoin(unidades, eq(solicitudes.idUnidad, unidades.id))
    .innerJoin(ciclos, eq(solicitudes.idCiclo, ciclos.id))
    .orderBy(desc(solicitudes.actualizadoEn));

  const filtradas = cicloId ? lista.filter((l) => l.cicloId === cicloId) : lista;
  if (filtradas.length === 0) return [];

  const ids = filtradas.map((l) => l.idSolicitud);
  const todasVersiones = await db
    .select({
      id: versiones.id,
      idSolicitud: versiones.idSolicitud,
      numeroVersion: versiones.numeroVersion,
      fechaVersion: versiones.fechaVersion,
      autor: usuarios.nombre,
    })
    .from(versiones)
    .innerJoin(usuarios, eq(versiones.idUsuario, usuarios.id))
    .where(inArray(versiones.idSolicitud, ids))
    .orderBy(desc(versiones.numeroVersion));

  const ultimaPorSolicitud = new Map<number, (typeof todasVersiones)[number]>();
  for (const v of todasVersiones) {
    if (!ultimaPorSolicitud.has(v.idSolicitud)) ultimaPorSolicitud.set(v.idSolicitud, v);
  }

  const idsVersion = [...ultimaPorSolicitud.values()].map((v) => v.id);
  const conteos = idsVersion.length
    ? await db
        .select({
          idVersion: detalleVersion.idVersion,
          filas: sql<number>`count(*)`,
          asignadas: sql<number>`count(${detalleVersion.idAula})`,
          vacantes: sql<number>`coalesce(sum(${detalleVersion.vacantes}), 0)`,
        })
        .from(detalleVersion)
        .where(inArray(detalleVersion.idVersion, idsVersion))
        .groupBy(detalleVersion.idVersion)
    : [];

  const mapaConteos = new Map(conteos.map((c) => [c.idVersion, c]));

  return filtradas.map((s) => {
    const ultima = ultimaPorSolicitud.get(s.idSolicitud);
    const conteo = ultima ? mapaConteos.get(ultima.id) : undefined;
    return {
      idSolicitud: s.idSolicitud,
      unidadNombre: s.unidadNombre,
      cicloNombre: s.cicloNombre,
      estado: s.estado,
      actualizadoEn: s.actualizadoEn,
      versionVigente: ultima?.numeroVersion ?? null,
      fechaVersion: ultima?.fechaVersion ?? null,
      autor: ultima?.autor ?? null,
      filas: Number(conteo?.filas ?? 0),
      asignadas: Number(conteo?.asignadas ?? 0),
      vacantes: Number(conteo?.vacantes ?? 0),
    };
  });
}

export async function solicitudesDeUnidad(idUnidad: number) {
  const db = await getDb();
  const lista = await db
    .select({
      idSolicitud: solicitudes.id,
      cicloNombre: ciclos.nombre,
      cicloId: ciclos.id,
      estado: solicitudes.estado,
      actualizadoEn: solicitudes.actualizadoEn,
      actual: ciclos.activo,
    })
    .from(solicitudes)
    .innerJoin(ciclos, eq(solicitudes.idCiclo, ciclos.id))
    .where(eq(solicitudes.idUnidad, idUnidad))
    .orderBy(desc(ciclos.nombre));

  const ids = lista.map((l) => l.idSolicitud);
  if (ids.length === 0) return lista.map((l) => ({ ...l, versiones: 0, filas: 0 }));

  const vs = await db
    .select({
      idSolicitud: versiones.idSolicitud,
      n: sql<number>`count(*)`,
    })
    .from(versiones)
    .where(inArray(versiones.idSolicitud, ids))
    .groupBy(versiones.idSolicitud);

  const counts = await db
    .select({
      idSolicitud: versiones.idSolicitud,
      filas: sql<number>`count(${detalleVersion.idDetalle})`,
    })
    .from(versiones)
    .leftJoin(detalleVersion, eq(detalleVersion.idVersion, versiones.id))
    .where(inArray(versiones.idSolicitud, ids))
    .groupBy(versiones.idSolicitud);

  const mapaVs = new Map(vs.map((v) => [v.idSolicitud, Number(v.n)]));
  const mapaFilas = new Map(counts.map((c) => [c.idSolicitud, Number(c.filas)]));

  return lista.map((l) => ({
    ...l,
    versiones: mapaVs.get(l.idSolicitud) ?? 0,
    filas: mapaFilas.get(l.idSolicitud) ?? 0,
  }));
}
