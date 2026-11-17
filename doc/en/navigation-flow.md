# Navigation flow (suite standard)

The suite has one navigation tree, the same in every app. The achievement screen
is a state of an activity's page, and it returns the person to the start of that
activity. It never moves them on to another activity by itself.

> 🌐 **Other language:** [Spanish](../es/flujo-navegacion.md)

## The tree

```
Home           index.html of the app: the whole catalogue
└── Hub        a page that lists the activities of one group or section
    └── Activity   its entry point: the page as it opens, with its first screen
        └── Achievement   a state of the same page, shown inside <main>
                          «A por más» → back to the entry point of the activity
```

- **Home** is the top of the app.
- **Hub** is the level above an activity. The activity's header back link
  (`.back-link`) goes there. The suite already requires that link on every page
  below the home (see `doc/en/shared-blocks.md`, suite-chrome): it always goes one
  level up, never back through the browser history.
- **Activity** has its stages (explanation, real life, test) inside the page. The
  stages move with the page's own buttons.

## The rules

1. **The entry point of an activity is the page as it opens.** Its first screen is
   where the activity starts, and where a person returns after an achievement.
2. **The achievement is shown in the page.** It takes the place of the activity's
   content inside `<main>`. The header and the back link stay visible. It is not a
   layer over the page.
3. **«A por más» returns to the entry point of the activity.** It reloads the page
   (`App.navigation.entry()`), which shows the first screen and keeps the saved
   progress. An activity may pass its own action instead, for something that must
   happen inside the page: calculia's tests return to their first explanation slide
   (`reviewIntro`), for instance.
4. **The achievement never moves the person to another activity.** Going to a
   different activity is a choice the person makes from the hub, with the back link.
   A link that declares the next activity (`rel="next"`) is not used by the
   achievement, and no page declares one.
5. **A sentence star or another reward that does not end an activity** passes an
   empty action, so the person stays where they are.

## How it works in the code

The achievement block lives in `apptonomia/scripts/suite/celebrate.js` and
`celebrate.css`, copied into each app's `assets/js/feedback.js` and shared
stylesheet by `scripts/sync-answer-round.js`:

- `celebrate(message, after, goal)` puts the reward in `<main>` (`#app-celebration`),
  marks `<main>` with `.is-celebrating`, and hides the rest of the content while it
  is shown.
- «A por más» hides the reward again and then calls `after`, or
  `App.navigation.entry()` when there is no `after`.

## Checks

- A page with an achievement has a `<main>`, so the reward has a place to appear.
- Every page below the home has a back link in its header, so the person can go up
  to the hub.

## Related

- [`shared-blocks.md`](shared-blocks.md): the shared blocks and how they are copied.
- `apptonomia/scripts/suite/celebrate.js`: the canonical source of the achievement
  and of the entry point.
