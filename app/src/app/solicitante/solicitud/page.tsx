import Link from "next/link";
import { ProgramacionEditor } from "@/components/ProgramacionEditor";
import { PageIntro, Vacio, btnSecondary } from "@/components/ui";
import { requireRole } from "@/lib/auth";
import { puedeEditarSolicitud } from "@/lib/rules";
import { fmtFechaHora } from "@/lib/format";
import { cicloActivo } from "@/services/catalogos";
import {
  detalleDeVersion,
  obtenerSolicitudDeUnidad,
  obtenerVersionVigente,
} from "@/services/solicitudes";

export const dynamic = "force-dynamic";

export default async function SolicitudPage() {
  const usuario = await requireRole(["SOLICITANTE"]);
  const ciclo = await cicloActivo();

  if (!ciclo) {
    return (
      <div className="space-y-6">
        <PageIntro titulo="Mi programación" />
        <Vacio titulo="Sin ciclo activo" detalle="El administrador debe activar un ciclo acadÃ©mico." />
      </div>
    );
  }
  if (!usuario.idUnidad) {
    return (
      <div className="space-y-6">
        <PageIntro titulo="Mi programación" />
        <Vacio titulo="Sin unidad asignada" detalle="Contacte al administrador para asociar su cuenta." />
      </div>
    );
  }

  const solicitud = await obtenerSolicitudDeUnidad(usuario.idUnidad, ciclo.id);
  const vigente = solicitud ? await obtenerVersionVigente(solicitud.id) : null;
  const detalle = vigente ? await detalleDeVersion(vigente.id) : [];
    const estado = solicitud?.estado ?? "BORRADOR";
  const permiso = puedeEditarSolicitud(ciclo, estado);

  return (
    <div className="space-y-6">
      <PageIntro
        titulo="Mi programación"
        descripcion={`Ciclo ${ciclo.nombre} · ${usuario.unidadNombre}. Registra la programación de tu unidad. La asignación de aula la realizará Intendencia en una fase posterior.`}
        accion={
          <div className="flex flex-wrap gap-2">
            <Link href="/solicitante/importar" className={btnSecondary}>
              Importar Excel
            </Link>
            <Link href="/solicitante/versiones" className={btnSecondary}>
              Versiones
            </Link>
          </div>
        }
      />

      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-600 shadow-sm">
        <span className="font-semibold text-slate-800">
          {vigente ? `Editando sobre la versión vigente v${vigente.numeroVersion}` : "Nueva solicitud"}
        </span>
        {vigente ? (
          <>
            <span className="text-slate-300">·</span>
            <span>Guardada por {vigente.autorNombre}</span>
            <span className="text-slate-300">·</span>
            <span>{fmtFechaHora(vigente.fechaVersion)}</span>
          </>
        ) : null}
        <span className="ml-auto rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-600">
          Registro de programación
        </span>
      </div>

      <ProgramacionEditor
        filasIniciales={detalle.map((d) => ({
          claveCurso: d.clave,
          nombreCurso: d.nombreCurso,
          secuencia: d.secuencia,
          horario: d.horario,
          vacantes: d.vacantes,
          docentes: d.docentes,
          dia: d.dia,
          horaInicio: d.horaInicio,
          horaFin: d.horaFin,
          formatoCurso: d.formatoCurso,
          tipoAulaSolicitado: d.tipoAulaSolicitado,
          facultadPrograma: d.facultadPrograma,
          observacionesFacultad: d.observacionesFacultad,
        }))}
        puedeEditar={permiso.permitido}
        motivoBloqueo={permiso.motivo}
      />
    </div>
  );
}

