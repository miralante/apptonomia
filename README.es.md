# Apptonomia

> 🌐 **Otros idiomas:** [English](README.md)

**Portal de la suite Apptonomia** — una landing estática, gratuita y sin
dependencias que enlaza con seis pequeñas aplicaciones web hermanas,
todas pensadas para ayudar a aprender a tu propio ritmo, en el
navegador, sin coste, sin cuentas y sin datos personales.

- 🌐 **Aplicación**: [apptonomia.uk](https://apptonomia.uk/)
- 📦 **Repositorio**: [github.com/miralante/apptonomia](https://github.com/miralante/apptonomia)
- 💻 **Ejecutar en local**: abre `index.html` directamente en un
  navegador, o sirve la carpeta con cualquier servidor estático
  (`npx serve .` / `python -m http.server 8080`).

---

## Qué es este repositorio

Este repositorio aloja el **portal de entrada** de la suite Apptonomia:
una única página estática que presenta las seis aplicaciones hermanas
y enlaza con cada una. Es deliberadamente pequeño — un único
`index.html`, un bootstrap de i18n (`bootstrap.js` + `script.js`), los dos
bundles `strings.<locale>.js`, y un `_headers` para las cabeceras HTTP
de seguridad.

Las aplicaciones reales viven en sus propios repositorios:

| Aplicación | Qué es | Repositorio |
|---|---|---|
| **Apptonomia** *(este repo — portal)* | Landing que presenta la suite | [github.com/miralante/apptonomia](https://github.com/miralante/apptonomia) |
| [Routime](https://routime.apptonomia.uk/) | Terapia ocupacional: 7 módulos, 68 actividades | [github.com/miralante/routime](https://github.com/miralante/routime) |
| [Calculia](https://calculia.apptonomia.uk/) | Cálculo y razonamiento lógico: 12 actividades | [github.com/miralante/calculia](https://github.com/miralante/calculia) |
| [Memofun](https://memofun.apptonomia.uk/) | Tarjetas de memoria con aprendizaje significativo | [github.com/miralante/memofun](https://github.com/miralante/memofun) |
| [Okeymoney](https://okeymoney.apptonomia.uk/) | Finanzas personales y autonomía cotidiana | [github.com/miralante/okeymoney](https://github.com/miralante/okeymoney) |
| [Sinonimia](https://sinonimia.apptonomia.uk/) | Diccionario en lectura fácil | [github.com/miralante/sinonimia](https://github.com/miralante/sinonimia) |
| [Teclatlon](https://teclatlon.apptonomia.uk/) | Mecanografía con el teclado físico | [github.com/miralante/teclatlon](https://github.com/miralante/teclatlon) |

---

## 📚 Documentación

| Tema | Documento |
|---|---|
| Producto, audiencia, reglas de accesibilidad | [`doc/es/SPEC.md`](doc/es/SPEC.md) · [`doc/en/SPEC.md`](doc/en/SPEC.md) |
| Arquitectura y referencia técnica | [`doc/es/tecnico.md`](doc/es/tecnico.md) · [`doc/en/technical.md`](doc/en/technical.md) |
| Internacionalización (añadir un idioma) | [`doc/es/I18N.md`](doc/es/I18N.md) · [`doc/en/I18N.md`](doc/en/I18N.md) |
| Guía de despliegue (Cloudflare Workers) | [`CLOUDFLARE.md`](CLOUDFLARE.md) |
| Flujo operativo para agentes de IA | [`CLAUDE.md`](CLAUDE.md) |

El historial del proyecto vive en `git log`; no se mantiene una hoja de
ruta externa.

---

## ☁️ Despliegue

Apptonomia es un sitio totalmente estático (HTML/CSS/JS, sin build), así
que se publica directamente en **[Cloudflare Workers (static assets)](https://developers.cloudflare.com/workers/static-assets/)**
mediante su integración nativa con GitHub. Las cabeceras de seguridad
HTTP viven en [`_headers`](_headers), y la metadata del proyecto en
[`wrangler.toml`](wrangler.toml). Consulta [`CLOUDFLARE.md`](CLOUDFLARE.md)
con la guía completa (rebuild, rollback, dominio personalizado,
rotación de credenciales).

Las pull requests reciben automáticamente una URL de previsualización
en `apptonomia-<rama>.<subdominio-cuenta>.workers.dev` — sin necesidad
de un workflow extra.

---

## ✅ Validar

```bash
node scripts/check.js
```

No hace falta `npm install` — el script solo usa la librería estándar de Node.

---

## 📄 Licencia

MIT — ver [`LICENSE`](LICENSE).

---

## 🙌 Contribuir

Las contribuciones son bienvenidas. Consulta
[`CONTRIBUTING.es.md`](CONTRIBUTING.es.md) para el flujo, los roles del
proyecto y las recetas (nuevo idioma, correcciones de copy,
mejoras de accesibilidad). Todas las personas participantes deben
seguir [`CODE_OF_CONDUCT.es.md`](CODE_OF_CONDUCT.es.md).

---

## 🔐 Seguridad

Apptonomia es un sitio estático completamente del lado del cliente: sin
backend, sin base de datos, sin telemetría, sin servicios de terceros
en tiempo de ejecución. Para reportar una vulnerabilidad consulta
[`SECURITY.es.md`](SECURITY.es.md).