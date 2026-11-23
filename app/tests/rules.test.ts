import type { Aula, Ciclo } from "@db/schema";
import { describe, expect, it } from "vitest";
import {
  estadoVentana,
  puedeEditarSolicitud,
  validarAsignaciones,
  validarFilas,
} from "@/lib/rules";

const aulas: Aula[] = [
  { id: 10, codigo: "A-101", capacidad: 40, tipoAula: "Normal", activo: true },
  { id: 11, codigo: "B-201", capacidad: 20, tipoAula: "Híbrido", activo: true },
  { id: 12, codigo: "C-301", capacidad: 60, tipoAula: "Normal", activo: false },
];

const filaValida = {
  claveCurso: "IS-101",
  nombreCurso: "Introducción",
  secuencia: "01",
  horario: "G01",
  vacantes: 30,
  docentes: "Docente Demo",
  dia: "LUN",
  horaInicio: "08:00",
  horaFin: "10:00",
  formatoCurso: "Presencial",
  tipoAulaSolicitado: "Normal",
  facultadPrograma: "Ingeniería de Sistemas",
  observacionesFacultad: "",
};

describe("validarFilas", () => {
  it("acepta una fila válida y normaliza vacíos a null", () => {
    const r = validarFilas([filaValida]);
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.filas[0].horaInicio).toBe("08:00");
      expect(r.filas[0].secuencia).toBe("01");
      expect(r.filas[0].claveCurso).toBe("IS-101");
      expect(r.filas[0].observacionesFacultad).toBeNull();
    }
  });

  it("rechaza clave de curso vacía", () => {
    const r = validarFilas([{ ...filaValida, claveCurso: " " }]);
    expect(r.ok).toBe(false);
  });

  it("rechaza horario con menos de 3 caracteres", () => {
    const r = validarFilas([{ ...filaValida, horario: "G1" }]);
    expect(r.ok).toBe(false);
  });

  it("rechaza hora fin anterior o igual a la de inicio (RN-12)", () => {
    const r = validarFilas([{ ...filaValida, horaFin: "07:00" }]);
    expect(r.ok).toBe(false);
  });

  it("rechaza vacantes menores a 1", () => {
    const r = validarFilas([{ ...filaValida, vacantes: 0 }]);
    expect(r.ok).toBe(false);
  });

  it("normaliza día completo a 3 letras (Lunes->LUN)", () => {
    const r = validarFilas([{ ...filaValida, dia: "Lunes" }]);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.filas[0].dia).toBe("LUN");
  });

  it("normaliza día a 3 letras (MIER->MIE, VIER->VIE)", () => {
    const r = validarFilas([{ ...filaValida, dia: "MIER" }, { ...filaValida, claveCurso: "IS-102", dia: "VIER" }]);
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.filas[0].dia).toBe("MIE");
      expect(r.filas[1].dia).toBe("VIE");
    }
  });

  it("rechaza tipo de aula inválido", () => {
    const r = validarFilas([{ ...filaValida, tipoAulaSolicitado: "Híbrida" }]);
    expect(r.ok).toBe(false);
  });

  it("detecta filas duplicadas", () => {
    const r = validarFilas([filaValida, { ...filaValida }]);
    expect(r.ok).toBe(false);
  });
});

describe("validarAsignaciones (RN-10)", () => {
  it("acepta aula con capacidad suficiente", () => {
    const r = validarAsignaciones([{ numero: 1, idAula: 10, vacantes: 30, tipoAulaSolicitado: "Normal" }], aulas);
    expect(r.ok).toBe(true);
  });

  it("rechaza aula con capacidad insuficiente", () => {
    const r = validarAsignaciones([{ numero: 1, idAula: 11, vacantes: 30, tipoAulaSolicitado: "Híbrido" }], aulas);
    expect(r.ok).toBe(false);
  });
});

describe("ventana de solicitudes", () => {
  const base: Ciclo = {
    id: 1,
    nombre: "2026-II",
    fechaInicio: "2026-08-01",
    fechaFin: "2026-12-20",
    inicioSolicitudes: new Date("2026-11-01T08:00:00-05:00"),
    finSolicitudes: new Date("2026-12-15T23:59:00-05:00"),
    activo: true,
  };

  it("detecta ventana abierta, próxima y cerrada", () => {
    expect(estadoVentana(base, new Date("2026-11-10T10:00:00-05:00"))).toBe("ABIERTA");
    expect(estadoVentana(base, new Date("2026-10-01T10:00:00-05:00"))).toBe("PROXIMA");
    expect(estadoVentana(base, new Date("2026-12-16T10:00:00-05:00"))).toBe("CERRADA");
  });

  it("permite editar durante ventana habilitada aunque esté registrada", () => {
    expect(puedeEditarSolicitud(base, "BORRADOR").permitido).toBe(true);
    expect(puedeEditarSolicitud(base, "REGISTRADA").permitido).toBe(true);
  });

  it("bloquea edición si ciclo inactivo, ventana cerrada o solicitud cerrada", () => {
    expect(puedeEditarSolicitud({ ...base, activo: false }, "REGISTRADA").permitido).toBe(false);
    expect(puedeEditarSolicitud(base, "CERRADA").permitido).toBe(false);
    const cerrada = { ...base, finSolicitudes: new Date("2026-11-01T10:00:00-05:00") };
    expect(puedeEditarSolicitud(cerrada, "REGISTRADA").permitido).toBe(false);
  });
});
