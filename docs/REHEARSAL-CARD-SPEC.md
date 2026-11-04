# Rehearsal card spec: 6.3.7 (v2, built for 6.3.7)

**Built for 6.3.7 on 2026-11-03** (`content/u3/plan/6.3.7.json` → `rehearsal`). Robert's decisions:
- **No student names.** Cards say "a student" or "Pair A", not "Maya" or "Dani", wherever the text below uses a name.
- **Keep "Crux"** on screen, with a tap definition.
- **The reviewers' recommendations stand** for the other three decisions: rehearse each picked level, accept Pair B's work, and show Today's frame before speaking.

The other four lessons keep the earlier cards until this one is approved.

- **Drafted** by Jordan Ellis (second-year teacher).
- **Edited for wording** by Dana Okoro (copy editor).
- **Checked against IM, the language goal and the routines** by Dr. Elena Vásquez-Tran.

The personas are defined in `docs/REVIEW-PERSONAS.md`. This spec covers the night when only the key activity is chosen for 6.3.7 (seven cards), then what adding 7.2 changes.

**The problem it solves (Robert):** "The language phrasing is not intuitive and the cards require the reader to draw from their memory of the lesson crux."

**The fix:** every card shows what it refers to, asks one plain question, and says what a good move achieves. It never relies on the teacher remembering the lesson.

---

## Every card, top to bottom

1. **Card name**, a plain verb phrase ("Choose who shares first"), plus small labels: *Key activity*, the routine (*Three Reads*, *Collect and Display*) and *Language*. Tap any label for a one-line definition.
2. **Today's sentence.** This shows on the key-activity cards: one line, tap to see it all. It is the model sentence (`clo.exemplar`): "To get bracelets, I multiply by the unit rate, 6 bracelets per hour: 7 × 6 = 42. To get hours, I divide by 6: 66 ÷ 6 = 11."
3. **Where we are:** "About N minutes into Activity 7.3." Then what just happened, and what's on the board.
4. **What's in front of you:** the exact rows of the table, and the student's words or work.
5. **The question**, asked from the teacher's seat, then the **Aim**: what the student ends up doing, in 15 words or fewer, never the words to say.
6. **Say it out loud (speech-bubble icon) → "I said it".** Then the model wording, then **"Did yours do these?"** with ticks that are never marked wrong, then **More**, collapsed.

The two kinds of language support are called **Today's frame** (with blanks) and **Today's sentence** (filled in) everywhere.

---

## Card 1 · Do the task yourself

- **Where we are:** Before class. Solve the task students do today.
- **Shown** (IM's 7.3 task, photo lines removed): "Complete the table. Then, explain the strategy you used to do so."

  | time in hours | number of bracelets | speed (bracelets per hour) |
  |---|---|---|
  | 2 | | 6 |
  | 5 | | 6 |
  | 7 | | 6 |
  | | 66 | 6 |
  | | 100 | 6 |

  The cells are fillable and marked against IM's answers, as now. The burrito question is collapsed under **Second question**.
- **Question:** "Fill in the five blanks. How did you get from 66 bracelets to hours?"
- **Aim:** Know every answer and two ways to get it. You'll spot both on papers.
- **After:** IM's filled table, then **How students might solve it**: three ways, which are the 1-hour row, row to row, and across by 6 (plus multiplying bracelets by \(\frac{1}{6}\), IM's endpoint).
- **Did yours do these?**
  - Got 12, 30, 42, 11 and \(16\frac{2}{3}\).
  - Went across by 6 in at least one row.
  - Said what the 4 left over means: \(\frac{4}{6} = \frac{2}{3}\) of an hour.
- **More:** where students get stuck, and questions to ask if they're stuck.
- **Phone:** about 1.5 screens.

## Card 2 · Read the problem three times

*Label: Three Reads.* "Read the problem aloud three times. Ask one question after each read. Nobody solves yet."

- **Where we are:** Start of Activity 7.3. The bracelet table is up, questions covered.
- **Three short rounds, one at a time**, each with its own "I said it":

  | Round | Question | Aim |
  |---|---|---|
  | 1 | "You've read it once. What do you ask?" | Students say what's happening, with no numbers. |
  | 2 | "You've read it twice. What do you ask?" | Students say what each column counts, with units, and what "speed" means here. |
  | 3 | "You've read it three times. What do you ask?" | Students say what they must do, without solving. |

