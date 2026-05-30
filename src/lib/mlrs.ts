export type MlrNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface MlrEntry {
  number: MlrNumber;
  name: string;
  shortName: string;
  definition: string;
  structure: string[];
  example: string;
}

export const MLRS: Record<MlrNumber, MlrEntry> = {
  1: {
    number: 1,
    name: 'Stronger and Clearer Each Time',
    shortName: 'Stronger & Clearer',
    definition:
      'Students refine a math idea through partner exchange — each round produces a stronger and clearer version than the one before.',
    structure: [
      'First draft. Students write or say their initial response to a prompt.',
      'Partner share. Students share with a partner who asks clarifying questions or pushes for detail.',
      'Stronger draft. Students revise using what they heard from their partner.',
      'Optional second round with a new partner.',
    ],
    example:
      'After asking "How do you know the ratio is 3 to 6?", students write a first draft, share with one partner, then revise using their partner\'s questions to write a clearer explanation.',
  },
  2: {
    number: 2,
    name: 'Collect and Display',
    shortName: 'Collect & Display',
    definition:
      'The teacher captures student language about a math idea during the lesson and displays it back so the class can refine and reuse it.',
    structure: [
      'Listen. Circulate during student work and jot down phrases students are actually using.',
      'Display. Write the captured phrases on chart paper or the board.',
      'Refer back. Point to the language during discussion; invite students to refine, reuse, or improve.',
    ],
    example:
      'While students sort objects, the teacher writes phrases like "groups of two" and "three for every one" on the board, then references them during the whole-class discussion.',
  },
  3: {
    number: 3,
    name: 'Critique, Correct, and Clarify',
    shortName: 'Critique & Clarify',
    definition:
      'The class examines a flawed math sample — work, statement, or explanation — and improves it together.',
    structure: [
      'Present a sample with a specific flaw (mathematical or in clarity).',
      'Critique. Students identify what is missing, unclear, or wrong.',
      'Correct or clarify. The class produces a revised version, with reasoning.',
    ],
    example:
      'Show a student response that says "there are more squares than circles" and ask the class to revise it to use ratio language precisely.',
  },
  4: {
    number: 4,
    name: 'Information Gap',
    shortName: 'Information Gap',
    definition:
      'Two students hold different pieces of math information; they must use precise math language to bridge the gap and solve a task together.',
    structure: [
      'Distribute. Partners receive different but related cards or pieces of information.',
      'Ask. One partner asks for what they need.',
      'Provide. The other partner gives the information using math language.',
      'Solve. Together they complete the task.',
    ],
    example:
      'One partner has a diagram of 3 squares and 6 circles; the other has only the question. They must describe the diagram precisely enough for the question to be answered.',
  },
  5: {
    number: 5,
    name: 'Co-Craft Questions',
    shortName: 'Co-Craft Questions',
    definition:
      'Students invent the question for a math scenario before any question is given to them.',
    structure: [
      'Present. Show only the scenario or data — no question attached.',
      'Brainstorm. Students write several questions they could ask about the scenario.',
      'Share. Read questions aloud; choose one or compare across several.',
    ],
    example:
      'Show a picture of a fruit bowl with 4 apples and 6 oranges. Ask students to write 3 questions they could ask. Compare across the class; then answer one together.',
  },
  6: {
    number: 6,
    name: 'Three Reads',
    shortName: 'Three Reads',
    definition:
      'Students read the same problem three times, each time for a different purpose, so the language and the math come into focus one layer at a time.',
    structure: [
      'Read 1. What is the situation? (No math work yet — just the story.)',
      'Read 2. What are the quantities and relationships?',
      'Read 3. What is the question, and what would you need to answer it?',
    ],
    example:
      'A word problem about pet snacks read three times — once for the story, once to name the quantities, once to identify the question being asked.',
  },
  7: {
    number: 7,
    name: 'Compare and Connect',
    shortName: 'Compare & Connect',
    definition:
      'Students examine two student solutions side by side to surface the underlying mathematical structure through language.',
    structure: [
      'Display two student solutions to the same problem.',
      'Compare. Students identify what is the same and what is different.',
      'Connect. The class names the mathematical idea both solutions share.',
    ],
    example:
      'Show two student diagrams of the same ratio (one with stacked boxes, one with a tape diagram). Ask: what is the same? what is different? what does that tell us about the ratio?',
  },
  8: {
    number: 8,
    name: 'Discussion Supports',
    shortName: 'Discussion Supports',
    definition:
      'A bundle of small teacher moves that build classroom math discussion — revoicing, sentence frames, wait time, and choral response.',
    structure: [
      'Revoice. Restate or amplify a student\'s idea using clearer math language.',
      'Offer frames. Provide sentence frames so students can join the discussion ("I agree because ___", "I think it\'s ___ because ___").',
      'Wait. Give at least 3 seconds of think time after asking a question.',
      'Repeat together. Repeat key vocabulary or phrases as a class to anchor them.',
    ],
    example:
      'After a student says "more squares," the teacher revoices: "So the ratio of squares to circles is greater than one to one?" Then offers the frame "I agree, because ___" to invite the class in.',
  },
};

export const ALL_MLR_NUMBERS: MlrNumber[] = [1, 2, 3, 4, 5, 6, 7, 8];

export function isValidMlrNumber(n: unknown): n is MlrNumber {
  return typeof n === 'number' && Number.isInteger(n) && n >= 1 && n <= 8;
}

export function getMlr(n: MlrNumber): MlrEntry {
  return MLRS[n];
}
