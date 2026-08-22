import { LessonData } from './types';

// ---------------------------------------------------------------------------
// Demo lesson — IM Grade 6, Unit 2, Lesson 1 "Introducing Ratios and Ratio
// Language". Loaded by the home page sample, /framework, /how-to, /qa, /audit.
//
// PROVENANCE: generated 2026-08-22T18:39:59.833Z on gemini/gemini-3.7-flash
// (thinking=medium), pipeline 2026-08-22.1+08fb3f478d223abc, from
// "Grade 6 Mathematics, Unit 2.1 - Open Up Resources.pdf". Cache key 6dbbdc789323b58e4c22cf11d5a03a4e.
//
// Regenerated on the outcome-first pipeline: routines are now selected from each
// activity's outcome against IM's published learning targets, so the sample
// shows what teachers will actually receive. The previous demo predated that and
// carried MLR assignments from the keyword-scan table.
//
// To refresh: POST the source PDF to /api/analyze and paste the response here.
// ---------------------------------------------------------------------------

export const demoLesson = {
  "meta": {
    "grade": "6",
    "unit": "2",
    "lesson_number": "1",
    "lesson_title": "Introducing Ratios and Ratio Language",
    "total_time": "45-50 min"
  },
  "arc_statement": "Students begin by sorting collections of shapes using everyday informal language to describe categories and counts. The lesson pivots to introducing the mathematical concept of a ratio, demanding precise alignment between the sequence of named categories and the sequence of numbers. Students then practice and solidify this syntax by organizing physical collections and constructing visual displays that clearly match their written ratio statements.",
  "destination": "Students can write and say ratio statements describing associations between two quantities with matching order of words and numbers.",
  "key_vocabulary": [
    {
      "term": "ratio",
      "definition": "An association between two or more quantities."
    },
    {
      "term": "for every",
      "definition": "A phrase used to describe a ratio relationship comparing amounts in each group."
    }
  ],
  "activities": [
    {
      "id": "1.1",
      "title": "What Kind and How Many?",
      "function": "Setup",
      "duration": "~10 min",
      "grouping": "Individual then whole group",
      "language_demand": "low",
      "function_summary": "This warm-up activates prior knowledge of sorting objects by various attributes (color, size, shape, area). It gives students opportunities to generate informal category words and counts that will soon become the quantities in ratio statements.",
      "learning_target": "Students sort a set of figures into categories based on different attributes.",
      "synthesis_prompt": "Synthesize toward sorting figures into categories based on different attributes by displaying the collected student sorting methods on an anchor chart and highlighting that any set can be grouped in multiple valid ways depending on the chosen attribute.",
      "is_crux": false,
      "friction_points": [
        {
          "description": "Students count the total shapes without sorting into distinct attribute groups.",
          "type": "math"
        },
        {
          "description": "Students use vague descriptions like 'the big ones' instead of naming specific sorting attributes.",
          "type": "language",
          "mlr": {
            "number": 2,
            "name": "Collect and Display"
          }
        }
      ],
      "success_signals": [
        "Students identify at least two distinct sorting attributes (e.g., color, number of sides, area).",
        "Students accurately count and state the number of figures in each sorted category."
      ],
      "teacher_moves": [
        {
          "text": "Circulate while students sort shapes individually; scribe their informal descriptive words onto a shared visual chart (e.g., 'blue ones', 'four-sided', 'large area').",
          "mlr": {
            "number": 2,
            "name": "Collect and Display"
          }
        },
        {
          "text": "Display the chart during whole-group discussion and ask students to point out which words describe the category name versus which describe the count."
        }
      ],
      "causal_link": "Establishes category sorting and counting needed to form two-quantity comparisons in Activity 1.2.",
      "extension": "Ask students to find a shape that belongs to two categories at the same time."
    },
    {
      "id": "1.2",
      "title": "The Teacher’s Collection",
      "function": "Crux",
      "duration": "~15 min",
      "grouping": "Partners",
      "language_demand": "medium",
      "function_summary": "This activity introduces formal ratio language and notation. It is the crux because students must directly map words to numbers in identical sequence, confronting the common trap of reversing values or defaulting to larger-first ordering.",
      "learning_target": "Students write ratio sentences describing categories in a collection with words and numbers in the correct order.",
      "synthesis_prompt": "Synthesize toward writing ratio sentences with matching word and number order by contrasting a reversed statement ('ratio of 3 blue to 2 red is 2 to 3') with the corrected statement on the board and asking students why order matters when communicating quantities.",
      "is_crux": true,
      "friction_points": [
        {
          "description": "Students write the larger count first regardless of the order of words in the sentence (e.g., writing 'ratio of 2 triangles to 5 squares is 5 to 2').",
          "type": "math"
        },
        {
          "description": "Students struggle to use the structured sentence frames 'The ratio of ___ to ___ is ___:___' and 'For every ___ there are ___'.",
          "type": "language-math",
          "mlr": {
            "number": 3,
            "name": "Critique, Correct, and Clarify"
          }
        }
      ],
      "success_signals": [
        "Students write ratio sentences where the order of numbers exactly mirrors the order of category names.",
        "Students accurately explain why changing the order of category names requires changing the order of the numbers."
      ],
      "teacher_moves": [
        {
          "text": "Display an anonymous student work sample with reversed order (e.g., 'The ratio of 4 forks to 6 spoons is 6 to 4') and prompt pairs to critique and rewrite the statement accurately.",
          "mlr": {
            "number": 3,
            "name": "Critique, Correct, and Clarify"
          }
        },
        {
          "text": "Have students read their written ratio sentences aloud to a partner, listen to partner feedback, and revise their sentences for clearer alignment between words and numbers.",
          "mlr": {
            "number": 1,
            "name": "Stronger and Clearer Each Time"
          }
        }
      ],
      "causal_link": "Gives students the syntactic foundation and precision required to produce ratio displays in Activity 1.3.",
      "extension": "Ask students to write their ratio sentence using the 'for every' structure simplified to lowest terms if possible."
    },
    {
      "id": "1.3",
      "title": "The Student’s Collection",
      "function": "Application",
      "duration": "~20 min",
      "grouping": "Partners",
      "language_demand": "high",
      "function_summary": "Students apply the new ratio syntax to tangible collections of items they organize themselves. They bridge concrete physical groupings, visual posters, and written statements using multiple ratio formats.",
      "learning_target": "Students create visual displays and write ratio statements that represent associations between categories in their own collections.",
      "synthesis_prompt": "Synthesize toward creating visual displays and writing ratio statements by placing two different group displays side-by-side on the board and asking students how both displays show the exact same ratio comparison despite differing visual arrangements.",
      "is_crux": false,
      "friction_points": [
        {
          "description": "Students draw collections without grouping items by attribute, making the ratio association difficult to verify visually.",
          "type": "math"
        },
        {
          "description": "Students struggle to explain how their visual poster connects to their written 'for every' ratio statement during partner share.",
          "type": "language",
          "mlr": {
            "number": 7,
            "name": "Compare and Connect"
          }
        }
      ],
      "success_signals": [
        "Students construct visual displays that group items clearly by category.",
        "Students write accurate ratio statements in multiple formats corresponding directly to their visual display."
      ],
      "teacher_moves": [
        {
          "text": "Select two student displays with different visual groupings for the same ratio (e.g., grouped in pairs vs grouped in separate lines) and guide the class to identify where the ratio appears in both representations.",
          "mlr": {
            "number": 7,
            "name": "Compare and Connect"
          }
        },
        {
          "text": "Guide partners to share their visual displays and practice explaining their ratio sentences, prompting listeners to ask 'How does your picture show that number?' before students write a final caption.",
          "mlr": {
            "number": 1,
            "name": "Stronger and Clearer Each Time"
          }
        }
      ],
      "causal_link": "Applies ratio notation and language to student-generated contexts, preparing for equivalent ratio explorations in subsequent lessons.",
      "extension": "Challenge students to arrange their collection into equal groups to write a ratio using smaller whole numbers."
    }
  ],
  "adaptation_guardrails": {
    "mathematical_purpose": "To understand that a ratio is an association between two quantities where the sequence of values must strictly match the sequence of categories being described.",
    "safe_to_change": [
      "The physical objects used in the collections (e.g., pattern blocks, colored tiles, counters, or stationery).",
      "The number of categories students sort into (2 or 3 categories).",
      "Whether displays are made on paper, whiteboards, or digital drawing slides."
    ],
    "do_not_remove": [
      {
        "text": "Do not remove the partner verbal reading of ratio sentences; speaking the sentence aloud is essential for hearing whether the order of words matches the numbers.",
        "mlr": {
          "number": 1,
          "name": "Stronger and Clearer Each Time"
        }
      },
      {
        "text": "Do not remove the critique of reversed word-and-number statements; students must confront the order-dependence of ratio syntax directly.",
        "mlr": {
          "number": 3,
          "name": "Critique, Correct, and Clarify"
        }
      },
      {
        "text": "Do not remove the requirement to write the ratio using multiple frames ('___ to ___', '___:___', and 'for every ___ there are ___')."
      }
    ],
    "rigor_check": "Are students required to write and say the ratio in the exact order requested rather than rearranging numbers from largest to smallest?",
    "by_proficiency": {
      "emerging": {
        "text": "Provide color-coded sentence frames matching physical object colors (e.g., blue box for blue objects count) and gesture to point to the physical pile as each number is spoken.",
        "mlr": {
          "number": 2,
          "name": "Collect and Display"
        }
      },
      "developing": {
        "text": "Provide pre-printed sentence strips with blanks for categories and numbers, requiring students to read their completed sentence to a partner before making their poster.",
        "mlr": {
          "number": 3,
          "name": "Critique, Correct, and Clarify"
        }
      },
      "expanding": {
        "text": "Prompt students to explain the difference in meaning between 'the ratio of A to B' and 'the ratio of B to A' in both written and spoken formats.",
        "mlr": {
          "number": 1,
          "name": "Stronger and Clearer Each Time"
        }
      }
    }
  },
  "anticipated_thinking": {
    "orientation": "Students arrive knowing how to count objects and group them by visible attributes like shape, color, or size. The key shift in this lesson is coordinating two counted amounts simultaneously and preserving the exact order of the category names when writing ratio sentences.",
    "activities": [
      {
        "activity_id": "1.1",
        "patterns": [
          {
            "label": "Sorting by multiple distinct attributes",
            "frequency": "most students",
            "type": "on-track",
            "description": "Students sort the collection by obvious visual traits like color (e.g., blue vs. green), number of sides, or size.",
            "move": "Record student sorting categories on a public chart. Ask: 'What category names did you use, and how many figures are in each group?'",
            "is_mll_specific": false
          },
          {
            "label": "Overlapping or vague category labels",
            "frequency": "some students",
            "type": "language-math",
            "description": "Students create ambiguous categories like 'pointy shapes' or 'big ones' where figures could belong to multiple groups or cannot be distinctly counted.",
            "move": "Use MLR 2 (Collect and Display) by writing their descriptive words on the board. Point to a figure and ask: 'Could this triangle go into both groups? How can we name the categories so every shape belongs in exactly one group?'",
            "is_mll_specific": true,
            "mlr": {
              "number": 2,
              "name": "Collect and Display"
            }
          },
          {
            "label": "Sub-categorizing within a single attribute",
            "frequency": "watch for this",
            "type": "extension",
            "description": "Students sort by two attributes at once, such as 'blue triangles' versus 'green quadrilaterals'.",
            "move": "Acknowledge this detailed sort, then ask: 'If we only look at shape, how many categories do we have? What if we only look at color?'",
            "is_mll_specific": false
          }
        ],
        "sentence_frames": [
          {
            "frame": "I sorted the figures by _______ into _______ groups.",
            "mlr": {
              "number": 2,
              "name": "Collect and Display"
            }
          },
          {
            "frame": "There are _______ [category name] and _______ [category name]."
          }
        ],
        "questions_to_listen_for": [
          "How did you decide which group each figure belongs to?",
          "Can a figure belong to more than one of your categories?"
        ]
      },
      {
        "activity_id": "1.2",
        "patterns": [
          {
            "label": "Correct word and number alignment",
            "frequency": "most students",
            "type": "on-track",
            "description": "Students match the order of categories to the order of numbers (e.g., 'The ratio of blue tiles to yellow tiles is 4 to 3').",
            "move": "Have students underline the first category name and point to the first number to verify they match.",
            "is_mll_specific": false
          },
          {
            "label": "Reversed order of quantities",
            "frequency": "some students",
            "type": "misconception",
            "description": "Students write the larger count first regardless of category order (e.g., writing 'The ratio of 3 yellow to 5 red is 5 to 3').",
            "move": "Use MLR 3 (Critique, Correct, and Clarify). Write an anonymous sentence with flipped numbers on the board. Ask: 'Which category was named first, and which number represents that category? How can we rewrite this so the order matches?'",
            "is_mll_specific": true,
            "mlr": {
              "number": 3,
              "name": "Critique, Correct, and Clarify"
            }
          },
          {
            "label": "Part-to-whole ratio formulation",
            "frequency": "watch for this",
            "type": "partial",
            "description": "Students compare one category to the total count of items rather than comparing two separate categories.",
            "move": "Validate that comparing a part to the whole is a valid ratio. Ask: 'What does the second number represent—the other category, or all items combined?'",
            "is_mll_specific": false
          },
          {
            "label": "Partner sentence refinement",
            "frequency": "some students",
            "type": "language-math",
            "description": "Students write an initial ratio sentence with informal phrasing and refine it after reading it aloud to a peer.",
            "move": "Run MLR 1 (Stronger and Clearer Each Time). Have Partner A read their ratio sentence aloud. Partner B asks: 'Which category comes first in your words, and which number comes first?' Students then revise their sentence for precision.",
            "is_mll_specific": true,
            "mlr": {
              "number": 1,
              "name": "Stronger and Clearer Each Time"
            }
          }
        ],
        "sentence_frames": [
          {
            "frame": "The ratio of [Category A] to [Category B] is _______ to _______.",
            "mlr": {
              "number": 3,
              "name": "Critique, Correct, and Clarify"
            }
          },
          {
            "frame": "For every _______ [Category A], there are _______ [Category B].",
            "mlr": {
              "number": 1,
              "name": "Stronger and Clearer Each Time"
            }
          }
        ],
        "questions_to_listen_for": [
          "Which category did you write first, and what number goes with it?",
          "How would your ratio sentence change if you swapped the order of the categories?"
        ]
      },
      {
        "activity_id": "1.3",
        "patterns": [
          {
            "label": "Grouping items into equivalent visual units",
            "frequency": "some students",
            "type": "on-track",
            "description": "Students physically cluster their items into equal groups (e.g., pairs of 2 paperclips for every 1 eraser) to justify their 'for every' statements.",
            "move": "Use MLR 7 (Compare and Connect). Place this grouped display next to an ungrouped display and ask: 'How do both displays show the same ratio even though one is grouped?'",
            "is_mll_specific": true,
            "mlr": {
              "number": 7,
              "name": "Compare and Connect"
            }
          },
          {
            "label": "Disconnection between visual display and written ratio",
            "frequency": "some students",
            "type": "misconception",
            "description": "Students draw a display that shows all items jumbled together without visually distinguishing the two categories named in their ratio statement.",
            "move": "Ask students to point to where the first number in their ratio sentence appears in the display, then point to the second number.",
            "is_mll_specific": false
          },
          {
            "label": "Describing displays using varied ratio phrasing",
            "frequency": "most students",
            "type": "language-math",
            "description": "Students practice explaining their visual display using colon notation and 'for every' language with different partners.",
            "move": "Run MLR 1 (Stronger and Clearer Each Time). Students explain their display to a partner using 'for every', get feedback on clarity, and then switch partners to share a refined explanation.",
            "is_mll_specific": true,
            "mlr": {
              "number": 1,
              "name": "Stronger and Clearer Each Time"
            }
          }
        ],
        "sentence_frames": [
          {
            "frame": "In my display, the ratio of _______ to _______ is shown by _______.",
            "mlr": {
              "number": 7,
              "name": "Compare and Connect"
            }
          },
          {
            "frame": "Both displays show the ratio _______ : _______ because _______.",
            "mlr": {
              "number": 7,
              "name": "Compare and Connect"
            }
          }
        ],
        "questions_to_listen_for": [
          "Where in your visual display do we see the two quantities from your sentence?",
          "How does grouping your items make the ratio easier to see?"
        ]
      }
    ]
  },
  "decision_guide": {
    "activities": [
      {
        "activity_id": "1.1",
        "scenarios": [
          {
            "scenario_type": "on-track",
            "label": "Sorting figures by precise geometric attributes (e.g., number of sides or vertices)",
            "interpretation": "The student recognizes that figures can be classified by shared mathematical properties beyond surface traits like color. They clearly separate polygons by side count and accurately count the quantity in each group.",
            "is_mll": false,
            "flat_move": {
              "move": "Ask the student to state their sorting rule and name the groups. Record their attribute terms on the board so the class can reuse the vocabulary.",
              "avoid": "Over-praising side-counting as 'better' than sorting by color, which invalidates other legitimate sorting rules.",
              "say": "You grouped all the 4-sided figures together and all the 3-sided figures together. What name can we give to each pile?"
            },
            "proficiency_moves": null,
            "mll_framework_note": null,
            "proficiency_divergence_note": null
          },
          {
            "scenario_type": "common-error",
            "label": "Counting total shapes instead of sorting into distinct attribute categories",
            "interpretation": "The student sees the collection as a single aggregate count rather than distinct subgroups. They have not yet established a rule to partition the set.",
            "is_mll": false,
            "flat_move": {
              "move": "Pick up two shapes with an obvious difference, such as color or shape, and ask the student if they belong in the same pile or different piles based on that feature.",
              "avoid": "Sorting the entire collection for the student.",
              "say": "Look at this blue triangle and this green square. If our rule is 'same color,' do they go together or apart?"
            },
            "proficiency_moves": null,
            "mll_framework_note": null,
            "proficiency_divergence_note": null
          },
          {
            "scenario_type": "partial-understanding",
            "label": "Using everyday descriptive phrasing ('pointy ones', 'flat ones') instead of category names",
            "interpretation": "The student has identified a valid sorting rule based on visual attributes but lacks the formal geometric vocabulary to name the category. They understand grouping but need an academic language bridge.",
            "is_mll": true,
            "flat_move": null,
            "proficiency_moves": {
              "emerging": {
                "move": "Point to the student's pile of triangles, say 'triangles,' write the word next to the pile, and have the student chorally repeat.",
                "avoid": "Telling the student their informal description is wrong.",
                "nonverbal": "Place a label card with the word 'Triangles' and a small drawing of a triangle directly in front of the pile.",
                "say": "You sorted the pointy ones together. In math, we call these 3-sided shapes 'triangles.' Say with me: triangles."
              },
              "developing": {
                "move": "Capture the student's phrase on the public display alongside the formal term, then prompt them to restate their sorting rule using the formal term.",
                "avoid": "Erasing or ignoring the student's informal description.",
                "say": "I heard you call these 'the pointy shapes.' Let's add that to our chart next to 'triangles.' How would you describe this category using the word 'triangle'?"
              },
              "expanding": {
                "move": "Ask the student to define the mathematical attribute that makes all the shapes in that category fit together.",
                "avoid": "Accepting just the single noun without pressing for the attribute description.",
                "say": "What specific attribute do all your 'pointy' shapes share that puts them in the triangle category?"
              }
            },
            "mll_framework_note": null,
            "proficiency_divergence_note": null,
            "mlr": {
              "number": 2,
              "name": "Collect and Display"
            }
          }
        ]
      },
      {
        "activity_id": "1.2",
        "scenarios": [
          {
            "scenario_type": "common-error",
            "label": "Reversing number order relative to word order in the ratio statement",
            "interpretation": "The student writes 'The ratio of blue cubes to yellow cubes is 5 to 3' when there are actually 3 blue and 5 yellow cubes. They default to writing the larger number first rather than preserving the grammatical order of the categories.",
            "is_mll": true,
            "flat_move": null,
            "proficiency_moves": {
              "emerging": {
                "move": "Point to the word 'blue' in their sentence, then point to the blue pile and count aloud. Then point to the first number in their sentence and ask if they match.",
                "avoid": "Rewriting the numbers in the sentence yourself.",
                "nonverbal": "Touch the word 'blue,' touch the 3 blue cubes, then point to the written number '5' with a questioning look.",
                "say": "Look at the sentence: blue comes first. How many blue cubes do we have? Does this first number say 3?"
              },
              "developing": {
                "move": "Have the student read the sentence aloud while tracing their finger from each category word to its corresponding number in the blank.",
                "avoid": "Telling them immediately that the numbers are reversed.",
                "say": "Read your sentence out loud. Point to the word for the first group, then point to the number that matches it."
              },
              "expanding": {
                "move": "Write an anonymous sample showing the reversed numbers on a whiteboard and ask the student to critique why the order changes the mathematical meaning.",
                "avoid": "Treating the reversed order as a minor formatting slip rather than a mathematical mismatch.",
                "say": "Someone wrote 'the ratio of blue to yellow is 5 to 3.' Looking at our collection of 3 blue and 5 yellow, what is misleading about this statement?"
              }
            },
            "mll_framework_note": null,
            "proficiency_divergence_note": null,
            "mlr": {
              "number": 3,
              "name": "Critique, Correct, and Clarify"
            }
          },
          {
            "scenario_type": "productive-insight",
            "label": "Simplifying counts into unit ratio language ('for every 1 of these, there are 2 of those')",
            "interpretation": "The student notices a multiplicative relationship within the collection (e.g., 3 circles and 6 squares) and partitions the objects into equal paired groups rather than simply stating the raw totals.",
            "is_mll": false,
            "flat_move": {
              "move": "Ask the student to physically arrange the physical objects into small identical groups to show the class how the 'for every 1... there are 2...' structure works.",
              "avoid": "Forcing the student to revert back to raw totals (6 to 3) before acknowledging the simplified form.",
              "say": "Show me how you grouped your objects to see that for every 1 circle, there are 2 squares. Can we make another group just like that?"
            },
            "proficiency_moves": null,
            "mll_framework_note": null,
            "proficiency_divergence_note": null
          },
          {
            "scenario_type": "productive-struggle",
            "label": "Freezing or struggling to articulate the relational meaning of 'for every'",
            "interpretation": "The student can state 'the ratio of A to B is X to Y' because it mirrors a standard fill-in-the-blank format, but struggles with the syntax and conceptual meaning of the 'for every' frame.",
            "is_mll": true,
            "flat_move": null,
            "proficiency_moves": {
              "emerging": {
                "move": "Set out 1 paper clip and 2 erasers. Gesture to the pair and say the phrase, then push another pair forward and prompt the student to repeat.",
                "avoid": "Demanding a written explanation before physical demonstration.",
                "nonverbal": "Slide 1 blue tile and 2 yellow tiles together as a unit, tapping each piece while saying the count.",
                "say": "Look: for every 1 blue, there are 2 yellow. Now you take 1 blue... how many yellow must go with it?"
              },
              "developing": {
                "move": "Provide a paired-matching template and have the student practice saying their 'for every' draft with a partner before writing.",
                "avoid": "Letting the student abandon the 'for every' prompt to only use 'ratio of... is...'.",
                "say": "Tell your partner your sentence starting with 'For every...'. Ask your partner: does my number match my group?"
              },
              "expanding": {
                "move": "Have the student write their first draft of the 'for every' sentence, share with a partner to verify word-number match, and revise for clarity.",
                "avoid": "Accepting sentences where the items are listed without quantities (e.g., 'for every blue there is yellow').",
                "say": "Draft your 'for every' sentence. Read it to your partner, then revise it so anyone reading it knows the exact number in each group."
              }
            },
            "mll_framework_note": null,
            "proficiency_divergence_note": null,
            "mlr": {
              "number": 1,
              "name": "Stronger and Clearer Each Time"
            }
          },
          {
            "scenario_type": "on-track",
            "label": "Consistently matching category words and quantities across multiple sentence structures",
            "interpretation": "The student understands that ratio statements are ordered pairs describing an association. They comfortably use 'X to Y', 'X : Y', and 'for every X there are Y' while keeping terms properly aligned.",
            "is_mll": false,
            "flat_move": {
              "move": "Challenge the student to write a ratio comparing one category to the total number of items in the entire collection.",
              "avoid": "Telling them part-to-whole comparisons are not allowed; ratios can describe part-to-part or part-to-whole.",
              "say": "You compared blue to yellow. How could you write a ratio sentence comparing the blue cubes to ALL the cubes in the collection?"
            },
            "proficiency_moves": null,
            "mll_framework_note": null,
            "proficiency_divergence_note": null
          }
        ]
      },
      {
        "activity_id": "1.3",
        "scenarios": [
          {
            "scenario_type": "common-error",
            "label": "Displaying items in an unorganized pile that obscures the stated ratio",
            "interpretation": "The student writes a correct ratio sentence but creates a visual display with scattered items. The display does not visually communicate the relationship or grouping described in their sentence.",
            "is_mll": false,
            "flat_move": {
              "move": "Ask the student to look at their display from two feet away and determine whether someone walking by could see the ratio without counting every item one by one.",
              "avoid": "Reorganizing the student's display for them.",
              "say": "Your sentence says 'for every 2 red counters there are 3 yellow counters.' How could you line up or group your counters so a visitor sees those groups of 2 and 3 instantly?"
            },
            "proficiency_moves": null,
            "mll_framework_note": null,
            "proficiency_divergence_note": null
          },
          {
            "scenario_type": "productive-insight",
            "label": "Arranging items in paired arrays or batches that visually prove the ratio statement",
            "interpretation": "The student connects the verbal/symbolic ratio statement directly to spatial organization. They arrange their collection into distinct, identical sub-groups (e.g., columns of 2 blue alongside columns of 3 red).",
            "is_mll": true,
            "flat_move": null,
            "proficiency_moves": {
              "emerging": {
                "move": "Pair this student's display with a standard total-count display. Point to one grouped row and ask both students to count the items in that single group.",
                "avoid": "Explaining the visual connection yourself without letting students observe.",
                "nonverbal": "Place the two displays side by side, circle one structured row with a finger, and point to the corresponding numbers in the written ratio.",
                "say": "Look at this group: 2 blue, 3 red. Where do you see those same numbers in the written sentence?"
              },
              "developing": {
                "move": "Prompt the student to explain to their partner how their visual grouping makes it easy to check the 'for every' statement.",
                "avoid": "Interrupting to provide formal terms like 'unit rate' or 'scale factor.'",
                "say": "Tell your partner how your columns show the 'for every' part of your sentence. What does each column represent?"
              },
              "expanding": {
                "move": "Have the student present their visual display during whole-class synthesis, explaining how the visual structure supports multiple equivalent ratio statements.",
                "avoid": "Limiting the student's presentation to just reading their written sentence.",
                "say": "Show the class your display. How does your arrangement show both the total ratio and the 'for every' relationship at the same time?"
              }
            },
            "mll_framework_note": null,
            "proficiency_divergence_note": null,
            "mlr": {
              "number": 7,
              "name": "Compare and Connect"
            }
          },
          {
            "scenario_type": "partial-understanding",
            "label": "Writing sentences that list category names and amounts without relational ratio language",
            "interpretation": "The student writes observational statements like 'There are 6 buttons and 4 paperclips' or 'Buttons have 6, clips have 4' instead of framing the relationship as an association between two quantities.",
            "is_mll": true,
            "flat_move": null,
            "proficiency_moves": {
              "emerging": {
                "move": "Provide a sentence strip with pre-printed blanks: 'The ratio of _____ to _____ is ___ : ___.' Point to their data table and help them transfer words and numbers in order.",
                "avoid": "Accepting the descriptive count list as a ratio statement.",
                "nonverbal": "Tap the first category in their table, tap the first blank on the sentence strip, tap the second category, tap the second blank.",
                "say": "You counted 6 buttons and 4 clips. Let's write them as a ratio. Put 'buttons' here and 'clips' here. What numbers go in the blanks?"
              },
              "developing": {
                "move": "Have the student read their statement to a partner, then use a provided sentence frame to convert their two separate count statements into one comparative ratio sentence.",
                "avoid": "Writing the converted sentence for them.",
                "say": "You listed the counts. Now turn those two facts into one sentence using the frame: 'The ratio of ___ to ___ is ___ to ___.'"
              },
              "expanding": {
                "move": "Ask the student to compare their draft with the required sentence frames and revise it so that it explicitly describes the association between the two quantities.",
                "avoid": "Telling them directly what words are missing.",
                "say": "How can you rewrite your draft so it uses ratio language to describe the relationship between these two categories?"
              }
            },
            "mll_framework_note": null,
            "proficiency_divergence_note": null,
            "mlr": {
              "number": 1,
              "name": "Stronger and Clearer Each Time"
            }
          },
          {
            "scenario_type": "on-track",
            "label": "Accurately representing 3 categories and creating multiple pairwise ratio statements",
            "interpretation": "The student sorts their collection into three distinct categories (e.g., red, green, blue counters) and writes multiple valid ratio statements comparing different pairs of categories with exact word-number alignment.",
            "is_mll": false,
            "flat_move": {
              "move": "Challenge the student to write a three-way ratio statement (e.g., 'The ratio of A to B to C is 2 : 3 : 5') and verify whether the order still holds true.",
              "avoid": "Discouraging three-quantity ratios; they are mathematically valid extensions of ratio language.",
              "say": "You wrote ratios comparing two categories at a time. How might you write a single ratio statement that compares all three categories at once?"
            },
            "proficiency_moves": null,
            "mll_framework_note": null,
            "proficiency_divergence_note": null
          }
        ]
      }
    ]
  },
  "elsf_inference": {
    "activities": [
      {
        "activity_id": "1.1",
        "language_demands": {
          "receptive": "Read task prompts asking to sort by color, area, and custom rules; listen to peers describe distinct grouping criteria.",
          "productive": "Verbally name attribute categories (e.g., 'number of sides', 'dark vs. light') and state the count of figures in each group.",
          "interactive": "Compare sorting rules in whole-group discussion to justify why a single shape belongs in a specific category.",
          "everyday_to_academic_bridge": "Connects informal descriptions like 'shapes with 4 corners' or 'tilted boxes' to formal terms like 'quadrilaterals' and defined attribute categories.",
          "elsf_guidelines_applied": [
            1,
            2,
            6
          ]
        },
        "functional_language": {
          "language_functions": [
            "classify objects by attribute",
            "describe categories and counts"
          ],
          "example_phrases": [
            "I sorted the figures into ___ groups based on ___.",
            "There are ___ shapes with an area of ___ square units."
          ],
          "l1_bridge": "Many attribute words (e.g., 'color/color', 'figure/figura', 'category/categoría') have direct Spanish cognates that can anchor sorting rules.",
          "elsf_guidelines_applied": [
            1,
            3,
            7
          ]
        }
      },
      {
        "activity_id": "1.2",
        "language_demands": {
          "receptive": "Read structured ratio sentence frames containing relational prepositions ('to', 'for every') and colon notation.",
          "productive": "Write complete sentences expressing two-quantity comparisons while maintaining strict alignment between word order and number order.",
          "interactive": "Orally compare recorded category counts with a partner to check whether the written numbers match the named categories in sequence.",
          "everyday_to_academic_bridge": "Transitions from everyday additive comparisons ('there are 3 more red blocks than blue') to multiplicative relational framing ('3 red for every 2 blue').",
          "elsf_guidelines_applied": [
            1,
            6,
            8
          ]
        },
        "functional_language": {
          "language_functions": [
            "describe a ratio relationship",
            "compare two quantities sequentially"
          ],
          "example_phrases": [
            "The ratio of ___ to ___ is ___ to ___.",
            "There are ___ [category A] for every ___ [category B]."
          ],
          "l1_bridge": "The phrasing 'for every' translates directly to 'por cada' in Spanish, reinforcing the paired association between the two quantities.",
          "elsf_guidelines_applied": [
            1,
            7,
            12
          ]
        }
      },
      {
        "activity_id": "1.3",
        "language_demands": {
          "receptive": "Interpret peers' visual representations, charts, and ratio sentences during display sharing.",
          "productive": "Write ratio statements from self-selected collections and create an annotated poster showing grouped items.",
          "interactive": "Discuss with a peer how visual groupings (e.g., 2 circles grouped with 1 square) justify the written ratio sentence.",
          "everyday_to_academic_bridge": "Bridges physical grouping and spatial arrangements to symbolic ratio notation (A:B) and formal 'for every' sentences.",
          "elsf_guidelines_applied": [
            2,
            4,
            9
          ]
        },
        "functional_language": {
          "language_functions": [
            "justify a statement using a representation",
            "translate between visual and written forms"
          ],
          "example_phrases": [
            "My display shows that for every ___ of ___, there are ___ of ___.",
            "The ratio of ___ : ___ matches the visual grouping of ___."
          ],
          "l1_bridge": "Allow students to initially label their visual display categories in their home language before writing the formal English ratio sentences.",
          "elsf_guidelines_applied": [
            3,
            4,
            7
          ]
        }
      }
    ]
  },
  "mlr_inference": {
    "activities": [
      {
        "activity_id": "1.1",
        "language_work": "Students generate informal descriptions and vocabulary to classify geometric figures by multiple attributes before transitioning to formal ratio language.",
        "mlrs": [
          {
            "number": 2,
            "name": "Collect and Display",
            "why_here": "Students use everyday sorting terms like 'pointy,' 'sides,' or 'shading' that the teacher captures visually to bridge toward precise mathematical categories and quantities."
          }
        ]
      },
      {
        "activity_id": "1.2",
        "language_work": "Students interpret structured sentence frames to express ratios, matching the sequential order of category names with their corresponding numerical counts.",
        "mlrs": [
          {
            "number": 3,
            "name": "Critique, Correct, and Clarify",
            "why_here": "A student inevitably writes the numbers reversed relative to the words, so analyzing an anonymous flawed sentence on the board helps the class identify and repair the order mismatch."
          },
          {
            "number": 1,
            "name": "Stronger and Clearer Each Time",
            "why_here": "Students read their initial ratio sentences to a partner, verify that the order of nouns matches the order of quantities, and revise their statements for precision."
          }
        ]
      },
      {
        "activity_id": "1.3",
        "language_work": "Students construct visual displays of their own sorted collections and explain the ratio relationships using multiple linguistic and symbolic forms.",
        "mlrs": [
          {
            "number": 7,
            "name": "Compare and Connect",
            "why_here": "Pairing different student displays side by side reveals that different visual arrangements can represent the exact same ratio statement and category comparison."
          },
          {
            "number": 1,
            "name": "Stronger and Clearer Each Time",
            "why_here": "During the gallery walk, students explain their display to consecutive peers, refining their explanation of which category corresponds to each number."
          }
        ]
      }
    ]
  },
  "wristband": {
    "arc_one_line": "Sort objects into categories, then write precise ratio statements matching order.",
    "preflight": [
      "Set up visual chart for sorting terms before opening 1.1.",
      "Prepare display collection with distinct countable categories for 1.2 demonstration.",
      "Distribute physical object bags with three distinct categories to partner pairs."
    ],
    "top_signals": [
      "Matching number order to category name order consistently.",
      "Using 'for every' phrasing correctly with grouped items.",
      "Aligning visual groupings directly to written ratio statements."
    ],
    "top_frictions": [
      "Reversing number order when naming smaller category first.",
      "Counting total collection instead of comparing two categories.",
      "Mixing up colon notation meaning with fraction division."
    ],
    "activities": [
      {
        "activity_id": "1.1",
        "tiles": [
          {
            "observation_short": "Vague category descriptions like 'these look big' instead of measurable area or side length.",
            "friction_type": "language",
            "move_short": "Record informal category words on a public chart. MLR 2 lets students reference and refine geometric attributes during discussion.",
            "avoid_short": "Correcting informal category words immediately yourself.",
            "has_proficiency_variants": true,
            "glyph_observation": "VAGUE CATEGORY WORDS",
            "mlr": {
              "number": 2,
              "name": "Collect and Display"
            }
          },
          {
            "observation_short": "Counting total shapes instead of sorting into distinct attribute groups across the set.",
            "friction_type": "math",
            "move_short": "Chart different student sorting rules side-by-side. MLR 2 highlights that attributes create distinct sub-groups before counting quantities.",
            "avoid_short": "Telling students which rule to sort by.",
            "glyph_observation": "TOTAL INSTEAD SORT",
            "glyph_move": "CHART RULES · COMPARE GROUPS",
            "mlr": {
              "number": 2,
              "name": "Collect and Display"
            }
          }
        ],
        "synthesis_short": "Highlight the charted sorting rules. Ask: how does changing the category change the group counts?"
      },
      {
        "activity_id": "1.2",
        "tiles": [
          {
            "observation_short": "Numbers reversed in sentence — wrote '4 to 7' when naming 7 circles to 4 squares.",
            "friction_type": "language-math",
            "move_short": "Display the anonymous reversed statement. MLR 3 prompts partners to critique which category name matches the first number written.",
            "avoid_short": "Erasing and writing correct numbers yourself.",
            "is_crux_moment": true,
            "has_proficiency_variants": true,
            "glyph_observation": "REVERSED RATIO ORDER",
            "glyph_move": "DISPLAY ERROR · PARTNERS CRITIQUE",
            "mlr": {
              "number": 3,
              "name": "Critique, Correct, and Clarify"
            }
          },
          {
            "observation_short": "Struggling to use 'for every' frame to describe the teacher collection categories.",
            "friction_type": "language",
            "move_short": "Have partners share sentences aloud and refine phrasing. MLR 1 helps students clarify how category amounts pair together.",
            "avoid_short": "Filling in sentence blanks for students.",
            "has_proficiency_variants": true,
            "glyph_observation": "STRUGGLING WITH FRAME",
            "glyph_move": "PARTNER SHARE · REFINE SENTENCE",
            "mlr": {
              "number": 1,
              "name": "Stronger and Clearer Each Time"
            }
          }
        ],
        "synthesis_short": "Display circle and square counts. Ask: why must number order match the word order exactly?"
      },
      {
        "activity_id": "1.3",
        "tiles": [
          {
            "observation_short": "Display arranges items randomly, obscuring the paired comparison described in their written ratio.",
            "friction_type": "math",
            "move_short": "Place grouped and ungrouped displays side-by-side. MLR 7 reveals how physical equal groupings make the written ratio visible.",
            "avoid_short": "Rearranging physical items for the student.",
            "glyph_observation": "RANDOM DISPLAY ARRANGEMENT",
            "glyph_move": "COMPARE DISPLAYS · CONNECT GROUPINGS",
            "mlr": {
              "number": 7,
              "name": "Compare and Connect"
            }
          },
          {
            "observation_short": "Describing collection ratios using everyday words instead of colon or 'for every' syntax.",
            "friction_type": "language",
            "move_short": "Have students read displays to peers and revise statements. MLR 1 builds precision using formal ratio colon notation.",
            "avoid_short": "Accepting incomplete verbal descriptions without revision.",
            "has_proficiency_variants": true,
            "glyph_observation": "INFORMAL RATIO SYNTAX",
            "glyph_move": "PEER REVIEW · REVISE NOTATION",
            "mlr": {
              "number": 1,
              "name": "Stronger and Clearer Each Time"
            }
          }
        ],
        "synthesis_short": "Show two different displays for the same collection. Ask: how do both represent the same ratio?"
      }
    ],
    "mlr_legend": [
      {
        "mlr": {
          "number": 1,
          "name": "Stronger and Clearer Each Time"
        },
        "one_line_cue": "Share draft with peer, gather feedback, write stronger."
      },
      {
        "mlr": {
          "number": 2,
          "name": "Collect and Display"
        },
        "one_line_cue": "Capture student language publicly to refine and reuse."
      },
      {
        "mlr": {
          "number": 3,
          "name": "Critique, Correct, and Clarify"
        },
        "one_line_cue": "Display flawed anonymous work for partner revision."
      },
      {
        "mlr": {
          "number": 7,
          "name": "Compare and Connect"
        },
        "one_line_cue": "Examine two representations side-by-side to find connections."
      }
    ],
    "lesson_synthesis_short": "Surface student displays showing circles to squares. Ask: how does changing the written word order change the ratio's meaning?"
  },
  "lesson_synthesis": {
    "prompt": "Consolidate the lesson by displaying an image of 4 squares and 6 circles. Ask: 'If I say the ratio of circles to squares is 4 to 6, what is wrong with my statement and how do we fix it?' Guide students to state that the order of the numbers must match the order of the categories (6 to 4), and have students chorally read the corrected sentence frames: 'The ratio of circles to squares is 6 to 4' and 'For every 3 circles there are 2 squares.'",
    "builds_on": [
      "Activity 1.1: Students established that items can be sorted into distinct category counts.",
      "Activity 1.2: Students learned that ratio statements require matching word and number order.",
      "Activity 1.3: Students connected concrete visual groupings directly to written ratio sentences."
    ]
  },
  "selection": {
    "lesson_targets": [
      "I can write or say a sentence that describes a ratio",
      "I know how to say words and numbers in the correct order to accurately describe the ratio"
    ],
    "targets_published": true,
    "standing_supports": true,
    "activities": [
      {
        "activity_id": "1.1",
        "activity_outcome": "Students describe different ways to sort a set of geometric figures by category.",
        "outcome_type": "formulate_precisely",
        "resolved_outcome_type": "formulate_precisely",
        "affordances": {
          "flawed_sample_provided": false,
          "error_harvestable": true,
          "splittable_materials": false,
          "student_products_differ": true,
          "public_share_step": true,
          "frames_already_printed": false,
          "context_word_count": 38
        },
        "function": "Setup",
        "lead": 2,
        "second": null,
        "because": "Students are producing the informal wording this lesson will make precise — capture it now so the class can refine and reuse it.",
        "teacher_prep": null
      },
      {
        "activity_id": "1.2",
        "activity_outcome": "Students write sentences describing ratios in a shared collection using precise word and number order.",
        "outcome_type": "formulate_precisely",
        "resolved_outcome_type": "formulate_precisely",
        "affordances": {
          "flawed_sample_provided": false,
          "error_harvestable": true,
          "splittable_materials": false,
          "student_products_differ": true,
          "public_share_step": false,
          "frames_already_printed": true,
          "context_word_count": 82
        },
        "function": "Crux",
        "lead": 3,
        "second": 1,
        "because": "This is where the precise form is first attempted, so the characteristic error is worth surfacing and correcting together before it sets.",
        "teacher_prep": "No wrong answer is printed — capture one from the room. While students work, copy a typical error onto the board anonymously and have the class repair it."
      },
      {
        "activity_id": "1.3",
        "activity_outcome": "Students write ratio sentences and make visual displays representing relationships in their own collections.",
        "outcome_type": "connect_representations",
        "resolved_outcome_type": "connect_representations",
        "affordances": {
          "flawed_sample_provided": false,
          "error_harvestable": true,
          "splittable_materials": false,
          "student_products_differ": true,
          "public_share_step": true,
          "frames_already_printed": true,
          "context_word_count": 95
        },
        "function": "Application",
        "lead": 7,
        "second": 1,
        "because": "The outcome is seeing what two approaches share, which only happens when they are put side by side and the connection is named.",
        "teacher_prep": null
      }
    ]
  },
  "provenance": {
    "pipeline_version": "2026-08-22.1+08fb3f478d223abc",
    "cache_key": "6dbbdc789323b58e4c22cf11d5a03a4e",
    "provider": "gemini",
    "model": "gemini-3.7-flash",
    "thinking": "medium",
    "generated_at": "2026-08-22T18:39:59.833Z",
    "served_from_cache": false
  }
} as unknown as LessonData;
