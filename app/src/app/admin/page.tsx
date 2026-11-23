import Link from "next/link";
import { Card, CardHeader, PageIntro, StatCard, Vacio } from "@/components/ui";
import { requireRole } from "@/lib/auth";
import { fmtFechaHora } from "@/lib/format";
import { cicloActivo, listarUsuarios } from "@/services/catalogos";
import { metricasGenerales } from "@/services/metricas";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  await requireRole(["ADMIN"]);
  const [metricas, ciclo, usuarios] = await Promise.all([
    metricasGenerales(),
    cicloActivo(),
    listarUsuarios(),
  ]);

  const pendientes = usuarios.filter((u) => !u.autorizado);
  const accesos = [
    { href: "/admin/usuarios", titulo: "Usuarios y autorización", detalle: "Habilitar cuentas, roles y unidad" },
    { href: "/admin/ciclos", titulo: "Ciclos y ventanas", detalle: "Definir el período y la ventana de recepción" },
    { href: "/admin/cursos", titulo: "Catálogo de cursos", detalle: "Claves, nombres y unidad propietaria" },
    { href: "/admin/aulas", titulo: "Inventario de aulas", detalle: "Capacidad, tipo y vigencia" },
  ];

  return (
    <div className="space-y-6">
      <PageIntro
        titulo="Panel general de administración"
        descripcion="Gobierno de usuarios, ciclos, catálogos y seguimiento del sistema."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard etiqueta="Ciclo activo" valor={ciclo?.nombre ?? "Ninguno"} detalle={ciclo ? `Ventana hasta ${fmtFechaHora(ciclo.finSolicitudes)}` : "Configure un ciclo"} tono={ciclo ? "ok" : "alerta"} />
        <StatCard etiqueta="Usuarios pendientes" valor={pendientes.length} detalle="Sin autorización de acceso" tono={pendientes.length ? "alerta" : "neutro"} />
        <StatCard etiqueta="Solicitudes" valor={metricas.totalSolicitudes} detalle={`${metricas.totalVersiones} versiones registradas`} />
        <StatCard etiqueta="Cobertura de aulas" valor={`${metricas.totalFilas ? Math.round((metricas.totalAsignadas / metricas.totalFilas) * 100) : 0}%`} detalle={`${metricas.totalAsignadas} de ${metricas.totalFilas} filas`} tono="info" />
      </div>

      {pendientes.length > 0 ? (
        <Card>
          <CardHeader
            titulo={`${pendientes.length} cuenta(s) esperando autorización`}
            descripcion="Revise cada caso y asigne rol y unidad académica antes de habilitar el acceso."
            accion={
              <Link href="/admin/usuarios" className="text-xs font-semibold text-brand-700 hover:underline">
                Ir a usuarios →
              </Link>
            }
          />
          <ul className="divide-y divide-slate-100">
            {pendientes.map((u) => (
              <li key={u.id} className="flex flex-wrap items-center justify-between gap-2 px-5 py-3 text-sm">
                <div>
                  <p className="font-medium text-slate-800">{u.nombre}</p>
                  <p className="text-xs text-slate-500">{u.correo}</p>
                </div>
                <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-800 ring-1 ring-amber-200">
                  Pendiente
                </span>
              </li>
            ))}
          </ul>
        </Card>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        {accesos.map((a) => (
          <Link key={a.href} href={a.href} className="group">
            <Card className="h-full p-5 transition group-hover:border-brand-200 group-hover:shadow">
              <p className="text-sm font-semibold text-slate-900">{a.titulo}</p>
              <p className="mt-1 text-sm text-slate-600">{a.detalle}</p>
              <p className="mt-3 text-xs font-semibold text-brand-700">Abrir →</p>
            </Card>
          </Link>
        ))}
      </div>

      {!ciclo ? (
        <Vacio
          titulo="No hay ciclo activo"
          detalle="Las unidades no podrán registrar programación hasta que active un ciclo con ventana vigente."
        />
      ) : null}
    </div>
  );
}
