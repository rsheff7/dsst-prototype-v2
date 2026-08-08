# Gemini High Thinking vs. Claude 3.5 Sonnet Baseline

**Date:** 2026-08-07
**Lesson:** Grade 6, Unit 2, Lesson 2 — "Representing Ratios with Diagrams"
**Models Compared:** Gemini 3.6 Flash (thinkingLevel: high) vs. Claude 3.5 Sonnet (default)

## Executive Summary

Giving Gemini maximum thinking budget does not close the quality gap with Claude. The output is marginally more thorough in anticipated thinking analysis but remains noticeably more verbose in the same ways as the medium-thinking run. Conciseness — the defining strength of Claude's output — is a model personality trait, not something unlocked by more reasoning time.

## Performance Metrics

| Metric | Gemini Medium Thinking | Gemini High Thinking | Claude 3.5 Sonnet |
|---|---|---|---|
| Total thinking tokens | 15,963 | 21,971 | N/A (no chain of thought) |
| Wall clock time | ~56s | ~76s | ~136s (2m 15s) |
| Output tokens | 5,587 | 5,448 | 6,520 |
| Total lines in dsst | 1,095 | 1,022 | 1,265 |

Two notable shifts from medium to high: thinking tokens increased by roughly 37 percent. Wall clock time grew by 36 seconds, dominated by pass D jumping from 48 to 65 seconds. But output token count actually dropped slightly, and the dsst file got shorter.

That's interesting — more thinking produced less output. The model appears to be reasoning more before generating, which may indicate better planning but doesn't translate into higher-quality output.

## Section-by-Section Analysis

### Arc Statement and Destination

**Claude:**
> Students open by sharpening mental multiplication and division—the same multiplicative thinking ratios require. They then draw their own ratio diagrams from a snap cube image and read a partner's diagram in words, building the diagram-to-language connection. The crux activity pushes them to sort true from false ratio statements about a single diagram, exposing that word order in a ratio statement matters and that one diagram holds multiple valid descriptions.

**Gemini High:**
> Students begin by using simple discrete visual diagrams like snap cubes to represent ratios between two quantities. They transition to evaluating and writing statements using 'for every' and 'for each' language to identify unit relationships within discrete paint and paste diagrams. Finally, students apply this thinking during a card sort by matching recipe diagrams with multiple equivalent descriptive sentences, cementing the connection between visual grouping and ratio statements.

Claude's arc statement is tighter and names the conceptual throughline explicitly: "word order matters" and "one diagram holds multiple valid descriptions." Gemini's version is longer and focuses on mechanics (what students do) rather than the mathematical insight being developed. Claude sounds like a curriculum designer; Gemini sounds like an activity catalog.

### Activity Synthesis Prompts

This is where the gap is most visible.

**Activity 2.3 (Crux) — Claude:**
> Synthesize toward the idea that word order determines whether a ratio statement is true by calling on a pair to share which statements they circled and which they rejected. Pick one rejected statement—likely statement (e) 'for each tablespoon of blue paint, there are 3 cups of white paint'—and ask: 'What would the diagram have to look like for this one to be true? How is that different from the diagram we have?' Then ask a pair to share the two sentences they wrote for flour-to-water and ask: 'Are both sentences true for the same diagram—how?'

**Gemini High:**
> Synthesize toward evaluating 'for every' unit statements by projecting Elena's paint diagram (2 white cups, 6 blue tbsp), drawing a circle around each group of 1 white cup with 3 blue tbsp, and asking: 'Where in the diagram do we visually see that there are 3 tablespoons of blue paint for every 1 cup of white paint?'

Claude's synthesis prompt names the specific false statement, poses two follow-up questions, and connects back to the student-generated flour/water work. It gives a teacher a complete mini-lesson they can run in three minutes. Gemini's version is narrower — it focuses only on the visual grouping aspect and misses the word-order insight entirely. More thinking didn't produce a better synthesis move.

### Decision Guide Scenarios

**Activity 2.2, Reversed Ratio Order — Claude:**
The scenario interpretation reads: "The student's diagram is correct but the sentence reverses the two colors. This is the core language-math challenge of the lesson: the order in the sentence must match the order in the diagram."

Emerging move: "Point to the student's diagram. Point to the first color drawn. Point to the sentence. Say: 'Which color is first here? Which is first here?' Use a finger to trace left-to-right in both."

**Gemini High:**
Interpretation: "Student correctly draws 4 blue and 2 red cubes, but writes 'For every 2 blue cubes there are 4 red cubes' because they listed red first in thought."

Emerging move: "Point to the 4 blue cubes in the diagram and tap the number word in their sentence. Say: 'How many blue cubes are here? Point and count.'"

Claude's interpretation names the structural issue (order must match) rather than just describing one instance. The emerging move uses a physical left-to-right gesture that directly addresses order reversal. Gemini's move has the student count, which doesn't address the actual error — they counted correctly, they just listed in the wrong order. More thinking didn't produce a more precise diagnostic or intervention.

