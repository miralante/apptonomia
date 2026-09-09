# Guide for families and support professionals

> 🌐 **Other language:** [Español](../es/equipo.md)

This document is the **guide for families, therapists, teachers and
caregivers** — the people who help the end user navigate the
Miralante suite. It explains how to pick the right app of the
suite for a need, how to install it on a device, and where to find
deeper per-sibling documentation.

The Apptonomia landing at `https://apptonomia.uk/` is the entry
point: it shows the six apps of the suite, one card per app. Each
card opens that app in a new tab on its own domain. From there,
each app is independent and ships its own `doc/<lang>/team.md` with
per-app support guidance.

---

## 1. What is the Miralante suite?

The Miralante suite is **seven free static web apps**, each
addressing a different everyday need:

| App | What it helps with | Domain |
|---|---|---|
| **Calculia** | Math and logical reasoning with short, visual activities | <https://calculia.apptonomia.uk> |
| **Memofun** | Study flashcards for autonomous review, one idea per card | <https://memofun.apptonomia.uk> |
| **Okeymoney** | Personal finance and everyday financial autonomy | <https://okeymoney.apptonomia.uk> |
| **Routime** | Everyday activities to train mind and daily-life skills | <https://routime.apptonomia.uk> |
| **Sinonimia** | Easy-read dictionary of difficult words | <https://sinonimia.apptonomia.uk> |
| **Teclatlon** | Touch typing on the physical computer keyboard | <https://teclatlon.apptonomia.uk> |

The **Apptonomia landing** at <https://apptonomia.uk> links to
all six. Each app is **free, without accounts, without telemetry**
— progress lives only in the device's `localStorage`.

---

## 2. Picking the right app

The landing cards are grouped by **what the person wants to do
today**, not by therapeutic taxonomy. Pick the card that matches
the activity you want to support:

| If you want to… | Open… |
|---|---|
| Practise mental arithmetic, fractions, money, the clock, patterns, riddles | **Calculia** |
| Review a topic with flashcards between classes (literature, geography, science, history…) | **Memofun** |
| Practise everyday decisions about money (balance, savings goals, recording an expense) | **Okeymoney** |
| Practise daily-living routines, board games, or emotion recognition | **Routime** |
| Look up the meaning of a bureaucratic, legal, or medical word in plain language | **Sinonimia** |
| Practise touch typing on the physical computer keyboard | **Teclatlon** |

If you're not sure which app fits, open **Calculia** first — it
is the broadest cross-cutting tool (15 activities across math and
reasoning). For more nuanced support decisions, each app's own
`doc/en/team.md` goes deeper.

---

## 3. Installing an app

Each app that ships as a PWA can be installed to the device's
home screen for offline use. The flow is the same on every
device:

1. Open the app's URL in a modern browser (Chrome, Edge, Safari,
   Firefox).
2. Wait for the page to fully load.
3. **iOS / iPadOS**: tap the Share button, then **Add to Home
   Screen**.
4. **Android**: tap the browser's menu (⋮), then **Add to Home
   Screen** or **Install App**.
5. **Desktop Chrome / Edge**: click the install icon in the
   address bar (a small monitor with a down arrow), or open the
   menu → **Install [App Name]**.

Once installed, the app runs in its own window, without the
browser's URL bar, and works offline.

### 3.1 What gets stored on the device

- **Progress, settings and personal data** live in
  `localStorage` on the device. No accounts, no cloud sync.
- **You can wipe everything the app stores** from the in-app
  **Settings** route (or, on PWAs that don't ship a Settings
  route, with a "Borrar mis datos" button on the main menu).
- The wipe is **scoped to that one app's `localStorage`
  prefix**. It does not affect the browser's other apps or
  data.

---

## 4. Helping a person use an app

### 4.1 Before the session

- Make sure the device is charged (or plugged in).
- Make sure the app is already open, in the language the person
  uses.
- Sit beside the person, not across from them — your face is not
  what they're looking at; the screen is.
- Turn off notifications for the duration of the session if you
  can.

### 4.2 During the session

