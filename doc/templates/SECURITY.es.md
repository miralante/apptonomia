# Política de seguridad

## Versiones soportadas

| Versión | Soporte |
|---|---|
| `{{SLUG}}-vN` (última) | ✅ |
| `{{SLUG}}-v*` antiguas | ❌ |

La regla del bump de caché (ver `CLAUDE.md` §B.1) es lo que hace
que "soportada" signifique algo: un bump de `VERSION` en `sw.js`
es el único mecanismo que fuerza a las PWAs instaladas a
recoger el nuevo código. Damos soporte **solo a la última
`VERSION` desplegada**; las versiones anteriores no se parchean.

## Reportar una vulnerabilidad

Por favor, **no** abras una issue pública para problemas de
seguridad sospechosos. Envía un correo a <maintainer-email> en
su lugar, con:

- Una descripción breve del problema
- Pasos para reproducirlo (navegador, SO, URL)
- Una captura o log de consola si aplica
- Si quieres crédito público en el arreglo

Responderemos en **72 horas** con una nota de triaje y un plazo
de arreglo. Los problemas críticos (XSS, RCE, compromiso de
cuenta, cualquier cosa que rompa la promesa de sin telemetría)
se arreglan en 7 días; los no críticos en 30 días.

## Modelo de amenaza

{{DISPLAY_ES}} es un sitio estático puramente del lado del cliente.
Sin backend, sin base de datos, sin telemetría, sin runtime de
terceros, sin cuentas. El modelo de amenaza es esencialmente:

- "Lo que una página maliciosa offline sobre el mismo origen
  podría hacer al `localStorage` de esta app."
- "Lo que una página maliciosa sobre otro origen podría hacer
  vía APIs compartidas (las cabeceras `Permissions-Policy` y CSP
  de `_headers` están diseñadas para limitar esto)."
- "Lo que un actor malicioso podría hacer manipulando los
  archivos desplegados en el edge del CDN."

La política de mismo-origen del navegador, los iframes
sandboxed, el `Permissions-Policy` y el CSP estricto mitigan (1)
y (2). Para (3), el conector Git de Cloudflare fuerza un
despliegue de fuente única de verdad: solo la rama `main` de
`{{GIT_ORG}}/{{REPO}}` se despliega; las claves de despliegue se
rotan a través del panel de Cloudflare, no se almacenan en el
repo.

## Fuera de alcance

- Vulnerabilidades en el navegador de la persona usuaria (enviamos
  HTML/CSS/JS plano; reportar al vendor del navegador).
- Vulnerabilidades en el runtime de Workers de Cloudflare (reportar
  a Cloudflare).
- Auto-XSS (una persona pegando código malicioso en su propia
  consola del navegador).

## Ver también

- [`CLOUDFLARE.md`](CLOUDFLARE.md) — el runbook de despliegue.
- [`_headers`](_headers) — las cabeceras HTTP de seguridad en
  vigor.
- `CLAUDE.md` §B — las políticas transversales de la suite (sin
  telemetría, WCAG AAA, lenguaje público).
