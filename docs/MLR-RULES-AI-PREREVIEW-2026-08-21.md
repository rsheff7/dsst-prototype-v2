# MLR selection rules — AI pre-review

**Date:** 2026-08-21
**Reviewer:** AI persona (`.claude/agents/im-mlr-reviewer.md`), prompted as an IM
implementation specialist. Model-generated.
**Subject:** `src/lib/mlrSelection.ts`, plus `kluFromElsf.ts` and the anchor
schema it depends on.
**Evidence base:** the rules themselves, exhaustively swept over their whole
input space, plus 16 activities across 5 real generated lessons (IM G6 U2 L1,
G6 U2 L2, G7 U6 L22 ×2, and one repeat of G6 U2 L1).

> **THIS IS NOT EXPERT VALIDATION.**
> It is an automated pre-review, run because the table was about to reach
> production with no pedagogical sign-off at all. It does not substitute for
> review by the DSST IM implementation experts, scheduled for September 2026,
> and it must not be described to DSST as validation. Its purpose is to fix what
> is checkable now and to give the human reviewers a sharper starting point.
>
> Note the shared failure mode: the pairing table was written by a model reading
> the MLR definitions, and was reviewed by a model reading the same definitions.
> Where both are wrong in the same direction, neither will catch it.

## Independent verification

These claims were checked directly against the code and the generated lessons,
not taken from the review:

| Claim | Verified |
|---|---|
| MLR 4 and 5 unreachable across the entire input space | yes — exhaustive sweep of function × demand × KLU |
| MLR 6 and 7 never produced in practice | yes — 0 of 16 activities |
| `function: "Synthesis"` never emitted | yes — observed Setup 6, Crux 5, Application 5 |
| Distribution skew | yes — MLR 8 ×13, MLR 1 ×10, MLR 2 ×7, MLR 3 ×2 |
| Verb-form brittleness | yes — "compare" → [2,8], "comparing" → [1,8] |
| Same lesson, two runs, different routines | yes — G7 U6 L22 act 22.2: [3,1] vs [1,8] |

---

## Rule 1 — `BY_KLU` pairings

**Argue → [3 Critique/Correct/Clarify, 7 Compare and Connect] — ENDORSE.** Both routines put an artifact on the wall and make students take a position about it. Structurally coherent.

**Explain → [1 Stronger and Clearer, 8 Discussion Supports] — REJECT, because of what this branch actually is.** In all 16 activities across the four lessons, *not one* matched an EXPLAIN pattern. Every "Explain" assignment — 9 of 16 — came from the no-match default at the bottom of `kluFromElsf`. So `Explain: [1, 8]` is not the Explain pairing; it is the fallback pairing for everything the regex cannot read, and MLR 1 is now the house routine for 56% of all activities.

That would be merely unambitious if MLR 1 landed anywhere. It lands on the crux. Four of the five crux activities here got `[1, 8]`. MLR 1's structure presupposes students have a formed idea worth drafting and sharpening. At the crux they do not — that is what makes it the crux. What happens in the room: the teacher stops the most important fifteen minutes of the lesson to have students write a first draft of an explanation of a thing they are mid-way through not understanding, then pair them so two partial understandings can revise toward each other. A second-year teacher runs it faithfully, the drafts come back barely different, and they conclude Stronger and Clearer "doesn't work with my kids." MLR 1 belongs after the mathematics is in hand — which is exactly where `BY_FUNCTION.Application` already puts it.

**Inform → [2, 8] — ENDORSE** on structure. Caveat under Rule 5: the INFORM regex is firing on math verbs, not language functions.

**Narrate → [6 Three Reads, 8] — REJECT as unreachable.** Three Reads is a good routine badly gated. Narrate is last in priority and requires "tell a story / retell / recount / act out" in a learning target. IM learning targets are written in "Students ___" performance voice and never contain those. Observed: 0/16. Meanwhile Three Reads is the right routine for the actual common case — an activity whose friction is a dense contextual problem — and that case is invisible to this table. Three Reads should be triggered by task *form* (word problem, multi-sentence context, card sort with prose cards), not by a KLU that no math lesson will ever produce.

## Rule 2 — `BY_FUNCTION` arc-role overrides

**Setup → 2 Collect and Display — REVISE.** The premise is inverted. Collect and Display requires students to already be producing language worth capturing. In a Setup they usually are not: G6 U2 L2 activity 2.1 is a Number Talk, and the rule assigned MLR 2 to it. Students sit with fists to chest doing mental division by 4. The teacher is instructed to circulate and jot the phrases students are using. There is nothing to circulate past and no phrases to jot. The routine cannot be executed as written, and a novice teacher has no way to know that — they will either skip it, or turn a 5-minute number talk into a 12-minute chart-making exercise and lose the activity.

