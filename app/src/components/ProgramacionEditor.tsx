"use client";

import { guardarProgramacionAccion } from "@/app/actions";
import type { ActionResult, FilaInput } from "@/lib/types";
import { DIAS, FORMATOS, TIPOS_AULA } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";

type FilaEditor = {
  key: string;
  claveCurso: string;
  nombreCurso: string;
  secuencia: string;
  horario: string;
  vacantes: number;
  docentes: string;
  dia: string;
  horaInicio: string;
  horaFin: string;
  formatoCurso: string;
  tipoAulaSolicitado: string;
  facultadPrograma: string;
  observacionesFacultad: string;
};

function nuevaFila(): FilaEditor {
  return {
    key: crypto.randomUUID(),
    claveCurso: "",
    nombreCurso: "",
    secuencia: "",
    horario: "G01",
    vacantes: 30,
    docentes: "",
    dia: "LUN",
    horaInicio: "08:00",
    horaFin: "10:00",
    formatoCurso: "Presencial",
    tipoAulaSolicitado: "Normal",
    facultadPrograma: "",
    observacionesFacultad: "",
  };
}

function mapearFilas(filas: FilaInput[]): FilaEditor[] {
  return filas.map((f) => ({
    key: crypto.randomUUID(),
    claveCurso: f.claveCurso ?? "",
    nombreCurso: f.nombreCurso ?? "",
    secuencia: f.secuencia ?? "",
    horario: f.horario ?? "",
    vacantes: f.vacantes,
    docentes: f.docentes ?? "",
    dia: f.dia ?? "",
    horaInicio: f.horaInicio?.slice(0, 5) ?? "",
    horaFin: f.horaFin?.slice(0, 5) ?? "",
    formatoCurso: f.formatoCurso ?? "",
    tipoAulaSolicitado: f.tipoAulaSolicitado ?? "",
    facultadPrograma: f.facultadPrograma ?? "",
    observacionesFacultad: f.observacionesFacultad ?? "",
  }));
}

const celda =
  "w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100";

