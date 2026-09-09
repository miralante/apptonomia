# Apptonomia

**Portal page that introduces the six free apps of the Miralante suite — Calculia, Memofun, Okeymoney, Routime, Sinonimia and Teclatlon.**

---

## What is Apptonomia?

Apptonomia is the **landing page** of the Miralante suite. It does not run an app itself — its job is to help you find the right one of the six free apps for what you want to do today, and to link you straight to it.

Open **[apptonomia.uk](https://apptonomia.uk)** and you will see one card per app. Tap any card to open that app in your browser. Each app is independent: it runs in the browser, free of charge, without accounts and without personal data.

---

## What you can find here

The landing shows six cards, one for each app of the suite. Each card has a short description and a button that opens the app at its own domain.

| App | What it does |
|---|---|
| **Calculia** | Math and logical reasoning with short, visual activities. |
| **Memofun** | Study flashcards for autonomous review, one idea per card. |
| **Okeymoney** | Personal finance and everyday financial autonomy. |
| **Routime** | Everyday activities to train mind and daily-life skills between sessions. |
| **Sinonimia** | Easy-read dictionary of difficult words, with synonyms and pictograms. |
| **Teclatlon** | Touch typing on the physical computer keyboard, finger by finger. |

---

## Key features

### ✅ Designed for autonomy

- **No pressure**: the landing has no sign-up, no popups, no marketing
- **Easy Reading**: short sentences, everyday vocabulary, one idea per card
- **Bilingual**: Spanish (default) and English

### ✅ Accessible to everyone

- **Large buttons**: minimum 64×64 pixels
- **Large text**: clear readable font (Atkinson Hyperlegible)
- **High contrast** and visible focus rings
- **Keyboard navigation** and full `prefers-reduced-motion` support

### ✅ Privacy by default

No backend, no database, no telemetry, no third-party runtime. The landing is one static HTML file with a tiny i18n bootstrap and two language bundles. There is nothing to clear, nothing to delete.

### ✅ In two languages

- 🇪🇸 **Español** (default)
- 🇬🇧 **English** (can be changed with the language button)

---

## Getting started

### 1. Open the landing

Visit **[apptonomia.uk](https://apptonomia.uk)** or open `index.html` from a local server.

### 2. Pick the app you want to try

Read the six cards. Each card has a short description of what the app does and a button that opens it in a new tab.

### 3. Install the app you like (optional)

Each app is a PWA: you can install it on your home screen for offline use, just like a native app. Install instructions live in each app's own documentation.

### 4. Change language

Tap the language button (🇪🇸 or 🇬🇧) at the top of the landing.

---

## Example of use

Imagine you want to practise mental arithmetic today. You open **[apptonomia.uk](https://apptonomia.uk)** and you see six cards. The first one says **"Calculia — math and logical reasoning with short, visual activities"**. You tap **Open** and Calculia opens in a new tab. From there, you can install Calculia on your home screen and use it whenever you want.

---

## More information

- [`../README.md`](../../README.md) — Repository overview, build, deploy
- [`../../CLAUDE.md`](../../CLAUDE.md) — How the metaproject is run, and the cross-project sync script
- [`../../CLOUDFLARE.md`](../../CLOUDFLARE.md) — Canonical Cloudflare Workers deploy guide for the whole suite

---

## Credits and licence

Apptonomia is an open source project, distributed under the MIT licence.

Each of the six apps in the suite has its own repository, its own maintainers (or shared ones) and its own MIT licence. They share the same accessibility-first / no-backend philosophy but no code.
