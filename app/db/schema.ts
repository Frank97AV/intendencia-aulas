import {
  bigint,
  bigserial,
  boolean,
  date,
  index,
  integer,
  pgTable,
  text,
  time,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * Espejo en Drizzle del modelo físico de 8 tablas definido en
 * "Documentación Integral de Intendencia de Aulas" (sección 7, 8 y Anexo A).
 *
 * Ajustes MVP documentados en memory/decisiones.md:
 *  - timestamptz en lugar de timestamp
 *  - CHECK de rol y estado
 *  - un solo ciclo activo (índice único parcial)
 *  - correo Google único sin distinguir mayúsculas
 */
export const unidades = pgTable("unidades_academicas", {
  id: bigserial("id_unidad", { mode: "number" }).primaryKey(),
  nombre: varchar("nombre", { length: 150 }).notNull(),
  activo: boolean("activo").notNull().default(true),
});

export const usuarios = pgTable(
  "usuarios",
  {
    id: bigserial("id_usuario", { mode: "number" }).primaryKey(),
    correo: varchar("correo_google", { length: 255 }).notNull(),
    nombre: varchar("nombre", { length: 180 }).notNull(),
    idUnidad: bigint("id_unidad", { mode: "number" }),
    rol: varchar("rol", { length: 30 }).notNull(),
    autorizado: boolean("autorizado").notNull().default(false),
    activo: boolean("activo").notNull().default(true),
  },
  (t) => [uniqueIndex("ux_usuarios_correo").on(t.correo)],
);

export const ciclos = pgTable("ciclos", {
  id: bigserial("id_ciclo", { mode: "number" }).primaryKey(),
  nombre: varchar("nombre", { length: 100 }).notNull(),
  fechaInicio: date("fecha_inicio").notNull(),
  fechaFin: date("fecha_fin").notNull(),
  inicioSolicitudes: timestamp("inicio_solicitudes", { withTimezone: true }).notNull(),
  finSolicitudes: timestamp("fin_solicitudes", { withTimezone: true }).notNull(),
  activo: boolean("activo").notNull().default(false),
});

export const cursos = pgTable("cursos", {
  id: bigserial("id_curso", { mode: "number" }).primaryKey(),
  clave: varchar("clave", { length: 50 }).notNull(),
  nombreCurso: varchar("nombre_curso", { length: 250 }).notNull(),
  idUnidad: bigint("id_unidad", { mode: "number" }),
  activo: boolean("activo").notNull().default(true),
});

export const aulas = pgTable("aulas", {
  id: bigserial("id_aula", { mode: "number" }).primaryKey(),
  codigo: varchar("codigo", { length: 50 }).notNull(),
  capacidad: integer("capacidad").notNull(),
  tipoAula: varchar("tipo_aula", { length: 30 }).notNull(),
  activo: boolean("activo").notNull().default(true),
});

export const solicitudes = pgTable(
  "solicitudes",
  {
    id: bigserial("id_solicitud", { mode: "number" }).primaryKey(),
    idUnidad: bigint("id_unidad", { mode: "number" }).notNull(),
    idCiclo: bigint("id_ciclo", { mode: "number" }).notNull(),
    estado: varchar("estado", { length: 30 }).notNull(),
    fechaCreacion: timestamp("fecha_creacion", { withTimezone: true }).notNull().defaultNow(),
    actualizadoEn: timestamp("actualizado_en", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("ix_solicitudes_ciclo_unidad").on(t.idCiclo, t.idUnidad)],
);

export const versiones = pgTable(
  "versiones",
  {
    id: bigserial("id_version", { mode: "number" }).primaryKey(),
    idSolicitud: bigint("id_solicitud", { mode: "number" }).notNull(),
    numeroVersion: integer("numero_version").notNull(),
    idUsuario: bigint("id_usuario", { mode: "number" }).notNull(),
    fechaVersion: timestamp("fecha_version", { withTimezone: true }).notNull().defaultNow(),
    observacion: text("observacion"),
  },
  (t) => [index("ix_versiones_solicitud_numero").on(t.idSolicitud, t.numeroVersion)],
);

export const detalleVersion = pgTable(
  "detalle_version",
  {
    idDetalle: bigserial("id_detalle", { mode: "number" }).primaryKey(),
    idVersion: bigint("id_version", { mode: "number" }).notNull(),
    idCurso: bigint("id_curso", { mode: "number" }),
    claveCurso: varchar("clave_curso", { length: 50 }).notNull(),
    nombreCurso: varchar("nombre_curso", { length: 200 }),
    secuencia: varchar("secuencia", { length: 30 }),
    horario: varchar("horario", { length: 50 }),
    vacantes: integer("vacantes").notNull(),
    docentes: text("docentes"),
    dia: varchar("dia", { length: 20 }),
    horaInicio: time("hora_inicio"),
    horaFin: time("hora_fin"),
    formatoCurso: varchar("formato_curso", { length: 30 }),
    tipoAulaSolicitado: varchar("tipo_aula_solicitado", { length: 30 }),
    facultadPrograma: varchar("facultad_programa", { length: 180 }),
    observacionesFacultad: text("observaciones_facultad"),
    idAula: bigint("id_aula", { mode: "number" }),
    observacionesIntendencia: text("observaciones_intendencia"),
  },
  (t) => [index("ix_detalle_version").on(t.idVersion)],
);

export type Unidad = typeof unidades.$inferSelect;
export type Usuario = typeof usuarios.$inferSelect;
export type Ciclo = typeof ciclos.$inferSelect;
export type Curso = typeof cursos.$inferSelect;
export type Aula = typeof aulas.$inferSelect;
export type Solicitud = typeof solicitudes.$inferSelect;
export type Version = typeof versiones.$inferSelect;
export type DetalleVersion = typeof detalleVersion.$inferSelect;
