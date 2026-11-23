import { PGlite } from "@electric-sql/pglite";
import { drizzle, type PgliteDatabase } from "drizzle-orm/pglite";
import fs from "node:fs";
import path from "node:path";
import * as schema from "./schema";

type Database = PgliteDatabase<typeof schema>;

type GlobalDb = {
  __intendenciaPglite?: PGlite;
  __intendenciaDb?: Database;
  __intendenciaInit?: Promise<void>;
};

const globalForDb = globalThis as unknown as GlobalDb;

function dataDir() {
  return process.env.PGLITE_DATA_DIR || path.join(process.cwd(), "db", "pglite-data");
}

function migrationSql() {
  const file = path.join(process.cwd(), "db", "migrations", "0000_init.sql");
  return fs.readFileSync(file, "utf8");
}

async function bootstrap(client: PGlite, database: Database) {
  await client.exec(migrationSql());
  const { seed } = await import("./seed");
  await seed(database);
}

/**
 * Devuelve la instancia única de base de datos.
 * PGlite es PostgreSQL compilado a WASM: mismo dialecto, cero instalación.
 * La primera llamada aplica la migración y los datos demo (idempotente).
 */
export async function getDb(): Promise<Database> {
  if (!globalForDb.__intendenciaPglite) {
    globalForDb.__intendenciaPglite = new PGlite(dataDir());
    globalForDb.__intendenciaDb = drizzle(globalForDb.__intendenciaPglite, { schema });
  }

  if (!globalForDb.__intendenciaInit) {
    globalForDb.__intendenciaInit = bootstrap(
      globalForDb.__intendenciaPglite,
      globalForDb.__intendenciaDb!,
    ).catch((error) => {
      globalForDb.__intendenciaInit = undefined;
      console.error("[intendencia] Error inicializando la base de datos", error);
      throw error;
    });
  }

  await globalForDb.__intendenciaInit;
  return globalForDb.__intendenciaDb!;
}

export { schema };
