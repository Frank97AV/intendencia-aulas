import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Intendencia de Aulas · MVP",
  description:
    "Sistema de gestión de solicitudes, programación y asignación de aulas por ciclo académico.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-slate-100 text-slate-900 antialiased">{children}</body>
    </html>
  );
}
