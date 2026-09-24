#!/usr/bin/env node
/**
 * One-off: write the canonical SECURITY.{md,es.md} into the seven sibling
 * projects + the metaproject doc/templates/. Variables resolved per repo.
 *
 * Run from apptonomia/ (anywhere):
 *   node scripts/one-off/write-security-md.js
 *
 * Idempotent: rewrites the same bytes each run.
 *
 * The canonical template lives at apptonomia/doc/templates/SECURITY.{md,es.md}
 * after this script runs; per-project copies are concrete renderings of it.
 */

const fs = require('fs');
const path = require('path');

// __dirname is apptonomia/scripts/one-off; climb three levels to reach Miralante/
const ROOT = path.resolve(__dirname, '..', '..', '..');
const SUITE = ['apptonomia', 'calculia', 'memofun', 'okeymoney', 'teclatlon', 'sinonimia', 'routime'];

// Per-repo values resolved from git origin and current default branch.
//
// Suite-wide conventions, declared once here:
//   * GitHub org is `miralante` for every sibling.
//   * Default branch TARGET is `main`. apptonomia/memofun/sinonimia are
//     already on `main`; the four `master` repos (calculia, okeymoney,
//     teclatlon, routime) keep their `branch: 'master'` until migrated.
//     When you migrate a repo, change only the `branch` field below,
//     run the script, and the SECURITY files follow the rename.
//   * Support email is read at render time from each repo's
//     `app.config.json > supportEmail` (source of truth since each
//     repo now carries the field). The `supportEmail` value here is
//     a hard fallback for two cases: (a) a repo whose app.config.json
//     hasn't been updated yet, (b) sanity check that the on-disk
//     value didn't accidentally disappear. If you see the warning
//     `note: using fallback` in the output, that's the signal.
//   * The `extraThreat` / `extraThreatEs` block is a per-project addendum
//     to the threat model. Today only Memofun sets it (no third-party /
//     no AI integration / Node.js `scripts/`). Keep it empty for the rest.
const REPOS = {
  apptonomia: { gitOrg: 'miralante', repo: 'apptonomia', branch: 'main', supportEmail: 'hello@apptonomia.uk', extraThreat: '', extraThreatEs: '' },
  calculia:   { gitOrg: 'miralante', repo: 'calculia',   branch: 'main', supportEmail: 'hello@apptonomia.uk', extraThreat: '', extraThreatEs: '' },
  memofun:    { gitOrg: 'miralante', repo: 'memofun',    branch: 'main', supportEmail: 'hello@apptonomia.uk',
    extraThreat: "Memofun's static site ships **no third-party library at all** " +
                 "(not even from a CDN), and the codebase contains **no integration with any external API** " +
                 "\u2014 not even an AI one. The `scripts/` utilities (Node.js, zero npm packages) " +
                 "run locally, outside the site, make no network calls, and expose no service.",
    extraThreatEs: "El sitio estático de Memofun **no incluye ninguna librería de terceros** " +
                   "(tampoco por CDN), y el código **no contiene ninguna integración con ninguna API externa** " +
                   "\u2014 tampoco de IA. Las utilidades de `scripts/` (Node.js, sin paquetes npm) " +
                   "corren en local, fuera del sitio, no hacen ninguna llamada de red y no exponen ningún servicio." },
  okeymoney:  { gitOrg: 'miralante', repo: 'okeymoney',  branch: 'main', supportEmail: 'hello@apptonomia.uk', extraThreat: '', extraThreatEs: '' },
  teclatlon:  { gitOrg: 'miralante', repo: 'teclatlon',  branch: 'main', supportEmail: 'hello@apptonomia.uk', extraThreat: '', extraThreatEs: '' },
  sinonimia:  { gitOrg: 'miralante', repo: 'sinonimia',  branch: 'main', supportEmail: 'hello@apptonomia.uk', extraThreat: '', extraThreatEs: '' },
  routime:    { gitOrg: 'miralante', repo: 'routime',    branch: 'main', supportEmail: 'hello@apptonomia.uk', extraThreat: '', extraThreatEs: '' },
};

// Resolve `supportEmail` for a repo by reading its `app.config.json`.
// Falls back to the value baked into REPOS if the field is missing,
// and prints a one-line note to stderr so a human notices.
function resolveSupportEmail(slug) {
  const cfgPath = path.join(ROOT, slug, 'app.config.json');
  if (!fs.existsSync(cfgPath)) return { value: REPOS[slug].supportEmail, fromConfig: false };
  try {
    const cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
    if (typeof cfg.supportEmail === 'string' && cfg.supportEmail.length > 0) {
      return { value: cfg.supportEmail, fromConfig: true };
    }
  } catch (e) {
    // fall through to in-script value
  }
  process.stderr.write('note: using fallback supportEmail for ' + slug +
    ' (app.config.json missing or unreadable)\n');
  return { value: REPOS[slug].supportEmail, fromConfig: false };
}


