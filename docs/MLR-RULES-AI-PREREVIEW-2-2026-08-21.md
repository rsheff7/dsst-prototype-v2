# MLR selection — second AI pre-review (lesson-grounded)

**Date:** 2026-08-21
**Reviewer:** AI persona (`.claude/agents/im-mlr-reviewer.md`), rebuilt to reason
from the Stanford UL research base, per-routine preconditions, and WIDA.
**Method:** recommended routines for every activity from the **source lesson
PDFs first**, with no sight of the selection code, then compared against what the
tool produced. Run independently of the first pre-review — it was not shown
those findings.

> **NOT EXPERT VALIDATION.** Automated pre-review only. Human review by the DSST
> IM implementation experts is scheduled for September 2026. Both this and the
> first review were produced by a model reading the same literature the table was
> written from; where both are wrong in the same direction, neither catches it.
> The reviewer explicitly asks for two of its own calls to be contested — MLR 4
> on G7 22.2, and spending a slot on MLR 8 there.

## Independently verified before circulating

| Claim | Result |
|---|---|
| MLR 4 and 5 unreachable across the whole input space | confirmed — exhaustive sweep |
| MLR 4, 5, 6, 7 never produced in 16 real activities | confirmed |
| `Setup` override yields MLR 1 as *lead* on a warm-up | confirmed — `[1,2]` |
| `Application` override is a no-op in the dominant case | confirmed — `[1,8]` |
| `grouping` field exists but is unused by selection | confirmed — 0 references |
| G7 22.1 tagged `language_demand: low` in both runs | confirmed |
| Same lesson, two runs, different routines (22.2) | confirmed — `[3,1]` vs `[1,8]` |
| **Source PDFs are student-facing only** | **confirmed — see below** |

### The input question, settled

The reviewer flagged that its main recommendation depends on which document the
pipeline reads. Checked directly against the PDFs the pipeline ingests:

```
g6-u2-l1.pdf   6 pages, 5,495 chars   MLR mentions: absent   Teacher notes: absent
g7-u6-l22.pdf  5 pages, 4,401 chars   MLR mentions: absent   Teacher notes: absent
```

No MLR suggestions, no Launch, no Activity Synthesis, no Anticipated
Misconceptions, no lesson narrative. The pipeline is inferring language-routine
guidance from roughly five thousand characters of student worksheet — and
re-deriving from scratch what the IM teacher edition already states outright.

---

## PART 1 — What these lessons actually call for

### Grade 6, Unit 2, Lesson 1 — Introducing Ratios and Ratio Language

**1.1 What Kind and How Many? (Setup, ~5 min)** — students see ~20 colored polyomino figures, sort by color then by area, then invent a third sorting scheme and name its categories.

- *Language work:* naming attributes and categories, then pairing each with a count. Word/phrase-level noun phrases.
- *Demand:* productive. Receptive load near zero. Not interactive — a share-out.
- *Artifacts present:* one shared image; a genuinely divergent third question. No flawed sample, no text, no information asymmetry, no competing strategies.
- **Recommend: MLR 2 Collect and Display, alone.** Precondition met — students are actively producing category language, and this is the first and only moment it surfaces. Principle: support sense-making. The chart built here is literally what 1.2's sentence frames get filled with.
- *One routine is the right answer.* This is a five-minute warm-up.
- *Emerging:* accept a gesture or single word ("red," "four"); the teacher writes the phrase onto the chart — the student's contribution is the label, not the sentence. First-language category names go on the chart alongside English. *Developing:* rehearse "the [attribute] ones — there are ___" with a partner first. *Expanding:* push for the attribute as a criterion ("I sorted by how many squares each one has") — the nominalization 1.2 depends on.
- *Mistakes:* **MLR 5** — the questions are already posed. **MLR 7** — sorting schemes are not solution strategies.

**1.2 The Teacher's Collection (Crux, ~15 min)** — sort a physical collection into 2–3 categories, record name + amount, **pause for teacher review**, write ≥2 ratio sentences using three printed frames.