- **Don't time the activity.** None of the apps have timers; the
  absence of a clock is a feature, not a bug.
- **Don't grade.** The apps do not give negative feedback. If the
  person answers wrong, the app says something encouraging and
  lets them try again.
- **Don't push past frustration.** If the person wants to stop,
  stop. The activity will be there next session.
- **Listen to "almost" or "I don't know" as legitimate answers.**
  The apps surface those signals on their own.

### 4.3 After the session

- Let the person close the session however they want. Some apps
  auto-save on every action; others save on close. None of them
  ask "are you sure you want to leave?"
- If the device is shared with other people (siblings, partner),
  the per-app `localStorage` keeps each user's progress
  separately — there is no shared state to worry about.

---

## 5. Privacy and data

The Miralante suite is built around a single privacy promise:
**nothing leaves the device**. Concretely:

- **No accounts.** Anyone can use any app without signing up.
- **No analytics.** The apps do not call Google Analytics,
  Plausible, Sentry, or any other third-party telemetry.
- **No remote AI.** The apps do not call Gemini, OpenAI,
  Anthropic, or any other AI API. The cards in Memofun, for
  example, are written by the maintainer, not generated live.
- **No fonts from a CDN.** The two typefaces the suite uses
  (Atkinson Hyperlegible, Nunito) are bundled under
  `assets/fonts/` in each app's repo.
- **No telemetry, no cookies, no fingerprinting.** The apps
  make the same number of network requests on every visit — the
  static assets and nothing else.

The full threat model is in
[`../../CLAUDE.md`](../../CLAUDE.md) §A.2.2 and the per-sibling
`CLOUDFLARE.md`.

### 5.1 When the support person should consider wiping

- The person using the device has changed (e.g. one device
  shared between two users at different support centres).
- The app has been used by someone else (e.g. a sibling,
  partner, friend) and you want a clean slate.
- The device is being donated, recycled or returned.

In each case, the in-app Settings route (or the menu button)
wipes only that one app's progress. Other apps on the device
are untouched.

---

## 6. When something doesn't work

If an app behaves unexpectedly:

1. **Check the browser.** The apps require a modern browser
   (Chrome / Edge / Safari / Firefox from the last ~2 years).
   Older browsers may not support the service worker, IndexedDB
   or the CSS features the apps use.
2. **Try a hard refresh.** `Ctrl + Shift + R` (Windows / Linux)
   or `Cmd + Shift + R` (macOS) reloads the page and busts the
   cache.
3. **Try an incognito window.** If the app works there, the
   problem is in your local state (a corrupted `localStorage`
   key, for example). Wipe and reinstall.
4. **Check the network.** The apps are offline-capable once
   installed, but the **first** load needs the network. If the
   device is offline and the app hasn't been installed yet,
   you'll see a 404 or a network error — that's expected.

If the issue persists, **file an issue** in the affected
sibling's repo (`miralante/<sibling>`) using the bug template —
do **not** include personal data in the report.

---

## 7. Contributing as a support professional

Support professionals are the second-largest contributor group in
the Miralante suite — after the developers. The most common
contributions:

- **Wording fixes.** "This sentence is too long", "This word is
  too formal", "This example doesn't fit our centre's reality".
  File as a `content` issue.
- **Difficulty levels.** "This activity is too easy / too hard
  for our group", "Could you add a `Básico` / `Intermedio`
  level?". File as a `UX` issue.
- **Missing content.** "We need an activity about [topic] that
  the suite doesn't have yet". File as a `content` issue.

All contributions are welcome. The contribution workflow for each
sibling lives in its own `CONTRIBUTING.md` (linked from the
landing card).

---

## 8. See also

- The Apptonomia landing at <https://apptonomia.uk>.
- Each sibling's `doc/en/team.md` for per-app support guidance.
- The metaproject's [`../../CLAUDE.md`](../../CLAUDE.md) for the
  suite-wide policies that affect every app.
- [`guia-de-cumplimiento.md`](guia-de-cumplimiento.md) for the
  cross-project compliance rules (UNE 153101, WCAG AAA,
  public-facing wording, no telemetry).
