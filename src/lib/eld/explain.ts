/**
 * Explain KLU lens — DRAFT CONTENT for face-validity demo.
 *
 * All rows tagged provenance: design_hypothesis until expert review elevates
 * middle bands to framework_grounded by transcription against WIDA KLU
 * descriptors and CA ELD level progressions.
 *
 * KLU shape: students explain HOW a math procedure works or WHY a strategy
 * produces a correct result. Distinct from Argue (which carries claims +
 * critique) and Inform (which reports state without causal reasoning).
 */

import type { Lens } from './types.ts';

export const EXPLAIN_LENS: Lens = [
  {
    level: 1,
    label: 'Entering',
    archetype: 'pre-emerging',
    provenance: 'design_hypothesis',
    discourse: {
      does: 'Shows the procedure non-verbally (gesture, manipulative, pointing); supplies one step word',
      reaching: 'pairing one step word with the action it labels',
    },
    sentence: {
      does: "Uses single content words or one-word frames ('add', 'count')",
      reaching: "subject–verb labels ('I add')",
    },
    wordPhrase: {
      does: 'Uses everyday action words (put, take, count) and numerals',
      reaching: "math action terms ('add', 'group')",
    },
    embeddedMove:
      'Demonstrate the procedure yourself first, then narrate it with one math term per step as the student repeats the action',
  },
  {
    level: 2,
    label: 'Emerging',
    archetype: 'ca-emerging',
    provenance: 'design_hypothesis',
    discourse: {
      does: 'Names one step at a time as the procedure is performed; the actions carry the order',
      reaching: 'sequencing two steps with order words',
    },
    sentence: {
      does: "Uses simple imperative or present-tense sentences ('I add 3')",
      reaching: "sequence-marked sentences ('first I add')",
    },
    wordPhrase: {
      does: 'Uses operation terms (add, subtract, group) and basic quantity language',
      reaching: "sequence connectives ('first', 'next', 'then')",
    },
    embeddedMove:
      "Supply the frame 'First I ___. Next I ___.' Ask them to show and tell each step. Accept the action as the warrant for the words",
  },
  {
    level: 3,
    label: 'Developing',
    archetype: 'ca-emerging-exit/expanding-early',
    provenance: 'design_hypothesis',
    discourse: {
      does: 'Sequences two or three steps verbally with order words; can name what each step accomplishes',
      reaching: 'naming why one step depends on the previous',
    },
    sentence: {
      does: "Uses compound sentences with 'and then', 'so', 'because'",
      reaching: "purpose clauses ('I do this so that…')",
    },
    wordPhrase: {
      does: 'Uses grade-level operation and procedure vocabulary',
      reaching: "causal connectives ('because', 'so that')",
    },
    embeddedMove:
      "Press for the causal link with 'why that step, in that order?' — pushing sequence into purpose",
  },
  {
    level: 4,
    label: 'Expanding',
    archetype: 'ca-expanding',
    provenance: 'design_hypothesis',
    discourse: {
      does: 'Sustains a multi-step procedural explanation with explicit reasons for each move',
      reaching: 'explaining why the method works in general, not just for this case',
    },
    sentence: {
      does: 'Uses subordination to attach reason to action (in order to, so that, because)',
      reaching: 'conditional and generalizing structures (if, whenever)',
    },
    wordPhrase: {
      does: 'Uses precise procedural vocabulary and some abstract relation terms',
      reaching: 'language of generalization (any, every, in general)',
    },
    embeddedMove:
      "Ask 'why does this method work?' — pushing procedural explanation toward conceptual reasoning",
  },
  {
    level: 5,
    label: 'Bridging',
    archetype: 'ca-bridging',
    provenance: 'design_hypothesis',
    discourse: {
      does: 'Produces a coherent, conceptually grounded explanation that handles cases and connects representations',
      reaching: 'choosing register and detail to fit the audience',
    },
    sentence: {
      does: 'Uses complex structures to qualify, generalize, and link methods (whenever, regardless of, equivalently)',
      reaching: 'concise formal mathematical register',
    },
    wordPhrase: {
      does: 'Uses technical procedural and relational vocabulary with precision',
      reaching: 'disciplinary economy in word choice',
    },
    embeddedMove:
      "Ask for an alternative explanation — 'how would you explain this to a younger student?' — pushing flexibility of register",
  },
  {
    level: 6,
    label: 'Reaching',
    archetype: 'post-bridging',
    provenance: 'design_hypothesis',
    discourse: {
      does: 'Explains methods with disciplinary cohesion and economy; adapts register and detail to audience flexibly',
      reaching: '—',
    },
    sentence: {
      does: 'Controls the full range of structures for procedural, conceptual, and formal explanation',
      reaching: '—',
    },
    wordPhrase: {
      does: 'Uses procedural and relational vocabulary with the precision of the discipline',
      reaching: '—',
    },
    embeddedMove:
      'Treat as a full explainer; the language and the mathematical reasoning are now indistinguishable',
  },
];
