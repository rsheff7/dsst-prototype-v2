/**
 * Narrate KLU lens — DRAFT CONTENT for face-validity demo.
 *
 * All rows tagged provenance: design_hypothesis until expert review elevates
 * middle bands to framework_grounded.
 *
 * KLU shape: students tell the math story of a situation — what happened, in
 * what order, with what mathematical change. Most relevant for story problems,
 * action-on-quantity contexts, and time-based mathematical processes (e.g.,
 * temperature change, accumulation, sequences of operations as events).
 */

import type { Lens } from './types.ts';

export const NARRATE_LENS: Lens = [
  {
    level: 1,
    label: 'Entering',
    archetype: 'pre-emerging',
    provenance: 'design_hypothesis',
    discourse: {
      does: 'Acts out the story with manipulatives or gesture; supplies one action word per event',
      reaching: 'naming the action and the object together',
    },
    sentence: {
      does: "Uses single action words or two-word combinations ('we share')",
      reaching: "subject–verb–object sentences ('we share cookies')",
    },
    wordPhrase: {
      does: 'Uses everyday action words and concrete object nouns and numerals',
      reaching: 'math-context verbs (add, take, share, group)',
    },
    embeddedMove:
      'Act the story out with the student using materials, then provide one action word as they perform the move',
  },
  {
    level: 2,
    label: 'Emerging',
    archetype: 'ca-emerging',
    provenance: 'design_hypothesis',
    discourse: {
      does: 'Tells one event at a time using simple past or present tense; the order of telling matches the order of action',
      reaching: 'linking two events with a time word',
    },
    sentence: {
      does: "Produces simple event sentences ('we put 3 in the box')",
      reaching: "time-sequenced sentences ('then we…')",
    },
    wordPhrase: {
      does: 'Uses everyday verbs of math action and basic quantity language',
      reaching: "time markers ('first', 'then', 'after')",
    },
    embeddedMove:
      "Supply the frame 'First we ___, then we ___.' Prompt the student to tell two events in order",
  },
  {
    level: 3,
    label: 'Developing',
    archetype: 'ca-emerging-exit/expanding-early',
    provenance: 'design_hypothesis',
    discourse: {
      does: 'Sequences three or more events with time markers and names what changed at each step',
      reaching: 'naming the mathematical relationship between events',
    },
    sentence: {
      does: "Uses compound sentences linking events with 'and then', 'so', 'because'",
      reaching: "causal links ('because we had…')",
    },
    wordPhrase: {
      does: 'Uses grade-level quantity-change vocabulary (more, fewer, equal groups, left over)',
      reaching: "change-result terms ('now there are', 'altogether')",
    },
    embeddedMove:
      "Ask 'and what happened to the amount?' at each step — pushing event narration toward quantity-change tracking",
  },
  {
    level: 4,
    label: 'Expanding',
    archetype: 'ca-expanding',
    provenance: 'design_hypothesis',
    discourse: {
      does: 'Sustains a multi-event narrative that tracks mathematical change and names the relationship at each transition',
      reaching: 'connecting the narrative to a mathematical model or expression',
    },
    sentence: {
      does: 'Uses subordination to express mathematical change (in order to, so that, after we…)',
      reaching: 'condition–consequence structures (if we had had…)',
    },
    wordPhrase: {
      does: 'Uses precise quantity-change vocabulary and mathematical event terms',
      reaching: 'language of representation (this number stands for, this shows)',
    },
    embeddedMove:
      "Push for the link to representation — 'which part of the story does this equation tell?'",
  },
  {
    level: 5,
    label: 'Bridging',
    archetype: 'ca-bridging',
    provenance: 'design_hypothesis',
    discourse: {
      does: 'Tells a coherent mathematical narrative that integrates story, model, and observation',
      reaching: 'selecting which events to foreground to make a mathematical point',
    },
    sentence: {
      does: 'Uses complex structures to connect narrative to mathematical structure (which means that, this is why)',
      reaching: 'concise narrative-mathematical register',
    },
    wordPhrase: {
      does: 'Uses technical vocabulary for mathematical events and representations with precision',
      reaching: 'disciplinary economy in math narration',
    },
    embeddedMove:
      "Ask the student to retell the story for a specific purpose — 'tell it so a classmate could write the equation without seeing the picture'",
  },
  {
    level: 6,
    label: 'Reaching',
    archetype: 'post-bridging',
    provenance: 'design_hypothesis',
    discourse: {
      does: 'Narrates mathematical situations with disciplinary cohesion and economy; selects events, register, and detail for audience and purpose flexibly',
      reaching: '—',
    },
    sentence: {
      does: 'Controls the full range of structures for mathematical narrative register',
      reaching: '—',
    },
    wordPhrase: {
      does: 'Uses narrative and mathematical vocabulary with the precision of the discipline',
      reaching: '—',
    },
    embeddedMove:
      'Treat as a full participant; the story and the mathematical structure are now indistinguishable',
  },
];
