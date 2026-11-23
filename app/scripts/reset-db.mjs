import fs from "node:fs";
import path from "node:path";

const destino = process.env.PGLITE_DATA_DIR || path.join(process.cwd(), "db", "pglite-data");

if (!destino.includes("pglite-data") && !process.env.PGLITE_DATA_DIR) {
  console.error("Ruta de datos inesperada. Abortando por seguridad:", destino);
  process.exit(1);
}

fs.rmSync(destino, { recursive: true, force: true });
console.log(`[intendencia] Base de datos eliminada: ${destino}`);
console.log("[intendencia] Al iniciar la app se recreará el esquema y los datos demo.");
