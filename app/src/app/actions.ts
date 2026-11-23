"use server";

import { getDb } from "@db/index";
import { usuarios } from "@db/schema";
import { homeForRol, requireRole } from "@/lib/auth";
import { puedeEditarSolicitud, resultado, validarFilas } from "@/lib/rules";
import { cerrarSesion, crearSesion } from "@/lib/session";
import type { ActionResult, FilaInput, Rol } from "@/lib/types";
import { TIPOS_AULA } from "@/lib/types";
import {
  actualizarUsuario,
  activarCiclo,
  cambiarEstadoAula,
  cambiarEstadoCurso,
  cicloActivo,
  crearAula,
  crearCiclo,
  crearCurso,
  desactivarCiclo,
  obtenerCiclo,
} from "@/services/catalogos";
import {
  cambiarEstadoSolicitud,
  crearSolicitud,
  guardarVersion,
  obtenerSolicitudDeUnidad,
} from "@/services/solicitudes";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";

function urlMensaje(path: string, tipo: "ok" | "error", texto: string) {
  const sep = path.includes("?") ? "&" : "?";
  return `${path}${sep}${tipo}=${encodeURIComponent(texto)}`;
}

function revalidarTodo() {
  revalidatePath("/solicitante");
  revalidatePath("/solicitante/solicitud");
  revalidatePath("/solicitante/importar");
  revalidatePath("/solicitante/versiones");
  revalidatePath("/admin");
  revalidatePath("/admin/solicitudes");
  revalidatePath("/admin/metricas");
}

// ---------------------------------------------------------------------------
// Sesión simulada
// ---------------------------------------------------------------------------

export async function iniciarSesionDemo(formData: FormData) {
  const id = Number(formData.get("idUsuario"));
  if (!Number.isInteger(id)) redirect("/login?error=Usuario%20inv%C3%A1lido");

  const db = await getDb();
  const filas = await db.select().from(usuarios).where(eq(usuarios.id, id)).limit(1);
  const usuario = filas[0];

  if (!usuario) redirect("/login?error=Usuario%20no%20encontrado");
  if (!usuario.autorizado) redirect("/login?error=Su%20acceso%20est%C3%A1%20pendiente%20de%20autorizaci%C3%B3n");
  if (!usuario.activo) redirect("/login?error=Su%20cuenta%20est%C3%A1%20inactiva");

  await crearSesion(usuario.id);
  redirect(homeForRol(usuario.rol as Rol));
}

export async function salir() {
  await cerrarSesion();
  redirect("/login");
}

// ---------------------------------------------------------------------------
// Solicitante: programación y versionado
// ---------------------------------------------------------------------------

export async function guardarProgramacionAccion(
  filas: FilaInput[],
  observacion: string,
): Promise<ActionResult> {
  const usuario = await requireRole(["SOLICITANTE"]);
  if (!usuario.idUnidad) {
    return resultado(false, "Su usuario no tiene una unidad académica asignada. Contacte al administrador.");
  }

  const ciclo = await cicloActivo();
  if (!ciclo) return resultado(false, "No existe un ciclo académico activo.");

  const solicitudExistente = await obtenerSolicitudDeUnidad(usuario.idUnidad, ciclo.id);
  const estado = solicitudExistente?.estado ?? "BORRADOR";

  const permiso = puedeEditarSolicitud(ciclo, estado);
  if (!permiso.permitido) return resultado(false, permiso.motivo);

  const validacion = validarFilas(filas);
  if (!validacion.ok) {
    return resultado(false, "Revise los datos ingresados.", validacion.errores);
  }

  const solicitud = solicitudExistente ?? (await crearSolicitud(usuario.idUnidad, ciclo.id));

  const guardada = await guardarVersion({
    idSolicitud: solicitud.id,
    idUsuario: usuario.idUsuario,
    filas: validacion.filas,
    observacion: observacion?.trim() || null,
    estado: "REGISTRADA",
  });

  revalidarTodo();
  return resultado(
    true,
    `Versión ${guardada.numero} guardada correctamente (${validacion.filas.length} filas).`,
  );
}

// ---------------------------------------------------------------------------
// Administración: ciclos
// ---------------------------------------------------------------------------

export async function crearCicloAccion(formData: FormData) {
  await requireRole(["ADMIN"]);

  const nombre = String(formData.get("nombre") ?? "").trim();
  const fechaInicio = String(formData.get("fechaInicio") ?? "");
  const fechaFin = String(formData.get("fechaFin") ?? "");
  const inicioSolicitudes = String(formData.get("inicioSolicitudes") ?? "");
  const finSolicitudes = String(formData.get("finSolicitudes") ?? "");

  if (!nombre || !fechaInicio || !fechaFin || !inicioSolicitudes || !finSolicitudes) {
    redirect(urlMensaje("/admin/ciclos", "error", "Todos los campos del ciclo son obligatorios."));
  }
  if (fechaFin < fechaInicio) {
    redirect(urlMensaje("/admin/ciclos", "error", "La fecha de fin no puede ser anterior al inicio."));
  }

  const inicio = new Date(`${inicioSolicitudes}:00-05:00`);
  const fin = new Date(`${finSolicitudes}:00-05:00`);
  if (Number.isNaN(inicio.getTime()) || Number.isNaN(fin.getTime())) {
    redirect(urlMensaje("/admin/ciclos", "error", "Las fechas de la ventana no son válidas."));
  }
  if (fin < inicio) {
    redirect(
      urlMensaje("/admin/ciclos", "error", "La ventana de solicitudes no puede cerrar antes de abrir."),
    );
  }

  try {
    await crearCiclo({ nombre, fechaInicio, fechaFin, inicioSolicitudes: inicio, finSolicitudes: fin });
  } catch {
    redirect(urlMensaje("/admin/ciclos", "error", "No se pudo crear el ciclo (verifique el nombre único)."));
  }

  revalidatePath("/admin/ciclos");
  revalidatePath("/admin");
  redirect(urlMensaje("/admin/ciclos", "ok", "Ciclo creado correctamente."));
}