- *Language work:* this activity **is** the language target. The difficulty is word order, not vocabulary — "the ratio of markers to pencils is 10 to 4" collapses if either half reverses. Schleppegrell exactly: meaning carried by sequence.
- *Demand:* productive, written, sentence level.
- *Artifacts present:* sentence frames **already printed in the student book**; a whole class working from **the same** collection, so every sentence is comparable; a highly predictable error (reversal, or a referent-free "the ratio is 6 to 3"); and an explicit **"Pause here so your teacher can review your work"** — a built-in harvest point.
- **Recommend: MLR 3 Critique, Correct, and Clarify (lead) + MLR 1.**
  - MLR 3: precondition met *conditionally* — no flawed sample is printed, but the pause hands the teacher a real reversed sentence. The tool must say so explicitly ("during the pause, copy one sentence with the order wrong; display it anonymously"). Without that, it is an unbuildable directive. Principle: maximize meta-awareness.
  - MLR 1: precondition solidly met, with a concrete revision criterion (could a reader who can't see your table tell which category is which?). Degrades gracefully; safest of the two for a novice.
- *Emerging:* the frame is already given, so the scaffold is **oral rehearsal with the objects in hand**. Allow the count in L1. *Developing:* two frames, choose which reads more clearly and say why. *Expanding:* write a "for every" sentence — which requires unitizing — then justify the equivalence.
- *Mistakes:* **MLR 6** — the task is two lines. **MLR 8 sentence frames** — the frames are printed on the page the student is looking at.

**1.3 The Student's Collection (Application, ~20 min)** — each student has **their own** collection; sort, table, ≥2 sentences, pause, then **make a visual display that clearly shows one of your statements** and **share it with the class**.

- *Language work:* spoken/context-embedded → written/context-reduced. Gibbons's mode continuum, and the task states the criterion ("clearly shows").
- *Demand:* productive, then interactive at the share.
- *Artifacts present:* real information asymmetry (my collection ≠ yours); **multiple distinct visual displays** of the same statement type; an explicit public-share step. The only activity here where several preconditions are met at once.
- **Recommend: MLR 7 Compare and Connect (lead) + MLR 1.**
  - MLR 7: precondition genuinely met, and met nowhere else in this lesson. Different displays encode "for every" differently — grouped bundles vs. two tallied columns. **Hard caveat:** MLR 7 is Smith & Stein selecting-and-sequencing, not two posters side by side. The tool must name *which two to pick*. If it can't, downgrade to MLR 1 — a first-year teacher running MLR 7 without selection guidance holds a gallery walk with no payoff.
- *Emerging:* rehearse the one sentence the display shows, display in hand, to one partner before any public share. *Developing:* partner asks one clarifying question ("which pile is the 4?") and the display is revised. *Expanding:* explain why a *different* collection could produce the same ratio statement.
- *Honest gap:* **MLR 4 Information Gap** is what this activity most naturally supports — A has the collection and display, B must ask. But IM authored no card set or protocol for it, and I will not recommend a routine that requires a first-year teacher to invent materials on the application activity. Available in principle; **needs authoring first**.

**Lesson-level:** MLR 1 in both 1.2 and 1.3 is one draft-share-revise cycle too many in 35 minutes; the second is what gets cut for time.

### Grade 7, Unit 6, Lesson 22 — Combining Like Terms (Part 3)

**22.1 Are They Equal? (Setup, ~10 min)** — select all expressions equal to `8 − 12 − (6 + 4)` from five options.

- *Language work:* pure justification — why an option fails, using connectives and property language.
- *Demand:* productive, argumentative. Receptive load is five short symbolic lines. The pipeline tags this `language_demand: low` in both runs, which reads the *amount of text*, not the demand.
- *Artifacts present:* **three wrong options, wrong in instructive ways, printed on the page.** MLR 3's precondition met by the materials with zero teacher prep. The cheapest available win in either lesson.
- **Recommend: MLR 3 (lead) + MLR 2.** MLR 3: for each rejected option, name the error that would produce it and repair it. MLR 2: capture informal justifications ("the minus goes to both") and post formal property names *beside* them, not instead — amplify, don't simplify. This chart is what 22.3 needs.
- *Emerging:* "Number ___ is wrong because ___" with the chart in view; accept pointing at the sign and revoice it. *Developing:* say the error, then fix the expression. *Expanding:* name the property that makes the correct one work.

**22.2 X's and Y's (this is the crux, whatever the tag says)** — match six column-A expressions to six column-B, differing only by a sign or a grouping.

- *Language work:* **the one place in either lesson where the language demand and the mathematical demand are the same thing.** You cannot discuss these cards without distinguishing "minus the quantity three x plus seven y" from "minus three x plus seven y." A student who can do the math silently still cannot say which card they mean.
- *Demand:* interactive, sentence level. Schleppegrell's packed noun phrase, in symbolic form.
- *Artifacts present:* a card set that **splits cleanly in two halves, neither solvable alone**; a partner structure; near-miss distractors.
- **Recommend: MLR 4 Information Gap (lead).** A holds column A, B holds column B, cards may not be shown, only described. Precision of language is the mathematical point — Information Gap's stated home. **The recommendation I would defend hardest in this review.**
  - *Novice risk, and why it's acceptable:* it stalls if students say "mine has a nine x." The tool must supply the constraint (no showing; use "the quantity") and the fallback — and the fallback is free: if it collapses, students show each other the cards and it becomes the original matching activity. Bounded downside.
- **Second slot: MLR 8** — the one place in these two lessons I'd spend a slot on it, and only its choral/oral-convention component. Normally unfalsifiable; here observable — students either say "the quantity" or they don't.
- *Emerging:* choral read of two contrasting cards before matching. *Developing:* match two pairs and read both aloud to justify. *Expanding:* describe a card precisely enough that a partner can write it without seeing it — that *is* the information gap.

**22.3 Seeing Structure and Factoring (Application/synthesis)** — write with fewer terms: `3·15+4·15−5·15`; `3x+4x−5x`; `3(x−2)+4(x−2)−5(x−2)`; `3(5⁄2x+6½)+…`.

- *Language work:* the generalization is a nominalized abstract sentence — "when every term in a sum shares a factor, you add the coefficients and keep the factor." Students *see* it in item 1 and must *write* it by item 4.
- *Demand:* productive, written, discourse level.
- *Artifacts present:* a deliberate structural progression across items 1–3; and on **item 4 specifically, two genuinely different approaches** — expand everything and combine, vs. treat the parenthetical as a unit.
- **Recommend: MLR 1 (lead) + MLR 7 on item 4.** MLR 1: draft the generalization after item 3, exchange, revise after item 4 — the single best fit anywhere in this lesson. MLR 7: the compare *is* the mathematical goal, but requires circulating during item 4 and selecting one of each approach.
- *Emerging:* items 1→2→3 as a spoken pattern with the same frame, so writing at item 4 is a fourth repetition, not a first attempt. *Developing:* revise the draft to replace "the thing in the parentheses" with "the common factor." *Expanding:* argue why item 4 is no harder than item 2.

**Lesson-level:** three activities cannot carry six routines. One routine per activity, run well: 22.1 → MLR 3, 22.2 → MLR 4, 22.3 → MLR 1.

## PART 2 — Evaluating the automated selection

### (a) Match and mismatch

| Activity | Recommended | Tool assigned | Verdict |
|---|---|---|---|
| G6 1.1 Setup | 2 (alone) | 2 + 8 | lead correct; filler second |
| G6 1.2 **Crux** | **3** + 1 | 1 + 8 | lead half-right, **best routine missed** |
| G6 1.3 Application | **7** + 1 | 1 + 8 | **7 deleted by override** |
| G7 22.1 Setup | **3** + 2 | 2 + 8 | **free win missed** |
| G7 22.2 **real crux** | **4** + 8 | 3+1 *(run A)* / 1+8 *(run B)* | **4 unreachable; two answers for one activity** |
| G7 22.3 | 1 + **7** | 1 + 8 | lead correct; **7 deleted by override** |

**G6 1.2 — the clearest single failure.** The learning target the tool itself generated names word order as the objective, the task hands the teacher a harvest point, and the reversal error is certain. That is MLR 3 with its precondition served on a plate. Instead the wristband tells a first-year teacher to *"display structured sentence frames"* — frames printed on the page the student is already looking at. Not merely suboptimal: it instructs the teacher to do something already done. Cost: the reversal error is never named publicly, and half the class writes "the ratio of markers to pencils is 4 to 10" all week.

**G7 22.1 — the cheapest missed win.** Three wrong answers are printed. Zero prep. Assigned MLR 8 instead — the only routine with no student obligation and nothing to hand in.

**G6 1.3 and G7 22.3 — the same structural deletion twice.** Both are the moment multiple distinct student products exist and comparing them is the payoff. Both get MLR 8. Cost: both lessons end without a single routine that makes students look at anyone else's work. The unit's premise — different-looking things share structure — never gets a language routine attached.

**G7 22.2 — the determinism claim fails.** `[3,1]` in one run and `[1,8]` in another, because one anchor wrote *"match and justify"* (trips `/\bjustify\b/` → Argue) and the other wrote *"match equivalent expressions"* (no match → Explain default). The variance moved from the MLR pass into the learning-target wording, where it is harder to see.

**Repertoire across 16 activities:** MLR 8 — 13 (81%), MLR 1 — 10, MLR 2 — 7, MLR 3 — 2. **MLR 4, 5, 6, 7 — zero.** Three routines account for 30 of 32 slots. A teacher on this tool for a semester never meets Information Gap, Co-Craft Questions, Three Reads, or Compare and Connect — the opposite of the module's stated purpose.

### (b) Verdict per rule

**Argue → [3,7] — REVISE.** Both plausible for argumentation, but 3 needs a flawed artifact and 7 needs multiple strategies; "Argue" implies neither. Gate each on its precondition rather than pairing by theme.

**Explain → [1,8] — REVISE (keep the lead).** MLR 1 is a defensible default lead. Reject the 8.

**Inform → [2,8] — REVISE (keep the lead).** Fine where the teacher is circulating and students are producing language; wrong for silent individual work. Reject the 8.

**Narrate → [6,8] — REJECT.** Three Reads' precondition is dense context-heavy text, unrelated to narration. Also unreachable — no math learning target says "retell." A dead row encoding a wrong pairing. Delete it; route Three Reads off a text-length signal.

**Setup → 2 — ENDORSE the intuition, REVISE the placement.** Right that warm-ups are where informal language surfaces. But it is wired to the *support* slot, so with the dominant KLU it yields `[1,2]` — Stronger and Clearer as the **lead** on a warm-up where no draft exists. Setup should set the lead.

**Application → 1 — REJECT as written: dead code in the dominant case.** KLU defaults to Explain, whose lead is already 1, so the override duplicates and falls through to 8. Across 16 activities it changed the output exactly once — deleting MLR 7.

**Synthesis → 7 — REJECT as untested.** The anchor emitted no `Synthesis` activity in any run. Do not ship a rule you have never observed.

**High-language-demand → 8 — REJECT. The most damaging line in the file.** The activities with the heaviest language load get the only routine with no student obligation, no artifact, and no observable completion — and it fires *precisely on the crux*. It silently overwrites the arc-role logic above it, so the two rules reasoned about hardest are cancelled by the one below. Direct cause of MLR 7 never reaching a teacher. The rationale — "8 makes the others survivable" — argues for MLR 8 as a **lesson-level standing support**, not for consuming a slot.

**Duplicate-pair fallback — REJECT as dead code.** `support !== lead` is always true; `lead === 8 ? 7 : 8` is unreachable. The whole thing reduces to `second = support`, i.e. collapse to 8. The comment describes a three-step tie-break that is one step.

**KLU by keyword-scanning `learning_target` and `title` — REJECT.** Four failures: (1) *wrong object* — a learning target describes mathematics, a routine must match what students do with language; (2) *reintroduces nondeterminism* — the function is pure, its input is model-generated free text; (3) *brittle morphology* — `/\bcompare\b/` misses "comparing," so **the default is doing most of the work**; (4) *even at 100% accuracy, KLU is the wrong key* — two Argue activities, one with a printed flawed sample and one with a splittable card set, want MLR 3 and MLR 4 respectively, and no KLU precision distinguishes them.

Also: `kluFromElsf`'s documented contract is "scans ELSF's `language_functions`," but here it is fed anchor fields, so its docstring no longer describes its dominant caller. ELSF *does* produce the right signal — `language_demands { receptive, productive, interactive }` — but MLR assignment runs before it by design. **That ordering constraint forced the keyword hack, and it is the thing to reconsider first.**

### (c) What should decide this instead

**Tier 1 — a curated per-lesson table. This is the answer.** IM 6–8 is a fixed, finite corpus. There is no reason to re-derive a routine from a generated learning target when the lesson is one of a few hundred known documents. Ship a data file keyed on `(grade, unit, lesson, activity_id)`:

```
{ "6.2.1": {
    "1.1": { "lead": 2, "second": null,
             "precondition": "students invent and name sort categories aloud",
             "teacher_prep": "chart paper; capture phrases verbatim" },
    "1.2": { "lead": 3, "second": 1,
             "precondition": "harvestable-error: capture one reversed sentence at the pause",
             "teacher_prep": "during 'Pause here', copy one sentence with the order wrong" },
    "1.3": { "lead": 7, "second": 1,
             "precondition": "multiple distinct visual displays + public share",
             "teacher_prep": "select one grouped-by-'for every' display and one two-column display" } } }
```

Authored once by the DSST IM implementation experts — the module header already says these pairings "are pedagogy, not code, and are meant to be tuned by someone who runs IM PD." Make that literal. Two further arguments: **IM's teacher edition already names a suggested MLR for most activities** in its Access for English Language Learners notes — published ground truth the pipeline is ignoring while re-deriving it from a paraphrase; and a table is reviewable, diffable, and lets a PLC lead override one activity without touching code.

The `teacher_prep` field is not garnish. MLR 3, 4 and 7 are exactly the routines the current system cannot reach, and all three fail in a novice's hands for the same reason — a missing sample, uncut cards, unselected work. Ship the routine with the one sentence that makes it runnable, or don't ship the routine.

**Tier 2 — a computed rule, for lessons not yet curated.** A table can work, but keyed on **artifacts and participation structure**, not KLU. Fields Pass 0 would have to extract:

| New field | Type | Why |
|---|---|---|
| `flawed_sample_provided` | bool | Gates MLR 3 at zero prep (G7 22.1) |
| `flawed_sample_harvestable` | bool | A pause/circulate step where a real error can be captured (G6 1.2) |
| `splittable_materials` | bool | Gates MLR 4 — divides so neither partner can solve alone (G7 22.2) |
| `multiple_strategies_expected` | bool | Gates MLR 7 — ≥2 genuinely different paths |
| `student_products_differ` | bool | Students hold different objects/data (G6 1.3) |
| `context_word_count` | int | Gates MLR 6 honestly — G7 22.1 is 9 words |
| `question_withheld_possible` | bool | Gates MLR 5 |
| `frames_already_printed` | bool | Suppresses advice duplicating the student book |
| `written_product_required` | bool | Gates MLR 1 |
| `public_share_step` | bool | Strengthens MLR 7 and MLR 1 |
| `grouping_structure` | enum | **Already exists as free text and is unused.** Enumerate it |

Plus: **drop `language_demand: low|medium|high` from selection.** A single scalar cannot distinguish "dense text to read" from "must negotiate with a partner," and those point at opposite routines. It is currently read off text volume. Replace with ELSF's `receptive / productive / interactive`.

Then, precondition-gated, first match wins for the lead:

```
4  if splittable_materials AND grouping ∈ {partner, small_group}
3  if flawed_sample_provided
6  if context_word_count ≥ 50 AND receptive is dominant
5  if question_withheld_possible AND function = Setup
7  if multiple_strategies_expected AND (is_crux OR public_share_step)
1  if written_product_required AND function ∈ {Application, Synthesis}
2  if function = Setup AND productive AND NOT frames_already_printed
3  if flawed_sample_harvestable            → emit with the harvest instruction
2  else if students produce any language
   else emit nothing and say so
```

Second routine **only if** a second precondition is independently satisfied and it doesn't need the same ten minutes as the first. Otherwise return one. **Never fill an empty slot with MLR 8.** Against these two lessons this yields 1.1 → [2]; 1.2 → [3,1]; 1.3 → [7,1]; 22.1 → [3,2]; 22.2 → [4]; 22.3 → [1,7] — Part 1, reproduced.

Three honesties: several fields are judgements, and asking a model for them is arguably the "second demand classifier" the codebase forbids — but they are *cheaper and far more stable* judgements than "pick two MLRs," because they describe **printed materials** rather than pedagogy, and a human can check them against the page in ten seconds. Extract them **once per lesson, cache, and make them human-editable** — never regenerate per run, or the variance problem is rebuilt. And this only works if the anchor reads the **teacher edition**.

**Tier 3 — what exists now.** Retire it. If it must stay as a floor: delete the high-demand override, delete the Narrate row, make MLR 8 a lesson-level chip, allow single-routine returns.

**Regardless of tier:** allow **one** routine. The `[MlrNumber, MlrNumber]` type is where this went wrong — a two-slot type forced a filler, and MLR 8 became the filler. Widen to `[MlrNumber] | [MlrNumber, MlrNumber]`. And check the wristband component: if the UI requires two chips, that is the actual constraint, and it is a UI fix, not a pedagogy fix.

**And move MLR assignment after ELSF.** The keyword hack exists solely because assignment runs before ELSF produces `language_demands`. Either run assignment after ELSF and inject into the remaining passes, or pull the receptive/productive/interactive judgement into Pass 0.

### (d) What could not be determined here

1. **Which document Pass 0 receives.** Everything that decides MLR fit lives in teacher notes. *(Settled — see verification above: student pages only.)*
2. Whether IM's published MLR suggestions are licensed for use. If yes, Tier 1 is largely transcription.
3. Whether DSST's print packet distributes G7 22.2 column A and B as separate cuttable cards. The MLR 4 recommendation depends on it.
4. G6 1.2/1.3 collection logistics — inferred that 1.2 is one shared set and 1.3 is per-student.
5. Prior-lesson assignments across a unit; repertoire is a cross-lesson argument.
6. The wristband UI's chip capacity and how it renders a single-routine activity.
7. Fresh variance data on the `learning_target` text itself — that is where the variance now lives.
8. Whether the anchor ever emits `Synthesis`.
9. **Review by the DSST IM implementation experts.** The MLR 4 call on 22.2 and spending a slot on MLR 8 there both cut against usual guidance for first-three-years teachers. Contest those before they ship.
