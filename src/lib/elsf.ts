/**
 * English Learners Success Forum (ELSF) Guidelines for Improving
 * Math Materials for English Learners.
 *
 * Source: ELSF "Guidelines for Improving Math Materials for English Learners"
 * (Creative Commons Attribution 4.0 International License). The 5 Areas of Focus,
 * 15 numbered Guidelines, and their alpha sub-specifications below are taken
 * verbatim from that document and reorganized as structured data so the analysis
 * pipeline can reference them by number rather than embedding the guidelines as
 * free text in the prompt.
 *
 * Purpose in Premo:
 *   ELSF is an ADDITIONAL reasoning layer on top of Elmore's Instructional Core
 *   and the 8 MLRs. It sharpens two specific things in generated guidance:
 *     1. Identifying the key LANGUAGE DEMANDS of each activity.
 *     2. Surfacing the FUNCTIONAL LANGUAGE students need to engage the task.
 *
 * Tuning the layer: edit this file (not the prompt). The prompt references
 * ELSF_GUIDELINES as a structured injection so guideline edits flow through
 * automatically.
 */

export type ELSFAreaNumber = 1 | 2 | 3 | 4 | 5;
export type ELSFGuidelineNumber =
  | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15;

export interface ELSFArea {
  number: ELSFAreaNumber;
  name: string;
}

export interface ELSFGuideline {
  number: ELSFGuidelineNumber;
  area: ELSFAreaNumber;
  title: string;
  specs: { id: string; text: string }[];
}

export const ELSF_AREAS: ELSFArea[] = [
  { number: 1, name: 'Interdependence of Mathematical Content, Practices, and Language' },
  { number: 2, name: 'Scaffolding and Supports for Simultaneous Development' },
  { number: 3, name: 'Mathematical Rigor Through Language' },
  { number: 4, name: 'Leveraging Students Assets' },
  { number: 5, name: 'Assessment of Mathematical Content, Practices, and Language' },
];