// Render template by substituting {{KEY}} tokens. Unknown tokens throw.
function render(tpl, ctx) {
  return tpl.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    if (!(key in ctx)) throw new Error('Missing template key: ' + key);
    return ctx[key];
  });
}

// Common template body (English) — note: kept in sync with SECURITY.es.md below.
const EN_BODY = `# Security policy

{{DISPLAY_NAME}} is a fully client-side static site: no server of its own,
no backend, no database, no telemetry, no third-party runtime calls, no
accounts. The attack surface is essentially the browser sandbox on the
same origin (the HTTP security headers in \`_headers\` are
written to keep it that way — CSP locked to \`'self'\`, no inline scripts,
no \`connect-src\` to third parties).

{{SUITE_SPECIFIC_THREAT_MODEL}}

## Supported versions

Only the \`{{DEFAULT_BRANCH}}\` branch receives security patches. We do not
maintain old versions.

The cache-bump rule (see \`CLAUDE.md\` §B.1) is what makes "supported"
meaningful: a \`VERSION\` bump in \`sw.js\` is the only mechanism that
forces installed PWAs to pick up the new code. We support the
**latest deployed \`VERSION\` only**; older versions are not patched.

## Reporting a vulnerability

Open a private advisory via
[GitHub Security Advisories](https://github.com/{{GIT_ORG}}/{{REPO}}/security/advisories/new).

Please include:

- A short description and reproduction steps.
- Observed or expected impact.
- The affected commit SHA or tag.

If you cannot use Security Advisories, open an issue clearly labelled
as **security** and prepend \`[SEC]\` to the title. **Do not upload
runnable proof-of-concept code** to a public issue — wait for a
maintainer to coordinate.

If neither channel is appropriate, email \`{{SUPPORT_EMAIL}}\` instead.

## What to expect

- Acknowledgement within 5 business days.
- First assessment (reproduction, severity, plan) within 15 business days.
- If confirmed, a patch or mitigation as soon as feasible.

## Coordinated disclosure

We prefer to coordinate disclosure if the fix requires user-visible
changes to the UI or the PWA shell.

## Out of scope

- Vulnerabilities in the user's browser (we ship plain HTML/CSS/JS;
  report to the browser vendor).
- Vulnerabilities in Cloudflare's Workers runtime (report to
  Cloudflare).
- Self-XSS (a user pasting malicious code into their own browser
  console).

## See also

- [\`CLOUDFLARE.md\`](CLOUDFLARE.md) — the deploy runbook.
- [\`_headers\`](_headers) — the HTTP security headers in effect.
- \`CLAUDE.md\` §B — the suite-wide policies (no telemetry, WCAG
  AAA, public-facing wording).
`;

const ES_BODY = `# Política de seguridad

{{DISPLAY_NAME}} es un sitio estático completamente del lado del cliente:
no tiene servidor propio, ni backend, ni base de datos, ni telemetría,
ni llamadas de runtime a terceros, ni cuentas. La superficie de ataque
es esencialmente la del navegador sobre el mismo origen (las cabeceras
de seguridad HTTP en \`_headers\` están escritas para que
siga siendo así — CSP bloqueada a \`'self'\`, sin scripts inline, sin
\`connect-src\` a terceros).

{{SUITE_SPECIFIC_THREAT_MODEL_ES}}

## Versiones soportadas

Solo la rama \`{{DEFAULT_BRANCH}}\` recibe parches de seguridad. No
mantenemos versiones antiguas.

La regla del bump de caché (ver \`CLAUDE.md\` §B.1) es lo que hace que
"soportada" signifique algo: un bump de \`VERSION\` en \`sw.js\` es el
único mecanismo que fuerza a las PWAs instaladas a recoger el nuevo
código. Damos soporte **solo a la última \`VERSION\` desplegada**; las
versiones anteriores no se parchean.

## Cómo reportar una vulnerabilidad

Abre un aviso privado a través de
[GitHub Security Advisories](https://github.com/{{GIT_ORG}}/{{REPO}}/security/advisories/new).

Por favor, incluye:

- Descripción breve y pasos para reproducir.
- Impacto observado o esperado.
- SHA de commit o etiqueta afectada.

Si no puedes usar Security Advisories, abre un issue etiquetándolo
claramente como **security** y añade el prefijo \`[SEC]\` al título.
**No subas pruebas de concepto explotables** a un issue público:
espera a que un maintainer coordine.

Si ninguno de los canales es adecuado, escribe a \`{{SUPPORT_EMAIL}}\`.

## Qué esperar

- Acuse de recibo en 5 días laborables.
- Primera evaluación (reproducción, severidad, plan) en 15 días
  laborables.
- Si se confirma, un parche o mitigación en cuanto sea viable.

## Divulgación coordinada

Preferimos coordinar la divulgación si la corrección requiere cambios
visibles en la UI o en el shell de la PWA.

## Fuera de alcance

- Vulnerabilidades en el navegador de la persona usuaria (enviamos
  HTML/CSS/JS plano; reportar al vendor del navegador).
- Vulnerabilidades en el runtime de Workers de Cloudflare (reportar
  a Cloudflare).
- Auto-XSS (una persona pegando código malicioso en su propia
  consola del navegador).

## Ver también

- [\`CLOUDFLARE.md\`](CLOUDFLARE.md) — el runbook de despliegue.
- [\`_headers\`](_headers) — las cabeceras HTTP de seguridad en
  vigor.
- \`CLAUDE.md\` §B — las políticas transversales de la suite (sin
  telemetría, WCAG AAA, lenguaje público).
`;

