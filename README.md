# Apptonomia

> 🌐 **Other languages:** [Español](README.es.md)

**Portal page for the Apptonomia suite** — a free, static, dependency-free
landing that links out to six small sibling web apps, all designed to
help people learn at their own pace, in the browser, free of charge,
without accounts and without personal data.

- 🌐 **App**: [apptonomia.uk](https://apptonomia.uk/)
- 📦 **Repository**: [github.com/miralante/apptonomia](https://github.com/miralante/apptonomia)
- 💻 **Run locally**: open `index.html` directly in a browser, or serve
  the folder with any static server (`npx serve .` /
  `python -m http.server 8080`).

---

## What this repo is

This repository hosts the **landing portal** of the Apptonomia suite:
a single static page that introduces the six sibling apps and links to
each one. It is intentionally tiny — a single `index.html`, an i18n
bootstrap (`bootstrap.js` + `script.js`), the two `strings.<locale>.js`
bundles, and a `_headers` file for HTTP security headers.

The actual apps live in their own repositories:

| App | What it is | Repository |
|---|---|---|
| **Apptonomia** *(this repo — portal)* | Landing page that introduces the suite | [github.com/miralante/apptonomia](https://github.com/miralante/apptonomia) |
| [Routime](https://routime.apptonomia.uk/) | Occupational therapy: 7 modules, 68 activities | [github.com/miralante/routime](https://github.com/miralante/routime) |
| [Calculia](https://calculia.apptonomia.uk/) | Math and logical reasoning: 12 activities | [github.com/miralante/calculia](https://github.com/miralante/calculia) |
| [Memofun](https://memofun.apptonomia.uk/) | Flashcards built around meaningful learning | [github.com/miralante/memofun](https://github.com/miralante/memofun) |
| [Okeymoney](https://okeymoney.apptonomia.uk/) | Personal finance and everyday autonomy | [github.com/miralante/okeymoney](https://github.com/miralante/okeymoney) |
| [Sinonimia](https://sinonimia.apptonomia.uk/) | Plain-language dictionary (easy-read) | [github.com/miralante/sinonimia](https://github.com/miralante/sinonimia) |
| [Teclatlon](https://teclatlon.apptonomia.uk/) | Touch-typing with a physical keyboard | [github.com/miralante/teclatlon](https://github.com/miralante/teclatlon) |

---

## 📚 Documentation

| Topic | Document |
|---|---|
| Product, audience, accessibility rules | [`SPEC.md`](SPEC.md) · [`doc/en/SPEC.md`](doc/en/SPEC.md) |
| Architecture and technical reference | [`technical.md`](technical.md) · [`doc/en/technical.md`](doc/en/technical.md) |
| Internationalization (add a language) | [`doc/en/I18N.md`](doc/en/I18N.md) · [`doc/es/I18N.md`](doc/es/I18N.md) |
| Deploy runbook (Cloudflare Workers) | [`CLOUDFLARE.md`](CLOUDFLARE.md) |
| AI agent operational workflow | [`CLAUDE.md`](CLAUDE.md) |

Project history lives in `git log`; no external roadmap is maintained.

---

## ☁️ Deploying

Apptonomia is a fully static site (HTML/CSS/JS, no build step), so it
ships directly to **[Cloudflare Workers (static assets)](https://developers.cloudflare.com/workers/static-assets/)**
through its built-in GitHub integration. The HTTP security headers
live in [`_headers`](_headers), and the project metadata in
[`wrangler.toml`](wrangler.toml). See [`CLOUDFLARE.md`](CLOUDFLARE.md)
for the full runbook (rebuild, rollback, custom domain, credential
rotation).

Pull requests automatically get a preview URL on
`apptonomia-<branch>.<account-subdomain>.workers.dev` — no extra
workflow is needed.

---

## ✅ Validate

```bash
node scripts/check.js
```

No `npm install` needed — the script only uses Node's standard library.

---

## 📄 License

MIT — see [`LICENSE`](LICENSE).

---

## 🙌 Contributing

Contributions are welcome. See
[`CONTRIBUTING.md`](CONTRIBUTING.md) for the workflow, the project
roles, and the recipes (new language, copy edits, accessibility
fixes). All participants are expected to follow
[`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md).

---

## 🔐 Security

Apptonomia is a fully client-side static site: no backend, no
database, no telemetry, no third-party runtime. To report a
vulnerability see [`SECURITY.md`](SECURITY.md).