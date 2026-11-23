import { redirect } from "next/navigation";
import { getSessionUser, type UsuarioSesion } from "./session";
import type { Rol } from "./types";

export function homeForRol(rol: Rol): string {
  if (rol === "ADMIN") return "/admin";
  return "/solicitante";
}

export async function requireUser(): Promise<UsuarioSesion> {
  const usuario = await getSessionUser();
  if (!usuario) redirect("/login");
  return usuario;
}

export async function requireRole(roles: Rol[]): Promise<UsuarioSesion> {
  const usuario = await requireUser();
  if (!roles.includes(usuario.rol)) redirect(homeForRol(usuario.rol));
  return usuario;
}
