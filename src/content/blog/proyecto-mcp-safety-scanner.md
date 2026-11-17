---
title: "MCPSafetyScanner: auditoría automatizada"
description: "Herramienta propia en Python para escanear configuraciones de servidores MCP y generar reportes técnicos de seguridad automáticamente."
pubDate: 2026-07-01
category: proyecto
tags: ["python", "security", "automation", "tooling", "mcp"]
draft: false
---

**MCPSafetyScanner** es una herramienta que desarrollé para automatizar auditorías
de seguridad sobre configuraciones de servidores. La idea nació de la necesidad de
reducir el tiempo que toma revisar manualmente decenas de configuraciones repetitivas
durante una auditoría.

## El problema

Auditar configuraciones a mano es lento y propenso a errores. Un analista puede
pasar horas revisando los mismos patrones de riesgo una y otra vez. Quería una
herramienta que:

- Escaneara configuraciones en busca de patrones inseguros conocidos.
- Generara un reporte técnico legible y accionable.
- Fuera extensible: añadir una regla nueva debía ser trivial.

## Arquitectura

El escáner se estructura en tres módulos: un **cargador** de configuraciones, un
**motor de reglas** y un **generador de reportes**. El núcleo del motor recorre las
reglas registradas y las aplica a cada objetivo:

```python
def run_scan(target: dict, rules: list[Rule]) -> ScanReport:
    findings = []
    for rule in rules:
        result = rule.evaluate(target)
        if result.is_violation:
            findings.append(
                Finding(
                    rule_id=rule.id,
                    severity=rule.severity,
                    message=result.message,
                )
            )
    return ScanReport(target=target["name"], findings=findings)
```

Cada regla es una clase independiente, así que ampliar la cobertura es solo añadir
un archivo nuevo sin tocar el motor.

## Generación de reportes

El reporte final se emite en Markdown, listo para adjuntar a la documentación de
la auditoría:

```bash
python scanner.py --target config.json --output reporte.md
```

## Resultados

- Redujo el tiempo de una revisión típica de **~2 horas a minutos**.
- Los reportes en Markdown se integran directo en la documentación del cliente.
- El diseño basado en reglas permitió cubrir casos nuevos sin refactorizar.

## Próximos pasos

- Añadir salida en JSON para integración con pipelines CI/CD.
- Sistema de severidad ponderada para priorizar hallazgos.
- Modo `--diff` para comparar el estado entre dos auditorías.
