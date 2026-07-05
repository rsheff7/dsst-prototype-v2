/**
 * Argue KLU lens — transcribed exactly from the framework spec.
 * Source: PREMO_ELD_Convergence_Framework.md (validated-pending).
 *
 * Levels 1 and 6 carry provenance: design_hypothesis. The middle bands
 * (2, 4, 5) carry framework_grounded. Level 3 is design_hypothesis as it
 * sits between framework-defined bands.
 */

import type { Lens } from './types.ts';

export const ARGUE_LENS: Lens = [
  {
    level: 1,
    label: 'Entering',
    archetype: 'pre-emerging',
    provenance: 'design_hypothesis',
    discourse: {
      does: 'Expresses a position through one representation (drawing, manipulative, gesture) plus a word or two',
      reaching: 'linking the representation to a claim',
    },
    sentence: {
      does: "Uses formulaic frames ('___ is more')",
      reaching: 'subject–predicate claims',
    },
    wordPhrase: {
      does: 'Uses everyday quantity words (more, less, same) and numerals',
      reaching: "'equal', 'greater'",
    },
    embeddedMove:
      'Offer claim-and-justify non-verbally first (sort, match, point), then name one math term for the action already performed',
  },
  {
    level: 2,
    label: 'Emerging',
    archetype: 'ca-emerging',
    provenance: 'framework_grounded',
    discourse: {
      does: 'States a claim and gestures at one reason; the representation carries the logic',
      reaching: 'putting the reason into words',
    },
    sentence: {
      does: "Produces simple claim sentences ('9 is bigger because…')",
      reaching: "'because'-clauses that carry mathematical cause",
    },
    wordPhrase: {
      does: 'Uses comparison and operation terms (add, take away, bigger)',
      reaching: "'greater than', 'equal to', 'because'",
    },
    embeddedMove:
      "Supply a frame that forces the reason into words: '___ because ___.' Accept the representation as the warrant and name it",
  },
  {
    level: 3,
    label: 'Developing',
    archetype: 'ca-emerging-exit/expanding-early',
    provenance: 'design_hypothesis',
    discourse: {
      does: 'Connects claim to reason across two or three linked statements',
      reaching: 'sequencing steps so the argument holds',
    },
    sentence: {
      does: "Uses compound sentences with 'because/so'",
      reaching: "conditional 'if…then' reasoning",
    },
    wordPhrase: {
      does: 'Uses grade-level operation and relation vocabulary',
      reaching: "connectives 'therefore', 'since'",
    },
    embeddedMove:
      "Ask for the second step — 'and how do you know that part?' — pushing single-reason toward chained reasoning",
  },
  {
    level: 4,
    label: 'Expanding',
    archetype: 'ca-expanding',
    provenance: 'framework_grounded',
    discourse: {
      does: 'Sustains a multi-step justification with logical sequencing',
      reaching: 'anticipating a counter-case',
    },
    sentence: {
      does: 'Uses subordination (if…then, in order to)',
      reaching: 'qualified claims (always, sometimes)',
    },
    wordPhrase: {
      does: 'Uses precise connectives and some generalizing language',
      reaching: 'quantifier precision (all, any, no)',
    },
    embeddedMove:
      "Pose the counterexample probe — 'does that always work?' — pushing toward generalization",
  },
  {
    level: 5,
    label: 'Bridging',
    archetype: 'ca-bridging',
    provenance: 'framework_grounded',
    discourse: {
      does: 'Produces a coherent, logically sequenced argument that addresses cases',
      reaching: "critiquing another's argument",
    },
    sentence: {
      does: 'Uses complex structures to qualify, generalize, conditionalize',
      reaching: 'concise formal register',
    },
    wordPhrase: {
      does: 'Uses technical generalizing vocabulary (for all, it follows that, counterexample)',
      reaching: 'disciplinary economy',
    },
    embeddedMove:
      "Shift from constructing to critiquing — 'is this argument valid? where does it break?'",
  },
  {
    level: 6,
    label: 'Reaching',
    archetype: 'post-bridging',
    provenance: 'design_hypothesis',
    discourse: {
      does: 'Constructs and critiques arguments with grade-level disciplinary cohesion and economy; generalizes and formalizes independently',
      reaching: '—',
    },
    sentence: {
      does: 'Controls the full range of structures for formal mathematical register, flexibly',
      reaching: '—',
    },
    wordPhrase: {
      does: 'Uses technical vocabulary with the precision and economy of the discipline',
      reaching: '—',
    },
    embeddedMove:
      'Treat as a full participant; language work is now indistinguishable from the mathematical work',
  },
];
