import { getDb } from "@db/index";
import { unidades, usuarios } from "@db/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { createHmac } from "node:crypto";
import type { Rol } from "./types";

const COOKIE = "intendencia_sesion";
const SECRET = process.env.SESSION_SECRET ?? "demo-intendencia-aulas-secret";

export type UsuarioSesion = {
  idUsuario: number;
  correo: string;
  nombre: string;
  rol: Rol;
  idUnidad: number | null;
  unidadNombre: string | null;
};

function firmar(payload: string) {
  return createHmac("sha256", SECRET).update(payload).digest("base64url");
}

function tokenValido(raw: string | undefined): number | null {
  if (!raw) return null;
  const [payload, firma] = raw.split(".");
  if (!payload || !firma) return null;
  if (firmar(payload) !== firma) return null;
  const id = Number(payload);
  return Number.isInteger(id) && id > 0 ? id : null;
}

/** Login simulado: crea la cookie de sesión firmada (httpOnly). */
export async function crearSesion(idUsuario: number) {
  const store = await cookies();
  store.set(COOKIE, `${idUsuario}.${firmar(String(idUsuario))}`, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
}

export async function cerrarSesion() {
  const store = await cookies();
  store.delete(COOKIE);
}

/**
 * Devuelve el usuario autenticado y autorizado.
 * La identidad (Google, aquí simulada) no reemplaza la autorización local.
 */
export async function getSessionUser(): Promise<UsuarioSesion | null> {
  const store = await cookies();
  const id = tokenValido(store.get(COOKIE)?.value);
  if (!id) return null;

  const db = await getDb();
  const filas = await db
    .select({
      idUsuario: usuarios.id,
      correo: usuarios.correo,
      nombre: usuarios.nombre,
      rol: usuarios.rol,
      idUnidad: usuarios.idUnidad,
      autorizado: usuarios.autorizado,
      activo: usuarios.activo,
      unidadNombre: unidades.nombre,
    })
    .from(usuarios)
    .leftJoin(unidades, eq(usuarios.idUnidad, unidades.id))
    .where(eq(usuarios.id, id))
    .limit(1);

  const u = filas[0];
  if (!u || !u.autorizado || !u.activo) return null;

  return {
    idUsuario: u.idUsuario,
    correo: u.correo,
    nombre: u.nombre,
    rol: u.rol as Rol,
    idUnidad: u.idUnidad,
    unidadNombre: u.unidadNombre,
  };
}
