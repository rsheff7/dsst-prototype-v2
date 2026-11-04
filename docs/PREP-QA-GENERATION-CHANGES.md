# Generation changes proposed from the phone-prep QA

Proposed 2026-10-07. **Nothing here has been applied.** Each change is for Robert to approve,
change or drop; production prompts are frozen until then (COLLABORATION.md, Rule 2).

**Where the findings came from.** The prep was run on stored analyses of IM 6.2.1–6.2.5 and six
analyses of 7.6.22 (all generated 2026-08-22, Gemini Flash) and read as the personas in
`REVIEW-PERSONAS.md`. The readers were models, not people; the subject expert had the student
pages for 6.2.2 only. The causes below were found by reading the prompt and pipeline as they are
on `main` today, so they apply to current generation even where the stored lessons are older.

**Who does what** (role division agreed 2026-10-05). Robert owns the wording, what each field
means, and the pedagogical rules. Neil owns how a field is carried through the schema, the
normaliser and the pipeline. Three of the files involved are shared or Neil's, so the change is
Robert's but the edit needs coordinating:

| File | What lives there | Edit |
|---|---|---|
| `prompt-dev/modules/*.md` → `src/lib/prompts/production-prompt.ts` | System prompt: voice rules, MLR rules, field definitions | Robert |
| `src/lib/widaCalibration.ts`, `src/lib/mlrSelection.ts` | Level descriptors fed to generation; routine selection table | Robert |
| `src/lib/qa.ts` | Checks a generated lesson is held to | Robert writes the rule; Neil for engine changes |
| `src/app/api/analyze/route.ts` | `GUIDANCE_REGISTER` and the per-pass instructions | Robert's wording, **shared file (Rule 4)** |
| `src/lib/passSchemas.ts` | Technical schema for each pass | Neil, from Robert's field definition |

---

## 1. The lowest levels are given the answer