Worse, the inversion is visible within a single lesson. In G6 U2 L1, MLR 2 went to the warm-up — sorting objects and counting them, where the only student language is "there's four" — while the crux, "The Teacher's Collection," where students first attempt ratio phrasing and produce exactly the informal wordings Collect and Display exists to capture, got `[1, 8]`. The routine is placed one activity too early, systematically.

Replacement: **Setup → 5 Co-Craft Questions.** It is the routine whose structure *is* the setup move — show the situation with no question attached, students generate questions, the class picks one. It needs no skilled facilitation, it degrades gracefully (you still get a list of questions even if the discussion is thin), and it works on a number talk, a sorting task, and a diagram alike. MLR 2 should be attached to the crux instead.

**Application → 1 Stronger and Clearer — ENDORSE the mapping, REJECT as implemented.** It is the right routine in the right slot, and it almost never fires. Of 5 Application activities observed, the override delivered MLR 1 exactly once. Three times the lead was already 1 (the Explain default) so the duplicate rule deleted it and substituted 8; once (high demand) the demand rule overwrote it. A rule with an 80% no-op rate is not doing the work its comment claims.

**Synthesis → 7 Compare and Connect — REJECT as dead code.** Zero activities across five lessons carry `function: "Synthesis"`, and that is structural, not a sample artifact: IM puts the synthesis in a separate `lesson_synthesis` object, not in `activities[]`. This branch is the primary route to MLR 7, and it will essentially never execute.

**Crux left alone — REJECT.** "The crux is defined by its mathematics, not by its position" is a good sentence and the wrong conclusion. The crux is where the target language is first attempted, and leaving it to the KLU scan means it inherits the failure mode of the default branch. This is where the tool's whole value concentrates and it is the one slot with no arc-role reasoning applied to it. Give the crux an override — **2 Collect and Display** as the default second slot, taking it from Setup.

## Rule 3 — `language_demand === 'high'` forces slot two to MLR 8

**REJECT.** Two problems.

