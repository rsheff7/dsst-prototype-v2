# Premo for DSST — v2

**A first look — and an invitation to shape what comes next**

*Scale Up Partners · May 2026*

---

## WHY WE BUILT THIS

Most planning tools give teachers more material. The teachers we work with — especially in their first three years — do not need more material. They need a faster path to what matters about a lesson and what their students will actually do with it.

We built Premo to do that work alongside the teacher. A new teacher can open a lesson on Sunday night, read its story, see what their students are likely to say and do, and walk into Monday with moves ready — without spending hours decoding a curriculum guide. This version is built for DSST Public Schools and anchored to Illustrative Mathematics, though the engine works on any text-based lesson PDF.

That is the bet. This document introduces version 2 of the prototype, walks you through what it does, and tells you what we want from you next.

---

## THE PRODUCT, IN ONE PARAGRAPH

A teacher uploads a math lesson (or opens the built-in demo). The tool returns five integrated views: the **Quick Read** — the synthesized single-page read that goes into class — and four deeper planning views underneath. **Pathway** carries the story of the lesson, the crux, the friction. **Adapt** carries what is safe to change, what cannot be removed, and MLL adaptations by proficiency. **Thinking** carries the student responses to expect, organized by activity, asset-based. **Move Walkthrough** is a scenario-by-scenario rehearsal of what teachers will see in class and what to do. All five views share the same data and the same framework, so they tell a coherent story.

---

## WHAT TEACHERS GET OUT OF IT

**A single page to carry into class.** The Quick Read is the artifact a teacher takes onto the floor — the destination, the arc, the moments to look for, the routines, all on one printable page or in a phone-screen mode for mid-lesson glances.

**A picture of student thinking before class.** Thinking and Moves show what students are likely to say, what to listen for, and what to do when they hear it — including for multilingual learners at three proficiency levels.

**Confidence to adapt without losing the math.** Adapt names the non-negotiables and the safe-to-change elements explicitly. Modifications stop being guesses.

**A shared language with coaches.** Every tool is grounded in the same construct, so coaching conversations have something to point at instead of starting from scratch.

---

## THE THINKING UNDERNEATH

Three design commitments shape everything you will see.

**Asset-based by default.** The tool never frames a student by what they lack. Every orientation card names what students *bring* to a lesson and where their thinking will take work — not "students who don't have language." Non-negotiable across every view.

**Two constructs, nested.** Premo organizes the *tool ecology* around Richard Elmore's **Instructional Core** — Teacher / Task / Student — mapping each vertex to its planning tool (Pathway → Teacher, Adapt → Task, Thinking → Student) with Moves as the integration. Inside *moment-by-moment* decisions, the tool uses the 8 **Mathematical Language Routines** (Zwiers, Stanford UL) as the response vocabulary for language-rich moments. Every MLL guidance item is anchored to one of the eight routines; the routine name is the same across the system; teachers build a fixed repertoire through repetition. The framework page explains both.

**Coach-aware.** Every view is designed to be readable by the teacher *and* their coach. Coaches do not need a separate dashboard. They open the same tool the teacher is using and ground the conversation there.

---

## TRY IT YOURSELF (10 MINUTES)

**Live URL (v2):** https://dsst-prototype-v2.vercel.app
**v1 (May 26 build, for comparison):** https://dsst-prototype.vercel.app
**Demo lesson:** Grade 6, Unit 2, Lesson 1 — *Introducing Ratios and Ratio Language* (from Illustrative Mathematics)

The fastest way through the product is to walk the demo in the order a teacher would use it.

### 1. Start with the Quick Read

Click **Try the demo lesson** on the landing page. You land on the **Quick Read** — the new first tab. The destination — *"By the end of the lesson, students can …"* — is the loudest thing on the page. Below it: the arc, then three activity rows. Each row has a learning target and 2–3 moment tiles. Each tile carries **Notice → Clarify → Respond** — what the teacher would see, the friction type, the MLR routine to run, the move, and the trap to avoid. The crux moment of the lesson has a red header band marking it as the single moment that, if missed, the lesson didn't land.

Toggle to **In class** at the top to see the same content stripped to glyphs — designed for a phone screen mid-lesson. Toggle back to **Plan view** to print on one letter-size page.

### 2. Switch to Pathway

The teacher's read of the lesson's structure. Read the arc at top. The activity timeline shows the function of each activity (Setup, Crux, Application) with a circle marker. Click any activity for its **Activity Guidance** — why it matters, signals of strong thinking, friction points tagged math / language / language+math, and concrete teacher moves. Each activity header also has a **Language Support** pill, colored to indicate the demand level, that opens a focused panel with the language frictions and the proficiency-specific adaptations from Adapt.

