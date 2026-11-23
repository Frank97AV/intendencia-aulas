import { getDb } from "@db/index";
import {
  aulas,
  cursos,
  detalleVersion,
  solicitudes,
  unidades,
  usuarios,
  versiones,
} from "@db/schema";
import { eq } from "drizzle-orm";

export type Metricas = {
  totalSolicitudes: number;
  porEstado: Record<string, number>;
  totalVersiones: number;
  totalFilas: number;
  totalAsignadas: number;
  totalVacantes: number;
  aulasActivas: number;
  aulasTotal: number;
  cursosActivos: number;
  usuariosPendientes: number;
  porUnidad: {
    unidad: string;
    solicitudes: number;
    filas: number;
    asignadas: number;
    vacantes: number;
  }[];
};

export async function metricasGenerales(): Promise<Metricas> {
  const db = await getDb();

  const sol = await db
    .select({
      id: solicitudes.id,
      estado: solicitudes.estado,
      unidad: unidades.nombre,
    })
    .from(solicitudes)
    .innerJoin(unidades, eq(solicitudes.idUnidad, unidades.id));

  const ver = await db
    .select({
      id: versiones.id,
      idSolicitud: versiones.idSolicitud,
      numero: versiones.numeroVersion,
    })
    .from(versiones);

  const det = await db
    .select({
      idVersion: detalleVersion.idVersion,
      idAula: detalleVersion.idAula,
      vacantes: detalleVersion.vacantes,
    })
    .from(detalleVersion);

  const au = await db.select({ activo: aulas.activo }).from(aulas);
  const cu = await db.select({ activo: cursos.activo }).from(cursos);
  const us = await db.select({ autorizado: usuarios.autorizado }).from(usuarios);

  const numeroVigente = new Map<number, { id: number; numero: number }>();
  for (const v of ver) {
    const actual = numeroVigente.get(v.idSolicitud);
    if (!actual || v.numero > actual.numero) {
      numeroVigente.set(v.idSolicitud, { id: v.id, numero: v.numero });
    }
  }

  const detallesPorVersion = new Map<number, typeof det>();
  for (const d of det) {
    const lista = detallesPorVersion.get(d.idVersion) ?? [];
    lista.push(d);
    detallesPorVersion.set(d.idVersion, lista);
  }

  const porEstado: Record<string, number> = {};
  const porUnidadMap = new Map<string, Metricas["porUnidad"][number]>();

  for (const s of sol) {
    porEstado[s.estado] = (porEstado[s.estado] ?? 0) + 1;

    const acumulado =
      porUnidadMap.get(s.unidad) ?? {
        unidad: s.unidad,
        solicitudes: 0,
        filas: 0,
        asignadas: 0,
        vacantes: 0,
      };
    acumulado.solicitudes += 1;

    const vigente = numeroVigente.get(s.id);
    const filas = vigente ? detallesPorVersion.get(vigente.id) ?? [] : [];
    acumulado.filas += filas.length;
    acumulado.asignadas += filas.filter((f) => f.idAula != null).length;
    acumulado.vacantes += filas.reduce((acc, f) => acc + Number(f.vacantes ?? 0), 0);

    porUnidadMap.set(s.unidad, acumulado);
  }

  return {
    totalSolicitudes: sol.length,
    porEstado,
    totalVersiones: ver.length,
    totalFilas: det.length,
    totalAsignadas: det.filter((d) => d.idAula != null).length,
    totalVacantes: det.reduce((acc, d) => acc + Number(d.vacantes ?? 0), 0),
    aulasActivas: au.filter((a) => a.activo).length,
    aulasTotal: au.length,
    cursosActivos: cu.filter((c) => c.activo).length,
    usuariosPendientes: us.filter((u) => !u.autorizado).length,
    porUnidad: [...porUnidadMap.values()].sort((a, b) => a.unidad.localeCompare(b.unidad)),
  };
}
