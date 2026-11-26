# Guía CI/CD de Miralante

Esta guía resume el ciclo de validación y publicación de los proyectos de la
suite. Los workflows de GitHub Actions y la configuración de Cloudflare son la
fuente operativa: si cambian, actualiza esta guía. Cada aplicación conserva
esos detalles en su propio `CI-CD.md`; esta guía central resume la matriz y
los enlaces de la suite.

## Flujo de trabajo

1. Trabaja en una rama y abre un pull request hacia `main`.
2. Desde la raíz del proyecto, ejecuta los checks comunes y las pruebas de la
   sección siguiente. Usa la versión de Node del workflow del proyecto.
3. En **GitHub → Actions**, confirma que los checks bloqueantes hayan pasado
   antes de integrar el PR. Los informes informativos no bloquean la integración.
4. Al integrar en `main`, sigue el método de publicación del proyecto. En los
   proyectos con Cloudflare Git connector, Cloudflare Workers Builds y GitHub
   Actions son procesos separados: el conector puede publicar el push mientras
   CI aún se ejecuta. Configura protección de rama y checks requeridos si los
   fallos de CI deben impedir que el cambio llegue a producción.
5. Abre la URL de producción y comprueba la ruta o función afectada. Si el
   cambio modifica archivos precargados, confirma también el aumento de versión
   del service worker.
6. Si aparece una regresión, restaura una versión anterior en **Cloudflare →
   Workers & Pages → proyecto → Deployments** y prepara un arreglo hacia delante.

## Comprobaciones que se lanzan en CI

En los ocho proyectos, la validación incluye:

```sh
npm run lint
npm run lint:markup
node scripts/check-version-bump.js
npm run test:ui
```

Apptonomia no tiene `sw.js`; su check de versión termina correctamente con el
aviso de que no hay service worker. En las otras siete aplicaciones, el check
falla si cambió un archivo precargado y no se incrementó su versión.
La mayoría de los workflows usan Node 20; Ludia usa Node 22. Apptonomia también
usa Node 22 para la prueba de la plantilla.

Las siete aplicaciones también ejecutan estas comprobaciones de navegador y
service worker:

```sh
npm run test:crawl
npm run test:sw
npm run test:sw-redirects
```

Apptonomia usa en su lugar una prueba de la plantilla que genera una app y
ejecuta sus comprobaciones, incluida la suite de Playwright:

```sh
node scripts/check-template.js --ui
```

En los proyectos con `package.json`, instala primero las dependencias de
desarrollo:

```sh
npm install --no-audit --no-fund
npx playwright install --with-deps chromium
```

Estos son los pasos que sigue CI en Linux. En local, ejecuta las pruebas con el
comando del proyecto (`npm run test:ui`); la instalación global compartida es
opcional y no reemplaza las dependencias que declare el repositorio.

## Checks adicionales

| Proyecto | Checks de CI adicionales |
|---|---|
| Apptonomia | `node scripts/check-forbidden-terms.js`; `node scripts/scan-secrets.js` |
| Calculia | — |
| Ludia | — |
| Memofun | `node scripts/scan-secrets.js`; `node scripts/i18n-keys-smoke.js` es informativo |
| Okeymoney | — |
| Routime | `node scripts/scan-secrets.js`; `node scripts/i18n-keys-smoke.js` es informativo |
| Sinonimia | — |
| Teclatlon | — |

Memofun y Sinonimia ejecutan además `node scripts/smoke-prod.js` contra el sitio
publicado cada seis horas. Sus workflows también permiten lanzarlo manualmente.

Hay pruebas adicionales en algunos `package.json` que no son gates de cada PR.
Ejecútalas cuando el cambio afecte esa función:

