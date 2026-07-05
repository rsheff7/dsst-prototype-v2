# Premo · v2.2 ELSF preview — what to look at

**For the DSST IM implementation expert team**
*Scale Up Partners · June 2026*

---

## The comparison you have

| URL | Build | What it is |
|---|---|---|
| https://dsst-prototype-v2.vercel.app | **v2.1 — DSST 6/1 review** | The build you reviewed on June 1. Frozen here until you sign off on v2.2. |
| https://dsst-prototype-v2-git-elsf-layer-robert-5196s-projects.vercel.app | **v2.2 — ELSF preview** | v2.1 plus the ELSF reasoning layer. |

Each page's footer carries the version label so you can tell at a glance which build you're on.

---

## What v2.2 adds (and what stays untouched)

### Added — the ELSF reasoning layer

The intelligence layer now reasons through the **ELSF Math Guidelines** in addition to Elmore's Instructional Core and the 8 MLRs. The two new layers nest cleanly:

- **Elmore** organizes the tool ecology (Pathway → Teacher, Adapt → Task, Thinking → Student, Moves → Integration).
- **MLRs** are the response vocabulary for language-rich moments.
- **ELSF** (new) is the diagnostic vocabulary for *what kind of language work an activity demands* in the first place. The MLR picks the response; ELSF identifies the demand.

For every activity, ELSF reasoning now produces two structured blocks:

1. **language_demands** — receptive / productive / interactive / everyday-to-academic bridge. Names *what kind of language work the activity requires*.
2. **functional_language** — language functions students must use, example phrases, and where L1 (home language) can be leveraged. Names *the specific language students need to produce*.

Both blocks cite the specific ELSF guideline numbers that informed the reasoning. Most relevant for language demands: Guidelines 2 and 6. Most relevant for functional language: Guidelines 1, 3, 7, and 12.

### Added — proficiency vocabulary now uses ELSF labels

The three-tier proficiency structure that validated on 6/1 is preserved exactly — color scheme, distribution by language demand, the rule that Emerging always has a non-verbal action — all unchanged. **The labels changed**:

- **Entering** → **Emerging**
- **Developing** stays **Developing**
- **Bridging** → **Expanding**

This is a label change, not a structural change. Same content, same colors, same coaching guidance. The new vocabulary is the ELSF convention.

### Not changed — the six do-not-break items from 6/1

- The guidance voice (the "would say it myself" register, the why-statements, the don't-say-this precision). Untouched.
- The Quick Read / in-class view (MLR chips at points of need, proficiency surfacing, crux moment band). Untouched.
- The robust-vs-quick-read split (two depths). Untouched.
- Teacher-as-power-user framing (educative PL tool, not student-facing). Untouched.
- The language support layer (proficiency × demand color scheme with distributed guidance). ELSF *layers onto* this — it does not replace it.
- The lesson upload → per-lesson generated output pipeline. Same single-pass analysis call; the ELSF block is produced alongside everything else.

---

## What to look at, in order

### 1. Compare the demo lesson side by side

Open both URLs in separate tabs. The teacher-facing surfaces (Quick Read, Pathway, Adapt, Thinking, Moves) look almost identical on v2.2 — the only visible change in this cut is the proficiency labels (Emerging / Developing / Expanding instead of Entering / Developing / Bridging). The deeper reasoning happens behind the scenes and is exposed in `/audit` for your review before any of it surfaces in the teacher view.

### 2. Read the new ELSF thread in /audit

This is the most important comparison surface for this cut.

Visit https://dsst-prototype-v2-git-elsf-layer-robert-5196s-projects.vercel.app/audit (click "Load the demo lesson" if prompted), then scroll to **Section 9. ELSF language layer**. For each of the three activities you'll see:

- **Language demands** — receptive / productive / interactive / everyday-to-academic bridge, with the ELSF guideline numbers cited in brackets.
- **Functional language** — the language functions students must use, example phrases for what they need to produce, and where L1 can be leveraged.

This is the layer's content quality on display. The question we want your read on: *would you teach with this depth of language reasoning informing the rest of the guidance?*

### 3. Verify the /qa pass

Visit /qa on the v2.2 preview. You'll see a new **ELSF** check category. The four checks should all pass on the demo. On a real uploaded lesson, these will tell you whether the analysis covered every activity and cited valid guidelines.

### 4. Confirm the six 6/1 items survived intact

Walk the demo on v2.2 the same way you walked v2.1 — Quick Read first, then the four planning tools. The guidance voice, the chip placement, the proficiency structure, the upload pipeline should all feel exactly as they did on 6/1. If anything reads off, that is the bug we most want to know about.

---

## What's planned next (Cut 2, not in this preview)

If the audit content quality is good, Cut 2 will surface the ELSF reasoning in one teacher-facing place: the **Pathway Language Support accordion**. The accordion currently shows language frictions plus the three proficiency adaptations. Cut 2 adds two sub-sections between them — *What kind of language is at stake* (receptive / productive / interactive / bridge) and *Language students need to produce* (functions and example phrases).

We're holding that until you've reviewed the content on /audit and confirmed it's worth showing teachers.

---

## What we want from you

Specific questions:

1. **Is the ELSF content quality high enough to surface to teachers?** The /audit thread is the content quality bar. If it's thin or generic, it stays in /audit until we tune it.
2. **Does the everyday-to-academic bridge framing land?** That's the specific diagnostic ELSF adds. Read the bridge sentences across the three activities — do they name the right shift?
3. **Do the example phrases feel like real academic English students need to produce?** Or do they read as scaffolds disguised as functional language?
4. **Are the cited guideline numbers credible?** When language_demands cites guideline 2 or 6, does the reasoning actually reflect that guideline?
5. **Does the Emerging / Developing / Expanding label change feel like a small UX adjustment or does it disorient?** The structure is identical; only the words changed.
6. **Anything from the 6/1 do-not-break list that feels at risk in v2.2?** That's the most important question. If yes, we revert that piece before the merge.

A short Loom or a quick written note works. We will use it to decide whether Cut 2 ships now, ships after a tune, or waits.

---

## What to do next

Two asks:

1. Open both URLs and spend ~15 minutes on the comparison above. Start at the Quick Read on each, then walk to /audit on v2.2.
2. Share your read with us in a written note or a 5-10 min Loom by **Thursday, June 4** if possible. If you need longer, tell us when works.

---

*Premo · v2.2 ELSF preview · Scale Up Partners, LLC · June 2026*
