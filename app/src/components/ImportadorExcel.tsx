"use client";

import { guardarProgramacionAccion } from "@/app/actions";
import type { ActionResult, FilaInput } from "@/lib/types";
import { DIAS, FORMATOS, TIPOS_AULA } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState, useTransition } from "react";

type FilaPreview = {
  key: string;
  numero: number;
  clave: string;
  nombreCurso: string;
  horario: string;
  dia: string;
  horaInicio: string;
  horaFin: string;
  vacantes: number;
  formato: string;
  tipoAula: string;
  errores: string[];
  fila: FilaInput | null;
};

const ALIAS: Record<string, string[]> = {
  clave: ["clave_curso", "clave", "curso", "codigo_curso", "codigo"],
  nombreCurso: ["nombre_curso", "nombre", "curso_nombre"],
  secuencia: ["secuencia", "sec", "nro_secuencia"],
  horario: ["horario", "grupo", "seccion"],
  vacantes: ["vacantes", "vacante", "alumnos", "cupos"],
  docentes: ["docentes", "docente", "profesor", "profesores"],
  dia: ["dia", "dias"],
  horaInicio: ["hora_inicio", "inicio", "hora_de_inicio"],
  horaFin: ["hora_fin", "fin", "hora_de_fin"],
  formato: ["formato_curso", "formato"],
  tipoAula: ["tipo_aula_solicitado", "tipo_aula", "aula_solicitada"],
  facultad: ["facultad_programa", "facultad", "programa", "unidad"],
  observaciones: ["observaciones_facultad", "observaciones", "requerimientos"],
};

