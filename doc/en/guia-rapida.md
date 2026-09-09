# Quick guide

> 🌐 **Other language:** [Español](../es/guia-rapida.md)

This guide explains **step by step how to use Apptonomia**, the
metaproject landing of the Miralante suite. It also lists the
**four ways to open the landing** and the typical workflows for
each role.

---

## 1. How to open Apptonomia

There are **four ways**, ordered from easiest to hardest. Pick the
one that fits your situation:

| # | Method | What you need | Offline? | Notes |
|---|---|---|---|---|
| **A** | From the internet (<https://apptonomia.uk>) | A browser | ❌ | The live landing, automatically updated |
| **B** | Downloading the ZIP from GitHub | A browser | ❌ | Once unzipped, no internet needed for the landing itself |
| **C** | Local server with Python | Python 3 | ❌ | Serves the folder with the right MIME types |
| **D** | Local server with Node.js | Node.js | ❌ | Same as C, uses `npx serve` |

> 💡 If you just want to **look at the landing**, use method
> **A** or **B**. For **offline use** you need method B (and to
> have unzipped before going offline). Methods C and D are useful
> if you want to develop on the landing itself.

---

## 2. The landing

The landing at `https://apptonomia.uk/` shows **six cards**, one
per app of the suite. Each card has:

- The app's display name.
- A one-line tagline.
- An `Open` button that launches the app on its own domain in a
  new tab.

Cards are arranged in a 1 / 2 / 3 column responsive grid depending
on the viewport width. There is no carousel, no autoplaying
animation, no marketing copy.

## 3. Choosing an app

Tap (or click) any card. The app opens in a new tab on its own
domain (`<slug>.apptonomia.uk`). From there, the app is
independent — each one has its own PWA install, its own
`localStorage`, its own settings.

### 3.1 Picking the right card

If you're not sure which card matches a need:

| I want to… | Open… |
|---|---|
| Practise mental arithmetic, fractions, money, the clock | **Calculia** |
| Review a topic with flashcards | **Memofun** |
| Practise everyday decisions about money | **Okeymoney** |
| Practise daily-living routines or board games | **Routime** |
| Look up the meaning of a bureaucratic, legal, or medical word | **Sinonimia** |
| Practise touch typing on a physical keyboard | **Teclatlon** |

## 4. Buttons in each card

Each card has two main affordances:

- **The card itself** is a button. Pressing it anywhere (or
  pressing Enter while focused) opens the app in a new tab.
- **The visible `Open` button** is also a button, with the same
  target.

There is no settings route on the landing itself (Apptonomia
doesn't store anything on the device; the apps do).

## 5. Language

Tap the language button (🇪🇸 or 🇬🇧) at the top of the landing to
switch between Spanish and English. The active language is
mirrored into `<html lang>` for screen readers.

The detected language from `navigator.languages` is used on first
visit; the manual selector overrides it and is remembered for the
session (the landing doesn't write to `localStorage`).

## 6. Installing an app

Once you open an app from a card, the app itself can be installed
as a PWA:

- **iOS / iPadOS**: Share → **Add to Home Screen**.
- **Android**: menu (⋮) → **Add to Home Screen** or **Install
  App**.
- **Desktop Chrome / Edge**: install icon in the address bar.

Each app's own `doc/<lang>/team.md` covers installation in more
detail.

---

## 7. If something doesn't work

| Symptom | Likely cause | What to try |
|---|---|---|
| Landing doesn't load | No internet, or DNS | Check the URL, then the network |
| One card's `Open` button does nothing | Pop-up blocker | Allow pop-ups for `apptonomia.uk` |
| Cards are not aligned / hard to read | Very old browser | Use a browser from the last 2 years (Chrome, Edge, Safari, Firefox) |
| The language button doesn't switch | JavaScript disabled | Enable JavaScript; the landing needs it for i18n |
| An app opens but says "Service worker registration failed" | First load without network, before the app was installed | Install the app while online first, then it works offline |

For anything else, file an issue in
[`../../CONTRIBUTING.md`](../../CONTRIBUTING.md) or contact the
maintainer.

---

## See also

- [`spec.md`](spec.md) — what the landing is and the
  non-negotiable rules.
- [`team.md`](team.md) — guide for families and support
  professionals.
- Each sibling app's own `doc/<lang>/quick-guide.md` for the
  per-app installation walkthrough.
