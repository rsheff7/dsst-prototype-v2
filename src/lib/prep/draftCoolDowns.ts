/**
 * Draft cool-downs for the phone prep's "Do it as a student" step.
 *
 * PLACEHOLDERS. These were written for the prototype on 2026-10-11 and are not
 * Illustrative Mathematics' cool-downs. IM's own are behind an educator sign-in
 * and DSST will supply the real ones after reviewing the app; when they do,
 * replace the entry and drop `draft`. The app does not show the draft status to
 * teachers; it is recorded here for whoever reviews the content.
 *
 * Why the step wants a cool-down at all: the lesson's close as generated is a
 * teacher direction, sometimes with the answer in it, and three of eleven
 * analyses had no question in it to lift out. A cool-down is a student task
 * with a checkable answer, which is what the step is for.
 *
 * Each draft was written from the lesson's published learning goals, student
 * task and lesson summary (IM 6–8 Math, CC BY, teacher edition). Each uses a
 * new context, not the lesson's, so it tests the idea and not recall, and is
 * answerable in words on a phone: where students would draw, the teacher
 * describes the drawing.
 *
 * Keyed by lesson code as the prep shows it ("6.2.1"). A lesson with no entry
 * falls back to the generated close.
 */

export interface CoolDown {
  title: string;
  /** Student-facing. One entry per line as a student would see it. */
  task: string[];
  /** What a strong student writes. Shown only after the teacher has answered. */
  strongAnswer: string[];
  /** Checkable against a written answer, unlike the lesson-wide signals. */
  lookFors: string[];
  /** True until DSST's own cool-down replaces it. */
  draft: boolean;
}