// Display name (capitalised, no diacritics — Latin only).
const DISPLAY = {
  apptonomia: 'Apptonomia',
  calculia:   'Calculia',
  memofun:    'Memofun',
  okeymoney:  'Okeymoney',
  teclatlon:  'Teclatlon',
  sinonimia:  'Sinonimia',
  routime:    'Routime',
};

function writeFile(p, body) {
  fs.writeFileSync(p, body, { encoding: 'utf8' });
}

function renderProject(slug, body, isEs) {
  const r = REPOS[slug];
  const email = resolveSupportEmail(slug);
  const ctx = {
    DISPLAY_NAME: DISPLAY[slug],
    GIT_ORG: r.gitOrg,
    REPO: r.repo,
    DEFAULT_BRANCH: r.branch,
    SUPPORT_EMAIL: email.value,
    SUITE_SPECIFIC_THREAT_MODEL: r.extraThreat,
    SUITE_SPECIFIC_THREAT_MODEL_ES: r.extraThreatEs,
  };
  return render(body, ctx);
}

function renderTemplate(slug, body) {
  // The doc/templates/ files keep the {{...}} placeholders so new siblings
  // can copy them. We render with empty extras and a placeholder branch to
  // produce a valid example file at the same time.
  const ctx = {
    DISPLAY_NAME: '{{DISPLAY_NAME}}',
    GIT_ORG: '{{GIT_ORG}}',
    REPO: '{{REPO}}',
    DEFAULT_BRANCH: '{{DEFAULT_BRANCH}}',
    SUPPORT_EMAIL: '{{SUPPORT_EMAIL}}',
    SUITE_SPECIFIC_THREAT_MODEL: '{{SUITE_SPECIFIC_THREAT_MODEL}}',
    SUITE_SPECIFIC_THREAT_MODEL_ES: '{{SUITE_SPECIFIC_THREAT_MODEL_ES}}',
  };
  return render(body, ctx);
}

// 1. Render per-project files.
let wrote = 0;
for (const slug of SUITE) {
  const base = path.join(ROOT, slug);
  if (!fs.existsSync(base)) continue;
  const en = renderProject(slug, EN_BODY, false);
  const es = renderProject(slug, ES_BODY, true);
  const enPath = path.join(base, 'SECURITY.md');
  const esPath = path.join(base, 'SECURITY.es.md');
  writeFile(enPath, en);
  writeFile(esPath, es);
  wrote += 2;
  console.log('wrote', enPath);
  console.log('wrote', esPath);
}

// 2. Render the canonical template at apptonomia/doc/templates/.
const tplDir = path.join(ROOT, 'apptonomia', 'doc', 'templates');
if (fs.existsSync(tplDir)) {
  writeFile(path.join(tplDir, 'SECURITY.md'), renderTemplate('apptonomia', EN_BODY));
  writeFile(path.join(tplDir, 'SECURITY.es.md'), renderTemplate('apptonomia', ES_BODY));
  wrote += 2;
  console.log('wrote', path.join(tplDir, 'SECURITY.md'));
  console.log('wrote', path.join(tplDir, 'SECURITY.es.md'));
}

console.log('done; total files written:', wrote);