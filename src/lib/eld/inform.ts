/**
 * Inform KLU lens — DRAFT CONTENT for face-validity demo.
 *
 * All rows tagged provenance: design_hypothesis until expert review elevates
 * middle bands to framework_grounded.
 *
 * KLU shape: students describe, report, identify, or compare mathematical
 * objects, quantities, or relationships without (yet) supplying causal
 * reasoning. Distinct from Explain (procedural causation) and Argue
 * (claims with warrants).
 */

import type { Lens } from './types.ts';

export const INFORM_LENS: Lens = [
  {
    level: 1,
    label: 'Entering',
    archetype: 'pre-emerging',
    provenance: 'design_hypothesis',
    discourse: {
      does: 'Points to objects or features and supplies a numeral plus a one-word label',
      reaching: 'attaching a label to each thing identified',
    },
    sentence: {
      does: "Uses single content words and numerals ('5 cubes')",
      reaching: "subject–copula labels ('it is red')",
    },
    wordPhrase: {
      does: 'Uses everyday object names, basic colors, shapes, and numerals',
      reaching: 'math object names (cube, row, group)',
    },
    embeddedMove:
      "Hand them the materials and ask them to point and count aloud as you label what they're pointing at with one math term",
  },
  {
    level: 2,
    label: 'Emerging',
    archetype: 'ca-emerging',
    provenance: 'design_hypothesis',
    discourse: {
      does: 'States one fact about a mathematical object or display at a time',
      reaching: 'connecting two facts about the same object',
    },
    sentence: {
      does: "Uses simple statement sentences with 'there is/are' or 'has'",
      reaching: "conjunctive sentences ('and there are…')",
    },
    wordPhrase: {
      does: 'Uses noun phrases with quantity and basic mathematical attributes',
      reaching: 'comparison terms (more than, fewer than)',
    },
    embeddedMove:
      "Supply the frame 'I see ___' and prompt for two or three things. Accept noun phrases; do not yet press for relationships",
  },
  {
    level: 3,
    label: 'Developing',
    archetype: 'ca-emerging-exit/expanding-early',
    provenance: 'design_hypothesis',
    discourse: {
      does: 'Reports two or three facts about the same object or display and links them with simple connectors',
      reaching: 'organizing facts to describe a pattern or structure',
    },
    sentence: {
      does: "Uses compound sentences linking facts with 'and', 'but', 'also'",
      reaching: "relative clauses ('the row that has…')",
    },
    wordPhrase: {
      does: 'Uses comparison and quantity vocabulary across grade level',
      reaching: 'language of pattern and structure (the same, repeating)',
    },
    embeddedMove:
      "Ask 'and what else?' twice, then push toward structure with 'how would you group what you see?'",
  },
  {
    level: 4,
    label: 'Expanding',
    archetype: 'ca-expanding',
    provenance: 'design_hypothesis',
    discourse: {
      does: 'Produces an organized report that names a pattern or structure across multiple facts',
      reaching: 'describing the structure precisely enough that someone could reconstruct the object',
    },
    sentence: {
      does: 'Uses subordination to attach detail to claim (each row contains…, where the columns are…)',
      reaching: 'parallel structures for systematic description',
    },
    wordPhrase: {
      does: 'Uses precise vocabulary for relationships and structures (per, each, equally)',
      reaching: 'technical descriptors of mathematical objects',
    },
    embeddedMove:
      "Push for systematic description — 'describe it so I could draw it without seeing it'",
  },
  {
    level: 5,
    label: 'Bridging',
    archetype: 'ca-bridging',
    provenance: 'design_hypothesis',
    discourse: {
      does: 'Produces coherent, structurally precise descriptions that name relationships across an entire display',
      reaching: 'selecting which features to report given a purpose',
    },
    sentence: {
      does: 'Uses complex structures to describe quantitative relationships and embedded structure',
      reaching: 'concise formal descriptive register',
    },
    wordPhrase: {
      does: 'Uses technical descriptive vocabulary with precision',
      reaching: 'disciplinary economy in description',
    },
    embeddedMove:
      "Ask for a purposeful description — 'describe just the features that matter for the problem'",
  },
  {
    level: 6,
    label: 'Reaching',
    archetype: 'post-bridging',
    provenance: 'design_hypothesis',
    discourse: {
      does: 'Reports with disciplinary cohesion and economy; selects features and register for audience and purpose flexibly',
      reaching: '—',
    },
    sentence: {
      does: 'Controls the full range of structures for descriptive mathematical register',
      reaching: '—',
    },
    wordPhrase: {
      does: 'Uses descriptive and relational vocabulary with the precision of the discipline',
      reaching: '—',
    },
    embeddedMove:
      'Treat as a full reporter; the language and the mathematical observation are now indistinguishable',
  },
];