- Calculia: `npm run test:quantities` y `npm run test:los-numeros`.
- Sinonimia: `npm run test:offline`.
- Routime: verifica en WebKit antes de integrar cada cambio. Para una actividad
  nueva o cambios de navegación, service worker o layout, ejecuta además
  `node scripts/cross-browser.js <slug>`; es una comprobación manual de
  Chromium, Firefox y WebKit, separada del workflow de CI.
- Los proyectos que lo incluyan: `npm run test:contrast` para cambios de
  contraste o estilos relacionados.

## Despliegue en Cloudflare

| Proyecto | Cómo se despliega (guía operativa por app) |
|---|---|
| [Apptonomia](https://github.com/miralante/apptonomia/blob/main/CI-CD.md) | GitHub Actions ejecuta `cloudflare/wrangler-action@v3` en un push a `main`, después de los checks requeridos. Usa `CLOUDFLARE_API_TOKEN` del entorno `production`. |
| [Calculia](https://github.com/miralante/calculia/blob/main/CI-CD.md) | Workers Builds, mediante Cloudflare Git connector, publica pushes a `main`. El workflow de GitHub valida y no despliega. |
| [Ludia](https://github.com/miralante/ludia/blob/main/CI-CD.md) | Despliegue manual con Wrangler después de que CI pase. Workers Builds no está conectado; usa Wrangler `4.129.1`. |
| [Memofun](https://github.com/miralante/memofun/blob/main/CI-CD.md) | Workers Builds, mediante Cloudflare Git connector, publica pushes a `main`. El workflow de GitHub valida y no despliega. |
| [Okeymoney](https://github.com/miralante/okeymoney/blob/main/CI-CD.md) | Workers Builds, mediante Cloudflare Git connector, publica pushes a `main`. El workflow de GitHub valida y no despliega. |
| [Routime](https://github.com/miralante/routime/blob/main/CI-CD.md) | El método documentado es Workers Builds con Git connector. También existe `pages-deploy.yml`, una ruta distinta de Cloudflare Pages que requiere secretos; no la actives sin confirmar que ese es el destino deseado. |
| [Sinonimia](https://github.com/miralante/sinonimia/blob/main/CI-CD.md) | Workers Builds, mediante Cloudflare Git connector, publica pushes a `main`. El workflow de GitHub valida y no despliega. |
| [Teclatlon](https://github.com/miralante/teclatlon/blob/main/CI-CD.md) | Workers Builds, mediante Cloudflare Git connector, publica pushes a `main`. El workflow de GitHub valida y no despliega. |

En los despliegues automáticos, la publicación de Cloudflare puede ocurrir en
paralelo con CI. No presupongas que un check rojo cancela un build del Git
connector: usa protección de rama para bloquear la integración. Para los pasos
propios de cada servicio, recuperación, dominios y rutas, consulta el
`CI-CD.md` propio de cada aplicación.

### Publicación manual de Ludia

Desde la raíz de `ludia`, cuando el workflow haya pasado:

```powershell
npx wrangler@4.129.1 login
npx wrangler@4.129.1 deploy --dry-run
npx wrangler@4.129.1 deploy
```

El inicio de sesión solo hace falta si Wrangler no tiene una sesión válida.
Después, revisa el despliegue en Cloudflare y abre la URL canónica de Ludia.
No ejecutes Wrangler manualmente para otro proyecto salvo que su `CI-CD.md`
lo indique.

## Referencias

- Esta guía incluye también el perfil de despliegue de Apptonomia.
- Workflows de validación: `.github/workflows/validate.yml` en cada proyecto.
- Workflows de publicación o smoke: `.github/workflows/` en cada proyecto.


---

## Cloudflare deployment profile — Apptonomia

> **Deploy:** GitHub Actions runs `cloudflare/wrangler-action@v3` on pushes to `main` after the required validation jobs pass. The deploy job uses `CLOUDFLARE_API_TOKEN` from the `production` environment; Cloudflare Git connector is not the deployment path. The Cloudflare dashboard is the source of truth for project settings. This is a Worker with static assets, not classic Pages. Live at <https://apptonomia.uk>.

## Configuration

| Setting | Value |
|---|---|
| Worker | `apptonomia` |
| Production branch | `main` |
| Framework preset | None |
| Build command | (empty) |
| Output / root | `.` / repository root |
| GitHub workflow | [`.github/workflows/validate.yml`](.github/workflows/validate.yml) — validation on pushes and pull requests, then a Wrangler deploy to production on pushes to `main` after required checks pass |

`wrangler.toml` is the deploy configuration: it pins the Worker name, serves `[assets] directory = "."` without a `main` script, and sets `not_found_handling = "404-page"`. Keep it; do not convert this project to classic Pages (`pages_build_output_dir` or `wrangler pages deploy`). The GitHub Actions deploy runs Wrangler against this file; Cloudflare Workers Builds does not deploy this project.

`_headers` applies security and cache headers at deploy time; no dashboard rules are needed. The app needs no runtime environment variables. The GitHub deploy job does require `CLOUDFLARE_API_TOKEN`, stored in the GitHub `production` environment. `package.json` defines the suite gate scripts. No `_redirects` or `functions/`.

## Routing and Workers.dev

Cloudflare serves static Worker assets through an active `workers.dev` subdomain or custom domain. A deployment can succeed yet serve nothing without an active route. If a Worker shows **No active routes**, enable its Workers.dev subdomain under **Workers & Pages → `apptonomia` → Settings → Triggers**. If only a route table is available, add `*/*` on the account's `workers.dev` zone for Worker `apptonomia`. Routes are dashboard settings, not `wrangler.toml`; enabling one needs no rebuild. If a deployment is not active afterward, retry or promote the latest successful deployment.

The landing is the apex domain. `www.apptonomia.uk` redirects to it with a dashboard-configured 308.

## Cache and service worker

No service worker: this is a landing page, not an installable PWA. `_headers` serves every asset as `no-cache, must-revalidate`. The CSP is strict (`default-src 'self'`, no third-party CDN or inline scripts, system fonts); pictograms are Unicode glyphs, so `img-src` can stay `'self' data:`.

## Deploy, rollback, and domains

Push to `main` to run validation and the gated production deploy in GitHub Actions. The deploy job uses the `CLOUDFLARE_API_TOKEN` secret in the GitHub `production` environment. For a manual deployment or preview, authenticate with `npx wrangler login`, then run `npx wrangler deploy --dry-run` and `npx wrangler deploy` (Wrangler reads `wrangler.toml`). To retry or roll back, open **Workers & Pages → apptonomia → Deployments** and select a prior successful version.

To add a custom domain, use **Workers & Pages → `apptonomia` → Custom domains → Set up a custom domain**. Cloudflare configures DNS for a zone in the account; otherwise follow the wizard's DNS instructions. Current setup: `apptonomia.uk` is the apex custom domain; its DNS is in the same Cloudflare account.

Create or rotate the Cloudflare API token in Cloudflare, then update `CLOUDFLARE_API_TOKEN` in the GitHub `production` environment. Production deployment authenticates with this token; it does not use Cloudflare Git connector OAuth.

## Project-specific notes

The portal makes no server-side calls; linked suite apps are client-side too. The `www` redirect is configured in Cloudflare, not this repository.

## References

- [`wrangler.toml`](wrangler.toml) — Worker and asset configuration.
- [`_headers`](_headers) — security and cache policy.
- [`.github/workflows/validate.yml`](.github/workflows/validate.yml) — validation and gated production deployment.
- [`CI-CD.md`](CI-CD.md) — suite-wide test matrix, release steps, and deployment modes.
- [`CLAUDE.md`](CLAUDE.md) — agent workflow and, where applicable, the canonical service-worker cache contract (§B.1).
- [Miralante's shared Cloudflare runbook](https://github.com/miralante/apptonomia/blob/main/CI-CD.md) — common setup and recovery steps.