### 3. Switch to Adapt

The task's read on what is non-negotiable. The mathematical purpose card names what the lesson is for; the **Safe to change** and **Do not remove** columns name what is open and what is locked. Scroll to the proficiency adaptations — three concrete moves for Entering, Developing, and Bridging multilingual learners. Each is anchored to an MLR where one applies.

### 4. Switch to Thinking

The student's read. Pattern cards are color-coded by type and labeled with the action implied — *Build on this* / *Common error* / *Almost there* / *Ready to stretch* / *Language barrier*. Frequency labels tell the teacher how to prepare — *Plan for this* / *Have a move ready* / *Notice when it appears*. Patterns flagged MLL-specific carry an MLR chip; tap any chip to see the routine's definition, structure, and a *"Why here:"* line — the analysis-time reasoning for why that routine fits that pattern.

### 5. Switch to Move Walkthrough

The rehearsal. Scan the overview — every scenario the teacher might see, grouped by activity. Toggle to **By MLR** to see scenarios grouped by routine instead. Click any MLL scenario for the side-by-side comparison across Entering / Developing / Bridging — and for the **Avoid** line on the move card that names the over-helping trap that would undo the move.

### 6. Optional: read the framework and the how-to

Visit `/framework` for the construct backbone (*"What this is, and why to trust it"*), or `/how-to` for a three-step walkthrough. Both are short.

---

## WHAT WE WANT FROM YOU

This is round two with you. What we want most is a candid read.

- Does the **Quick Read** function as the in-class artifact — the single sheet a teacher would actually carry into class? Does the destination read as the entire purpose of the lesson?
- Do the **MLR chips** earn their place across the tool, or do they read as decoration? When you read a move text that is anchored to a routine, does it run the routine for you, or does it feel like generic advice with a label?
- Does the **Elmore mapping** in the framework make sense as the tool-ecology backbone? Does the framework page answer *what this is* and *why to trust it*?
- Does **Notice → Clarify → Respond** on the Quick Read tile add value, or feel imposed?
- Which of the five views carries the most weight in your read? Which feels weakest?
- Where does the tone or language drift from what a novice teacher would actually want at 9 PM the night before teaching?
- How might you embed the use of this tool inside the professional learning activities you already run with teachers — coaching cycles, PLCs, lesson study, induction, summer institutes — without adding a new layer on top of their week?

Even a 15-minute reaction is useful. A longer written response is more useful. Either is welcome.

---

## WHERE THIS IS IN DEVELOPMENT

Honest read on the state of v2.

**What works today:**
- The demo lesson runs instantly across all five views and is the best single demonstration of the product.
- Real PDFs from Illustrative Mathematics and similar curricula upload and analyze end-to-end (~2.5 to 3 minutes).
- All five views populate from a single analysis pass, with `mlr_inference` produced first and downstream guidance anchored to it.
- The Quick Read print stylesheet renders the wristband on one letter-size page.
- The Quick Read In-class view renders as a phone-screen-ready stripped artifact.
- An internal coherence editor (in `/qa`) flags type / frequency / move misalignments in Thinking patterns.
- The MLR overlay shows definition, structure, example, and the analysis-time *"Why here"* reasoning — without leaving the tool.

**What is still in active iteration:**
- A cross-tool coherence editor at the pipeline level — flags cross-view coherence issues rather than rewriting the analysis (designed; not yet rebuilt).
- Performance — upload time is the largest friction; we have a roadmap to bring it under one minute.
- Persistence — analyzed lessons currently live in browser memory only; saved-lesson workflows are next.
- A "Rehearse mode" on Quick Read or as a separate surface, to build wait-time and routine-execution muscle for first-year teachers.

**What we are deliberately not building yet:**
- An LMS integration. The tool is intentionally standalone for now so the educational thinking can be evaluated on its own merits.
- A teacher-facing dashboard. The unit of work is one lesson; we have not yet seen a need for a layer above it.

---

## WHAT TO DO NEXT

Two asks:

1. Spend 10 minutes with v2 at https://dsst-prototype-v2.vercel.app — use the walkthrough above as a guide. v1 is still live at https://dsst-prototype.vercel.app if you want to A/B.
2. Prepare to share initial feedback in our check-in on **June 1, 2026**.

---

*Premo for DSST · v2 · Scale Up Partners, LLC · May 2026*
