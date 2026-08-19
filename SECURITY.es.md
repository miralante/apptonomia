# Política de seguridad

Apptonomia es un sitio estático completamente del lado del cliente: no
tiene servidor propio, ni backend, ni base de datos, ni telemetría, ni
llamadas de runtime a terceros. La superficie de ataque es esencialmente
la del navegador sobre el mismo origen (las cabeceras de seguridad HTTP
en [`_headers`](_headers) están escritas para que siga siendo así — CSP
bloqueada a `'self'`, sin scripts inline, sin `connect-src` a terceros).

## Versiones soportadas

Solo la rama `master` recibe parches de seguridad. No mantenemos
versiones antiguas.

## Cómo reportar una vulnerabilidad

Abre un aviso privado a través de
[GitHub Security Advisories](https://github.com/miralante/apptonomia/security/advisories/new).

Por favor, incluye:

- Descripción breve y pasos para reproducir.
- Impacto observado o esperado.
- SHA de commit o etiqueta afectada.

Si no puedes usar Security Advisories, abre un issue etiquetándolo
claramente como **security** y añade el prefijo `[SEC]` al título.
**No subas pruebas de concepto explotables** a un issue público:
espera a que un maintainer coordine.

## Qué esperar

- Acuse de recibo en 5 días laborables.
- Primera evaluación (reproducción, severidad, plan) en 15 días
  laborables.
- Si se confirma, un parche o mitigación en cuanto sea viable.

## Divulgación coordinada

Preferimos coordinar la divulgación si la corrección requiere cambios
visibles en el portal o en las cabeceras de seguridad.