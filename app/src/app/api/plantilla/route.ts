import * as XLSX from "xlsx";

export async function GET() {
  const columnas = [
    "clave_curso",
    "secuencia",
    "horario",
    "vacantes",
    "docentes",
    "dia",
    "hora_inicio",
    "hora_fin",
    "formato_curso",
    "tipo_aula",
    "facultad_programa",
    "observaciones",
  ];

  const ejemplo = [
    {
      clave_curso: "IS-101",
      secuencia: "01",
      horario: "G01",
      vacantes: 30,
      docentes: "Nombre del docente",
      dia: "LUN",
      hora_inicio: "08:00",
      hora_fin: "10:00",
      formato_curso: "Presencial",
      tipo_aula: "Normal",
      facultad_programa: "Ingeniería de Sistemas",
      observaciones: "Requiere proyector",
    },
  ];

  const instrucciones = [
    ["Plantilla de programación · Intendencia de Aulas"],
    [""],
    ["Reglas de la importación"],
    ["1. Una fila por curso, horario y día."],
    ["2. clave_curso es texto libre obligatorio (ingresado manualmente)."],
    ["3. horario es código obligatorio de mínimo 3 caracteres (ej. G01, NOC)."],
    ["4. vacantes debe ser un entero mayor o igual a 1."],
    ["5. dia: LUN, MAR, MIE, JUE, VIE o SAB (se aceptan variantes y se normalizan a 3 letras)."],
    ["6. hora_inicio y hora_fin en formato HH:mm (24 horas); el fin debe ser posterior al inicio."],
    ["7. formato_curso: Presencial o Semipresencial."],
    ["8. tipo_aula: Normal o Híbrido (no elige aula definitiva)."],
    ["9. facultad_programa es obligatoria."],
    ["10. Máximo 200 filas por archivo."],
    ["11. La importación se aplica solo después de la vista previa y confirmación."],
    ["12. Al confirmar se crea una versión nueva completa e inmutable."],
    [""],
    ["No modifique los encabezados de la hoja 'Programación'."],
  ];

  const libro = XLSX.utils.book_new();
  const hojaDatos = XLSX.utils.json_to_sheet(ejemplo, { header: columnas });
  hojaDatos["!cols"] = [
    { wch: 14 },
    { wch: 10 },
    { wch: 10 },
    { wch: 10 },
    { wch: 26 },
    { wch: 8 },
    { wch: 12 },
    { wch: 12 },
    { wch: 16 },
    { wch: 12 },
    { wch: 28 },
    { wch: 32 },
  ];
  XLSX.utils.book_append_sheet(libro, hojaDatos, "Programación");

  const hojaInstrucciones = XLSX.utils.aoa_to_sheet(instrucciones);
  hojaInstrucciones["!cols"] = [{ wch: 90 }];
  XLSX.utils.book_append_sheet(libro, hojaInstrucciones, "Instrucciones");

  const buffer = XLSX.write(libro, { type: "buffer", bookType: "xlsx" }) as Buffer;

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="plantilla-programacion-aulas.xlsx"',
      "Cache-Control": "no-store",
    },
  });
}
