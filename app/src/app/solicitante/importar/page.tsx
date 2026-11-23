import Link from "next/link";
import { ImportadorExcel } from "@/components/ImportadorExcel";
import { PageIntro, Vacio, btnSecondary } from "@/components/ui";
import { requireRole } from "@/lib/auth";
import { puedeEditarSolicitud } from "@/lib/rules";
import { cicloActivo } from "@/services/catalogos";
import { obtenerSolicitudDeUnidad } from "@/services/solicitudes";

export const dynamic = "force-dynamic";

export default async function ImportarPage() {
  const usuario = await requireRole(["SOLICITANTE"]);
  const ciclo = await cicloActivo();

  if (!ciclo) {
    return (
      <div className="space-y-6">
        <PageIntro titulo="Importar programación desde Excel" />
        <Vacio titulo="Sin ciclo activo" detalle="El administrador debe activar un ciclo académico." />
      </div>
    );
  }
  if (!usuario.idUnidad) {
    return (
      <div className="space-y-6">
        <PageIntro titulo="Importar programación desde Excel" />
        <Vacio titulo="Sin unidad asignada" detalle="Contacte al administrador para asociar su cuenta." />
      </div>
    );
  }

  const solicitud = await obtenerSolicitudDeUnidad(usuario.idUnidad, ciclo.id);
  const estado = solicitud?.estado ?? "BORRADOR";
  const permiso = puedeEditarSolicitud(ciclo, estado);

  return (
    <div className="space-y-6">
      <PageIntro
        titulo="Importar programación desde Excel"
        descripcion={`Ciclo ${ciclo.nombre} · ${usuario.unidadNombre}. La importación reemplaza el contenido en una nueva versión; nunca sobrescribe el historial.`}
        accion={
          <Link href="/solicitante/solicitud" className={btnSecondary}>
            Volver a la programación
          </Link>
        }
      />

      <ImportadorExcel
        puedeEditar={permiso.permitido}
        motivoBloqueo={permiso.motivo}
      />
    </div>
  );
}
