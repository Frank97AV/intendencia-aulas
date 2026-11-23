export const ROLES = ["ADMIN", "SOLICITANTE"] as const;
export type Rol = (typeof ROLES)[number];

export const ESTADOS = ["BORRADOR", "REGISTRADA", "CERRADA"] as const;
export type EstadoSolicitud = (typeof ESTADOS)[number];

export const DIAS = ["LUN", "MAR", "MIE", "JUE", "VIE", "SAB"] as const;
export const FORMATOS = ["Presencial", "Semipresencial"] as const;
export const TIPOS_AULA = ["Normal", "Híbrido"] as const;

export type FilaInput = {
  idCurso?: number | null;
  claveCurso: string;
  nombreCurso?: string | null;
  secuencia?: string | null;
  horario?: string | null;
  vacantes: number;
  docentes?: string | null;
  dia?: string | null;
  horaInicio?: string | null;
  horaFin?: string | null;
  formatoCurso?: string | null;
  tipoAulaSolicitado?: string | null;
  facultadPrograma?: string | null;
  observacionesFacultad?: string | null;
};

export type FilaConAula = FilaInput & {
  idDetalle: number;
  idAula?: number | null;
  observacionesIntendencia?: string | null;
};

export type AsignacionInput = {
  idDetalle: number;
  idAula: number | null;
  observacionesIntendencia?: string | null;
};

export type ActionResult = {
  ok: boolean;
  message?: string;
  errores?: string[];
};

export const ESTADO_LABEL: Record<EstadoSolicitud, string> = {
  BORRADOR: "Borrador",
  REGISTRADA: "Registrada",
  CERRADA: "Cerrada",
};

export const ESTADO_BADGE: Record<EstadoSolicitud, string> = {
  BORRADOR: "bg-slate-100 text-slate-700 ring-slate-200",
  REGISTRADA: "bg-sky-50 text-sky-700 ring-sky-200",
  CERRADA: "bg-slate-800 text-white ring-slate-700",
};

export const ROL_LABEL: Record<Rol, string> = {
  ADMIN: "Administrador",
  SOLICITANTE: "Solicitante",
};