export const DRAFT_COOL_DOWNS: Record<string, CoolDown> = {
  // IM's own: "A Collection of Animals".
  '6.2.1': {
    title: 'A Shelf of Books',
    task: [
      'A shelf holds 8 paperback books and 4 hardcover books.',
      '1. Write two different sentences that describe this collection. Use the word “ratio” in one and “for every” in the other.',
      '2. A student wrote: “The ratio of hardcovers to paperbacks is 8 to 4.” Is the sentence correct? Explain how you know.',
    ],
    strongAnswer: [
      'The ratio of paperbacks to hardcovers is 8 to 4 (or 8 : 4).',
      'For every 2 paperbacks there is 1 hardcover. (“For every 8 paperbacks there are 4 hardcovers” is also correct.)',
      'The student’s sentence is not correct. It names hardcovers first, so the number of hardcovers has to come first: the ratio of hardcovers to paperbacks is 4 to 8.',
    ],
    lookFors: [
      'In each sentence the numbers come in the same order as the things they count',
      'One sentence uses “ratio” with “to” or a colon, the other uses “for every”',
      'The explanation points to the order of the words, not just “the numbers are backwards”',
    ],
    draft: true,
  },
  // IM's own: "Paws, Ears, and Tails".
  '6.2.2': {
    title: 'Trail Mix',
    task: [
      'A recipe for trail mix says, “Mix 4 cups of cereal with 2 cups of raisins.”',
      '1. Draw a diagram that represents the recipe. Label it. (Here, describe your diagram in words.)',
      '2. Write a sentence that describes the ratio your diagram shows.',
      '3. Complete, using your diagram: “For every 1 cup of raisins, there are ___ cups of cereal.” Explain how the diagram shows it.',
    ],
    strongAnswer: [
      'A row of 4 squares labeled “cereal (cups)” above a row of 2 squares labeled “raisins (cups)”. Plain shapes, one for each cup.',
      'The ratio of cups of cereal to cups of raisins is 4 to 2.',
      'For every 1 cup of raisins, there are 2 cups of cereal. The squares can be circled in 2 equal groups, each with 2 cereal squares and 1 raisin square.',
    ],
    lookFors: [
      'The diagram has one simple shape for each cup and no realistic detail',
      'Each kind of shape is labeled with the ingredient and the unit',
      'The numbers in the ratio sentence follow the order of the words',
      'The “for every 1” answer comes from grouping the shapes, and says so',
    ],
    draft: true,
  },
  // IM's own: "A Smaller Batch of Bird Food".
  '6.2.3': {
    title: 'Smoothies',
    task: [
      'A smoothie recipe uses 3 cups of yogurt and 2 bananas.',
      '1. How much yogurt and how many bananas make 3 batches? Explain or show how you know.',
      '2. Someone makes a smoothie with 9 cups of yogurt and 5 bananas. Will it taste the same as the recipe? Explain.',
    ],
    strongAnswer: [
      '9 cups of yogurt and 6 bananas. Each amount is multiplied by 3: 3 × 3 = 9 and 2 × 3 = 6. The ratios 3 : 2 and 9 : 6 are equivalent.',
      'No. The yogurt is 3 times the recipe, but 5 bananas is not 3 times 2. The ingredients were not multiplied by the same number, so it will taste less of banana.',
    ],
    lookFors: [
      'Both ingredients are multiplied by 3, and the answer says so',
      'Same taste is explained by multiplying every ingredient by the same number',
      'The 9 and 5 mixture is turned down by checking the multiplier, not because 5 is “close”',
    ],
    draft: true,
  },
  // IM's own: "Orange Water".
  '6.2.4': {
    title: 'Teal Paint',
    task: [
      'A shade of teal paint is made by mixing 4 ml of blue paint with 6 ml of green paint.',
      'Mixture A: 12 ml of blue and 18 ml of green.',
      'Mixture B: 9 ml of blue and 11 ml of green.',
      'Which mixture is the same shade of teal as the original? Explain how you know. Say what is different about the other one.',
    ],
    strongAnswer: [
      'Mixture A is the same shade. Both colors are multiplied by 3: 4 × 3 = 12 and 6 × 3 = 18. It is 3 batches, so 4 : 6 and 12 : 18 are equivalent ratios.',
      'Mixture B is not. It has 5 ml more of each color, and adding the same amount to each is not multiplying each by the same number. It has too much blue for its green, so it will look bluer.',
    ],
    lookFors: [
      'Mixture A is chosen because both amounts are multiplied by the same number, and the number is named',
      'Mixture B is turned down because adding the same amount to each is not multiplying by the same number',
      'The answer talks about batches or equivalent ratios, not only “the numbers are bigger”',
    ],
    draft: true,
  },
  // IM's own: "Why Are They Equivalent?".
  '6.2.5': {
    title: 'Equivalent or Not?',
    task: [
      '1. Write two ratios that are equivalent to 6 : 4. Make one with larger numbers and one with smaller numbers. Show what you multiplied by.',
      '2. Is 9 : 7 equivalent to 6 : 4? Explain how you know.',
    ],
    strongAnswer: [
      'Larger: 12 : 8, multiplying both 6 and 4 by 2. Smaller: 3 : 2, multiplying both 6 and 4 by one half.',
      'No. To get from 6 to 9 you multiply by 1.5, but 4 × 1.5 is 6, not 7. Each number went up by 3, and adding the same amount to both does not make an equivalent ratio.',
    ],
    lookFors: [
      'Each new ratio names one multiplier used for both numbers',
      'The smaller ratio comes from multiplying by a fraction (or dividing both by the same number)',
      '9 : 7 is turned down by testing the multiplier on both numbers',
    ],
    draft: true,
  },
  // IM's own: "R's and T's".
  '7.6.22': {
    title: 'Fewer Terms',
    task: [
      'Write each expression with fewer terms. Show or explain your reasoning.',
      '1. 5a − 2b − 3a + 6b',
      '2. 4(x + 5) + 3(x + 5) − 2(x + 5)',
    ],
    strongAnswer: [
      '1. 2a + 4b. Rewrite the subtraction as adding the opposite, 5a + (−2b) + (−3a) + 6b, then reorder and combine like terms: (5a − 3a) + (−2b + 6b) = 2a + 4b.',
      '2. 5(x + 5). Every term is a number times (x + 5), so by the distributive property it is (4 + 3 − 2)(x + 5). Expanding each part first and combining gives 5x + 25, which is also correct and equivalent.',
    ],
    lookFors: [
      'Subtraction is rewritten as adding the opposite before any terms are moved',
      'Only like terms are combined: a with a, b with b',
      '(x + 5) is treated as a common factor, or every part is expanded correctly. Both are valid',
      'The reasoning names a property or checks by substituting a value',
    ],
    draft: true,
  },
};