- **After each round:** the model question (`threeReads[i].say`) and "Listen for." The checks come after round 3.
- **Phone:** one screen per round.

## Card 3 · Send students to work

- **Where we are:** About 2 minutes into Activity 7.3. Next come 3–4 minutes of quiet think time, then partner talk.
- **Shown before speaking:** **Today's frame**, posted for the whole class: "To get ___ from ___, I multiply (or divide) by the unit rate, ___ ___ per ___."
- **Question:** "What must every sentence include? What do you tell the class?"
- **Aim:** Students know their sentence needs the unit rate, "per," and multiply or divide.
- **After:** the model line and the success criteria, then the checks, then **Frames by WIDA level** for the levels picked:
  - **Lower levels:** give their level's frame before they speak.
  - **Higher levels:** hold their level's frame until they stall, then show the stretch line. The posted frame stays up for all.
  - **Without words** comes first at lower levels and as a fallback at higher ones. Either way, the student then says or writes the sentence.
  - **The home-language line shows at every level.** The tier sets whether it comes first or as the fallback.
  - Last: **When partners talk** (`talkMoments`).
- **Phone:** one screen before, about two after. Levels not picked stay collapsed.

## Card 4 · Maya is stuck

*Maya is an example student.*

- **Where we are:** About 4 minutes into Activity 7.3, during quiet think time.
- **Shown:** Maya's table: hours and 6s filled, bracelets blank. Beside it, what she can look back at:
  - **7.2 taught:** her burrito table (2 | 14 | 7 … 10 | 70 | 7).
  - **7.2 skipped:** the board line "2 burritos, \$14, \$7 per burrito."
- **Question:** "What do you say to Maya?"
- **Aim:** Maya fills the first bracelet box herself, using work she's already done.
- **After:**
  - **7.2 taught:** "Look back at the burrito table. What did the 7 do?"
  - **7.2 skipped:** "Look at the burrito row. How do the 2 and the 7 make 14?" With 7.2 skipped, the 7 is a result, not something that "did" anything.
  - Then **What's going on**, the checks, **Avoid**, and **If she's still stuck**: "What does the 6 in each row tell you?"
- **Phone:** about 1.5 screens.

## Card 5 · Help Dani say it in words

*Label: Language.* "This moment is about the sentence, not the answer." *Dani is an example student.*

- **Where we are:** About 7 minutes into Activity 7.3, during partner talk.
- **Shown:** Dani's table (IM's answers, including the 100 row: \(16\frac{2}{3}\)) and Today's frame on the board.
- **Student:** Dani points across the columns: "You just do 6."
- **Rehearse each level picked, lowest first.** It's the same question at every level, with a different way in. One short round per level picked, three at most. The chip reads "Dani's WIDA level: 1–2," then "3–4," and so on. Names rotate across lessons and are never tied to a level.
- **Question:** "What do you say to Dani?"
- **Aim:** Dani says both directions and names the rate: 6 bracelets per hour.
- **After:**
  - The model line for that level.
  - The checks.
  - **How she gets there:** **the same level frame as Card 3**, so there's one frame per level for the whole activity. Then without words and the home-language line, by tier.
- **Phone:** about one screen per level.

## Card 6 · Choose who shares first

