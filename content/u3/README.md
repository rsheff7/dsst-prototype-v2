# Unit 3 content

Grade 6 Unit 3 (Unit Rates and Percentages) built ahead of time from IM's teacher
materials (IM 6–8 Math, CC BY edition). The design is in
`docs/CONTENT-STRUCTURE-NOTE.md`; the types are in `src/lib/u3/types.ts`. Built so far:
the Rates section, Lessons 6.3.5–6.3.9. In the app: `/u3` (unit view) and `/u3/<code>`
(phone prep).

| Folder / file | What it is | Who writes it |
|---|---|---|
| `source/` | IM's teacher pages as text (`u3-sources.mjs`), IM's course routines and design principles, the unit pages of the Teacher Guide transcribed | Fetched or transcribed; never edited by hand |
| `tg/6.3.<n>.json` | Student responses, extension responses and the cool-down, transcribed from the Teacher Guide's page images (its text layer drops the maths) | Transcribed by a model; not yet checked by a person |
| `im/6.3.<n>.json` | IM's layer: every line copied from the sources | `node scripts/u3-extract.mjs` |
| `purposes.json` | Premo's reading of each activity's task purpose, with the IM sentence it rests on | Premo |
| `premo/6.3.<n>.json` | Premo's layer: crux, testable object, rehearsal moments, prediction, language support, glance card. `status: "draft"` until a person reviews it | Premo |
| `unit.json` | Sections, narrative, language progression, terminology, readiness items | Built from `source/tg-unit.txt` |
| `../routines.json` | IM's 18 routine definitions, verbatim, with each routine's likely breakdowns | IM's text; breakdowns are Premo's |

## Adding a lesson

1. `node scripts/u3-sources.mjs <n>` to fetch its teacher pages.
2. Transcribe the Teacher Guide's student responses and cool-down into `tg/6.3.<n>.json`.
3. Add its activities' task purposes to `purposes.json`.
4. `node scripts/u3-extract.mjs <n>` to build the IM layer.
5. Write `premo/6.3.<n>.json` to the standard (6.3.7 is the worked example; the standard
   is `premo-ssa/docs/GENERATION-PROMPT.md`).
6. Add the lesson to `built` in `unit.json` and to `src/lib/u3/content.ts`.
7. `npm run check:u3` must pass: every line marked IM's is checked word for word against
   the sources.

## WIDA levels: one band's content, two tiers

Language content is written for three bands (Levels 1–2, 3–4, 5–6). Teachers pick individual levels 1–6, as in the tool set, and the level-tier rule in `src/lib/prep/levelTiers.ts` shows the band's content for that level:

| | Lower level (1, 3, 5) | Higher level (2, 4, 6) |
|---|---|---|
| Sentence frame | Given before they speak | Held back, offered if they stall |
| Without words | Offered first | Kept as a fallback |
| Home language | Work it out first in it | Share in English, switch if stuck |
| Partner rehearsal | Before sharing with the class | Share with the class directly |

The rule fades support; it never changes the math or the question. What the higher level adds depends on the lesson, so each band in `cruxLanguage.byBand` carries one authored `stretch` line (20 words at most, not a repeat of `reaching`). The checker requires it. The rule relies on the house home-language sentence: "They can work it out first in any language they share with a partner."