export const ELSF_GUIDELINES: ELSFGuideline[] = [
  // ---- Area I: Interdependence of Mathematical Content, Practices, and Language ----
  {
    number: 1,
    area: 1,
    title: 'Strategic opportunities to use and refine both language and mathematics over time',
    specs: [
      { id: '1a', text: 'Materials highlight, define, illustrate, and show the purpose for mathematical language within the context of the lesson (not in isolation).' },
      { id: '1b', text: 'Materials guide teachers to encourage students to build their own understanding of mathematics actively, through sustained activities and experiences.' },
      { id: '1c', text: 'Materials provide strategies to help students make connections between current language, new language, and mathematical concepts.' },
      { id: '1d', text: 'Units offer repeated opportunities to develop, refine, and extend language for mathematical purposes over time.' },
    ],
  },
  {
    number: 2,
    area: 1,
    title: 'Explicit mathematics and language learning goals and pathways',
    specs: [
      { id: '2a', text: 'Teacher materials state clear and specific language objectives both for math practices as well as for academic purposes that cut across disciplines.' },
      { id: '2b', text: 'Student materials contain mathematics and language learning objectives.' },
      { id: '2c', text: 'Teacher materials articulate a pathway or progression of objectives for content, practices, and language throughout units.' },
      { id: '2d', text: 'Materials present opportunities for students to use language at different stages within a unit, such as speculating or predicting about a new topic, exploring and reflecting during an experience, presenting afterwards, etc.' },
    ],
  },
  {
    number: 3,
    area: 1,
    title: 'Regular and varying opportunities to learn, reflect upon, and demonstrate learning of mathematics using a variety of modes and forms',
    specs: [
      { id: '3a', text: 'Activities deepen and extend learning through the various modes of communication: speaking, listening, reading, and writing.' },
      { id: '3b', text: 'Materials include prompts for students to reflect on their own thought processes, language use, methods, and learning of mathematical content.' },
      { id: '3c', text: 'Materials encourage students to utilize interdisciplinary words and phrases as well as math-specific words and phrases.' },
    ],
  },

  // ---- Area II: Scaffolding and Supports for Simultaneous Development ----
  {
    number: 4,
    area: 2,
    title: 'Opportunities for students to interact with and produce a variety of methods and representations',
    specs: [
      { id: '4a', text: 'Learning activities provide ways for students to generate and interpret a range of mathematical methods and representations (symbols, manipulatives, graphs, tables, words, etc.) and methods.' },
      { id: '4b', text: 'Teacher materials provide guidance to encourage students to draw comparisons and connections across different methods and representations.' },
      { id: '4c', text: 'Units of study include multiple sensory modalities for student interaction.' },
      { id: '4d', text: 'Teacher materials provide supports for teacher modeling of reading, writing, listening, speaking, and thinking aloud.' },
    ],
  },
  {
    number: 5,
    area: 2,
    title: 'Directions for providing specialized individual and small group instruction to ELs',
    specs: [
      { id: '5a', text: 'Teacher materials point to strategic opportunities for teachers to meet directly with EL students individually and in small groups.' },
      { id: '5b', text: 'Teacher materials give guidance on what to look for, listen for, questions to ask, and/or feedback to give when meeting with EL students.' },
      { id: '5c', text: 'Materials present a balance of opportunities for independent, paired, small-group, and whole-class activities.' },
    ],
  },
  {
    number: 6,
    area: 2,
    title: 'Guidance for anticipating potential language demands and opportunities in student activities',
    specs: [
      { id: '6a', text: 'Teacher materials make suggestions for addressing possible language issues that may interfere with engagement of math content.' },
      { id: '6b', text: 'Materials demonstrate activities and ways to help students make meaning of typical mathematical texts such as word problems, graphs, tables, etc.' },
      { id: '6c', text: 'Materials provide activities to help distinguish between common everyday meanings of language and mathematical meanings (table, round, product, origin, similar, etc.) as they emerge in the materials.' },
      { id: '6d', text: 'Unit amplifies rather than simplifies English language structures and forms that are often used in mathematics.' },
    ],
  },

  // ---- Area III: Mathematical Rigor Through Language ----
  {
    number: 7,
    area: 3,
    title: 'Explicit guidance for teachers to engage students in using mathematical practices',
    specs: [
      { id: '7a', text: 'Materials have targeted opportunities for students to use and develop language functions while engaging in mathematical practices.' },
      { id: '7b', text: 'Teacher materials point out opportunities for students to evaluate and address mathematical errors, misconceptions, and clarity of communication.' },
      { id: '7c', text: 'Teacher materials provide opportunities for students to revise their own, peers, and/or fictitious mathematical writing.' },
    ],
  },
  {
    number: 8,
    area: 3,
    title: 'Maintain appropriate challenge and high expectations of mathematics learning for EL students',
    specs: [
      { id: '8a', text: 'Materials consistently provide access to cognitively-demanding tasks.' },
      { id: '8b', text: 'Teacher materials demonstrate when and how to support productive struggle before intervening.' },
      { id: '8c', text: 'Materials guide the implementation of anchor charts, visual aids, models, and other resources for students to use as a reference.' },
    ],
  },
  {
    number: 9,
    area: 3,
    title: 'Guidance for facilitating mathematical discussion and co-construction of meaning',
    specs: [
      { id: '9a', text: "Materials include prompts for teachers to cultivate and facilitate back-and-forth mathematical discussions between students that refer to and build on each other's ideas." },
      { id: '9b', text: 'Materials provide explicit purposes for communication between students.' },
      { id: '9c', text: 'Materials allow for equitable participation and risk-taking in conversations.' },
    ],
  },

  // ---- Area IV: Leveraging Students Assets ----
  {
    number: 10,
    area: 4,
    title: 'Opportunities to draw on and incorporate students cultural background and lived experiences in mathematics learning',
    specs: [
      { id: '10a', text: "Teacher materials include relevant and practical suggestions for connecting mathematics content and practices to students' lives." },
      { id: '10b', text: 'Materials encourage students to draw on prior knowledge, culture, and experiences.' },
      { id: '10c', text: 'Materials offer opportunities for clarifying potentially unfamiliar contexts.' },
    ],
  },
  {
    number: 11,
    area: 4,
    title: 'Suggestions for incorporating and valuing ELs written and spoken contributions',
    specs: [
      { id: '11a', text: 'Teacher materials contain examples (and counter-examples) of evidence of students with various language strengths and needs engaged in mathematical practices.' },
      { id: '11b', text: 'Teacher materials contain explicit guidance for teachers to examine their own values and beliefs about language, ELs, and ways in which that might impact their teaching.' },
    ],
  },
  {
    number: 12,
    area: 4,
    title: 'Encouragement for ELs to use and build on existing language resources',
    specs: [
      { id: '12a', text: 'Activities permit appropriate opportunities for ELs to use and integrate first language (L1) and everyday English in communicating mathematical thinking.' },
      { id: '12b', text: 'Activities and materials present opportunities for students to ask and pursue their own questions and interests, using their own methods in their chosen contexts.' },
    ],
  },

  // ---- Area V: Assessment of Mathematical Content, Practices, and Language ----
  {
    number: 13,
    area: 5,
    title: 'Descriptions, illustrations, and examples of quality work and mathematical practices with varying levels of language proficiency',
    specs: [
      { id: '13a', text: 'Teacher materials should provide examples of teacher-student and student-student interactions that model and reflect the intent of mathematical practices.' },
      { id: '13b', text: 'Teacher materials present examples in a way that highlights student potential for English proficiency, not deficit-based.' },
    ],
  },
  {
    number: 14,
    area: 5,
    title: 'Assessments able to capture and measure students mathematics and language progress over time',
    specs: [
      { id: '14a', text: 'Assessments prompt students to use math practices through language (including but not limited to vocabulary).' },
      { id: '14b', text: 'Rubrics specifically identify and describe typical mathematical content, practice, and language achievements.' },
      { id: '14c', text: "Teacher materials suggest ways to capture students' progress from everyday language to language for more formal academic and mathematical purposes." },
    ],
  },
  {
    number: 15,
    area: 5,
    title: 'Guidance for recognizing and attending to student language produced to inform instructional decisions',
    specs: [
      { id: '15a', text: 'Teacher materials instruct teachers to avoid interpreting lower level language proficiency as lower level mathematics proficiency.' },
      { id: '15b', text: 'Units include a range of assessments for formative purposes that enable students to draw on and make use of their existing language resources.' },
      { id: '15c', text: 'Summative assessment tools specifically identify, describe, and measure mathematical and language successes, errors, and misconceptions and guide teachers to score them accordingly.' },
    ],
  },
];