- **Where we are:** About 8 minutes into Activity 7.3. You're about to start the discussion.
- **Shown:** three papers.
  - **Pair A, 1-hour row:** 1 | 6, 2 | 12 (IM's narrative).
  - **Pair B, row to row:** "2 h + 5 h = 7 h, so 12 + 30 = 42. 7 h + 2 h + 2 h = 11 h, so 42 + 12 + 12 = 66." This is **NEW**, written by a person, and the sums are checked. Premo's moment m5 said "doubling," which these numbers can't produce, so it needs fixing to "adding rows."
  - **Pair C, across by 6:** "7 × 6 = 42 … 66 ÷ 6 = 11."
- **Question:** "Who do you call first? What do you ask them?"
- **Aim:** Share in order: 1-hour row, row to row, then across by 6.
- **After:** "Start us off. How did you get your first row?" Then the order, the checks, and **Why this order**. IM calls the first way "less efficient," never slow.
- **Phone:** about 1.5 screens.

## Card 7 · Finish on the board

*Label: Collect and Display.* "Write students' words as they speak. Add math words beside them. Leave it up."

- **Where we are:** About 9 minutes into Activity 7.3. Pairs A, B and C have spoken. Their words are on the board.
- **Shown:** the board so far.
  - Pair A: "A 1-hour row, then the rest from it."
  - Pair C: "Times 6 across, divide by 6 back."
- **Question:** "Pair C's words are up. What math words do you add? What do you ask?"
- **Aim:** Students say where the 1-hour row's 6 shows up when they multiply across.
- **After:**
  - Write beside it: "unit rate," "per," "multiply by," "divide by."
  - Then ask (D1 option 3): "How does the 1-hour row show the 6 we multiply by across?" Let students make the connection.
  - Then **Sounds like**.
- **Did yours do these?**
  - Called pairs in IM's order, 1-hour row first.
  - Wrote students' own words, with the math word beside them.
  - Asked them to connect the 1-hour row to × 6, and let them do it.
- **Phone:** about two screens.

---

## When 7.2 is added

Three cards come first, in the order they happen in class:

1. **Do the task yourself** (7.2, the burrito table).
2. **Hands up too early** (Premo m2, about 1 minute in).
3. **A student says "14 per 2"** (Premo m1, about 3 minutes in).

These three have no language layer, level chip or Today's sentence. Card 4 then shows Maya's own burrito table, and Card 2's "Where we are" reads "Just finished the burrito table." That makes ten cards in all.

## Wording rules for all cards, all lessons

1. **Card names** are plain verb phrases. No routine names, lesson numbers or moment IDs in names.
2. **"Where we are"** always reads "About N minutes into Activity X.Y," then what just happened and what's on the board.
3. **Show what you refer to.** Every card shows the board, the table or the earlier work it refers to. Nothing relies on memory.
4. **Questions** come from the teacher's seat: one question per sentence, to a named student or pair. Names are marked as example students, rotate, and are never tied to a WIDA level.
5. **The Aim** is one sentence of 15 words or fewer. It says what the student ends up doing and never gives the words to say.
6. **Checks** start with a past-tense verb, sit under "Did yours do these?" and are never marked wrong.
7. **One name for each thing:** Today's frame, Today's sentence, WIDA level, Key activity, and each strategy's name (for 6.3.7: 1-hour row, row to row, across by 6).
8. **Lines of 15 words or fewer.** US spelling, curly quotes with punctuation inside, fractions in LaTeX, "multilingual learners." Nothing about recording.

## New and changed content (all five lessons)

| Field | Where | What goes in |
|---|---|---|
| `card.where` | each card | How far in, what just happened, what's on the board |
| `card.show` | each card | Pointers to rows in IM's task or response, not copies |
| `card.student` | moments, synthesis | `{ name, says?, work? }`, marked as an example student |
| `card.ask`, `card.aim` | each card | The question and the Aim |
| `followUp` | moments | One next question |
| `mathCard.checks`, `synthesis.checks` | plan | Replace the checks currently fixed in code |
| `threeReads[i].ask`, `threeReads[i].aim` | plan | One question and one Aim per read |
| `strategies` | plan 7.3 | Add multiplying by \(\frac{1}{6}\) |
| Premo m6 moves | premo 6.3.7 | Point to the level frames, no poster |
| Premo m5 `see` | premo 6.3.7 | "Adding rows," not "doubling" |
| Pair B's work | plan 6.3.7 | NEW, written by a person |
| Glossary | app-wide | Key activity, Three Reads, Today's frame, Today's sentence, Collect and Display, Stronger and Clearer, WIDA level, quiet think time, unit rate |

In 6.3.6, the closing card is **Stronger and Clearer** instead. It shows IM's flawed explanation and asks, "What should students fix first?"

## Decisions for Robert

The personas' recommendations are in brackets.

1. **Example student names** (Maya, Dani): yes or no? [Yes, marked "example student," rotated, never tied to a WIDA level.]
2. **Dani's card: rehearse each level picked, lowest first, or just one?** [Each level picked, three short rounds at most.]
3. **Pair B's row-to-row work:** accept the version above, or write your own? [Accept; it's checked.]
4. **"Key activity" in place of "Crux" on screen,** with a tap definition? [Yes. It avoids "required," which clashes with "nothing is locked."]
5. **Today's frame shown before the teacher speaks on Card 3:** yes or no? [Yes. It's what's on the board, not the answer.]
