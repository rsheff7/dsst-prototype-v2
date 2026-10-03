# Phone prep: what is true in the SSA version that is not true in DSST

Assessed 2026-10-03 on branch `phone-prep-view`, sample lesson IM 6.2.1 ("Introducing Ratios
and Ratio Language"), against `premo-prep-v2.html` (SSA, lesson 7.7.9). Five reviewers:
a DSST 6th-grade math teacher, a math instructional coach, an IM curriculum specialist, a
WIDA-fluent MLL specialist, and the learning designer behind the SSA prep. Their claims about
the data were checked against `src/lib/demoLesson.ts`.

Cause codes: **A** DSST's generated data lacks it · **B** the data has it, the prep port drops
or misframes it · **C** SSA relies on authored content DSST would need new schema or prompting
to produce · **D** a real subject difference.

## The short version

The port copied the **shape** of each SSA step but not the **mechanism**. SSA works because
(1) one testable idea runs through every screen and is stated the same way each time, and
(2) the content is written in a teacher's voice: short lines to say, observable moments,
the lesson's own materials. DSST's sample has neither. Its central claim contradicts itself,
and the prep took fields written *about* the lesson and showed them as if written *to* the
teacher. About half the gap is **B** and can be fixed on this branch. The part that matters
most, correctness and coherence of the generated lesson, is **A/C** and needs generation work
(Neil, Rule 4).

## What SSA has that DSST doesn't (ranked; all five reviewers converged on 1–3)

1. **One idea, consistent and correct everywhere. (A+B, high)**
   SSA: the "pencil sentence" is written in Doc B, tested by Doc C, protected by the rigor
   check, predicted ("how many groups will revise?"), diagnosed by the tell ("if no group
   revises, the sentences were too vague"), rehearsed first, and reported to the coach.
   DSST: no central testable object, and the content contradicts itself:
   - Rigor check: "the **smaller** quantity is named first", which is wrong. The rule is that
     word order sets number order. The prep shows it three times (Orient, Step 2, Adjust).
   - Crux error: "puts the **larger** number first" (pattern, friction, in-class card) vs
     "default to writing the **smaller** number first" (1.2 scenario, whose own example is built that way).
   - Part-to-whole is an error on the in-class card and a goal in the 1.2 extension. One 1.3
     "error" example ("blue cubes to cubes is 4 to 10") is a valid part-to-whole ratio.
   - "for every two squares there is one triangle", the lesson's target language, is labelled informal / Language barrier.
   The correct statement exists (`adaptation_guardrails.mathematical_purpose`), but the prep never shows it.

2. **"Do it as a student" is a real student task. (A+B+C, high)**
   SSA: the actual exit-ticket item, the source documents, its scoring look-fors, an exemplar.
   DSST: a yes/no question *about* students (the wrong rigor check), two look-fors about
   posters a typed answer can't show, and "Now say it" is a teacher direction ("Synthesize
   the lesson by…"). A real student question is sitting in `lesson_synthesis.prompt`
   (why are both "6 to 3" and "3 to 6" correct?). The cool-down isn't captured at all (A).

3. **Lines a teacher can say, and the same lines from rehearsal to class. (B, high)**
   SSA: say lines are short quoted questions (median ~10 words; 9 of 12 are questions), and
   the In-class card repeats the rehearsed lines verbatim, under a launch line for the crux.
   DSST: the In-class card uses `teacher_moves[0]` and wristband shorthand ("Display anonymous
   reversed statement; ask class which quantity…"), not what was rehearsed. A two-level MLL
   card runs ~130 words. Better lines exist: `proficiency_moves.*.say`, `questions_to_listen_for`
   ("Which category is named first in your sentence, and does its count come first?").

4. **Commit-before-reveal actually works. (B+C, high)**
   - *Notice* shows an observable moment, often in students' words. DSST shows a category
     label ("Reversing the order of numbers relative to category names"); the concrete scene
     is in `interpretation`, which DSST reveals only after the teacher speaks. That's backwards.
   - *Criteria* check what the move accomplished ("Asked a question instead of fixing it").
     DSST's `deriveCriteria` copies the move's first sentence ("Place two separate paper
     plates…"), which checks logistics and leaks the model answer. It also keeps only the first level's
     Avoid, dropping the most demand-protecting one.
   - *Predict* is checkable: Most/Some/Few matches the tell. DSST's context card gives the
     answer away before the teacher predicts (`function_summary` names the error), and
     "Plan for this" gets stamped on on-track patterns.

5. **Rehearsal follows how the crux fails. (B+C, high)**
   SSA's six are a causal chain: two Doc B failures that would make Doc C impossible, then four
   at the crux, including a protocol breakdown, a content-sensitivity moment and the teacher's
   own impulse to confirm. DSST fills per-activity quotas by scenario type, which pulls in two
   warm-up "productive insights" with no link to the crux, and spends the 1.3 slot on a
   math error instead of 1.3's language scenarios. The DSST schema has only student-thinking
   scenario types (C); `causal_link` goes unused (B).

6. **Tomorrow's setup is explicit. (B, high for the teacher)**
   DSST's data says where the crux's material comes from ("No wrong answer is printed — capture one
   from the room", `selection.activities[1.2].teacher_prep`) and what to set up
   (`wristband.preflight`: bag the collections, frames on the board, home-language partners,
   chart paper). The prep shows none of it, so the In-class card tells her to display an
   anonymous error without saying where it comes from.

7. **MLL support is specific and asset-framed. (B, plus A, high)**
   SSA names the words and traps per activity ("New words: Frank, Templar…"; "a decoding problem,
   not a thinking problem") and gives escalating frames at the crux. DSST shows "Language
   demand: medium" and "Provide sentence frames…" without frames. The data has the frames
   (`anticipated_thinking[1.2].sentence_frames`), WIDA does/reaching descriptors
   (`elsf_inference…learner_profile`), the three language modes, `everyday_to_academic_bridge`,
   `l1_bridge`, `key_vocabulary`. None of it is shown. Generation (A) tags the "most students" crux error
   MLL-specific and leaves it without a whole-class move.

8. **Adjust offers real time cuts. (A/C, medium)**
   SSA: per-activity "if short on time" cuts, sequence constraints, never-cut items as ~7-word
   protected moments. DSST's `safe_to_change` holds material swaps shown as toggles, and the coach
   summary reports them as "Changes I'm planning". Never-cut items are 18-word rules.

9. **Lower:** no source tags (Lesson vs Premo), so a teacher can't tell IM text from model
   guesses (C). No callback to the prior lesson (C/D). The examples invent a different collection
   on nearly every screen, and none of them is IM's (A; partly D, since the teacher picks the 1.2 collection).

## Where DSST is better (keep these)

- Moves by WIDA level, with "Without words" options; more MLL scenarios rehearsed than SSA.
- MLR tags give teachers and coaches a shared routine vocabulary.
- Concrete numeric student examples; some excellent lines ("Are there 10 red cubes, or 10 cubes in all?").
- Keeps language patterns in Predict, labelled, where SSA filtered them out.
- The crux/feeder rule and everything else generate automatically for any lesson.

## What this means for the work

- **Fix on this branch (B).** Stop showing the rigor check as the student task; use the
  synthesis question. Show `mathematical_purpose`. Put `interpretation` before the commit.
  Pick rehearsal by link to the crux. Reuse rehearsed say lines on the In-class card. Show
  `teacher_prep`/`preflight`, real frames and the language fields. Replace derived criteria
  with fixed, demand-protecting checks. Fix the frequency labels.
- **Needs generation (A/C, Neil).** A consistency gate across rigor check, friction, patterns
  and scenarios. The cool-down/exit ticket. Authored criteria, a "tell" and a crux launch line.
  Time-based cuts. Non-student scenario types. Whole-class moves for errors most students make.
- **The prep should not paper over A.** If the generated lesson contradicts itself, the
  prep will repeat the contradiction more prominently than the five tools do.

Full reviewer reports were written to the session scratchpad and are not kept in the repo.

## Branch fixes applied (2026-10-03)

The **B** items, all in `src/lib/prep` and `src/components/prep`; generation untouched.

| Finding | Change |
|---|---|
| 1 | Pinned "The idea" is `mathematical_purpose`; the rigor check is shown under it, labelled as the lesson's. Orient shows the idea, not the rigor check. |
| 2 | Step 2 is the question the lesson closes on (`lesson_synthesis.prompt`), answered as a student. Look-fors exclude anything a written answer can't show. The rigor check no longer appears here. |
| 3 | The In-class card leads with a crux question to ask (`questions_to_listen_for[0]`) and reuses the rehearsed say lines verbatim, for the class's levels only. Say lines are quoted; the stage direction folds under "The full move". |
| 4 | Rehearse shows the concrete scene (`interpretation`) before the teacher speaks. Criteria are fixed checks of what a move protects, plus every distinct avoid line; they never contain the model wording. Predict shows the task, not the misconception, and uses the generator's own frequency ("Most students") so Most/Some/Few is checkable. "Language barrier" is now "Language + math". |
| 5 | The feeder contributes only failures; the after-crux slot prefers a language scenario. The lede says how many are at the crux. |
| 6 | Crux setup (`selection…teacher_prep`) appears in Predict, the activity sheet and the In-class card; `wristband.preflight` is a "Before class tomorrow" checklist in Carry. |
| 7 | Adjust shows crux frames, each level's "already does / reaching for" (`learner_profile`), and key words. The activity sheet shows the three language modes, the everyday-to-math bridge, the home-language bridge and `causal_link`. |

Still open, all **A/C** (generation, Neil): the self-contradicting crux error ("smaller number first" in the 1.2
scenario) and the wrong rigor check are still in the data and still visible; the "most students" crux error
still has no whole-class move; no cool-down, authored criteria, tell, time cuts, or non-student scenario types.
