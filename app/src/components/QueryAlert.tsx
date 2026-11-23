import { Alerta } from "@/components/ui";

export function QueryAlert({ ok, error }: { ok?: string; error?: string }) {
  if (!ok && !error) return null;
  return <Alerta tipo={error ? "error" : "ok"}>{error ?? ok}</Alerta>;
}

export function parametro(valor: string | string[] | undefined): string | undefined {
  return Array.isArray(valor) ? valor[0] : valor;
}
