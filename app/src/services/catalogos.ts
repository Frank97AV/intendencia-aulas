import { getDb } from "@db/index";
import { aulas, ciclos, cursos, unidades, usuarios } from "@db/schema";
import { and, asc, eq } from "drizzle-orm";

export async function listarUnidades() {
  const db = await getDb();
  return db.select().from(unidades).orderBy(asc(unidades.nombre));
}

export async function listarCursos() {
  const db = await getDb();
  return db
    .select({
      id: cursos.id,
      clave: cursos.clave,
      nombreCurso: cursos.nombreCurso,
      idUnidad: cursos.idUnidad,
      activo: cursos.activo,
      unidadNombre: unidades.nombre,
    })
    .from(cursos)
    .leftJoin(unidades, eq(cursos.idUnidad, unidades.id))
    .orderBy(asc(cursos.clave));
}

export async function listarAulas() {
  const db = await getDb();
  return db.select().from(aulas).orderBy(asc(aulas.codigo));
}

export async function listarCiclos() {
  const db = await getDb();
  return db.select().from(ciclos).orderBy(asc(ciclos.nombre));
}

export async function cicloActivo() {
  const db = await getDb();
  const filas = await db.select().from(ciclos).where(eq(ciclos.activo, true)).limit(1);
  return filas[0] ?? null;
}

export async function obtenerCiclo(id: number) {
  const db = await getDb();
  const filas = await db.select().from(ciclos).where(eq(ciclos.id, id)).limit(1);
  return filas[0] ?? null;
}

export async function listarUsuarios() {
  const db = await getDb();
  return db
    .select({
      id: usuarios.id,
      correo: usuarios.correo,
      nombre: usuarios.nombre,
      rol: usuarios.rol,
      autorizado: usuarios.autorizado,
      activo: usuarios.activo,
      idUnidad: usuarios.idUnidad,
      unidadNombre: unidades.nombre,
    })
    .from(usuarios)
    .leftJoin(unidades, eq(usuarios.idUnidad, unidades.id))
    .orderBy(asc(usuarios.nombre));
}

export async function obtenerUsuarioPorId(id: number) {
  const db = await getDb();
  const filas = await db.select().from(usuarios).where(eq(usuarios.id, id)).limit(1);
  return filas[0] ?? null;
}

export async function crearCiclo(input: {
  nombre: string;
  fechaInicio: string;
  fechaFin: string;
  inicioSolicitudes: Date;
  finSolicitudes: Date;
}) {
  const db = await getDb();
  const [creado] = await db.insert(ciclos).values({ ...input, activo: false }).returning();
  return creado;
}

export async function activarCiclo(id: number) {
  const db = await getDb();
  return db.transaction(async (tx) => {
    await tx.update(ciclos).set({ activo: false }).where(eq(ciclos.activo, true));
    await tx.update(ciclos).set({ activo: true }).where(eq(ciclos.id, id));
  });
}

export async function desactivarCiclo(id: number) {
  const db = await getDb();
  await db.update(ciclos).set({ activo: false }).where(eq(ciclos.id, id));
}

export async function crearCurso(input: {
  clave: string;
  nombreCurso: string;
  idUnidad: number | null;
}) {
  const db = await getDb();
  const [creado] = await db.insert(cursos).values({ ...input, activo: true }).returning();
  return creado;
}

export async function cambiarEstadoCurso(id: number, activo: boolean) {
  const db = await getDb();
  await db.update(cursos).set({ activo }).where(eq(cursos.id, id));
}

export async function crearAula(input: {
  codigo: string;
  capacidad: number;
  tipoAula: string;
}) {
  const db = await getDb();
  const [creada] = await db.insert(aulas).values({ ...input, activo: true }).returning();
  return creada;
}

export async function cambiarEstadoAula(id: number, activo: boolean) {
  const db = await getDb();
  await db.update(aulas).set({ activo }).where(eq(aulas.id, id));
}

export async function actualizarUsuario(
  id: number,
  input: { autorizado: boolean; rol: string; idUnidad: number | null },
) {
  const db = await getDb();
  await db.update(usuarios).set(input).where(eq(usuarios.id, id));
}

export async function cursosDeUnidad(idUnidad: number | null) {
  const db = await getDb();
  if (idUnidad == null) {
    return db.select().from(cursos).where(eq(cursos.activo, true)).orderBy(asc(cursos.clave));
  }
  return db
    .select()
    .from(cursos)
    .where(and(eq(cursos.activo, true), eq(cursos.idUnidad, idUnidad)))
    .orderBy(asc(cursos.clave));
}
