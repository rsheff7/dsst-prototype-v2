# Content structure: what IM's teacher materials change

Written 2026-10-23 from Robert's reading of the IM 6–8 Math Teacher Guide for Grade 6 Unit 3
(CC BY edition, the one DSST teaches) and IM's course-level Design Principles and
Instructional Routines. It is a note for the next full build, not a plan for this branch. It
says what the current structure gets wrong, what a better one looks like, and what that means
for the prototype now.

The tools were built on what the app could read: the student pages of one lesson. Almost
everything the analyses invent, the teacher materials state. The direction is **extract
first, infer second**: IM's words are copied with their source, and Premo adds a separate,
labelled layer on top.

Related: `REVIEW-PERSONAS.md` (who the tools are held up against),
`PREP-QA-GENERATION-CHANGES.md` (prompt changes proposed before the teacher materials were
available; see "What to do now" for which still apply).

---

## 1. Sources

| Source | What it holds | Access |
|---|---|---|
| Student pages (the uploaded PDF) | Tasks, lesson summary, practice problems | What the app uses today |
| Teacher edition web pages, `im.kendallhunt.com/MS/teachers/<course>/<unit>/<lesson>/` | Everything in the guide below except student responses and cool-downs | Open |
| Unit Teacher Guide PDF | All of it, including student responses, cool-downs with answers, practice solutions, assessments with notes on each wrong answer | DSST to supply; one unit is in hand |
| Course guide | Design principles, routine definitions, the English-learner framework | Robert has the first two |

The edition matters. `accessim.org` serves IM v.360, which has different activities in the
same lesson numbers and a non-commercial licence. It is not DSST's curriculum.

**Extraction hazard.** Plain text from the guide PDF drops inline mathematics: fractions and
expressions vanish ("have unit rates of and."). Ingestion has to use the web pages, which keep
the mathematics as text, or read the page images. This is the first infrastructure question
for Neil.

---

## 2. What the materials contain

### The unit

