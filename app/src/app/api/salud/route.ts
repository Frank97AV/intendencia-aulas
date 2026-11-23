import { getDb } from "@db/index";
import { usuarios } from "@db/schema";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = await getDb();
    const filas = await db.select({ id: usuarios.id }).from(usuarios).limit(1);
    return Response.json({
      ok: true,
      baseDatos: "PGlite (PostgreSQL embebido)",
      usuarios: filas.length > 0 ? "con datos" : "vacía",
      fecha: new Date().toISOString(),
    });
  } catch (error) {
    return Response.json(
      { ok: false, error: error instanceof Error ? error.message : "Error desconocido" },
      { status: 500 },
    );
  }
}