First, it is placed after the arc-role override and silently destroys it. G6 U2 L2 activity 2.4 is a card sort where students "match recipe diagrams with corresponding ratio sentences and justify their matches" — high demand, so `[3, 7]` became `[3, 1]` became `[3, 8]`. Compare and Connect was the single best-fitting routine in the catalog for that activity (two representations, side by side, name what's shared) and it was removed *because the activity was language-heavy*. High demand is the condition under which you most want two artifacts on the board, not least.

Second, MLR 8 is not a routine. It is a bundle of teacher moves — revoice, frame, wait, choral repeat — with no student obligation and no student artifact. It is unfalsifiable: a teacher can believe they did it without anything in the room changing. Firing it at 13 of 16 activities (81%) means the second chip on the wristband carries no information. The teacher learns that the second slot means "talk supportively," which is the definition of MLR-as-decoration.

What I would do instead: keep MLR 8 as an always-on *scaffold band* on the wristband — a persistent strip of frames and revoicing cues, not a per-activity chip — and let the second slot stay a real routine. High demand should raise the *density of supports within* the chosen routine, not replace the routine.

## Rule 4 — duplicate-pair fallback

**REJECT.** The branch `lead === 8 ? 7 : 8` is unreachable — 8 is never a lead — and `support !== lead` is always true, so this collapses to "on collision, use the KLU support," which is 8 for three of four KLUs. That makes the collision path a third route to MLR 8.

The deeper problem is what a collision *means*. When the KLU scan says 2 and the arc role says 2, those are two independent signals agreeing that Collect and Display is right. That is the strongest evidence this system ever generates. The code treats it as an error and discards it for the generic default. Observed three times, all Setup + Inform, all resolved to `[2, 8]` where the 8 came from the collision, not from any judgement about the activity.

Fix: on agreement, promote — keep the agreed routine as lead and draw the second from a complement table keyed on the lead (2 pairs naturally with 5 or 7; 1 pairs with 3; 6 pairs with 5), never from a global fallback.

## Rule 5 — deriving KLU by keyword-scanning `learning_target` and `title`

**REJECT. This is the highest-risk rule in the file.**

Three failures, in ascending order of severity.

*Category error.* `kluFromElsf` was built to read ELSF's `language_functions` — statements about what students do *with language*. It is being fed learning targets, which are statements about what students do *with mathematics*. "Identify equivalent expressions," "count the objects in each group," "classify by attribute" are math actions; the INFORM list catches all of them and concludes the language demand is informational.

*Verb-form brittleness.* `\bcompare\b` does not match "comparing." `\bdescribe\b` does not match "describing." Both appear in the observed learning targets and both missed, dropping those activities into the default. The list matches infinitives against prose written in the present participle.

*It breaks the determinism guarantee this module exists to provide.* The header says the crux drew five different pairs across ten runs and that computing it fixes that. It does not, because the input is model-generated prose. Two runs of the same lesson — G7 U6 L22, activity 22.2, the same card-matching task — diverged on one word. One anchor wrote "match **and justify** equivalent expressions"; the other wrote "combine like terms … to match equivalent expressions." The first got `[3, 1]` — display a flawed match, class critiques it, then partner revision. The second got `[1, 8]` — draft, share, redraft. Two teachers in the same PLC upload the same PDF and prep two different activities, one of which requires printing a wrong worked example. The variance moved from the MLR pass into the anchor pass; it did not go away.

What to change: stop inferring KLU from prose. Ask Pass 0 for the language function as a constrained enum field on each activity (`language_function: Argue | Explain | Inform | Narrate | Procedural`) alongside `function` and `language_demand`. A four-way enum is as stable across runs as the crux marker and activity ids already are. Keep the regex only as a fallback when the field is absent, and log how often it is used.

---

## Single highest-risk rule and what I would change first

Highest risk: **Rule 5**, the keyword derivation. Every other rule is downstream of it, it silently defaults 56% of activities to the same pairing, and it reintroduces the exact run-to-run variance the module was written to eliminate.

But the first change I would ship is **Rule 3** — delete the `language_demand === 'high'` force and move MLR 8 to a persistent wristband band. One line, no new model output required, and it immediately unblocks MLR 7 and the Application→1 override on the highest-demand activities, which are the ones a first-year teacher most needs a real structure for. Then fix Rule 5, because until the KLU input is trustworthy the rest of the table is tuning on noise.

## Coverage check

Across the four lessons (16 activities), the rules produced: **MLR 1** — 10, **MLR 8** — 13, **MLR 2** — 7, **MLR 3** — 2. **MLR 4, 5, 6, 7: zero.**

That is not a sampling accident, it is what the table permits:

- **MLR 4 Information Gap** and **MLR 5 Co-Craft Questions** appear in neither `BY_KLU` nor `BY_FUNCTION`. They are structurally unreachable — the code cannot emit them.
- **MLR 6 Three Reads** requires Narrate, which requires narrative verbs that do not occur in IM learning targets. Unreachable in practice.
- **MLR 7 Compare and Connect** has two routes: `Synthesis` function (never emitted — synthesis lives outside `activities[]`), or Argue KLU + Crux function + demand ≠ high. Unreachable in practice.

So a teacher using this tool for a full unit sees four of the eight routines, one of them (8) on four activities out of five, and one of them (1) on the crux of nearly every lesson. The premise in the header — "teachers build a recognizable repertoire across lessons" — is being satisfied in the narrow sense (it is recognizable) and defeated in the real one (it is four routines, and the two most common are the two that require the least of students). A teacher three months in has never seen an Information Gap and does not know Co-Craft Questions exists.

## What the lessons showed that the rules alone did not, and what I still can't judge

The lessons confirmed the reachability analysis and surfaced the same-lesson divergence that the rules alone would have hidden, since the table *is* deterministic — it is the input that moves.

They also showed something the rules cannot: the model writes plausible `why_here` prose for whatever it is handed. One run got MLR 3 on a card-matching task with no flawed sample in it, and Pass B dutifully invented one — "present an incorrect match where x and y coefficients were combined into a single term." That is a defensible activity, but nobody decided to add it; a regex hit on "justify" did, and the teacher reads it as a recommendation grounded in their lesson. This is the mechanism by which a mis-selection becomes invisible: the reasoning layer launders it.

What I still cannot judge:

- Whether the pairs hold up on lessons with a genuine **Synthesis** activity or a **Cool-Down**, since none of the five samples had one. If `Synthesis` is truly never emitted, that branch should be deleted and MLR 7 rerouted; I'd want a run over 20+ lessons to confirm before removing it.
- What ELSF's `language_functions` actually contain once they're available, and whether feeding those to `kluFromElsf` — the use it was written for — produces a materially different distribution. That's the cheapest experiment available and it should run before any of the pairings get retuned.
- The `deviations` counter from `enforceMlrPlan`. How often the model was overruled, and on which activities, is the best available signal for where the table disagrees with a reader of the actual lesson. It's logged but not surfaced in the pre-generation report; it belongs there.
- Whether a teacher notices the repetition. Seeing `[1, 8]` on the crux of five consecutive lessons is the failure mode to watch for in the first pilot, and it won't show up in any automated check.