export function ProgramacionEditor({
  filasIniciales,
  puedeEditar,
  motivoBloqueo,
}: {
  filasIniciales: FilaInput[];
  puedeEditar: boolean;
  motivoBloqueo?: string;
}) {
  const router = useRouter();
  const [pendiente, startTransition] = useTransition();
  const [filas, setFilas] = useState<FilaEditor[]>(() => mapearFilas(filasIniciales));
  const [observacion, setObservacion] = useState("");
  const [resultado, setResultado] = useState<ActionResult | null>(null);

  const firmaServidor = useMemo(() => JSON.stringify(filasIniciales), [filasIniciales]);
  const firmaAplicada = useRef(firmaServidor);
  useEffect(() => {
    if (firmaAplicada.current === firmaServidor) return;
    firmaAplicada.current = firmaServidor;
    setFilas(mapearFilas(filasIniciales));
  }, [firmaServidor, filasIniciales]);

  const totalVacantes = useMemo(
    () => filas.reduce((acc, f) => acc + (Number.isFinite(f.vacantes) ? f.vacantes : 0), 0),
    [filas],
  );

  function actualizar<K extends keyof FilaEditor>(key: string, campo: K, valor: FilaEditor[K]) {
    setFilas((prev) => prev.map((f) => (f.key === key ? { ...f, [campo]: valor } : f)));
  }

  function agregar() {
    setFilas((prev) => [...prev, nuevaFila()]);
  }

  function eliminar(key: string) {
    setFilas((prev) => prev.filter((f) => f.key !== key));
  }

  function guardar() {
    setResultado(null);
    const payload: FilaInput[] = filas.map((f) => ({
      claveCurso: f.claveCurso,
      nombreCurso: f.nombreCurso || null,
      secuencia: f.secuencia || null,
      horario: f.horario || null,
      vacantes: f.vacantes,
      docentes: f.docentes || null,
      dia: f.dia || null,
      horaInicio: f.horaInicio || null,
      horaFin: f.horaFin || null,
      formatoCurso: f.formatoCurso || null,
      tipoAulaSolicitado: f.tipoAulaSolicitado || null,
      facultadPrograma: f.facultadPrograma || null,
      observacionesFacultad: f.observacionesFacultad || null,
    }));

    startTransition(async () => {
      const r = await guardarProgramacionAccion(payload, observacion);
      setResultado(r);
      if (r.ok) {
        setObservacion("");
        router.refresh();
      }
    });
  }

  return (
    <div className="space-y-4">
      {!puedeEditar ? (
        <div role="status" className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <p className="font-semibold">Edición bloqueada</p>
          <p className="mt-0.5">{motivoBloqueo ?? "La solicitud no admite cambios en este momento."}</p>
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

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
          <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold">{filas.length} filas</span>
          <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold">
            {totalVacantes} vacantes solicitadas
          </span>
          <span className="text-slate-500">
            Al guardar se crea una <strong>versión nueva e inmutable</strong>.
          </span>
        </div>
        <button
          type="button"
          onClick={agregar}
          disabled={!puedeEditar || pendiente}
          className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          + Agregar fila
        </button>
      </div>

      <div className="tabla-scroll rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[1420px] border-collapse text-left">
          <thead className="bg-slate-50 text-[10px] uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-2 py-2 font-semibold">#</th>
              <th className="px-2 py-2 font-semibold">Clave curso</th>
              <th className="px-2 py-2 font-semibold">Nombre curso</th>
              <th className="px-2 py-2 font-semibold">Horario</th>
              <th className="px-2 py-2 font-semibold">Vacantes</th>
              <th className="px-2 py-2 font-semibold">Docente(s)</th>
              <th className="px-2 py-2 font-semibold">Secuencia</th>
              <th className="px-2 py-2 font-semibold">Día</th>
              <th className="px-2 py-2 font-semibold">Inicio</th>
              <th className="px-2 py-2 font-semibold">Fin</th>
              <th className="px-2 py-2 font-semibold">Formato</th>
              <th className="px-2 py-2 font-semibold">Tipo aula</th>
              <th className="px-2 py-2 font-semibold">Facultad / Programa</th>
              <th className="px-2 py-2 font-semibold">Observaciones</th>
              <th className="px-2 py-2" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filas.length === 0 ? (
              <tr>
                <td colSpan={15} className="px-4 py-10 text-center text-sm text-slate-500">
                  Aún no hay filas. Agrega una manualmente o importa un Excel.
                </td>
              </tr>
            ) : null}

            {filas.map((fila, indice) => (
              <tr key={fila.key} className="align-middle hover:bg-slate-50/60">
                <td className="px-2 py-1.5 text-xs font-semibold text-slate-400">{indice + 1}</td>
                <td className="px-2 py-1.5">
                  <input
                    aria-label={`Clave de curso de la fila ${indice + 1}`}
                    className={`${celda} w-28`}
                    value={fila.claveCurso}
                    disabled={!puedeEditar || pendiente}
                    onChange={(e) => actualizar(fila.key, "claveCurso", e.target.value.toUpperCase())}
                    placeholder="IS-101"
                  />
                </td>
                <td className="min-w-[170px] px-2 py-1.5">
                  <input
                    aria-label={`Nombre del curso de la fila ${indice + 1}`}
                    className={celda}
                    value={fila.nombreCurso}
                    disabled={!puedeEditar || pendiente}
                    onChange={(e) => actualizar(fila.key, "nombreCurso", e.target.value)}
                    placeholder="Nombre del curso"
                  />
                </td>
                <td className="px-2 py-1.5">
                  <input
                    aria-label={`Horario de la fila ${indice + 1}`}
                    className={`${celda} w-20`}
                    value={fila.horario}
                    disabled={!puedeEditar || pendiente}
                    onChange={(e) => actualizar(fila.key, "horario", e.target.value.toUpperCase())}
                    placeholder="G01"
                    minLength={3}
                  />
                </td>
                <td className="px-2 py-1.5">
                  <input
                    type="number"
                    min={1}
                    aria-label={`Vacantes de la fila ${indice + 1}`}
                    className={`${celda} w-20`}
                    value={fila.vacantes}
                    disabled={!puedeEditar || pendiente}
                    onChange={(e) => actualizar(fila.key, "vacantes", Number(e.target.value))}
                  />
                </td>
                <td className="min-w-[150px] px-2 py-1.5">
                  <input
                    aria-label={`Docentes de la fila ${indice + 1}`}
                    className={celda}
                    value={fila.docentes}
                    disabled={!puedeEditar || pendiente}
                    onChange={(e) => actualizar(fila.key, "docentes", e.target.value)}
                  />
                </td>
                <td className="px-2 py-1.5">
                  <input
                    aria-label={`Secuencia de la fila ${indice + 1}`}
                    className={`${celda} w-20`}
                    value={fila.secuencia}
                    disabled={!puedeEditar || pendiente}
                    onChange={(e) => actualizar(fila.key, "secuencia", e.target.value)}
                    placeholder="01"
                  />
                </td>
                <td className="px-2 py-1.5">
                  <select
                    aria-label={`Día de la fila ${indice + 1}`}
                    className={`${celda} w-24`}
                    value={fila.dia}
                    disabled={!puedeEditar || pendiente}
                    onChange={(e) => actualizar(fila.key, "dia", e.target.value)}
                  >
                    <option value="">—</option>
                    {DIAS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-2 py-1.5">
                  <input
                    type="time"
                    aria-label={`Hora de inicio de la fila ${indice + 1}`}
                    className={`${celda} w-[92px]`}
                    value={fila.horaInicio}
                    disabled={!puedeEditar || pendiente}
                    onChange={(e) => actualizar(fila.key, "horaInicio", e.target.value)}
                  />
                </td>
                <td className="px-2 py-1.5">
                  <input
                    type="time"
                    aria-label={`Hora de fin de la fila ${indice + 1}`}
                    className={`${celda} w-[92px]`}
                    value={fila.horaFin}
                    disabled={!puedeEditar || pendiente}
                    onChange={(e) => actualizar(fila.key, "horaFin", e.target.value)}
                  />
                </td>
                <td className="px-2 py-1.5">
                  <select
                    aria-label={`Formato de la fila ${indice + 1}`}
                    className={`${celda} w-32`}
                    value={fila.formatoCurso}
                    disabled={!puedeEditar || pendiente}
                    onChange={(e) => actualizar(fila.key, "formatoCurso", e.target.value)}
                  >
                    <option value="">—</option>
                    {FORMATOS.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-2 py-1.5">
                  <select
                    aria-label={`Tipo de aula solicitada en la fila ${indice + 1}`}
                    className={`${celda} w-24`}
                    value={fila.tipoAulaSolicitado}
                    disabled={!puedeEditar || pendiente}
                    onChange={(e) => actualizar(fila.key, "tipoAulaSolicitado", e.target.value)}
                  >
                    <option value="">—</option>
                    {TIPOS_AULA.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="min-w-[170px] px-2 py-1.5">
                  <input
                    aria-label={`Facultad o programa de la fila ${indice + 1}`}
                    className={celda}
                    value={fila.facultadPrograma}
                    disabled={!puedeEditar || pendiente}
                    onChange={(e) => actualizar(fila.key, "facultadPrograma", e.target.value)}
                    placeholder="Facultad / Programa"
                  />
                </td>
                <td className="min-w-[170px] px-2 py-1.5">
                  <input
                    aria-label={`Observaciones de la fila ${indice + 1}`}
                    className={celda}
                    value={fila.observacionesFacultad}
                    disabled={!puedeEditar || pendiente}
                    onChange={(e) => actualizar(fila.key, "observacionesFacultad", e.target.value)}
                  />
                </td>
                <td className="px-2 py-1.5 text-right">
                  <button
                    type="button"
                    onClick={() => eliminar(fila.key)}
                    disabled={!puedeEditar || pendiente}
                    aria-label={`Eliminar fila ${indice + 1}`}
                    className="rounded-md px-2 py-1 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 disabled:opacity-40"
                  >
                    Quitar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-end">
        <div className="flex-1">
          <label
            htmlFor="observacion-version"
            className="block text-xs font-semibold uppercase tracking-wide text-slate-600"
          >
            Comentario de la versión (opcional)
          </label>
          <input
            id="observacion-version"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            placeholder="Ej. Ajuste de horarios tras reunión con la facultad"
            value={observacion}
            disabled={!puedeEditar || pendiente}
            onChange={(e) => setObservacion(e.target.value)}
            maxLength={300}
          />
        </div>
        <button
          type="button"
          onClick={guardar}
          disabled={!puedeEditar || pendiente || filas.length === 0}
          className="inline-flex items-center justify-center rounded-lg bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-900 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pendiente ? "Guardando…" : "Guardar nueva versión"}
        </button>
      </div>
    </div>
  );
}