**Seen.** Levels 1–2 moves reduce to yes/no or dictation ("Write 1. Now combine 4 groups plus 1
group"; "Say: 3 cups of tomato sauce"). Levels 3–4 are told the finding ("Statement e has the
words flipped"). Only the top band is asked why.

**Cause.** Two rules pull the wrong way, and nothing pulls the right way.

- `GUIDANCE_REGISTER` rule 4 in `route.ts` tells the model to make the bands different tasks:
  *"EACH BAND MUST DIFFER IN OBLIGATION… the Expanding student must owe something structurally
  different — a claim to defend, a comparison to make, a peer's work to critique."* It was
  written to stop decorative differences. It does that by varying the thinking.
- Voice rule 7 (*"Script the words"*) plus a calibration line saying a lower-level learner "can
  use learned phrases" produces a sentence for the student to repeat.
- No rule anywhere says every level answers the same mathematical question.

**Proposed.** Replace rule 4 with:

> 4. ONE QUESTION, THREE WAYS IN. Decide the mathematical question this scenario turns on and
> hold it fixed for all three bands. What changes by band is how the student takes the question
> in and how they show an answer: pointing or arranging, two words, a sentence, a claim defended
> to a partner. What they have to figure out does not change. Then read each `say` line: if it
> states what the student was meant to notice, supplies the number, term or corrected sentence
> the scenario is about, or leaves only yes or no, rewrite it as a question that sends them back
> to the work. The bands still must not be the same act at three politeness levels: the
> difference is in the mode of response, not in an adverb.

**Rule to add to `qa.ts`.** For every scenario with by-level moves: each band's `say` contains a
question; no band's `say` begins "Say:", "Write" or "Repeat"; no band's `say` repeats the
scenario's own `avoid` line. These catch the pattern, not every case. A qualified reader still
signs off the say-lines (see 9).

## 2. Moves written for WIDA 2, 3 and 4 are shown as Levels 1–2, 3–4 and 5–6

**Seen.** Found while tracing 1, not by the reviewers.

**Cause.** `widaCalibration.ts` gives generation the descriptors for single levels:
`emerging → 2`, `developing → 3`, `expanding → 4`, with the comment that these are "WIDA's own
labels for levels 2, 3 and 4". Three days later `eld/types.ts` rebalanced the bands to cover
1–2, 3–4 and 5–6 and says the keys "are band keys, NOT WIDA level names". Generation was not
updated. A move written for a Level 4 learner is displayed for Levels 5–6, and nothing is
written with a Level 1 newcomer in mind.

The system prompt has a second version of the same problem: `by_proficiency` describes each band
as an "ELSF proficiency level". ELSF has no proficiency levels.

**Proposed.** Feed each band both of its levels: what the lower level can do now, what the upper
level is reaching for. Reword the `by_proficiency` field descriptions to "WIDA Levels 1–2 / 3–4 /
5–6" with no ELSF attribution. **Decision for Robert:** whether the band's move should be pitched
at its lower level (safer for newcomers) or span both.

## 3. Wrong mathematics in lines a teacher will say or post

**Seen.** "Write '1 white = 3 blue'"; a frame reading "multiplied by ___ batches"; "3 dimes and
4 nickels" for unlike terms, in one analysis of a lesson where another analysis says to avoid
exactly that analogy.

**Cause.** The prompt tells the model to carry the mathematics (voice rule 2) and to name
mathematically wrong moves in `avoid` (rule 8). It never asks that what the teacher is given to
say is itself true, and no pass or check reads for it.

**Proposed.** Add a voice rule:

> 13. Everything the teacher says or posts must be true as written. Read each `say` line and
> each sentence frame as mathematics. An equals sign joins equal quantities, never a ratio
> pairing: write "3 tablespoons of blue for every 1 cup of white", not "1 white = 3 blue". A
> quantity is multiplied by a number, not by a unit or an object. Do not explain unlike terms by
> treating letters as objects (apples and oranges, dimes and nickels): substitute a value and
> compare. If you cannot make the line both short and true, make it true.

A prompt rule lowers the rate; it does not verify. Two further options, in order of cost:
a checklist line in the pre-generation `review.md` ("say-lines and frames read by a math
reviewer"), and a short sixth pass that reads only the say-lines and frames and returns any that
are false. The pass is a pipeline change (Neil); what it checks is Robert's.

## 4. Invented material presented as the lesson's

**Seen.** The closing question and the rigor check use expressions that are not in the lesson
and differ between analyses of the same lesson. Three screens of one prep gave three different
number examples of the same error. Scenarios refer to "statement e" or "Elena's paint diagram"
that the teacher is never shown.

**Cause.**
- The model receives the student pages only, about 3,600 characters for 6.2.2, with no teacher
  guide. The prompt asks for a `lesson_synthesis.prompt` that is "what the teacher actually says
  or does at lesson close". With no synthesis in the source, the model writes one.
- "Use this lesson's actual content" is asked of synthesis fields only, and "actual" is not
  defined as "appears in the text".
- Thinking, moves and the wristband are written by three passes running in parallel. None sees
  the others' examples, so each invents its own.

**Proposed.**
1. A content rule: *"Every expression, number, name and quoted statement you use must appear in
   the lesson text. Refer to a task item the way the page does ('statement e', 'problem 3'). If
   you need an example the lesson does not contain, say it is a new example."* The same rule
   for `rigor_check`.
2. Anchor the close on what is published: *"Build `lesson_synthesis` on the Lesson Summary
   printed in the student pages when there is one, using its example."*
3. Two new fields in `lesson_synthesis`: `student_question` (the one question put to students,
   in their words) and `strong_answer` (two or three sentences a strong student would give).
   This is what "Do it as a student" needs. Three of eleven analyses had no question the prep
   could lift out, and the look-fors describe classroom behaviour, not a written answer.
4. One new anchor field, `task_items`: the crux activity's statements or expressions, verbatim.
   Because every later pass receives the anchor, all of them draw on the same examples, and the
   prep can show the teacher the task.

Items 3 and 4 are schema additions: Robert defines them, Neil adds them to `passSchemas.ts`.

## 5. Routines are named, not run, and Information Gap is over-assigned

**Seen.** "MLR 4 · Information Gap" on a card sort where both partners see every card, with a
move that then contradicts the task ("without looking at the shapes"). MLR tags on pre-drawn
outlines and on "do not remove" lines.

**Cause.**
- The MLR 4 entry lists as a trigger: *"card sort, partner-A / partner-B materials"*. Any card
  sort qualifies.
- Tagging is compulsory where it should be earned: an `mlr` is REQUIRED on every language
  friction, every MLL pattern and scenario, and every wristband tile, with *"default to MLR 8"*
  when nothing fits.

**Proposed.**
- MLR 4, reworded: *"Apply only when each partner holds information the other cannot see and
  must ask for it. A card sort or matching task where both partners see every card is not an
  information gap. Trigger signals: partner-A / partner-B cards, a data card and a problem
  card."*
- Change "REQUIRED" to "include when the move below actually runs the routine's steps; otherwise
  omit". Remove the MLR 8 default.
- **Decision for Robert:** the wristband instruction says "EVERY tile MUST carry an mlr… a tile
  without one is incomplete". That was added to stabilise chip placement. Loosening it trades
  consistency of chips for accuracy of chips.
- `qa.ts`: a tagged move must contain its routine's signature step (MLR 3: a flawed sample to
  critique and revise; MLR 4: information one partner lacks; MLR 1: a second draft).

## 6. Correct thinking is labelled as error, and labels blame the student

**Seen.** Expanding 4(x+2)+4(x+2) to 8x+16 is "Common error" in Moves and "Almost there" in
Thinking. Labels open with "Failing to see" and "Struggling to". Patterns carry coined names
("Additive Difference Test", "Directional Multiplier Reversal").

**Cause.** Voice rule 5 says to mark correct thinking as correct, but it is not tied to
`scenario_type`, and Thinking and Moves are written by separate parallel passes. The register
check lists "lack the language" but not the verbs above. Nothing forbids naming a pattern.

**Proposed.**
- Decision-guide instruction: *"`common-error` is only for work that is mathematically wrong. A
  valid method that is longer or unfamiliar is `on-track` or `productive-insight`."*
- `GUIDANCE_REGISTER`: *"A label says what the student did, in plain words a teacher would use
  out loud. Not what they failed to do, and not a name you made up for it."*
- `qa.ts` red flags: add "failing to", "fails to", "struggling to", "unable to", "lacks".
- With `task_items` in the anchor (4.4), add `moments`: three to five short labels with their
  type, fixed once, that Thinking and Moves both use.

## 7. "Questions to listen for" has no definition

**Seen.** The field name says listening; the content is questions for the teacher to ask, and
several state the idea students are meant to reach. The prep showed the first one as the
teacher's opening question at the crux.

**Cause.** The whole specification is *"2-3 questions_to_listen_for (strings)"*.

**Proposed.** Define two things separately:
- `launch_question`, for the crux only: the one question that starts students on the task
  without telling them what they will find.
- `questions_to_ask`: questions for pairs who already have an answer, each sending them back to
  their own work, none stating the idea.

**Decision for Robert:** rename the field (a schema change, and stored lessons keep the old
name) or keep the name and define it.

## 8. Placeholders and inconsistent formats

**Seen.** "n/a" written as a move, a say-line and an avoid-line. Grade written "7" in four
analyses and "Grade 7" in two.

**Cause.** The decision-guide schema offers `flat_move` and `proficiency_moves` on every
scenario and requires `move` and `avoid` inside each, so the model fills the one it is not using.
The anchor asks for `meta { grade, unit, lesson_number }` with no format.

**Proposed.** Prompt: *"Fill only one of `flat_move` and `proficiency_moves`; leave the other
out. Never write 'n/a', 'none' or a dash as a value."* and *"grade, unit and lesson_number are
the number alone: '7', not 'Grade 7'."* Mechanics (Neil): the normaliser drops placeholder moves
and strips the prefixes, so a stored lesson is clean whatever the model wrote. The prep view
already guards both.

## 9. Supports that need things the teacher does not have

**Seen.** By-level moves call for an "ingredient card-strip", "dual-language sentence starters"
and "bilingual ratio tables". None is in the before-class list. The reader profile describes a
teacher who will not make them.

**Proposed.** *"A by-level move uses what is already in the lesson or what a teacher can do on
the spot with a marker and paper. If it needs anything prepared, that thing is the first item in
`preflight`."* Because the wristband pass runs in parallel with the moves pass, the second half
of that needs the same anchor mechanism as 4.4, or the first half alone.

## 10. Small

- The reader profile says the teacher is "teaching 6th grade mathematics". The tool is used for
  grade 7. Say "middle school mathematics".
- Voice rule 10 says to gloss each term on first appearance in an artifact. The prep is a new
  artifact built from fields written for other screens, so nothing is glossed there. Either the
  prep view supplies a gloss for its own terms (crux, MLR, WIDA levels), or the rule is restated
  per field. The view is the cheaper place.

---

## Order I would do them in

1. **1, 3 and 8** first. They are wording only, they address what the subject expert said would
   stop her signing, and they need one coordinated edit to `route.ts` plus one module edit.
2. **2** next. It is a small change to a file Robert owns and it corrects every by-level move.
3. **5 and 6**, wording plus QA rules.
4. **4 and 7**, which add fields and so need Neil.

## How to tell whether it worked

Regenerate the same lessons and repeat the same reads: 6.2.1–6.2.5 once each and 7.6.22 three
times, then the walkthrough and both persona reads, compared finding by finding with this
document. That needs the lesson PDFs (only 6.2.2 is in the repo) and about thirty model calls.
A second analysis of the same lesson is the test for 4 and 6, since those are about agreement.
The new `qa.ts` rules should fail on the stored August analyses and pass on the new ones.

## What this does not fix

A real teacher has not timed the prep, and a qualified person has not read the say-lines against
the lessons. Prompt rules reduce how often a wrong line is written. They do not replace that
reader.
