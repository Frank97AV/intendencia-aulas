---
description: Crea o actualiza la especificación de una feature.
agent: orquestador
---

Ejecuta el flujo de especificación SDD para la feature indicada por el usuario.

## Entrada
- Nombre/ID de feature y pedido funcional.

## Leer antes
- `AGENTS.md`, `memory/constitution.md`, `memory/contexto.md`, `memory/decisiones.md`
- `specs/README.md` y plantilla en `specs/_template/spec.md`
- Spec existente de la feature, si aplica

## Salida
- Crear/actualizar `specs/<feature>/spec.md`.

## Debe incluir
- Objetivo, alcance, fuera de alcance, actores.
- Reglas y dependencias (constitución/ADRs).
- Criterios de aceptación trazables (CA-XX.Y).
- Riesgos y preguntas abiertas.

## Gates
- No implementar código.
- No contradecir la constitución; si hay conflicto, registrarlo como riesgo/decisión pendiente.
- Si la feature cambia reglas base, señalar actualización requerida en `memory/constitution.md` o `memory/decisiones.md`.
