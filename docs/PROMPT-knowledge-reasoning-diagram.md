# Prompt — knowledge & reasoning layer diagram

Paste everything below the line into GPT or Claude. It is self-contained.

Before running it, set the two bracketed values in the first paragraph. Everything
else works as written.

---

You are an information designer who makes technical architecture legible to
non-technical decision-makers. I need one diagram for a slide deck.

**Audience:** [district instructional leadership — people who know mathematics
teaching well and software not at all]. **The one thing they should leave with:**
[this tool's guidance is grounded in named frameworks and mostly decided by rules,
not improvised by an AI].

## What the system is

A planning tool for middle-school mathematics teachers. A teacher uploads one
lesson PDF; the tool returns a lesson plan with teaching guidance — what to watch
for, what to say, and how to adapt for multilingual learners.

The interesting part, and the part the diagram must carry, is that the guidance is
produced by three different *kinds* of thing, and they carry different weight:

- **Read from the lesson** — taken verbatim from the uploaded document. Not
  interpreted.
- **Computed** — decided by a rule or lookup table in code. Same input always
  gives the same output. A person can read the rule.
- **Written by the model** — a language model produces prose, under constraints
  supplied by the two above.

A reader should be able to see at a glance which parts of the output are which.
That distinction is the argument of the slide.

## The knowledge layer — what the system knows before it sees any lesson

These are fixed, owned, and auditable. None are invented per lesson.

1. **The 8 Mathematical Language Routines** (Zwiers et al., Stanford Understanding
   Language / SCALE). Named classroom routines — e.g. *Collect and Display*,
   *Critique, Correct and Clarify*, *Information Gap*, *Compare and Connect*. Each
   has a structure and a precondition: a routine only works if the task already
   contains what it needs (a flawed sample to critique, materials that split
   between partners, two strategies to compare).
2. **The 15 ELSF guidelines** (English Learners Success Forum) for mathematics
   materials. Used to diagnose an activity's **Language Mode** — receptive,
   productive, interactive. Language Mode characterises the activity; it does
   not select the routine and does not determine the Key Language Use.
3. **WIDA's proficiency framework** — 6 levels (Entering → Reaching) across 3
   dimensions (Discourse, Sentence, Word/Phrase), and 4 Key Language Uses (Argue,
   Explain, Inform, Narrate). A 4 × 6 lens describing what a learner at each level
   already does and is reaching toward.
4. **Routine-Selection Table** — maps **Lesson Outcome** (what students are
   expected to accomplish) plus **Activity Role** (where the activity sits in the
   lesson: Setup / Crux / Application) to the routine that develops it.
5. **Lesson Outcome → Key Language Use Mapping**.

Items 4 and 5, and the wording of item 3's descriptors, are the project's own
design work and are awaiting review by subject-matter experts. Items 1–3 are
external published frameworks. **The diagram should distinguish borrowed
frameworks from our own judgement.**

## The reasoning layer — what happens to one lesson

```
lesson PDF
   │
   ├─ read verbatim ──▶ the lesson's published learning targets
   │                     ("I can write or say a sentence that describes a ratio")
   │
   ▼
ANCHOR  (one model call)
   For each activity, produces:
     · the LESSON OUTCOME — what students are expected to accomplish,
       restating a published target in that activity's terms, classified into
       one of six kinds (formulate precisely / judge or evaluate / connect
       representations / interpret a situation / communicate precisely /
       generalise in writing)
     · the LANGUAGE MODE (receptive / productive / interactive)
     · the ACTIVITY ROLE (Setup / Crux / Application)
     · plain facts about the printed materials: is a wrong answer shown?
       do the materials divide between partners? are sentence frames printed?
   │
   ▼
ROUTINE SELECTION  (no model — a rule)
   Lesson Outcome + Activity Role  ──▶  which routine(s), why, what to prepare
   (Language Mode drives neither this mapping nor the Key Language Use one)
   Where a routine needs something the lesson does not print, the rule attaches
   the one sentence of preparation that makes it runnable.
   │
   ▼
FIVE PARALLEL MODEL CALLS, each constrained by a schema and by everything above
   · lesson structure and teacher moves
   · MLR + ELSF reasoning, and a learner profile per proficiency band
   · anticipated student thinking
   · decision guide — what you'll see, what it means, what to do
   · the one-page in-class reference
   │
   ▼
VALIDATION  (no model)
   Structural floors enforced in code, not requested in a prompt.
   Anything out of line is regenerated once.
   │
   ▼
CACHE, keyed on the lesson's identity
   The same lesson always returns the same plan — for every teacher, every time.
```

## What the diagram must show

- The two layers, and that the knowledge layer is stable while the reasoning
  layer runs per lesson.
- The three provenance kinds, visually distinct and consistently applied.
- That the deterministic steps *constrain* the model steps — the arrows are the
  argument, not decoration.
- Which knowledge is borrowed and published versus our own and provisional.

## What to leave out

Function names, file names, model names, vendors, JSON, token counts, latency.
The audience does not care and it makes the slide look like an engineering
artifact. No cloud icons, no database cylinders, no robot imagery.

## Output

Produce two things.

**1. The schema, as structured data.** Every node with: id, label, layer,
provenance (`read` / `computed` / `generated` / `framework` / `our-judgement`),
one plain-language sentence, and its edges. Someone should be able to hand this
to a designer and get a different-looking diagram that says the same thing.

**2. The diagram, as a single self-contained SVG** — 1920×1080, no external
fonts, no scripts, readable when projected. Legible from the back of a room means
nothing below ~16px at that size, and the provenance distinction must survive
grayscale printing, so do not rely on colour alone.

Then, in three sentences, tell me what you had to simplify and where the diagram
is therefore misleading.

## How to judge your own output

The slide succeeds if someone who has never seen this tool can point at any part
of the output and say whether a rule decided it or a model wrote it. If your
diagram requires the presenter to explain that distinction out loud, it has
failed and you should redraw it.