function normalizarClave(valor: string): string {
  return valor
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

function texto(valor: unknown): string {
  if (valor == null) return "";
  return String(valor).trim();
}

function horaExcel(valor: unknown): string {
  if (typeof valor === "number" && Number.isFinite(valor)) {
    const totalMin = Math.round((valor % 1) * 24 * 60);
    const h = Math.floor(totalMin / 60) % 24;
    const m = totalMin % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  }
  const s = texto(valor);
  const m = s.match(/^(\d{1,2}):(\d{2})/);
  if (m) return `${m[1].padStart(2, "0")}:${m[2]}`;
  return s;
}

function normalizarDia(valor: string): string | null {
  const n = normalizarClave(valor);
  const mapa: Record<string, string> = {
    lun: "LUN", lunes: "LUN",
    mar: "MAR", martes: "MAR",
    mie: "MIE", mier: "MIE", miercoles: "MIE", mi_rcoles: "MIE",
    jue: "JUE", juev: "JUE", jueves: "JUE",
    vie: "VIE", vier: "VIE", viernes: "VIE",
    sab: "SAB", sabado: "SAB", s_bado: "SAB",
  };
  if (mapa[n]) return mapa[n];
  const pref3 = n.slice(0, 3).toUpperCase();
  const porPrefijo: Record<string, string> = { LUN: "LUN", MAR: "MAR", MIE: "MIE", JUE: "JUE", VIE: "VIE", SAB: "SAB" };
  if (porPrefijo[pref3]) return porPrefijo[pref3];
  return DIAS.find((d) => d === valor.toUpperCase().trim()) ?? null;
}

function formatoValido(valor: string): string | null {
  const n = normalizarClave(valor);
  return FORMATOS.find((f) => normalizarClave(f) === n) ?? null;
}

function tipoValido(valor: string): string | null {
  const n = normalizarClave(valor);
  if (n === "hibrida" || n === "hibrido") return "Híbrido";
  return TIPOS_AULA.find((t) => normalizarClave(t) === n) ?? null;
}

export function ImportadorExcel({
  puedeEditar,
  motivoBloqueo,
}: {
  puedeEditar: boolean;
  motivoBloqueo?: string;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [pendiente, startTransition] = useTransition();
  const [archivo, setArchivo] = useState<string | null>(null);
  const [filas, setFilas] = useState<FilaPreview[]>([]);
  const [errorGlobal, setErrorGlobal] = useState<string | null>(null);
  const [resultado, setResultado] = useState<ActionResult | null>(null);

  const totalErrores = filas.filter((f) => f.errores.length > 0).length;
  const validas = useMemo(() => filas.filter((f) => f.errores.length === 0 && f.fila), [filas]);

  async function procesar(file: File) {
    setResultado(null);
    setErrorGlobal(null);
    setFilas([]);
    setArchivo(file.name);

    try {
      const XLSX = await import("xlsx");
      const buffer = await file.arrayBuffer();
      const libro = XLSX.read(buffer, { type: "array" });
      const hoja = libro.Sheets[libro.SheetNames[0]];
      if (!hoja) {
        setErrorGlobal("El archivo no contiene hojas legibles.");
        return;
      }
      const crudas = XLSX.utils.sheet_to_json<Record<string, unknown>>(hoja, { defval: "" });
      if (crudas.length === 0) {
        setErrorGlobal("El archivo no contiene filas de datos.");
        return;
      }
      if (crudas.length > 200) {
        setErrorGlobal("El archivo supera el máximo de 200 filas por importación.");
        return;
      }

      const primera = crudas[0];
      const columnas = new Map<string, string>();
      for (const key of Object.keys(primera)) {
        const norm = normalizarClave(key);
        for (const [campo, alias] of Object.entries(ALIAS)) {
          if (alias.includes(norm)) columnas.set(campo, key);
        }
      }

      if (!columnas.has("clave")) {
        setErrorGlobal(
          "No se encontró la columna 'clave_curso'. Descarga la plantilla oficial para asegurar los encabezados.",
        );
        return;
      }

      const leidas: FilaPreview[] = crudas.map((cruda, indice) => {
        const valor = (campo: string) => (columnas.has(campo) ? cruda[columnas.get(campo)!] : undefined);
        const clave = texto(valor("clave")).toUpperCase();
        const nombreCurso = texto(valor("nombreCurso"));
        const errores: string[] = [];

        if (!clave) errores.push("Falta la clave del curso.");

        const horario = texto(valor("horario")).toUpperCase();
        if (horario.length < 3) errores.push("El horario debe tener al menos 3 caracteres.");

        const vacantesNum = Number(valor("vacantes"));
        const vacantes = Number.isFinite(vacantesNum) ? Math.trunc(vacantesNum) : 0;
        if (!Number.isInteger(vacantes) || vacantes < 1) {
          errores.push("Las vacantes deben ser un entero mayor o igual a 1.");
        }

        const diaTexto = texto(valor("dia"));
        const dia = diaTexto ? normalizarDia(diaTexto) : null;
        if (diaTexto && !dia) errores.push(`El día "${diaTexto}" no es válido. Use LUN, MAR, MIE, JUE, VIE o SAB.`);

        const inicio = horaExcel(valor("horaInicio"));
        const fin = horaExcel(valor("horaFin"));
        if (inicio && !/^([01]\d|2[0-3]):[0-5]\d$/.test(inicio)) {
          errores.push("La hora de inicio no tiene formato HH:mm (24 horas).");
        }
        if (fin && !/^([01]\d|2[0-3]):[0-5]\d$/.test(fin)) {
          errores.push("La hora de fin no tiene formato HH:mm (24 horas).");
        }
        if (inicio && fin && fin <= inicio) {
          errores.push("La hora de fin debe ser posterior a la hora de inicio.");
        }

        const formatoTexto = texto(valor("formato"));
        const formato = formatoTexto ? formatoValido(formatoTexto) : null;
        if (formatoTexto && !formato) errores.push(`El formato "${formatoTexto}" no es válido.`);

        const tipoTexto = texto(valor("tipoAula"));
        const tipoAula = tipoTexto ? tipoValido(tipoTexto) : null;
        if (tipoTexto && !tipoAula) errores.push(`El tipo de aula "${tipoTexto}" no es válido.`);

        const facultadPrograma = texto(valor("facultad"));
        if (!facultadPrograma) errores.push("La facultad/programa es obligatoria.");

        const fila: FilaInput | null =
          errores.length === 0
            ? {
                claveCurso: clave,
                nombreCurso: nombreCurso || null,
                secuencia: texto(valor("secuencia")) || null,
                horario,
                vacantes,
                docentes: texto(valor("docentes")) || null,
                dia,
                horaInicio: inicio || null,
                horaFin: fin || null,
                formatoCurso: formato,
                tipoAulaSolicitado: tipoAula,
                facultadPrograma,
                observacionesFacultad: texto(valor("observaciones")) || null,
              }
            : null;

        return {
          key: `${indice}-${clave}`,
          numero: indice + 1,
          clave,
          nombreCurso: nombreCurso || "—",
          horario,
          dia: dia ?? diaTexto,
          horaInicio: inicio,
          horaFin: fin,
          vacantes,
          formato: formato ?? formatoTexto,
          tipoAula: tipoAula ?? tipoTexto,
          errores,
          fila,
        };
      });

      setFilas(leidas);
    } catch {
      setErrorGlobal("No se pudo leer el archivo. Verifique que sea un Excel .xlsx o .xls válido.");
    }
  }

  function reiniciar() {
    setResultado(null);
    setErrorGlobal(null);
    setFilas([]);
    setArchivo(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  function confirmar() {
    if (!validas.length || totalErrores > 0) return;
    setResultado(null);
    startTransition(async () => {
      const r = await guardarProgramacionAccion(
        validas.map((v) => v.fila!),
        `Importación Excel: ${archivo ?? "archivo"}`,
      );
      setResultado(r);
      if (r.ok) {
        router.push("/solicitante/solicitud");
        router.refresh();
      }
    });
  }

  return (
    <div className="space-y-5">
      {!puedeEditar ? (
        <div role="status" className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <p className="font-semibold">Importación bloqueada</p>
          <p className="mt-0.5">{motivoBloqueo ?? "La solicitud no admite cambios en este momento."}</p>
        </div>
      ) : null}

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-slate-900">1. Selecciona el archivo</h2>
            <p className="mt-1 max-w-xl text-sm text-slate-600">
              Formato Excel (.xlsx / .xls) con los encabezados de la plantilla oficial. Se permite un máximo de 200 filas.
              Nada se guarda hasta que confirmes la vista previa.
            </p>
          </div>
          <a
            href="/api/plantilla"
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            Descargar plantilla
          </a>
        </div>

        <div className="mt-4">
          <input
            ref={inputRef}
            type="file"
            accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
            disabled={!puedeEditar || pendiente}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void procesar(file);
            }}
            className="block w-full cursor-pointer rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-600 file:mr-4 file:rounded-md file:border-0 file:bg-brand-700 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-brand-900"
          />
          {archivo ? <p className="mt-2 text-xs text-slate-500">Archivo: {archivo}</p> : null}
        </div>
      </div>

      {errorGlobal ? (
        <div role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">
          <p>{errorGlobal}</p>
          <div className="mt-3 flex gap-2">
            <button type="button" onClick={reiniciar} className="rounded-md border border-rose-300 bg-white px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50">Reintentar</button>
            <button type="button" onClick={() => router.push("/solicitante/solicitud")} className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">Cancelar importación</button>
          </div>
        </div>
      ) : null}

      {resultado ? (
        <div
          role={resultado.ok ? "status" : "alert"}
          className={`rounded-lg border px-4 py-3 text-sm ${
            resultado.ok
              ? "border-emerald-200 bg-emerald-50 text-emerald-900"
              : "border-rose-200 bg-rose-50 text-rose-900"
          }`}
        >
          <p className="font-semibold">{resultado.message}</p>
          {resultado.errores?.length ? (
            <ul className="mt-2 list-disc space-y-0.5 pl-5 text-xs">
              {resultado.errores.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}

      {filas.length > 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
            <div>
              <h2 className="text-base font-semibold text-slate-900">2. Vista previa</h2>
              <p className="mt-0.5 text-sm text-slate-600">
                {filas.length} filas leídas · <strong>{validas.length} válidas</strong>
                {totalErrores > 0 ? <span className="text-rose-700"> · {totalErrores} con errores</span> : null}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {totalErrores > 0 ? (
                <>
                  <button
                    type="button"
                    onClick={reiniciar}
                    className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                  >
                    Reintentar
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push("/solicitante/solicitud")}
                    className="rounded-lg border border-rose-200 bg-white px-4 py-2 text-sm font-semibold text-rose-700 shadow-sm transition hover:bg-rose-50"
                  >
                    Cancelar importación
                  </button>
                </>
              ) : null}
              <button
                type="button"
                onClick={confirmar}
                disabled={!puedeEditar || pendiente || totalErrores > 0 || validas.length === 0}
                className="rounded-lg bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-900 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {pendiente ? "Aplicando…" : `Confirmar e importar ${validas.length} filas`}
              </button>
            </div>
          </div>

          <div className="tabla-scroll">
            <table className="w-full min-w-[980px] border-collapse text-left text-xs">
              <thead className="bg-slate-50 uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-3 py-2 font-semibold">#</th>
                  <th className="px-3 py-2 font-semibold">Clave</th>
                  <th className="px-3 py-2 font-semibold">Curso</th>
                  <th className="px-3 py-2 font-semibold">Horario</th>
                  <th className="px-3 py-2 font-semibold">Día</th>
                  <th className="px-3 py-2 font-semibold">Horas</th>
                  <th className="px-3 py-2 font-semibold">Vacantes</th>
                  <th className="px-3 py-2 font-semibold">Formato</th>
                  <th className="px-3 py-2 font-semibold">Tipo aula</th>
                  <th className="px-3 py-2 font-semibold">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filas.slice(0, 60).map((f) => (
                  <tr key={f.key} className={f.errores.length ? "bg-rose-50/50" : "hover:bg-slate-50"}>
                    <td className="px-3 py-2 text-slate-400">{f.numero}</td>
                    <td className="px-3 py-2 font-semibold text-slate-700">{f.clave || "—"}</td>
                    <td className="px-3 py-2 text-slate-700">{f.nombreCurso}</td>
                    <td className="px-3 py-2">{f.horario || "—"}</td>
                    <td className="px-3 py-2">{f.dia || "—"}</td>
                    <td className="px-3 py-2">
                      {f.horaInicio || "—"} – {f.horaFin || "—"}
                    </td>
                    <td className="px-3 py-2">{f.vacantes || "—"}</td>
                    <td className="px-3 py-2">{f.formato || "—"}</td>
                    <td className="px-3 py-2">{f.tipoAula || "—"}</td>
                    <td className="px-3 py-2">
                      {f.errores.length === 0 ? (
                        <span className="rounded-full bg-emerald-50 px-2 py-0.5 font-semibold text-emerald-700">Válida</span>
                      ) : (
                        <ul className="list-disc space-y-0.5 pl-4 text-rose-700">
                          {f.errores.map((e) => (
                            <li key={e}>{e}</li>
                          ))}
                        </ul>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filas.length > 60 ? (
            <p className="border-t border-slate-100 px-5 py-3 text-xs text-slate-500">
              Mostrando las primeras 60 filas de {filas.length}.
            </p>
          ) : null}
          {totalErrores > 0 ? (
            <p className="border-t border-rose-100 bg-rose-50 px-5 py-3 text-xs text-rose-800">
              Corrige todas las filas con error en el archivo y vuelve a cargarlo. No se aplicará una importación parcial.
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
