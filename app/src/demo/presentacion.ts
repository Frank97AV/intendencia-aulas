/**
 * Contenido TEMPORAL de la presentación del proyecto.
 * Vive aislado del dominio: puede editarse o eliminarse sin tocar la aplicación.
 * Fuente: Documentación Integral de Intendencia de Aulas v1.0.
 */
export const PRESENTACION = {
  kicker: "Transformación Digital · Intendencia",
  titulo: "Intendencia de Aulas",
  subtitulo: "De planillas dispersas a una programación académica trazable.",
  descripcion:
    "MVP funcional que digitaliza la recepción de solicitudes de programación por ciclo académico, con captura individual, importación Excel, versionado inmutable y asignación de aulas por Intendencia.",
  version: "MVP 0.1 · Demostración",
  fecha: "23 de noviembre de 2026",

  cifras: [
    { valor: "8", etiqueta: "tablas PostgreSQL" },
    { valor: "3", etiqueta: "roles operativos" },
    { valor: "6", etiqueta: "estados de solicitud" },
    { valor: "14", etiqueta: "features del MVP" },
  ],

  problema: [
    "La programación llega en múltiples Excel por facultad y se consolida manualmente.",
    "No hay control de quién edita, cuándo ni qué cambió entre entregas.",
    "La unidad académica y la asignación de aulas se mezclan en el mismo archivo.",
    "Los históricos se pierden o se sobrescriben, sin trazabilidad para auditoría.",
  ],

  objetivo:
    "Centralizar la solicitud de programación por unidad y ciclo, separar lo que solicita la facultad de lo que decide Intendencia y conservar una fotografía completa de cada versión.",

  alcance: [
    "Login Google simulado y autorización local por rol y unidad.",
    "Administración de usuarios, ciclos, ventanas, cursos y aulas.",
    "Solicitud por unidad y ciclo con múltiples filas de programación.",
    "Validación de curso, horario, vacantes, día, formato y tipo de aula.",
    "Versionado inmutable: cada guardado crea una versión completa.",
    "Importación Excel con vista previa y errores por fila.",
    "Exportación Excel/CSV de la versión vigente o histórica.",
    "Asignación de aula con control de capacidad y observaciones internas.",
    "Dashboard de estados, avance y ocupación proyectada.",
  ],

  fuera: [
    "OAuth real de Google (la interfaz queda preparada para conectarlo).",
    "Integración SIPUC y robot de sincronización.",
    "Algoritmo automático de asignación y criterios de desempate.",
    "Formulario de actividades y campo Secuencia (fuera del modelo actual).",
  ],

  roles: [
    {
      nombre: "Administrador",
      descripcion: "Gobierna el sistema y habilita el acceso.",
      permisos: ["Autoriza usuarios", "Asigna rol y unidad", "Gestiona ciclos y catálogos"],
    },
    {
      nombre: "Unidad académica",
      descripcion: "Registra su programación, nunca elige el aula.",
      permisos: ["Crea y edita su solicitud", "Importa Excel", "Guarda versiones", "Exporta su historial"],
    },
    {
      nombre: "Intendencia",
      descripcion: "Revisa y decide la asignación de espacios.",
      permisos: ["Revisa solicitudes", "Asigna aulas", "Registra observaciones internas", "Cierra solicitudes"],
    },
  ],

  flujo: [
    {
      paso: "01",
      titulo: "Ingreso simulado con Google",
      detalle: "La cuenta define la identidad; la base local valida autorización, rol y unidad.",
    },
    {
      paso: "02",
      titulo: "La unidad prepara su programación",
      detalle: "Agrega filas manualmente o importa el Excel institucional con vista previa.",
    },
    {
      paso: "03",
      titulo: "Se guarda una versión inmutable",
      detalle: "Cada guardado congela la fotografía completa, con autor, fecha y comentario.",
    },
    {
      paso: "04",
      titulo: "Intendencia revisa y asigna",
      detalle: "Selecciona aulas por fila, valida capacidad y deja observaciones internas.",
    },
    {
      paso: "05",
      titulo: "La nueva versión conserva el historial",
      detalle: "La asignación no sobrescribe: genera una versión nueva y trazable.",
    },
  ],

  features: [
    { id: "F-00", nombre: "Fundaciones, diseño y datos demo", estado: "Listo" },
    { id: "F-01", nombre: "Login Google simulado", estado: "Listo" },
    { id: "F-02", nombre: "Autorización de usuarios", estado: "Listo" },
    { id: "F-03", nombre: "Ciclos y ventanas", estado: "Listo" },
    { id: "F-04", nombre: "Catálogo de cursos", estado: "Listo" },
    { id: "F-05", nombre: "Inventario de aulas", estado: "Listo" },
    { id: "F-06", nombre: "Solicitudes por unidad y ciclo", estado: "Listo" },
    { id: "F-07", nombre: "Programación y validaciones", estado: "Listo" },
    { id: "F-08", nombre: "Versionado e historial", estado: "Listo" },
    { id: "F-09", nombre: "Importación Excel con vista previa", estado: "Listo" },
    { id: "F-10", nombre: "Exportación Excel y CSV", estado: "Listo" },
    { id: "F-11", nombre: "Gestión y asignación de Intendencia", estado: "Listo" },
    { id: "F-12", nombre: "Dashboard y métricas", estado: "Listo" },
    { id: "F-13", nombre: "Presentación HTML temporal", estado: "Listo" },
  ],

  stack: [
    { capa: "Interfaz", tecnologia: "Next.js 15 · React 19 · Tailwind CSS 4" },
    { capa: "Dominio", tecnologia: "TypeScript estricto · Zod · reglas RN-01…RN-14" },
    { capa: "Datos", tecnologia: "PostgreSQL (PGlite embebido) · Drizzle ORM · migraciones SQL" },
    { capa: "Pruebas", tecnologia: "Vitest · Chrome DevTools MCP · guiones E2E" },
    { capa: "SDD", tecnologia: "Constitución · specs · planes · tareas · agentes · memoria" },
  ],

  garantias: [
    "La unidad académica nunca asigna aula.",
    "Toda versión es inmutable; corregir siempre crea una versión nueva.",
    "La autorización es local, aunque la identidad venga de Google.",
    "Aislamiento estricto entre unidades académicas.",
    "Validaciones de negocio en servidor, no solo en pantalla.",
    "Sin borrados físicos: catálogos e históricos se desactivan o conservan.",
  ],

  pendientes: [
    "PD-01 · ¿Unidad = facultad, programa o catálogo jerárquico?",
    "PD-03 · Estados y transiciones definitivas.",
    "PD-04 · Política de edición tras el cierre.",
    "PD-06 · Identificación de secciones y horarios duplicados.",
    "PD-08 · Reglas de disponibilidad, continuidad y desempate.",
    "PD-11 · Integración SIPUC: método, permisos y ambiente de prueba.",
  ],

  demo: [
    "Abrir /login y entrar como Unidad Sistemas.",
    "Agregar filas o importar el Excel de ejemplo; guardar la versión 1.",
    "Entrar como Intendencia y asignar aulas validando capacidad.",
    "Volver a la unidad: revisar versiones, comparar y exportar.",
    "Entrar como Administrador: aprobar la cuenta pendiente.",
  ],

  aviso:
    "Contenido temporal de demostración. Las cifras, cursos y aulas son ficticios y se gestionan aparte del dominio, en db/seed y src/demo.",
};
