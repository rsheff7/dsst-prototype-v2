# Phone prep view — applying the Premo Social Studies design to DSST

Branch: `phone-prep-view`. Source design: `premo-prep-v2.html` (Premo Prep 7.7.9, Social Studies).
Status: first working cut on this branch (`/prep`). The only change to `/lesson` is a link to it on phone widths.

## What the design is

The Social Studies phone view is not the five tools shrunk to a phone. It is a **guided
evening prep** of about 18 minutes in six steps, where each step asks the teacher to *do*
something before Premo shows its own answer. The five tools stay as a reference
**Library**, and the prep produces an **In-class card** for use during the lesson.

| Piece | What the teacher does | Premo tool behind it |
|---|---|---|
| Home ("Tonight") | Sees the lesson, the time estimate, and the six steps; sets the class ELD profile once | — |
| 1 Orient (2 min) | Reads the destination and the arc as a timeline; tap an activity for a bottom sheet | Quick Read |
| 2 Do it as a student (3 min) | Writes an answer to the key task, then checks it against look-fors | Quick Read |
| 3 Predict the crux (3 min) | Predicts what students will do at the crux, *then* sees Premo's patterns | Thinking |
| 4 Rehearse (6 min) | For each crux scenario: says a move aloud, checks it against criteria, then sees model wording; can flag it as hard | Moves |
| 5 Adjust (2 min) | Toggles cuts; sees "never cut" and MLL supports filtered to the class; rigor check pinned | Adapt |
| 6 Carry it (1 min) | Gets a prep summary, copyable coach text, and the In-class card | — |

Interaction patterns worth keeping: sticky app bar with prep clock and step segments;
thumb-zone action bar with one primary button; commit-before-reveal (buttons stay
disabled until the teacher writes something); bottom sheets for detail; progress kept
in local storage so prep can be resumed; 44px+ touch targets; dark mode; reduced motion.

## How DSST's lesson data fills each step

DSST's `LessonData` already carries almost everything the design needs. Field-level map:

| Design element | DSST source | Fit |
|---|---|---|
| Lesson title, time | `meta.lesson_title`, `meta.total_time` | Direct |
| Destination | `destination` | Direct |
| Arc timeline | `activities[]`: start times computed from `duration`; crux from `is_crux`; role from `function` | Direct |
| "Watch for" per activity | `wristband.activities[].tiles[0].observation_short`, fallback `friction_points[0]` | Direct |
| Activity bottom sheet | `function_summary`, `learning_target`, `success_signals`, `friction_points`, `teacher_moves`, `synthesis_prompt` | Direct |
| Step 2 task and look-fors | `adaptation_guardrails.rigor_check` as the written task, then `lesson_synthesis.prompt` to explain aloud; look-fors from `wristband.top_signals` + the final activity's `success_signals` | **Substitute** (see gaps) |
| Step 3 patterns | `anticipated_thinking` for the crux **and the activity that feeds it**; `type` mapped to Common error / Almost there / Build on this / Ready to stretch / Language barrier | Direct |
| Step 4 scenarios | `decision_guide` for the crux, the activity that feeds it, and any later high-language-demand activity: `label` → Notice; `interpretation` → Clarify; `flat_move.say` or `proficiency_moves[band]` → model wording; `avoid` → Avoid | Direct |
| Step 4 criteria | Derived from `move` and `avoid` | **Derived** (see gaps) |
| Rigor check | `adaptation_guardrails.rigor_check` | Direct |
| Cuts (toggles) | `adaptation_guardrails.safe_to_change` | Direct |
| Never cut | `adaptation_guardrails.do_not_remove` (with MLR chips) | Direct |
| MLL supports | `adaptation_guardrails.by_proficiency`, filtered by the selected WIDA level | Direct |
| In-class card | `wristband` crux tiles (`observation_short` → If you see, `move_short` → Say); crux `synthesis_prompt` | Direct (the wristband already *is* a glance card) |
| Library tabs | The existing five tool components, unchanged | Reuse |

## Gaps: things the Social Studies version has that DSST data does not

1. **No exit-ticket or student materials.** Premo has the actual exit-ticket item, scoring
   look-fors, an exemplar response, and the source documents. DSST keeps no student-facing
   text from the uploaded PDF. Step 2 must still test the *whole lesson*, not the crux:
   Premo's exit-ticket item is the proof of the destination, answerable only after every
   activity. In the sample DSST lesson the destination ("write **and say** ratio sentences")
   is completed in 1.3, after the crux, and 1.3 carries the only high language demand, so a
   crux-only task would skip the hardest part. Plan: the teacher answers the rigor check
   (already phrased as an independent end-of-lesson test), explains it aloud as the
   synthesis prompt asks, and self-checks against the lesson-level top signals plus the
   final activity's success signals. No exemplar response. Real fix, later: retain the
   cool-down from the PDF, which is a pipeline change and needs Neil (Rule 4).
2. **No authored rehearsal criteria.** Premo's checklists per scenario are written by hand.
   Plan: derive two or three checks from each scenario's `move`, `say` and `avoid`. A later
   option is a small schema addition, which would touch the generation side and therefore
   needs Neil (Rule 4).
3. **No routine history or unit path.** Premo's "routines fade after 2 rehearsals" and the
   unit path need prep history across lessons. DSST analyzes one lesson at a time. Plan:
   leave both off the home screen for this test.
4. **ELD vocabulary differs.** Premo uses CA ELD (Emerging / Expanding / Bridging). DSST uses
   a WIDA level and emerging / developing / expanding bands. Plan: use DSST's existing
   selector and band mapping (`src/lib/eld`), not Premo's.
5. **No "Lesson" vs "Premo" source tags.** DSST content is all generated, so the source
   badges are left off.

**Crux focus means the crux and what feeds it.** Premo's Predict draws on Documents B and C,
and two of its six rehearsal moments are in Document B, because the crux fails if the
sentence it tests was never written. DSST's Steps 3 and 4 follow the same rule.

## Found while building (sample lesson 6.2.1)

- **MLL tags don't mean "only MLLs."** The sample's main crux misconception (most students
  reverse the numbers) is tagged `is_mll_specific`. Premo's Predict drops MLL patterns;
  DSST's keeps them, labels them, and puts the crux patterns first.
- **Step 2's look-fors are partly about the display, not the sentence.** Two of the five come
  from 1.3's poster work, which a teacher writing an answer can't show. Accurate to the
  lesson, awkward for the step. The cool-down text would fix it.
- **The synthesis prompt is written to the teacher** ("Synthesize the lesson by
  displaying…"), so "Now say it" reads as a teacher direction, not a student question.
- **Derived rehearsal checks are thin.** The first one is often just the move's first
  sentence ("Place two separate paper plates…"), so checking it restates the model.
  Authored criteria would need a schema field, which is generation work for Neil.

## Build plan (isolated, per COLLABORATION.md Rule 1)

- `src/lib/prep/prepModel.ts`: a pure function, `LessonData` → prep view model (steps,
  timeline, scenarios, derived criteria, cuts). Tests beside it, run by `npm run check:prep`.
- `src/app/prep/page.tsx` + `src/components/prep/*`: the phone flow (Home, six steps,
  Library, In-class card, bottom sheet). Library reuses the existing tool components.
- Prep progress kept in `localStorage`, keyed by `lessonIdentity`.
- One entry point: a "Prep on phone" link from the lesson page.
- Does not touch `llm-client.ts`, `api/analyze/route.ts`, the prompts, or the schema.

**Does this change what a teacher sees?** Only through the new `/prep` route and the one
link that opens it. `/lesson` is unchanged.