- A **narrative** from the grades before to the grade after (Unit 3: grade 5 scaling, to the
  constant of proportionality in grade 7), and the distinctions that matter ("75% does not
  represent a fraction or decimal").
- **Sections** that group lessons (Units of Measurement, Unit Conversion, Rates, Percentages,
  Let's Put it to Work).
- A **progression of disciplinary language**: the language use each lesson calls for
  (interpret, explain, justify, and also describe, compare, critique, generalize, represent),
  with lesson numbers.
- A **terminology table**: new words by lesson, split into words students need to understand
  (receptive) and words they must produce (productive).
- A **readiness check** that ties each item to a move ("If most students struggle with this
  item, plan to use … in the Lesson 1 Activity 2 Synthesis").
- An **end-of-unit assessment** that says what each wrong answer means ("Students selecting A
  have computed 70% of 35…"), in two forms.
- A **materials list** for the unit.

### The lesson

Every lesson has the same skeleton:

1. **Warm-up**, 5–10 minutes, with a named routine.
2. **One to three activities**, 10–35 minutes.
3. Often an **optional activity**. Unit 3 has seven, across six of its 17 lessons.
4. **Lesson synthesis.**
5. **Cool-down**, 5 minutes, with a student response.
6. **Student lesson summary.**
7. **Practice problems** with solutions, marked when they revisit an earlier lesson.

The unit's last lesson is an application project, with no synthesis or cool-down.

Each lesson also has **goals** that name the language mode ("explain (orally and in
writing)"; "orally" is by far the most common), learning targets, a **lesson narrative** that
says what shifts (Lesson 7: until now students reasoned row to row in a table; here they
reason across columns), standards, the routines used, and required materials and preparation.

### The activity

Every activity has: a **narrative** (its purpose, usually in the first sentence, and what to
watch for and which students to look for), **routines**, **launch** (grouping, think time),
**access for students with disabilities**, **access for English language learners**,
**anticipated misconceptions** with a teacher move (in about half the activities), the
**student task**, the **student response**, an optional extension, and the **activity
synthesis** (which work to show, in what order, what to highlight).

---

## 3. Design principles that shape the structure

From IM's course-level Design Principles.

### Task purpose

IM designs every activity for one of eight purposes. The guide does not label them, but the
activity narrative almost always states the purpose in its first sentence (10.2 "students
learn the definition of a percentage"; 4.4 "This optional activity is an opportunity to
practice"; 14.3 "In this info gap activity"). Task purpose should be the activity's main
attribute, and it settles questions the tools now guess at:

| Task purpose | What it settles |
|---|---|
| Provide experience with a new context | Concrete before abstract. The prep is about the experience working (6.2.4's color mixing) |
| Introduce a new concept and associated language | The likeliest crux. Rehearse noticing and putting words to the new idea |
| Introduce a new representation | Students interpret it first, then make it. A move that starts with drawing skips a step |
| Formalize a definition | A likely crux. The look-for is the definition in students' own words |
| Identify and resolve common mistakes | The flawed work is IM's. Use it; do not invent another |
| Practice using mathematical language | The only purpose where Information Gap belongs |
| Work toward mastery | Usually optional, no new mathematics. Safe to cut, never the crux |
| Apply mathematics to a modeling problem | Usually the last lesson. Planning and materials matter more than misconceptions |

### The Five Practices

Anticipate, monitor, select, sequence, connect (Smith and Stein). IM says much of the
anticipating, sequencing and connecting is already in each activity's narrative, launch and
synthesis. Unit 3 uses the routine in 11 activities. The phone prep already does the first
two practices (Predict is anticipating; Rehearse is monitoring and responding). Select,
sequence and connect are what is missing.

### The unit arc

A pre-assessment opens the unit. The first lesson is built for an easy entry at every level
of mathematics and of English. Representations, contexts, concepts, language and notation are
introduced in order, then connected, then made efficient. Anchor contexts recur across
lessons. Most units end with an application lesson.

### Standards alignment

Each activity is "building on" (prior grades, used as a bridge), "addressing" (grade-level
work), or "building towards" (laying a foundation, not yet at the standard). On a "building
towards" activity, work short of the standard is expected, not an error.

### Diagrams

"Everything in a mathematical diagram has a mathematical meaning." This applies to anything
Premo tells a teacher or a student to draw.

---

## 4. Routines

IM defines 17 routines: Algebra Talk; Anticipate, Monitor, Select, Sequence, Connect; Group
Presentations; the eight MLRs; Notice and Wonder; Number Talk; Poll the Class; Take Turns;
Think Pair Share; True or False; Which One Doesn't Belong. Each comes with what it is, where it
goes and why.

**What this establishes:**

- **The routines are the activity's structure.** Most are not MLRs. Think Pair Share appears
  28 times in Unit 3. No non-MLR routine appears anywhere in the pipeline, prompts or tools
  today, so the analysis cannot say how an activity is meant to run.
- **Each has a place and a purpose.** Number Talk, Algebra Talk, True or False and Which One
  Doesn't Belong are warm-ups. Notice and Wonder and Poll the Class open activities. Think Pair
  Share and Take Turns structure partner work.
- **IM supplies the teacher's words.** Number Talk: "Who thought about it a different way?",
  gather two or three distinct strategies, record them for all to see. Information Gap: "What
  information do you need?" and "Why do you need that information?". Group Presentations: ask
  a classmate to restate the group's findings in their own words.
- **Each implies its own breakdown.** Take Turns exists to stop one student taking over. Think
  Pair Share fails without quiet thinking time first. Number Talk fails when the teacher
  demonstrates the strategy. In Information Gap the data-card partner must not do the
  calculation. Poll the Class fails when not everyone answers, and IM's fix is a guess sure to
  be too low or too high. These are the "protocol breakdown" moments the Social Studies prep
  rehearses, and here they come from IM.
- **Some need a first-time demonstration.** IM says to model Information Gap and Take Turns
  with a partner the first few times.
- **MLR 8 is a modifier.** Discussion Supports "can be combined and used together with any of
  the other routines". It is not a fallback.
- **Language development is not only the MLRs.** Number Talk, True or False, Which One Doesn't
  Belong and Take Turns each list precise language or argument (MP6, MP3) as their purpose.

**Where the app disagrees with IM today:**

| | App (`src/lib/mlrs.ts`, production prompt) | IM |
|---|---|---|
| MLR 3 name | "Critique, Correct, and Clarify" | "Clarify, Critique, Correct" in DSST's edition |
| MLR 3 material | Any flawed sample | A piece of mathematical writing that is not the student's own |
| MLR 4 | Partners hold different information; example is describing a diagram. Prompt trigger: "card sort" | A problem card missing information and a data card; both partners ask; teacher demonstrates first |
| MLR 6, third read | "What is the question?" | In IM's Lesson 1.3 support: brainstorm solution strategies |
| MLR 8 | Default when nothing fits | Combined with other routines |
| Tagging | Every wristband tile must carry an MLR | MLRs assigned sparingly, alongside the other routines |

---

## 5. Language development

### How IM supports English learners

In Unit 3 there are 39 English-learner supports, about one per activity. Each one:

- is anchored to an **MLR**: MLR 8 ten times, MLR 7 nine, MLR 1 and MLR 3 six each, MLR 6
  four, MLR 2 two, MLR 4 and MLR 5 once each;
- names the **language domains** it works on: speaking (29), listening (18), writing (16),
  reading (7), conversing (7), representing (5);
- sits at a **phase**: 17 at the launch, mostly for making sense of the task (Three Reads,
  Co-Craft Questions); 22 in the synthesis, mostly for output and reflection (Compare and
  Connect, Clarify Critique Correct, Discussion Supports);
- gives its reason as one or more of four **design principles**: support sense-making,
  optimize output, cultivate conversation, maximize meta-awareness;
- says what to **listen for and amplify** ("Listen for, and amplify, the important quantities
  that vary in relation to each other").

The unit's rule is to **amplify, not simplify**, the language.

The guide never mentions proficiency levels, WIDA, home language, cognates or translation. One
support serves every learner. The sentence frames it offers sit mostly in the supports for
students with disabilities, not the English-learner ones.

### What that means for the structure

- **Premo's WIDA layer sits inside IM's routine, not beside it.** Level-specific moves are
  entirely Premo's. Today each scenario gets three free-standing moves, which is how a by-level
  move came to invent an Information Gap the lesson does not have. A level-specific move should
  be a way into IM's routine at its phase: for example, Three Reads at the launch, with the
  first read supported by a picture for Levels 1–2.
- **A support records its phase, domains and design principle**, so a chip can say "at the
  launch, for sense-making" instead of a generated "why here".
- **Vocabulary splits** into words to produce today and words to understand, from the
  terminology table.
- **The lesson's language use comes from IM**, replacing the lookup in `widaCalibration.ts`
  that guesses a Key Language Use from the activity's outcome type. IM's list (interpret,
  explain, justify, describe, compare, critique, generalize, represent) does not map one-to-one
  onto WIDA's four (narrate, inform, explain, argue). **The crosswalk is a decision for
  Robert.**
- **"Amplify, not simplify" becomes a check** on every support. It is the rule the subject
  expert found broken most often.
- **Home-language moves are labelled Premo's.** IM has none.
- **Access for students with disabilities is a missing kind of support** across all five
  tools. IM gives one in most activities, tagged by what it supports (memory, organization,
  visual-spatial processing…).

---

## 6. The content model this points to

```
Unit
  narrative, sections, language progression, terminology (receptive / productive),
  readiness check (item → move), end-of-unit assessment (item → what each wrong answer means)
  Lesson
    slot structure, goals (with language mode), narrative (what shifts), standards,
    materials and preparation, lesson synthesis, cool-down + response, summary, practice
    Activity
      slot (warm-up / activity / optional / cool-down), minutes, task purpose,
      alignment (building on / addressing / building towards)
      narrative, launch, task, response, misconceptions + moves, synthesis (select, sequence, connect)
      routines → Routine
      supports: English learner (MLR, phase, domains, principle, what to amplify),
                disability (what it supports)
Routine (shared)
  name, kind, where, IM's procedure, IM's lines, known breakdowns, needs first-time demo
```

Every field carries **whose it is**:

- **IM**: copied from the materials, verbatim where quoted.
- **Premo**: the layer IM does not write. The crux, the testable object, moments beyond IM's,
  level-specific ways into IM's routines, rehearsal checks, the prediction.
- **DSST**: the district's adaptations, once they have them.

Content is built and reviewed ahead of time, unit by unit, as the Social Studies prep does
(status draft until a person checks it). Analysing an uploaded PDF becomes the fallback.

---

## 7. What it means for this version

| Part of this version | Under the new structure |
|---|---|
| Phone prep screens and flow (commit before reveal, rehearse aloud, the In-class card) | **Stay.** They do not depend on where content comes from |
| Prep model's selection rules: crux focus, rehearsal quotas, look-for filter, close-splitting, reading-time minutes | **Mostly retired.** They work around thin data |
| `src/lib/prep/draftCoolDowns.ts` | **Retired.** The guide has the real cool-downs and answers |
| The `prep` block in `samples/6.2.4-authored.json` (`AuthoredPrep`) | **The seed of the new model.** Sourced, ordered, reviewable. Grow this rather than adding fields to `LessonData` |
| MLR selection table (`mlrSelection.ts`) and routine tagging in the passes | **Becomes a check.** IM names the routines; Premo verifies or adds and says so |
| `mlrs.ts` definitions and the prompt's MLR section | **Replaced by IM's definitions** (section 4) |
| WIDA calibration and the outcome-to-Key-Language-Use lookup | **Needs the crosswalk** (section 5) |
| Per-activity learning targets | **Premo's inventions.** The materials give lesson goals only. Drop them or label them |
| Activity roles (Setup, Crux, Application, Synthesis) | **Replaced by IM's slots plus task purpose**, with the crux as a Premo judgment on top |
| The five desktop tools | **Same screens, new source,** plus two things they lack: disability access and the unit view |

**In the phone prep specifically:**

- **Orient** shows IM's slots: the warm-up routine, optional activities, the synthesis and the
  cool-down.
- **Predict** stays Premo's: IM's misconceptions carry no frequency, so Most / Some / Few has
  no IM basis.
- **Rehearse** gains two kinds of moment: "the routine breaks down" (from the routine's
  definition) and "which work do you show first" (IM's select-and-sequence, on Five Practices
  activities). A moment on a "building towards" activity is not labelled an error. Each
  language moment is tied to the launch or the synthesis.
- **Adjust**'s multilingual section becomes IM's support for the crux (when, which domains,
  what to amplify), then Premo's level-specific ways into it, then the words to produce today.
  Mastery activities are marked as the safe cuts.
- **The In-class card** opens with IM's launch or routine line where there is one, and carries
  the sequence for a Five Practices activity.
- **The 6.2.4 file** already follows IM's slots and lists only the routines IM assigns. It does
  not yet record task purpose, alignment, each support's phase, domains and principle, or the
  non-MLR routines.

---

## 8. What to do now, short of the full build

- **Stop spending on inference the materials replace.** In `PREP-QA-GENERATION-CHANGES.md`,
  items 1 (by-level moves keep one question), 3 (everything said is true) and the grounding
  half of 4 still apply to Premo's layer. Timings, routine choice, the invented close, the
  student question and `questions_to_listen_for` are superseded by extraction.
- **Do not add more prep-only fields to `LessonData`.** Extend `AuthoredPrep` instead.
- **Test one lesson from the guide.** Rebuild a Unit 3 lesson from the Teacher Guide the way
  6.2.4 was built from the web pages, and measure how much of it becomes copying rather than
  writing. Unit 2 needs its own guide for a like-for-like comparison with the lessons tested so
  far.

## 9. Decisions

**For Robert** (generation, pedagogy):

1. The crosswalk from IM's language uses to WIDA's Key Language Uses.
2. Whether a level-specific move is pitched at the band's lower WIDA level or spans both.
3. Whether every wristband tile must still carry a routine, now that MLR 8 is a modifier and
   IM names non-MLR routines.
4. Which source of truth wins when IM and Premo disagree on the crux.
5. Whether rehearsal keeps Premo-invented moments once IM's misconceptions and routine
   breakdowns are available, and how they are marked.

**For Neil** (infrastructure):

1. Ingesting the teacher materials without losing mathematics (web pages or page images, not
   PDF text).
2. Storing content by unit, with provenance on every field and a review status.
3. Pre-building and serving reviewed content, with upload analysis as the fallback.

## Evidence

Counts are from Grade 6 Unit 3 only and were taken by parsing the guide's text, so treat them
as approximate. The Unit 3 guide has 17 lessons, 39 English-learner supports, 38 disability
supports and 11 Five Practices activities, and anticipated misconceptions appear in about half
the activities. The routine definitions and design principles are IM's course-level text, as
supplied by Robert. Lesson 7 was read in full; the other lessons were read for structure.