export async function activarCicloAccion(formData: FormData) {
  await requireRole(["ADMIN"]);
  const id = Number(formData.get("idCiclo"));
  const ciclo = await obtenerCiclo(id);
  if (!ciclo) redirect(urlMensaje("/admin/ciclos", "error", "Ciclo no encontrado."));

  await activarCiclo(id);
  revalidarTodo();
  redirect(urlMensaje("/admin/ciclos", "ok", `Ciclo ${ciclo.nombre} activado.`));
}

export async function desactivarCicloAccion(formData: FormData) {
  await requireRole(["ADMIN"]);
  const id = Number(formData.get("idCiclo"));
  await desactivarCiclo(id);
  revalidarTodo();
  redirect(urlMensaje("/admin/ciclos", "ok", "Ciclo desactivado."));
}

// ---------------------------------------------------------------------------
// Administración: cursos y aulas
// ---------------------------------------------------------------------------

export async function crearCursoAccion(formData: FormData) {
  await requireRole(["ADMIN"]);
  const clave = String(formData.get("clave") ?? "").trim().toUpperCase();
  const nombreCurso = String(formData.get("nombreCurso") ?? "").trim();
  const idUnidadRaw = String(formData.get("idUnidad") ?? "");
  const idUnidad = idUnidadRaw ? Number(idUnidadRaw) : null;

  if (!clave || !nombreCurso) {
    redirect(urlMensaje("/admin/cursos", "error", "Clave y nombre del curso son obligatorios."));
  }

  try {
    await crearCurso({ clave, nombreCurso, idUnidad });
  } catch {
    redirect(urlMensaje("/admin/cursos", "error", "No se pudo crear el curso (clave duplicada)."));
  }

  revalidatePath("/admin/cursos");
  redirect(urlMensaje("/admin/cursos", "ok", `Curso ${clave} creado.`));
}

export async function toggleCursoAccion(formData: FormData) {
  await requireRole(["ADMIN"]);
  const id = Number(formData.get("idCurso"));
  const activo = String(formData.get("activo")) === "true";
  await cambiarEstadoCurso(id, activo);
  revalidatePath("/admin/cursos");
  redirect(urlMensaje("/admin/cursos", "ok", "Estado del curso actualizado."));
}

export async function crearAulaAccion(formData: FormData) {
  await requireRole(["ADMIN"]);
  const codigo = String(formData.get("codigo") ?? "").trim().toUpperCase();
  const capacidad = Number(formData.get("capacidad"));
  const tipoAula = String(formData.get("tipoAula") ?? "");
  const destino = "/admin/aulas";

  if (!codigo || !Number.isInteger(capacidad) || capacidad < 0) {
    redirect(urlMensaje(destino, "error", "Código y capacidad válida son obligatorios."));
  }
  if (!(TIPOS_AULA as readonly string[]).includes(tipoAula)) {
    redirect(urlMensaje(destino, "error", "Tipo de aula no válido."));
  }

  try {
    await crearAula({ codigo, capacidad, tipoAula });
  } catch {
    redirect(urlMensaje(destino, "error", "No se pudo crear el aula (código duplicado)."));
  }

  revalidatePath(destino);
  redirect(urlMensaje(destino, "ok", `Aula ${codigo} creada.`));
}

export async function toggleAulaAccion(formData: FormData) {
  await requireRole(["ADMIN"]);
  const id = Number(formData.get("idAula"));
  const activo = String(formData.get("activo")) === "true";
  const destino = "/admin/aulas";
  await cambiarEstadoAula(id, activo);
  revalidatePath(destino);
  redirect(urlMensaje(destino, "ok", "Estado del aula actualizado."));
}

// ---------------------------------------------------------------------------
// Administración: usuarios
// ---------------------------------------------------------------------------

export async function actualizarUsuarioAccion(formData: FormData) {
  await requireRole(["ADMIN"]);
  const id = Number(formData.get("idUsuario"));
  const rol = String(formData.get("rol") ?? "");
  const idUnidadRaw = String(formData.get("idUnidad") ?? "");
  const idUnidad = idUnidadRaw ? Number(idUnidadRaw) : null;
  const autorizado = String(formData.get("autorizado")) === "on";

  if (!["ADMIN", "SOLICITANTE"].includes(rol)) {
    redirect(urlMensaje("/admin/usuarios", "error", "Rol no válido."));
  }

  await actualizarUsuario(id, { autorizado, rol, idUnidad });
  revalidatePath("/admin/usuarios");
  revalidatePath("/admin");
  redirect(urlMensaje("/admin/usuarios", "ok", "Usuario actualizado."));
}

// ---------------------------------------------------------------------------
// Administración: mantenimiento de solicitudes
// ---------------------------------------------------------------------------

export async function cambiarEstadoSolicitudAccion(formData: FormData) {
  await requireRole(["ADMIN"]);
  const idSolicitud = Number(formData.get("idSolicitud"));
  const estado = String(formData.get("estado"));
  const destino = `/admin/solicitudes/${idSolicitud}`;

  if (!["BORRADOR", "REGISTRADA", "CERRADA"].includes(estado)) {
    redirect(urlMensaje(destino, "error", "Estado no permitido."));
  }

  await cambiarEstadoSolicitud(idSolicitud, estado);
  revalidarTodo();
  redirect(urlMensaje(destino, "ok", "Estado de la solicitud actualizado."));
}
