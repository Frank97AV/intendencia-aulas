import { aulas, ciclos, cursos, detalleVersion, solicitudes, unidades, usuarios, versiones } from "./schema";
import type { PgliteDatabase } from "drizzle-orm/pglite";
import type * as schema from "./schema";

type Database = PgliteDatabase<typeof schema>;

type FilaSeed = {
  idCurso?: number | null;
  claveCurso: string;
  nombreCurso?: string | null;
  secuencia?: string | null;
  horario: string;
  vacantes: number;
  docentes: string;
  dia: string;
  horaInicio: string;
  horaFin: string;
  formatoCurso: string;
  tipoAulaSolicitado: string;
  facultadPrograma: string;
  observacionesFacultad?: string;
  idAula?: number | null;
  observacionesIntendencia?: string | null;
};

/**
 * Datos DEMO (temporales). Viven aislados en este archivo y pueden
 * reemplazarse por datos institucionales sin tocar el dominio.
 */
export async function seed(db: Database) {
  const existentes = await db.select({ id: unidades.id }).from(unidades).limit(1);
  if (existentes.length > 0) return;

  const [uSistemas, uNegocios, uDerecho, uMedicina] = await db
    .insert(unidades)
    .values([
      { nombre: "Ingeniería de Sistemas" },
      { nombre: "Administración de Empresas" },
      { nombre: "Derecho" },
      { nombre: "Medicina Humana" },
    ])
    .returning({ id: unidades.id });

  const usuariosSeed = await db
    .insert(usuarios)
    .values([
      {
        correo: "admin@demo.edu.pe",
        nombre: "Alicia Ramos (Administradora)",
        rol: "ADMIN",
        autorizado: true,
      },
      {
        correo: "sistemas@demo.edu.pe",
        nombre: "Carla Mendoza (Solicitante)",
        idUnidad: uSistemas.id,
        rol: "SOLICITANTE",
        autorizado: true,
      },
      {
        correo: "negocios@demo.edu.pe",
        nombre: "Diego Huamán (Solicitante)",
        idUnidad: uNegocios.id,
        rol: "SOLICITANTE",
        autorizado: true,
      },
      {
        correo: "derecho@demo.edu.pe",
        nombre: "Lucía Torres (Solicitante)",
        idUnidad: uDerecho.id,
        rol: "SOLICITANTE",
        autorizado: true,
      },
      {
        correo: "nuevo@demo.edu.pe",
        nombre: "Elena Quispe (nueva usuaria)",
        idUnidad: uSistemas.id,
        rol: "SOLICITANTE",
        autorizado: false,
      },
    ])
    .returning({ id: usuarios.id, correo: usuarios.correo });

  const idUsuario = (correo: string) => usuariosSeed.find((u) => u.correo === correo)!.id;

  const [cicloAnterior, cicloActual] = await db
    .insert(ciclos)
    .values([
      {
        nombre: "2026-I",
        fechaInicio: "2026-03-02",
        fechaFin: "2026-07-17",
        inicioSolicitudes: new Date("2026-01-15T08:00:00-05:00"),
        finSolicitudes: new Date("2026-02-20T23:59:00-05:00"),
        activo: false,
      },
      {
        nombre: "2026-II",
        fechaInicio: "2026-08-03",
        fechaFin: "2026-12-18",
        inicioSolicitudes: new Date("2026-11-01T08:00:00-05:00"),
        finSolicitudes: new Date("2026-12-15T23:59:00-05:00"),
        activo: true,
      },
    ])
    .returning({ id: ciclos.id });

  const cursosSeed = await db
    .insert(cursos)
    .values([
      { clave: "IS-101", nombreCurso: "Introducción a la Ingeniería de Sistemas", idUnidad: uSistemas.id },
      { clave: "IS-201", nombreCurso: "Estructuras de Datos", idUnidad: uSistemas.id },
      { clave: "IS-301", nombreCurso: "Base de Datos", idUnidad: uSistemas.id },
      { clave: "IS-401", nombreCurso: "Ingeniería de Software", idUnidad: uSistemas.id },
      { clave: "IS-501", nombreCurso: "Redes de Computadoras", idUnidad: uSistemas.id },
      { clave: "AD-101", nombreCurso: "Fundamentos de Administración", idUnidad: uNegocios.id },
      { clave: "AD-201", nombreCurso: "Contabilidad General", idUnidad: uNegocios.id },
      { clave: "AD-301", nombreCurso: "Marketing Estratégico", idUnidad: uNegocios.id },
      { clave: "AD-401", nombreCurso: "Gestión de Operaciones", idUnidad: uNegocios.id },
      { clave: "AD-501", nombreCurso: "Finanzas Corporativas", idUnidad: uNegocios.id },
      { clave: "DE-101", nombreCurso: "Introducción al Derecho", idUnidad: uDerecho.id },
      { clave: "DE-201", nombreCurso: "Derecho Civil", idUnidad: uDerecho.id },
      { clave: "DE-301", nombreCurso: "Derecho Penal", idUnidad: uDerecho.id },
      { clave: "DE-401", nombreCurso: "Derecho Laboral", idUnidad: uDerecho.id },
      { clave: "DE-501", nombreCurso: "Derecho Constitucional", idUnidad: uDerecho.id },
      { clave: "ME-101", nombreCurso: "Anatomía Humana", idUnidad: uMedicina.id },
      { clave: "ME-201", nombreCurso: "Fisiología", idUnidad: uMedicina.id },
      { clave: "ME-301", nombreCurso: "Farmacología", idUnidad: uMedicina.id },
      { clave: "ME-401", nombreCurso: "Semiología Médica", idUnidad: uMedicina.id },
      { clave: "ME-501", nombreCurso: "Salud Pública", idUnidad: uMedicina.id },
    ])
    .returning({ id: cursos.id, clave: cursos.clave });

  const idCurso = (clave: string) => cursosSeed.find((c) => c.clave === clave)?.id ?? null;

  await db.insert(aulas).values([
    { codigo: "A-101", capacidad: 40, tipoAula: "Normal" },
    { codigo: "A-102", capacidad: 45, tipoAula: "Normal" },
    { codigo: "A-103", capacidad: 35, tipoAula: "Normal" },
    { codigo: "B-201", capacidad: 50, tipoAula: "Híbrido" },
    { codigo: "B-202", capacidad: 50, tipoAula: "Híbrido" },
    { codigo: "C-301", capacidad: 60, tipoAula: "Normal" },
    { codigo: "C-302", capacidad: 30, tipoAula: "Normal" },
    { codigo: "LAB-1", capacidad: 25, tipoAula: "Híbrido" },
    { codigo: "LAB-2", capacidad: 25, tipoAula: "Híbrido" },
    { codigo: "AUD-1", capacidad: 120, tipoAula: "Normal" },
  ]);

  const filasBase: FilaSeed[] = [
    { idCurso: idCurso("AD-101"), claveCurso: "AD-101", nombreCurso: "Fundamentos de Administración", secuencia: "01", horario: "G01", vacantes: 35, docentes: "María López", dia: "LUN", horaInicio: "08:00", horaFin: "10:00", formatoCurso: "Presencial", tipoAulaSolicitado: "Normal", facultadPrograma: "Administración de Empresas", observacionesFacultad: "Proyector" },
    { idCurso: idCurso("AD-201"), claveCurso: "AD-201", nombreCurso: "Contabilidad General", secuencia: "01", horario: "G01", vacantes: 40, docentes: "Carlos Ruiz", dia: "MAR", horaInicio: "10:00", horaFin: "12:00", formatoCurso: "Presencial", tipoAulaSolicitado: "Normal", facultadPrograma: "Administración de Empresas" },
    { idCurso: idCurso("AD-301"), claveCurso: "AD-301", nombreCurso: "Marketing Estratégico", secuencia: "02", horario: "G02", vacantes: 45, docentes: "Ana Torres", dia: "MIE", horaInicio: "08:00", horaFin: "10:00", formatoCurso: "Semipresencial", tipoAulaSolicitado: "Híbrido", facultadPrograma: "Administración de Empresas" },
  ];

  const [solicitudDemo] = await db
    .insert(solicitudes)
    .values({
      idUnidad: uNegocios.id,
      idCiclo: cicloActual.id,
      estado: "REGISTRADA",
      fechaCreacion: new Date("2026-11-04T09:20:00-05:00"),
      actualizadoEn: new Date("2026-11-05T10:00:00-05:00"),
    })
    .returning({ id: solicitudes.id });

  const [v1] = await db
    .insert(versiones)
    .values({
      idSolicitud: solicitudDemo.id,
      numeroVersion: 1,
      idUsuario: idUsuario("negocios@demo.edu.pe"),
      fechaVersion: new Date("2026-11-04T09:25:00-05:00"),
      observacion: "Programación de inicio 2026-II",
    })
    .returning({ id: versiones.id });

  await db.insert(detalleVersion).values(
    filasBase.map((f) => ({
      idVersion: v1.id,
      idCurso: f.idCurso ?? null,
      claveCurso: f.claveCurso,
      nombreCurso: f.nombreCurso ?? null,
      secuencia: f.secuencia ?? null,
      horario: f.horario,
      vacantes: f.vacantes,
      docentes: f.docentes,
      dia: f.dia,
      horaInicio: f.horaInicio,
      horaFin: f.horaFin,
      formatoCurso: f.formatoCurso,
      tipoAulaSolicitado: f.tipoAulaSolicitado,
      facultadPrograma: f.facultadPrograma,
      observacionesFacultad: f.observacionesFacultad ?? null,
    })),
  );

  const [v2] = await db
    .insert(versiones)
    .values({
      idSolicitud: solicitudDemo.id,
      numeroVersion: 2,
      idUsuario: idUsuario("negocios@demo.edu.pe"),
      fechaVersion: new Date("2026-11-05T10:00:00-05:00"),
      observacion: "Actualización de vacantes y secuencia",
    })
    .returning({ id: versiones.id });

  await db.insert(detalleVersion).values(
    filasBase.map((f, i) => ({
      idVersion: v2.id,
      idCurso: f.idCurso ?? null,
      claveCurso: f.claveCurso,
      nombreCurso: f.nombreCurso ?? null,
      secuencia: f.secuencia ?? null,
      horario: f.horario,
      vacantes: i === 1 ? 42 : f.vacantes,
      docentes: f.docentes,
      dia: f.dia,
      horaInicio: f.horaInicio,
      horaFin: f.horaFin,
      formatoCurso: f.formatoCurso,
      tipoAulaSolicitado: f.tipoAulaSolicitado,
      facultadPrograma: f.facultadPrograma,
      observacionesFacultad: f.observacionesFacultad ?? null,
    })),
  );

  // Histórica
  const [solHist] = await db
    .insert(solicitudes)
    .values({
      idUnidad: uNegocios.id,
      idCiclo: cicloAnterior.id,
      estado: "CERRADA",
      fechaCreacion: new Date("2026-01-20T11:00:00-05:00"),
      actualizadoEn: new Date("2026-02-25T17:00:00-05:00"),
    })
    .returning({ id: solicitudes.id });
  const [vHist] = await db
    .insert(versiones)
    .values({
      idSolicitud: solHist.id,
      numeroVersion: 1,
      idUsuario: idUsuario("negocios@demo.edu.pe"),
      fechaVersion: new Date("2026-01-20T11:10:00-05:00"),
      observacion: "Programación de inicio 2026-I (histórica)",
    })
    .returning({ id: versiones.id });
  await db.insert(detalleVersion).values({
    idVersion: vHist.id,
    idCurso: idCurso("AD-201"),
    claveCurso: "AD-201",
    nombreCurso: "Contabilidad General",
    secuencia: "01",
    horario: "G01",
    vacantes: 35,
    docentes: "Carlos Ruiz",
    dia: "LUN",
    horaInicio: "08:00",
    horaFin: "10:00",
    formatoCurso: "Presencial",
    tipoAulaSolicitado: "Normal",
    facultadPrograma: "Administración de Empresas",
  });
}