/**
 * The two lenses the ELSF reasoning layer must sharpen in Premo's guidance:
 *
 * LANGUAGE_DEMAND_GUIDELINES are the guidelines whose specs most directly address
 * identifying what kind of language work an activity requires (anticipating the
 * receptive / productive / interactive demand and the everyday-to-academic bridge).
 *
 * FUNCTIONAL_LANGUAGE_GUIDELINES are the guidelines whose specs most directly
 * address the language functions and forms students need to PRODUCE to engage
 * with the task.
 *
 * These lists are tunable. Adding or removing a guideline here changes which
 * guidelines the analysis prompt's ELSF section foregrounds when reasoning
 * about each lens. They do NOT exclude other guidelines from informing the
 * analysis — the full ELSF_GUIDELINES list is always available to Claude.
 */
export const LANGUAGE_DEMAND_GUIDELINES: ELSFGuidelineNumber[] = [2, 6];
export const FUNCTIONAL_LANGUAGE_GUIDELINES: ELSFGuidelineNumber[] = [1, 3, 7, 12];

export const ALL_ELSF_GUIDELINE_NUMBERS: ELSFGuidelineNumber[] = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
];

export function isValidELSFGuidelineNumber(n: unknown): n is ELSFGuidelineNumber {
  return typeof n === 'number' && Number.isInteger(n) && n >= 1 && n <= 15;
}

export function getELSFGuideline(n: ELSFGuidelineNumber): ELSFGuideline {
  return ELSF_GUIDELINES[n - 1];
}

export function getELSFArea(n: ELSFAreaNumber): ELSFArea {
  return ELSF_AREAS[n - 1];
}
