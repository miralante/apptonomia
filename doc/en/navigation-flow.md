# Navigation flow (suite standard)

The suite has one way to move a person through an app: from an activity to the
next logical point, the same way in every app. The achievement screen uses it,
so closing an achievement never restarts the activity it closes.

> 🌐 **Other language:** [Spanish](../es/flujo-navegacion.md)

## The problem it solves

Before this standard, the closing button of the achievement screen ("A por más")
did whatever the activity wired it to. Several activities wired it to start the
activity again from its first slide, so finishing the activity showed the
achievement, and closing it showed the first slide again: a loop. Each activity
had its own answer to "what comes next", and none of them was the same.

## The levels

A person moves through three levels. Every page sits at one of them.

| Level | What it is | Example |
|---|---|---|
| Home | The entry page of the app, with the whole catalogue | `index.html` of the app |
| Hub | A page that lists the activities of one group or section | `numbers-group/`, the activity list of a route |
| Activity | One activity. Its stages (explanation, real life, test) are inside the page | `tools/los-numeros/` |

Between the levels a page has at most two links:

- **Up** is the level above. It is the page's back link (`.back-link`). The suite
  already requires it (see `doc/en/shared-blocks.md`, suite-chrome): it always goes
  one level up, never back through the browser history.
- **Next** is the next logical point of the flow. It is optional. It is either the
  next stage of the same activity (when a stage is its own page) or the next
  activity of a sequence. It is declared with a standard link in the head:

  ```html
  <link rel="next" href="../order-numbers/">
  ```

  A page without `rel="next"` has no next point; its flow ends at its up link.

## The rules

1. **Stages inside a page move with the page's own buttons.** Explanation, real
   life and test are changed by the activity's own controls (arrows, "Siguiente",
   "Empezar"). The achievement screen does not move between stages.
2. **The achievement screen closes a round or a test.** Its button **«A por más»**
   resumes the flow:
   - a page with `rel="next"` goes to the next point;
   - otherwise, to the up link (the hub the activity belongs to);
   - otherwise (no up link), the screen only closes.
3. **An explicit action replaces the flow.** When the activity itself must continue
   inside the page (the next question, the next round, a wizard that closes), it
   passes its own action to `celebrate`. That action replaces the flow. Use it
   only for continuations inside the activity.
4. **The achievement never repeats a round of the same activity.** Another round of
   the same test started from the achievement is the loop this standard removes.
   When a test activity has no next point, «A por más» returns to the **entry point**
   of the activity: its first explanation slide, where the person chooses what to do.
   This is the choice made for calculia's test activities. It is implemented in two
   ways: `reviewIntro` (`activity-flow-options.js`) puts the first explanation slide
   back on screen, and the round-based activities reload their page
   (`window.location.reload()`, which shows the page's first screen and keeps the saved
   progress). It is an explicit action, not a repetition of the round.
5. **Stay on the page only when the closed achievement is not the end of an
   activity.** A sentence star, for instance, passes an empty action so that the
   person stays where they are.

## How it works in the code

The navigation object lives in the shared achievement block
(`apptonomia/scripts/suite/celebrate.js`, copied into `assets/js/feedback.js` of
each app by `scripts/sync-answer-round.js`). It is exposed as `App.navigation`:

- `App.navigation.target()`: the URL the flow goes to from this page, or `null`.
- `App.navigation.resume()`: goes there. It returns `false` when there is no
  target, and the achievement screen then just closes.

The achievement screen calls `resume()` when its button has no explicit action.
Nothing else in the app is needed. There is no table of routes in the code: the
flow is read from the page, so a page that gains or loses a next point changes its
flow by changing its markup only.

## Declaring the flow of a page

| Point of the flow | Markup | Required |
|---|---|---|
| Up (the hub or the level above) | `<a class="back-link" href="../">` in the header | yes, on every page below the home |
| Next (the next stage or activity) | `<link rel="next" href="…">` in `<head>` | only where the flow has a next point |

The template (`apptonomia/doc/templates/app-template/`) carries both examples.

## Checks

- A page with an achievement screen and no up link closes and stays. That is
  allowed, but the page must then have an up link through its header before it
  ships, so that the flow can leave the activity.
- `rel="next"` must point to an existing page of the same app.

## Where it applies

Every app of the suite carries the shared block, so every page that shows an
achievement screen uses this flow. Calculia, Routime, Memofun, Okeymoney, Teclatlon
and Sinonimia are covered by the same block; the new-app template is too.

## Related

- [`shared-blocks.md`](shared-blocks.md): the shared blocks and how they are copied.
- `apptonomia/scripts/suite/celebrate.js`: the canonical source of the navigation
  object and of the achievement screen.
