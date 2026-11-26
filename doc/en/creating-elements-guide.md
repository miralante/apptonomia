# Pedagogical guide for creating learning elements

> Apptonomia's canonical guide for designing activities, lessons,
> exercises, decks and other learning elements across the Miralante
> suite. Each app adapts these principles to its audience and product;
> its `SPEC.md` and technical guide define the project-specific requirements.

## 1. Design principles

Every element should have a clear, observable learning objective. Start by
asking what the learner should be able to do afterward; the format, story and
rewards should help them practise that objective.

- **Start with the learner and their context.** Use situations, vocabulary
  and knowledge familiar to the app's audience. Do not assume an age,
  experience, ability or environment that the product has not defined.
- **Make learning concrete and meaningful.** When it fits the objective,
  place the practice in a recognisable task or situation and show how the
  learning can be useful.
- **Build difficulty gradually.** Start with few concepts and visible support;
  increase one dimension of difficulty at a time. Make sure each step prepares
  for the next and provides enough practice before moving on.
- **Keep cognitive load appropriate.** Use a short instruction, direct
  vocabulary and one main idea per screen. Remove decoration, options and text
  that compete with the task.
- **Support independent participation.** Explain how to start, what to do and
  how to continue. The activity should be understandable without relying on
  an outside explanation, unless the product design says otherwise.

## 2. Accessibility and comprehension

Accessibility is part of instructional design. Follow the app's accessibility
rules and test the element with its supported input, reading and presentation
methods.

- Write direct instructions in the active voice, with one action at a time.
- Avoid double negatives, confusing metaphors and ambiguous wording.
- Do not communicate success only through colour, sound or animation; pair it
  with a perceptible, understandable signal.
- Respect the app's audio, motion, contrast and text-size preferences.
- Allow enough time and avoid penalising mistakes, pauses or different paces,
  in line with the product rules.

## 3. Hints, mistakes and reinforcement

A mistake should help the learner think and try again safely. Use a sequence
of support that preserves the chance to solve the problem:

1. **Redirect:** a small question or hint that helps reconsider the idea.
2. **Make it concrete:** a clearer hint, example or part of the procedure.
3. **Explain:** show the answer or solution with a brief explanation.

Adapt the sequence to the type of activity. Do not reveal the solution before
the learner can use the support, and avoid messages that shame, blame or
compare. After a correct answer, explain what went well and make the next step
clear.

## 4. Responsible gamification and persuasion

Use play to sustain practice and make progress visible, not to apply pressure.
Rewards should correspond to an action or achievement the learner can
understand. Progress should be clear, predictable and under the learner's
control.

Do not use false urgency, artificial scarcity, streaks that punish a pause,
social comparison as pressure, loss of progress to force a return, or deceptive
patterns. Motivation should come from learning, mastering steps, exploring and
receiving kind recognition.

Sound, animation, colour and microcopy can help maintain attention and signal
consequences. Keep these elements brief and relevant to the task, make them
optional where appropriate, and respect accessibility preferences.

## 5. Pre-publication review

- [ ] The learning objective is stated in one sentence and can be observed.
- [ ] The content fits the app's audience, scope and vocabulary.
- [ ] Difficulty increases step by step, and each level prepares for the next.
- [ ] Instructions and responses are understandable without extra explanation.
- [ ] Hints support reasoning before showing the solution.
- [ ] Feedback is specific, respectful and helps the learner continue.
- [ ] Important signals do not depend on only one sense.
- [ ] Play supports practice without pressure or penalties for pauses.
- [ ] The full flow has been tried with the accessibility preferences supported
      by the activity.
- [ ] The app's specific `SPEC.md` and technical requirements are satisfied.

## See also

- [`guia-de-cumplimiento.md`](guia-de-cumplimiento.md): easy-read writing,
  accessibility and suite-wide requirements.
- [`crear-app.md`](crear-app.md): the recipe for creating a suite sibling.
- Each app's product and technical guide: defines its requirements and
  prevails where it sets a more specific rule.
