# SPEC.md — Product definition

> **This document defines WHAT Apptonomia is, WHO it's for, and why.**
>
> To know HOW the application is built (architecture, APIs, recipes),
> see [`technical.md`](technical.md).

---

## 1. Product

Apptonomia is a **web application for occupational therapy activities** for
people with intellectual disability. It's designed so the end user can practice
daily living skills **autonomously**, without needing a professional present at
all times.

### 1.1 What it is and what it isn't

**It is:**
- A tool for autonomous practice and reinforcement between sessions
- A complement to professional intervention (family, therapist, teacher)
- An application usable without technical knowledge
- A PWA installable on the user's device

**It isn't:**
- A substitute for the occupational therapy professional
- A standardized clinical assessment tool
- A record of personal data (doesn't save personally identifiable information)
- A social network nor a system that requires an internet connection

### 1.2 Target audience

**End user (person with intellectual disability):**
- Practices activities autonomously or with point support
- Needs an accessible, clear, pressure-free interface

**Families:**
- Find a tool to work on at home
- Accompany and supervise daily use
- Observe progress through stars ⭐

**Occupational therapists and teachers:**
- Select activities that fit specific therapeutic objectives
- Use the application as a complement between sessions
- Can view the usage guide at `equipo/`

---

## 2. Product goals

### 2.1 Therapeutic objectives

Apptonomia works on **6 therapeutic areas** (modules):

| Module | Area | Main objective |
|--------|------|----------------|
| 🎯 Aiming and hands | Coordination and motor skills | Precise hand and finger movements, eye-hand coordination |
| 📋 My daily routine | Autonomy and home | Independent daily living skills |
| 🧠 Memory and attention | Memory and attention | Visual and auditory memory, attention and concentration |
| 🔢 Thinking and counting | Reasoning and math | Logic, math and strategies |
| 💬 Language and words | Language and communication | Vocabulary, comprehension, expression |
| 💜 Emotions | Emotions and relationships | Emotional recognition and regulation, social skills |

The complete catalog, area by area and activity by activity, is in
[`activities.md`](activities.md). The specific therapeutic purpose of each
activity is in `equipo/index.html`.

### 2.2 UX goals

- **Real autonomy**: the user can use the app without needing another person by their side
- **Universal accessibility**: usable by people with different abilities (easy reading, large buttons, high contrast, audio)
- **No pressure**: no visible timers, no negative scores, no "game over"
- **Continuous positive reinforcement**: celebrate attempts, not just correct answers
- **Low emotional risk**: never show explicit errors nor subtract score

---

## 3. Non-negotiable constraints (product)

These constraints come from the **product**, not technical. They are the "laws"
that are never broken, because they define what kind of experience we offer.

### 3.1 Error never punishes

- No stars or progress are subtracted for failing
- Failure produces an **encouragement** message (`animo()`), never an "incorrect"
- It can be retried without limit
- Hints are used (Socratic method) before showing the answer

### 3.2 No time pressure

- **No visible timers** in the interface
- The time the person takes isn't measured (internally it can be, but it's not shown)
- The rhythm is set by the user

### 3.3 Easy reading always

- Short sentences, one idea per sentence
- Everyday vocabulary (no technical jargon)
- No clinical language in the interface ("patient", "therapy", "disability")
- Clinical language is only allowed in `equipo/` and in repo documentation

### 3.4 Privacy by default

- **No registration**: email, real name or password aren't requested
- **No cookies or analytics**: no tracking
- **No personal data**: progress is saved on the device (`localStorage`)
- The application works without an internet connection

### 3.5 Universal accessibility

- Buttons ≥ 64×64 px, spacing ≥ 16 px
- WCAG AA contrast minimum
- Audio available on all important text (🔊 button)
- Complete keyboard navigation
- Respects `prefers-reduced-motion`
- Maximum 4–6 options per screen
- Compatible with screen readers (ARIA)

---

## 4. Design principles

These principles **rule over any other decision**. If a task conflicts with them,
the principles win. They are the product's compass.

1. **Easy reading**: short sentences, one idea per sentence, everyday vocabulary, no metaphors.
2. **One action per screen**: the user should never have to choose between more than 4–6 visible options at once.
3. **Large touch targets**: buttons minimum **64×64 px**, minimum spacing 16 px.
4. **Large typography**: 20 px base, 28–36 px titles, legible font (Atkinson Hyperlegible or Nunito).
5. **Light theme by default** with high contrast (WCAG AA minimum, AAA whenever possible).
6. **Audio everywhere**: every important text has a 🔊 button (Web Speech API, es-ES / en-US, speed 0.9).
7. **No pressure**: no visible timers, no negative scoring, no "game over".
8. **Immediate positive reinforcement**: visual + sound celebration on correct answer (≤ 2 s).
9. **`prefers-reduced-motion`**: all animations are disabled if the system requests it.
10. **Autonomy**: works offline (PWA), no login, no cost, no personal data.

---

## 5. Success criteria

A change in Apptonomia is considered successful when:

1. **Maintains autonomy**: the user can continue using the app without external help for that activity
2. **Is accessible**: complies with WCAG AA and the 13 rules in `technical.md` §5
3. **Doesn't introduce pressure**: no new counters or punishments
4. **Works offline**: the app keeps being usable without connection
5. **Respects privacy**: no new personal data is collected
6. **Maintains ES/EN parity**: any new text appears in both languages
7. **Doesn't break existing activities**: the 57 activities keep working the same

---

## 6. What Apptonomia does NOT do

Explicit decisions that may surprise — they're here so they aren't "suggested"
in the future:

| Doesn't | Why |
|--------|-----|
| Has user accounts | Privacy and simplicity |
| Stores data in the cloud | Privacy and offline-first |
| Has rankings or comparisons | No pressure, no frustration |
| Uses push notifications | Doesn't introduce pressure or external dependencies |
| Has in-app purchases | It's free and will remain so |
| Shows advertising | Public funding / non-profit |
| Collects analytics | Privacy |
| Has chatbot or generative AI | Determinism, accessibility, predictability |
| Uses social networks | Privacy and focus |
| Works on gross motor skills or postural coordination | Requires physical space and in-person support |
| Offers real-time teamwork | The application is individual and does not connect multiple people |
| Automatically assesses oral expression | Speech recognition is not reliable enough for assessment |

---

## 7. How this document is organized

This SPEC.md is the **product definition**: WHAT, FOR WHOM and WHY.
The rest of the documentation covers the HOW:

| To understand… | Read… |
|---|---|
| How the app is built | [`technical.md`](technical.md) |
| How to use the app | [`quick-guide.md`](quick-guide.md) |
| What activities there are | [`activities.md`](activities.md) |
| How to use Apptonomia in therapy | [`team.md`](team.md) |
| Map of all documentation | [`../index.md`](../index.md) |
