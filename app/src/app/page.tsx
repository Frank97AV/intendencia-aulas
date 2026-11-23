import { homeForRol } from "@/lib/auth";
import { getSessionUser } from "@/lib/session";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Home() {
  const usuario = await getSessionUser();
  redirect(usuario ? homeForRol(usuario.rol) : "/login");
}
