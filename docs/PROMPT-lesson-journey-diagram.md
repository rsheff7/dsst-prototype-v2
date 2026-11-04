# Prompt — what happens to a lesson inside Premo

Paste everything below the line into GPT or Claude. It is self-contained.

Set the bracketed audience line first; the rest works as written.

The retention facts below were read off the running code, not recalled. If the
build changes, re-check them before reusing this — an IP claim that has drifted
is worse than none.

---

You are an information designer. I need one diagram for a slide deck showing what
happens to a lesson document as it passes through our tool — and, just as
importantly, what is kept afterwards and what is not.

**Audience:** [district leadership and curriculum staff, some of whom are
responsible for the district's relationship with the curriculum publisher]. A
significant part of the room is asking, in effect: *are you ingesting our
curriculum and keeping it?* The diagram must answer that on its face, without the
presenter having to reassure anyone verbally.

**Tone:** factual, not defensive. This is a data-handling diagram, and the honest
answer is good but not "we keep nothing." Overclaiming here is the fastest way to
lose the room.

## The tool, in one line

A teacher uploads one lesson PDF; the tool returns a lesson plan with teaching
guidance — what to watch for, what to say, how to adapt for multilingual learners.

## The journey — one lesson, one upload

**1. Upload.** A teacher drags in a PDF of a single lesson, exported from the
curriculum site.

**2. Text extraction.** The file is parsed in memory to plain text. The PDF binary
is never written to disk, never stored, and is gone when the request ends. Only
the first ~12,000 characters of text are used — roughly one lesson.

**3. Identification.** Two things are read out of the text verbatim, by pattern
matching rather than interpretation: which lesson it is (grade, unit, lesson
number, title) and the publisher's own printed learning targets.

**4. Analysis.** The extracted text is sent to a commercial language model, which
returns a structured analysis: the activities and their arc, the language demands,
anticipated student thinking, and teaching moves. **This is a third-party API
call — the lesson text leaves our system for the model vendor for the duration of
the request.** This is the one step where the document is handled by someone else,
and the diagram must not bury it.

**5. Rule-based decisions.** Which language routines to recommend is decided in our
own code by a lookup table, not by the model. Structural requirements are checked
and enforced here too.

**6. Assembly and storage.** The finished plan is stored so the same lesson always
returns the same plan for every teacher. **What is stored is the plan we produced,
not the lesson.**

**7. Delivery.** The teacher reads it in the app, prints a one-page version, or
exports a file.

## What is retained — state this precisely

**Never stored:**
- the uploaded PDF
- the body of the lesson — the tasks, problems, prompts, worked examples,
  illustrations, and student-facing text
- any student information; the tool never sees any

**Stored, as part of the plan:**
- which lesson it is: grade, unit, lesson number, lesson title
- the publisher's printed learning targets, verbatim — two or three sentences
- the activity titles, as printed
- our generated guidance, which necessarily refers to lesson specifics in order
  to be useful ("when a student writes 3 blue and 5 yellow in the wrong order…")

**Sent to the model vendor, not retained by us:** the extracted lesson text for
the duration of one request.

**Logged:** timing and size numbers only — how long a step took, how many
characters were extracted. No lesson content.

The honest summary a viewer should reach on their own: *the tool keeps its own
output, plus enough identification to know which lesson that output belongs to.
It does not accumulate a copy of the curriculum. It does hand each lesson to a
model vendor while it works.*

## What the diagram must show

- The linear journey, left to right or top to bottom.
- A second, parallel track showing what persists at each step — most steps should
  visibly persist **nothing**, which is the point.
- A clear boundary marking what leaves our system, drawn honestly rather than
  minimised.
- The distinction between *stored* and *momentarily handled*, since that is the
  distinction the audience actually cares about and the one most often blurred.

## What to leave out

Vendor names, model names, file names, function names, cloud icons, database
cylinders, encryption padlocks. No security theatre — a padlock icon invites the
question of what it means. Keep it to what happens to the document.

## Output

**1. The schema, as structured data.** Each step with: id, label, one plain
sentence of what happens, `leaves_our_system` true/false, and `persists_after`
as an explicit list — empty where nothing is kept. A designer should be able to
rebuild the diagram from this alone.

**2. The diagram, as a single self-contained SVG** — 1920×1080, no external fonts,
no scripts. Nothing below ~16px at that size. The retention distinction must
survive grayscale printing, so it cannot rest on colour alone.

Then, in three sentences: what you simplified, and where a well-informed skeptic
in the audience could reasonably say the diagram is flattering.

## How to judge your own output

Someone whose job is protecting the district's curriculum licence should be able
to look at the slide, without narration, and correctly answer three questions:
Does this system keep our lesson? Does our lesson go anywhere else? What exactly
is in the thing it saves?

If they would have to ask any of those out loud, redraw it.
