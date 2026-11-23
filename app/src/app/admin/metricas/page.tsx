import { MetricasView } from "@/components/MetricasView";
import { PageIntro } from "@/components/ui";
import { requireRole } from "@/lib/auth";
import { metricasGenerales } from "@/services/metricas";

export const dynamic = "force-dynamic";

export default async function AdminMetricasPage() {
  await requireRole(["ADMIN"]);
  const metricas = await metricasGenerales();

  return (
    <div className="space-y-6">
      <PageIntro
        titulo="Métricas del sistema"
        descripcion="Lectura consolidada para seguimiento institucional. El dashboard definitivo consumirá datos estructurados."
      />
      <MetricasView metricas={metricas} />
    </div>
  );
}