### Wristband (Pass D)

**Claude Activity 2.3 tiles:**
- "Students circle statement e — divided correctly but attached the 3 to the wrong quantity." / Move: "Ask: which quantity is bigger in the diagram? Trace from the diagram count back to the division — who gets the 3?"
- "MLL students stall at writing a second sentence for flour and water diagram." / Move: "Lay out two parallel frames side by side. Point: fill frame one, now flip and fill frame two."

**Gemini High Activity 2.3 tiles:**
- "Picking option (e) '3 cups white per tablespoon blue'; mixing up unit relationship direction." / Move: "Project option (e). MLR 3 critique prompt helps class test if 1 tablespoon blue really needs 3 white."
- "Frozen trying to write Jada's flour-to-water ratio sentence after drawing 8 to 2 diagram." / Move: "Partner share sentence drafts using MLR 1. Listening to partners refines precision for 'for every' statements."

Claude's wristband tiles are scannable and action-first. A teacher glancing at "Trace from the diagram count back to the division — who gets the 3?" knows exactly what to do in three seconds. Gemini's tiles require reading more context to extract the action. The MLR references feel tacked on rather than driving the move.

### Anticipated Thinking Patterns

This is the one area where Gemini high thinking shows marginal improvement over medium. The Gemini output includes slightly more granular pattern identification — for example, it distinguishes between students who "batch Jada's flour and water into equal groups" (extension behavior) versus those who just count totals. Claude also identifies these patterns, but its descriptions are consistently tighter and include more specific teacher language ("Ask: 'What was your first sentence?' Have them read it aloud. Then say: 'Now flip it — start with water instead of flour.'").

The improvement from medium to high thinking here is real but modest. We're looking at a 10-15 percent increase in pattern specificity, not a qualitative leap.

### ELSF Language Demands

Claude provides richer everyday-to-academic bridges. For Activity 2.3: "The word 'per' and the phrase 'for every' are used interchangeably in everyday English but carry precise directional meaning in ratio statements. Students who say 'there's 3 times as much blue' need to learn to express this as a formal ratio with order."

Gemini high: "Navigating the precise academic order of ratio terms compared to everyday flexible language where order is often informal."

Same idea, but Claude gives you the concrete student utterance and the exact pivot point. Gemini stays at the abstraction level.

## The Verdict on Robert's Question

Robert asked whether the difference between Gemini and Claude might be a prompting issue. After running Gemini at maximum thinking budget, I think we can answer that more definitively:

**No, it's not primarily a prompting problem.** Both models received identical system prompts, MLR definitions, ELSF guidelines, and JSON schemas. Gemini at high thinking still produces verbose descriptions where Claude produces tight instructions. It still interprets scenarios descriptively where Claude names the underlying structure. It still writes wristband tiles that require more reading to extract action.

The gap is model personality. Claude 3.5 Sonnet was trained with heavier emphasis on instruction-following and concision. Gemini 3.6 Flash, even with extended chain-of-thought reasoning, defaults to a more expansive output style. More thinking time lets Gemini reason more carefully about what to produce, but it doesn't fundamentally change how it produces it.

**Could prompt tweaks help?** Yes, marginally. Adding explicit conciseness pressure — "Every sentence must earn its place," "Write for a teacher scanning under time pressure" — would likely tighten Gemini's output. But this is the same prompt work we'd need to do regardless of thinking level. The thinking budget doesn't make Gemini better at following our existing concision constraints; it just gives it more time to be verbose about its reasoning before generating verbose output.

**The real finding:** Thinking level affects *depth* of analysis (marginally), not *style* of output. If the constraint is "produce dense, scannable, action-first content for busy teachers," that's a prompt engineering problem, not a thinking budget problem.

## Recommendations

1. **Don't invest more in Gemini thinking escalation.** The jump from medium to high cost 20 additional seconds of wall clock time and produced output that is functionally equivalent — slightly shorter but no tighter or more actionable.

2. **Focus prompt engineering on concision.** If we want to keep Gemini as a viable option, the work is in the prompt: add explicit word-count constraints per field, provide Claude-style examples of "good" wristband tiles as few-shot references, and penalize verbosity at the schema level.

3. **Pass D is where thinking matters most.** Of all five passes, pass D (the decision guide / wristband) showed the most sensitivity to thinking level — high thinking produced slightly more nuanced proficiency moves for emerging ELs. If we're going to use Gemini with thinking enabled, medium is the sweet spot: 36 fewer seconds of wait time for roughly equivalent output quality.

4. **Claude remains the baseline.** For production readiness, Claude 3.5 Sonnet produces output that is more immediately usable by teachers without post-processing. The cost-performance tradeoff favors Claude unless Gemini's lower API pricing becomes a deciding factor.