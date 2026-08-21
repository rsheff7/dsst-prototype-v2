import { LessonData } from './types';

// ---------------------------------------------------------------------------
// Demo lesson — IM Grade 6, Unit 2, Lesson 1 "Introducing Ratios and Ratio
// Language". Loaded by the home page sample, /framework, /how-to, /qa, /audit.
//
// PROVENANCE: generated 2026-08-20T23:59:56.978Z by the analyze pipeline on
// gemini/gemini-3.7-flash (thinking=medium), pipeline 2026-08-20.2,
// from "Grade 6 Mathematics, Unit 2.1 - Open Up Resources.pdf".
// Cache key 0ff9011572493ba57c6da260ba2e0835.
//
// Regenerated on the current pipeline rather than carried over: the previous
// Gemini demo predated constrained decoding, so it had numeric meta fields,
// duplicated activity numbers in titles, and MLR chips on only half its
// wristband tiles. This one is schema-constrained end to end.
//
// To refresh: POST the source PDF to /api/analyze and paste the response here.
// ---------------------------------------------------------------------------

export const demoLesson = {
  "meta": {
    "grade": "Grade 6",
    "unit": "Unit 2",
    "lesson_number": "Lesson 1",
    "lesson_title": "Introducing Ratios and Ratio Language",
    "total_time": "~45 min"
  },
  "arc_statement": "Students begin by sorting geometric figures into distinct categories to establish that a single collection can be categorized and counted in multiple ways. In the crux activity, they transition from isolated counts to comparing two distinct groups simultaneously, learning the formal phrasing and notation of ratios where the sequence of words must strictly match the sequence of numbers. Finally, students apply this ratio language to their own physical collections, creating visual arrangements that make the comparative relationship evident.",
  "destination": "Students can describe a relationship between two quantities using ratio language and write ratio statements with words and numbers in matching order.",
  "key_vocabulary": [
    {
      "term": "ratio",
      "definition": "An association between two or more quantities that compares their amounts."
    },
    {
      "term": "for every",
      "definition": "A phrase used to describe how many items in one group correspond to a specific number of items in another group."
    }
  ],
  "activities": [
    {
      "id": "1.1",
      "title": "What Kind and How Many?",
      "function": "Setup",
      "duration": "~10 min",
      "grouping": "Partners",
      "language_demand": "medium",
      "function_summary": "This activity activates prior sorting and counting skills so students can generate distinct category counts from a single set of shapes. It establishes the baseline data needed before students begin comparing two quantities simultaneously. Students see that changing the sorting rule changes the categories and amounts.",
      "learning_target": "Students sort a collection into distinct categories and count the number of objects in each group.",
      "synthesis_prompt": "Synthesize toward sorting into distinct categories by writing the sorting categories students created on the board alongside their counts, pointing to two specific groups (like 4 blue shapes and 2 green shapes), and asking: 'How many items are in each group, and what exact rule separated them?'",
      "is_crux": false,
      "friction_points": [
        {
          "description": "Students create overlapping or ambiguous categories where an object could belong to two groups at once (e.g., 'blue' and 'triangle').",
          "type": "math"
        },
        {
          "description": "Students struggle to verbally describe their third sorting rule using precise attribute terms.",
          "type": "language",
          "mlr": {
            "number": 2,
            "name": "Collect and Display"
          }
        }
      ],
      "success_signals": [
        "Students name unambiguous sorting attributes such as number of sides, color, or area.",
        "Every figure is placed in exactly one category with accurate corresponding counts."
      ],
      "teacher_moves": [
        {
          "text": "Circulate and record the descriptive words students use to categorize figures (e.g., 'quadrilaterals', 'shaded area', 'pointy') onto a visual anchor chart for students to reference.",
          "mlr": {
            "number": 2,
            "name": "Collect and Display"
          }
        },
        {
          "text": "When a student names an informal category, revoice their statement using precise geometric language and ask them to confirm if it matches their rule.",
          "mlr": {
            "number": 8,
            "name": "Discussion Supports"
          }
        }
      ],
      "causal_link": "Establishes category counts that students will compare as paired quantities in Activity 1.2.",
      "extension": "Challenge students to find a sorting rule that splits the figures into exactly two groups of equal count."
    },
    {
      "id": "1.2",
      "title": "The Teacher’s Collection",
      "function": "Crux",
      "duration": "~15 min",
      "grouping": "Whole group",
      "language_demand": "high",
      "function_summary": "This is the core conceptual moment where students move from listing single counts to expressing the relationship between two quantities together. It introduces the term 'ratio' and the critical convention that the order of words must match the order of numbers. Mastering this prevents misrepresenting relationships in all future ratio work.",
      "learning_target": "Students write ratio statements comparing two categories using 'to', colon notation, or 'for every' with quantities in the correct order.",
      "synthesis_prompt": "Synthesize toward writing ratio statements with matched word-number order by displaying two contrasting sentences for the collection—'The ratio of blue to red is 3 to 5' and 'The ratio of blue to red is 5 to 3'—and asking students to point to the objects and explain which sentence matches the collection and why.",
      "is_crux": true,
      "friction_points": [
        {
          "description": "Students reverse the numerical values in a ratio statement, writing the larger count first regardless of the order the categories were named.",
          "type": "language-math",
          "mlr": {
            "number": 1,
            "name": "Stronger and Clearer Each Time"
          }
        },
        {
          "description": "Students interpret the colon notation ':' as a division operation or subtraction symbol rather than as comparison punctuation read as 'to'.",
          "type": "language",
          "mlr": {
            "number": 8,
            "name": "Discussion Supports"
          }
        }
      ],
      "success_signals": [
        "Students match the first-named category to the first number and the second-named category to the second number.",
        "Students correctly read aloud '3:5' using the word 'to' rather than 'colon' or 'divided by'."
      ],
      "teacher_moves": [
        {
          "text": "Direct partners to read their ratio sentences aloud to each other, listen for matching order between category names and numbers, and refine their written drafts based on peer feedback.",
          "mlr": {
            "number": 1,
            "name": "Stronger and Clearer Each Time"
          }
        },
        {
          "text": "Provide choral reading of ratio statements (e.g., 'The ratio of cats to dogs is three to five') pointing to each word and symbol in sequence on the board.",
          "mlr": {
            "number": 8,
            "name": "Discussion Supports"
          }
        }
      ],
      "causal_link": "Provides the explicit language structures and notation required to complete the independent display task in Activity 1.3.",
      "extension": "Ask students to write a ratio statement comparing one category to the total number of items in the entire collection."
    },
    {
      "id": "1.3",
      "title": "The Student’s Collection",
      "function": "Application",
      "duration": "~20 min",
      "grouping": "Small groups",
      "language_demand": "high",
      "function_summary": "Students apply the newly acquired ratio phrasing and notation to hands-on collections, reinforcing order accuracy through peer presentation and visual arrangement. It bridges abstract notation with concrete spatial groupings. Creating a display allows peers to verify whether statements accurately describe physical quantities.",
      "learning_target": "Students create a visual display and write accurate ratio statements describing relationships within their own sorted collections.",
      "synthesis_prompt": "Synthesize toward creating accurate visual ratio displays by showcasing a student poster with grouped items and asking: 'How does the way these objects are arranged help anyone immediately read the ratio of circles to triangles without counting one by one?'",
      "is_crux": false,
      "friction_points": [
        {
          "description": "Students arrange items in their display in a jumble that obscures the paired comparison rather than grouping them to show the ratio.",
          "type": "math"
        },
        {
          "description": "Students struggle to write three distinct ratio statements for their three categories without repeating the same pair in reverse order.",
          "type": "language-math",
          "mlr": {
            "number": 1,
            "name": "Stronger and Clearer Each Time"
          }
        }
      ],
      "success_signals": [
        "Students create visual groups (e.g., clusters of 2 blue for every 1 yellow) that visually substantiate their written ratio sentences.",
        "Students write ratio statements matching all three taught structures ('to', ':', 'for every') with accurate numerical order."
      ],
      "teacher_moves": [
        {
          "text": "Have pairs exchange visual displays and sentences, coaching each other to clarify any mismatch between the physical layout and the written ratio statement before finalizing their posters.",
          "mlr": {
            "number": 1,
            "name": "Stronger and Clearer Each Time"
          }
        },
        {
          "text": "Post fillable sentence frames on the board ('For every ___ [category A], there are ___ [category B]') and point to them during small group coaching.",
          "mlr": {
            "number": 8,
            "name": "Discussion Supports"
          }
        }
      ],
      "causal_link": "Consolidates hands-on sorting and ratio notation to prepare for equivalent ratio representations in Lesson 2.",
      "extension": "Have students write 'for every' statements that scale down their collection (e.g., from 6 to 3 down to '2 for every 1')."
    }
  ],
  "adaptation_guardrails": {
    "mathematical_purpose": "To understand a ratio as an association between two quantities where the order of words explicitly dictates the order of values.",
    "safe_to_change": [
      "The physical objects used in the collections (e.g., colored tiles, pattern blocks, counters, classroom stationery).",
      "The total count of items in the collections, provided numbers remain accessible whole numbers under 20.",
      "Whether the visual display is made on chart paper, personal whiteboards, or shared digital slides."
    ],
    "do_not_remove": [
      {
        "text": "Do not remove the partner verbal read-aloud where students check word-and-number order aloud.",
        "mlr": {
          "number": 1,
          "name": "Stronger and Clearer Each Time"
        }
      },
      {
        "text": "Do not remove the explicit requirement to write ratios using all three forms: 'to', colon notation, and 'for every'."
      },
      {
        "text": "Do not remove the visual grouping step where students physically arrange objects to match their ratio sentences."
      }
    ],
    "rigor_check": "If a student writes 'The ratio of dogs to cats is 5:2', can they point to exactly 5 dogs and 2 cats, or did they write 5 first simply because 5 is the bigger number?",
    "by_proficiency": {
      "emerging": {
        "text": "Provide pre-printed bilingual labels for categories and color-coded sentence frames where the box for Category A color-matches the blank for Quantity A.",
        "mlr": {
          "number": 8,
          "name": "Discussion Supports"
        }
      },
      "developing": {
        "text": "Provide sentence starters and have students underline category names in one color and corresponding numbers in the same color before reading to a peer.",
        "mlr": {
          "number": 1,
          "name": "Stronger and Clearer Each Time"
        }
      },
      "expanding": {
        "text": "Prompt students to articulate the relationship using all three formats ('to', ':', 'for every') and explain how the meaning changes if the category order is inverted.",
        "mlr": {
          "number": 8,
          "name": "Discussion Supports"
        }
      }
    }
  },
  "anticipated_thinking": {
    "orientation": "Students bring strong intuitive sorting and counting skills from everyday experiences with objects, shapes, and colors. Their main challenge will be preserving the precise order of quantities when translating visual groupings into formal ratio language and colon notation.",
    "activities": [
      {
        "activity_id": "1.1",
        "patterns": [
          {
            "label": "Sorting by obvious visual attributes",
            "frequency": "most students",
            "type": "on-track",
            "description": "Students group shapes by color (e.g., blue vs. green) or shape type (e.g., triangles vs. squares) and count the totals accurately.",
            "move": "Affirm their categories and prompt them to look for less obvious attributes like area or number of sides.",
            "is_mll_specific": false
          },
          {
            "label": "Using informal descriptive language for sorting rules",
            "frequency": "some students",
            "type": "language-math",
            "description": "Multilingual students use phrases like 'the big pointy ones' or 'dark pieces' instead of geometric category names like 'large triangles' or 'shaded figures'.",
            "move": "Use MLR 2 (Collect and Display) to write student phrases on the board alongside formal terms like 'triangles' and 'area in square units', then invite students to refer to the display when explaining their categories.",
            "is_mll_specific": true,
            "mlr": {
              "number": 2,
              "name": "Collect and Display"
            }
          },
          {
            "label": "Overlapping or vague sorting categories",
            "frequency": "watch for this",
            "type": "partial",
            "description": "Students create categories where some shapes fit into more than one group or some shapes are left out entirely.",
            "move": "Point to an unplaced or double-counted shape and ask which group it belongs to, prompting them to refine category boundaries so every object has exactly one group.",
            "is_mll_specific": false
          }
        ],
        "sentence_frames": [
          {
            "frame": "We sorted the figures into _____ groups based on _____.",
            "mlr": {
              "number": 8,
              "name": "Discussion Supports"
            }
          },
          {
            "frame": "There are _____ figures in the _____ category and _____ figures in the _____ category.",
            "mlr": {
              "number": 2,
              "name": "Collect and Display"
            }
          }
        ],
        "questions_to_listen_for": [
          "What rule did you use to decide if a shape belongs in this group?",
          "How many total groups do you have when you sort by area versus when you sort by color?"
        ]
      },
      {
        "activity_id": "1.2",
        "patterns": [
          {
            "label": "Flipping quantity order in ratio sentences",
            "frequency": "most students",
            "type": "misconception",
            "description": "A student writes 'The ratio of blue cubes to yellow cubes is 3 to 7' when the collection actually has 7 blue cubes and 3 yellow cubes.",
            "move": "Point to the words and numbers simultaneously and ask: 'How many blue cubes are there? Which number needs to come first to match the word blue?'",
            "is_mll_specific": false
          },
          {
            "label": "Translating words to colon notation accurately",
            "frequency": "some students",
            "type": "on-track",
            "description": "Students correctly write 'The ratio of category A to category B is 5 : 2' preserving the exact sequence of categories.",
            "move": "Ask the student to state the relationship using 'for every' language to build connections across different ratio representations.",
            "is_mll_specific": false
          },
          {
            "label": "Drafting and refining ratio comparison statements",
            "frequency": "some students",
            "type": "language-math",
            "description": "Multilingual students write an incomplete comparison like '7 blue and 3 yellow' instead of using full ratio sentence structures.",
            "move": "Run MLR 1 (Stronger and Clearer Each Time) by having students share their draft with a partner, ask 'What are you comparing?', and write a revised draft using the frame 'The ratio of _____ to _____ is _____ to _____.'",
            "is_mll_specific": true,
            "mlr": {
              "number": 1,
              "name": "Stronger and Clearer Each Time"
            }
          }
        ],
        "sentence_frames": [
          {
            "frame": "The ratio of [Category A] to [Category B] is _____ to _____.",
            "mlr": {
              "number": 8,
              "name": "Discussion Supports"
            }
          },
          {
            "frame": "For every _____ [Category A], there are _____ [Category B].",
            "mlr": {
              "number": 1,
              "name": "Stronger and Clearer Each Time"
            }
          },
          {
            "frame": "The ratio of [Category A] to [Category B] is _____ : _____."
          }
        ],
        "questions_to_listen_for": [
          "Which quantity did you name first in your sentence, and does the first number match it?",
          "How would your ratio statement change if you switched the order of the categories?"
        ]
      },
      {
        "activity_id": "1.3",
        "patterns": [
          {
            "label": "Creating matching visual arrangements and ratio statements",
            "frequency": "most students",
            "type": "on-track",
            "description": "Students organize physical objects into distinct groups (e.g., 6 buttons and 2 paperclips) and write 'The ratio of buttons to paperclips is 6 to 2' with an aligned visual display.",
            "move": "Challenge students to group their items into equal sub-piles to see if they can find a 'for every' statement like 'for every 3 buttons there is 1 paperclip'.",
            "is_mll_specific": false
          },
          {
            "label": "Revising partner descriptions for precision",
            "frequency": "some students",
            "type": "language-math",
            "description": "Multilingual students struggle to explain why their poster display matches their written ratio statement to a peer.",
            "move": "Use MLR 1 (Stronger and Clearer Each Time): have students point to their visual groups while reading their ratio statement to a partner, listen to partner feedback on clarity, and refine their display label.",
            "is_mll_specific": true,
            "mlr": {
              "number": 1,
              "name": "Stronger and Clearer Each Time"
            }
          },
          {
            "label": "Writing part-to-whole without identifying the whole",
            "frequency": "watch for this",
            "type": "partial",
            "description": "A student compares one category to the total collection (e.g., '4 red out of 10 total') but writes it using 'to' without naming the second category as 'total items'.",
            "move": "Ask: 'What does the 10 represent? Is it another group of items, or all the items together? Let us label what both numbers represent.'",
            "is_mll_specific": false
          }
        ],
        "sentence_frames": [
          {
            "frame": "In our collection, the ratio of _____ to _____ is _____ : _____.",
            "mlr": {
              "number": 8,
              "name": "Discussion Supports"
            }
          },
          {
            "frame": "Our visual display shows that for every _____ [items], there are _____ [items].",
            "mlr": {
              "number": 1,
              "name": "Stronger and Clearer Each Time"
            }
          }
        ],
        "questions_to_listen_for": [
          "How does your visual display show the reader which group comes first in your ratio?",
          "If someone only looked at your numbers, would they know what each number measures?"
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
            "scenario_type": "common-error",
            "label": "Overlapping sorting categories",
            "interpretation": "A student creates categories that are not mutually exclusive, such as sorting shapes into 'triangles' and 'blue shapes'. They double-count a blue triangle, which creates contradictory total counts when comparing category sizes.",
            "is_mll": false,
            "flat_move": {
              "move": "Point to the overlapping item and ask which single group it belongs to so each shape is counted exactly once.",
              "avoid": "Telling the student which sorting rule to use or fixing the categories for them.",
              "nonverbal": "Pick up the blue triangle and place it between the two category piles.",
              "say": "If we count this triangle in the blue pile and also in the triangle pile, we count it twice. How can we define our categories so every shape has only one home?"
            },
            "proficiency_moves": null,
            "mll_framework_note": null,
            "proficiency_divergence_note": null
          },
          {
            "scenario_type": "partial-understanding",
            "label": "Using everyday descriptors instead of geometric attributes for sorting",
            "interpretation": "A student sorts by informal attributes like 'pointy ones' or 'big ones' and hesitates when asked to name the category label. They understand the visual sorting rule but lack the academic vocabulary to name it precisely.",
            "is_mll": true,
            "flat_move": null,
            "proficiency_moves": {
              "emerging": {
                "move": "Write the student's informal word alongside a small sketch of the attribute on the public anchor chart, then point and say the formal term.",
                "avoid": "Correcting the student's speech aloud or rejecting the sorting method.",
                "nonverbal": "Point to the 3-sided shape, trace the three sides with a finger, and write 'triangles (3 sides)' on the display board.",
                "say": "You sorted by pointy shapes. These have 3 sides: triangles."
              },
              "developing": {
                "move": "Reference the Collect and Display board to help the student substitute their informal phrase with a formal mathematical descriptor.",
                "avoid": "Letting the student move on without saying or recording the formal category name.",
                "nonverbal": "Point to the category header in their workbook and then point to the corresponding word on the chart.",
                "say": "You called these 'four-corner shapes.' Look at our chart: what mathematical name can we write in your table header?"
              },
              "expanding": {
                "move": "Ask the student to state their sorting rule to a partner using both the visual feature and the geometric term.",
                "avoid": "Over-prompting when the student can self-correct from the displayed vocabulary.",
                "nonverbal": "Nod toward the displayed vocabulary list while listening to the partner exchange.",
                "say": "Use the word 'quadrilateral' or 'number of sides' to describe your rule to your partner."
              }
            },
            "mll_framework_note": null,
            "proficiency_divergence_note": null,
            "mlr": {
              "number": 2,
              "name": "Collect and Display"
            }
          },
          {
            "scenario_type": "productive-insight",
            "label": "Sorting by multiple combined geometric attributes",
            "interpretation": "A student sorts the figures by a combination of two properties, such as 'shaded quadrilaterals' versus 'unshaded quadrilaterals' versus 'triangles'. This demonstrates strong categorization skills that set up multi-way ratio comparisons.",
            "is_mll": false,
            "flat_move": {
              "move": "Validate the multi-attribute sorting and ask the student to record the exact count for each distinct group in their table.",
              "avoid": "Telling the student to simplify their sorting to only one basic attribute like color.",
              "nonverbal": "Tap each of the student's three distinct piles with an approving nod.",
              "say": "You used both shading and number of sides to create three unique categories. How many shapes are in each exact group?"
            },
            "proficiency_moves": null,
            "mll_framework_note": null,
            "proficiency_divergence_note": null
          },
          {
            "scenario_type": "on-track",
            "label": "Accurate sorting by single attribute with matching table counts",
            "interpretation": "The student sorts the collection by a clear single attribute (e.g., color: 4 blue, 6 yellow) and fills out the category name and amount rows accurately.",
            "is_mll": false,
            "flat_move": {
              "move": "Have the student confirm that the sum of the amounts in their table equals the total number of items in the collection.",
              "avoid": "Moving on immediately without verifying total count.",
              "nonverbal": "Point to the counts in the table, then point to the full collection.",
              "say": "Your categories are clear. Add your category numbers together—does that match the total number of shapes on the page?"
            },
            "proficiency_moves": null,
            "mll_framework_note": null,
            "proficiency_divergence_note": null
          }
        ]
      },
      {
        "activity_id": "1.2",
        "scenarios": [
          {
            "scenario_type": "common-error",
            "label": "Reversing the order of numbers in a ratio statement",
            "interpretation": "The student writes 'The ratio of blue cubes to yellow cubes is 3 to 5' when there are actually 5 blue cubes and 3 yellow cubes. They put the smaller or larger number first out of habit rather than matching the order of the nouns in the sentence.",
            "is_mll": false,
            "flat_move": {
              "move": "Point to the words in the sentence and ask the student to match each category name to its number from the table in the exact order written.",
              "avoid": "Erasing and swapping the numbers for the student.",
              "nonverbal": "Touch the word 'blue', then touch the number '3'; touch the word 'yellow', then touch the number '5'. Pause with an expectant look.",
              "say": "In your sentence, 'blue' comes first, but in your table, how many blue cubes are there? In a ratio, the numbers must match the exact order of the words."
            },
            "proficiency_moves": null,
            "mll_framework_note": null,
            "proficiency_divergence_note": null
          },
          {
            "scenario_type": "productive-struggle",
            "label": "Drafting ratio statements using non-standard comparative language",
            "interpretation": "A student writes 'There are 2 more blue cubes than yellow cubes' or 'Blue is bigger than yellow.' They recognize the relationship between two quantities but default to additive comparison or vague language rather than ratio syntax.",
            "is_mll": true,
            "flat_move": null,
            "proficiency_moves": {
              "emerging": {
                "move": "Provide the printed sentence frame 'The ratio of ___ to ___ is ___ to ___' and physically place colored cubes directly onto the blanks to scaffold the revised draft.",
                "avoid": "Telling the student additive comparison is 'wrong' without showing how ratios compare both quantities simultaneously.",
                "nonverbal": "Point to the student's first draft, point to the ratio sentence starter on the display, and point to the two piles of objects.",
                "say": "You found that there are more blue cubes. Now let's describe both quantities together. Complete this sentence: 'The ratio of blue to yellow is ___ to ___.'"
              },
              "developing": {
                "move": "Have the student read their first draft to a partner, listen to the partner's feedback on whether it uses ratio words ('to' or 'for every'), and write a stronger second draft.",
                "avoid": "Writing the revised draft for the student.",
                "nonverbal": "Gesture between the two partners, then point to the second draft space on the worksheet.",
                "say": "Read your draft to your partner. Partner, ask: 'What is the ratio using the word *to*?' Then write your second draft."
              },
              "expanding": {
                "move": "Ask the student to write their comparison in two different ratio formats (colon notation and 'for every') to strengthen their mathematical communication.",
                "avoid": "Accepting only one basic sentence when the student is ready to connect multiple notations.",
                "nonverbal": "Underline the colon ':' on the reference chart.",
                "say": "You compared them by subtraction. Now write a stronger statement that describes the relationship as a ratio using colon notation."
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
            "scenario_type": "partial-understanding",
            "label": "Struggling with the phrase 'for every' in ratio descriptions",
            "interpretation": "A student successfully writes 'The ratio of red to green is 4 to 2' using 'to', but freezes or writes an incomplete phrase when trying to use 'for every'. They do not see that 'for every' pairs a specific number of one group with a specific number of another group.",
            "is_mll": true,
            "flat_move": null,
            "proficiency_moves": {
              "emerging": {
                "move": "Use physical grouping to demonstrate the pairing, then chorally recite the sentence frame while pointing to each group.",
                "avoid": "Leaving the student to decipher the sentence frame without concrete physical grouping.",
                "nonverbal": "Group 4 red counters and 2 green counters together into a single circle on the desk, pointing to 4 red, then 2 green.",
                "say": "Look: For every 4 red counters, there are 2 green counters. Say it with me: 'For every 4 red, there are 2 green.'"
              },
              "developing": {
                "move": "Provide the sentence starter with explicit noun placeholders: 'For every [number] [category 1], there are [number] [category 2]' and ask the student to read it aloud.",
                "avoid": "Allowing the student to drop the category nouns and only say numbers.",
                "nonverbal": "Tap the first blank in the sentence frame, tap category 1, tap the second blank, tap category 2.",
                "say": "Use this sentence starter: 'For every ___ red cubes, there are ___ green cubes.' Fill in the numbers from your table."
              },
              "expanding": {
                "move": "Revoice the student's statement and ask them to explain how 'for every' conveys the same information as the colon notation.",
                "avoid": "Treating 'for every' as a completely disconnected concept from colon notation.",
                "nonverbal": "Point back and forth between the colon notation and the 'for every' sentence on their page.",
                "say": "You wrote 4:2. How does the sentence 'For every 4 red, there are 2 green' tell someone the exact same mathematical story?"
              }
            },
            "mll_framework_note": null,
            "proficiency_divergence_note": null,
            "mlr": {
              "number": 8,
              "name": "Discussion Supports"
            }
          },
          {
            "scenario_type": "productive-insight",
            "label": "Identifying a simplified unit ratio in the collection",
            "interpretation": "A student looking at 6 pencils and 2 erasers writes 'For every 3 pencils, there is 1 eraser' rather than just '6 to 2'. They have noticed the equal grouping structure within the collection.",
            "is_mll": false,
            "flat_move": {
              "move": "Highlight the student's grouping strategy and have them physically arrange the objects into equal subgroups to show the class during synthesis.",
              "avoid": "Telling the student they must only use the raw total counts 6 and 2.",
              "nonverbal": "Separate the 6 pencils and 2 erasers into 2 equal piles, each containing 3 pencils and 1 eraser.",
              "say": "You noticed that 6 to 2 can be grouped as 3 pencils with 1 eraser, and another 3 pencils with 1 eraser. That is a valid ratio description. Show me how you grouped them."
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
            "scenario_type": "on-track",
            "label": "Writing multiple ratio statements with distinct notation formats",
            "interpretation": "The student creates 3 distinct categories from their collection, accurately counts them, and writes two correct ratio sentences using different formats ('to' and ':') with matching word-number ordering.",
            "is_mll": false,
            "flat_move": {
              "move": "Confirm the accuracy of both statements and prompt the student to begin designing their visual display so that the ratio relationship is immediately visible to someone walking by.",
              "avoid": "Letting them draw a disorganized pile of items for their poster.",
              "nonverbal": "Check off the two written statements in their workbook with a nod.",
              "say": "Your statements are completely accurate. As you make your visual display, how can you arrange the items so anyone can see that ratio without counting one by one?"
            },
            "proficiency_moves": null,
            "mll_framework_note": null,
            "proficiency_divergence_note": null
          },
          {
            "scenario_type": "common-error",
            "label": "Confusing part-to-part with part-to-total without naming the total",
            "interpretation": "A student with 3 red buttons, 5 blue buttons, and 2 green buttons (total 10) writes 'The ratio of red buttons to blue buttons is 3 to 10.' They wrote the total count in place of the second category's count without updating the category name.",
            "is_mll": false,
            "flat_move": {
              "move": "Point to the number 10 in their sentence and ask what category that number represents in their collection.",
              "avoid": "Simply telling the student '10 is the total, change it to 5.'",
              "nonverbal": "Point to the word 'blue buttons', then point to the count for blue buttons (5) in their table, then point to the written number '10'.",
              "say": "You wrote 'blue buttons', but you wrote the number 10. Does 10 tell us the number of blue buttons, or the number of all the buttons together?"
            },
            "proficiency_moves": null,
            "mll_framework_note": null,
            "proficiency_divergence_note": null
          },
          {
            "scenario_type": "productive-struggle",
            "label": "Creating a disorganized visual display where the ratio is obscured",
            "interpretation": "A student scatters all their items randomly on the poster paper. The items are all present, but a viewer cannot see the ratio relationship without counting every single object individually.",
            "is_mll": false,
            "flat_move": {
              "move": "Ask the student how someone looking at the poster from across the room could see the ratio comparison without counting every single item.",
              "avoid": "Rearranging or redrawing the poster items for the student.",
              "nonverbal": "Stand back 4 feet from the poster, squint, and gesture across the scattered items.",
              "say": "If I stand back here, it looks like a big pile. How can you arrange your items in distinct rows or groups so the ratio of 4 to 2 is obvious immediately?"
            },
            "proficiency_moves": null,
            "mll_framework_note": null,
            "proficiency_divergence_note": null
          },
          {
            "scenario_type": "partial-understanding",
            "label": "Difficulty refining poster explanations during partner exchange",
            "interpretation": "During the peer review of visual displays, a student points to their poster and simply says 'It is 6 and 4' without using ratio language or explaining how the display proves the statement.",
            "is_mll": true,
            "flat_move": null,
            "proficiency_moves": {
              "emerging": {
                "move": "Model pointing to the first group on the poster and reading the sentence starter, then have the student repeat while pointing.",
                "avoid": "Allowing the partner exchange to happen silently without oral practice.",
                "nonverbal": "Point to group 1 on the poster, say '6 squares', point to group 2, say '4 circles', point to the written ratio '6:4'.",
                "say": "Point and say: 'The ratio of squares to circles is 6 to 4.'"
              },
              "developing": {
                "move": "Provide structured partner interview prompts: Partner A asks 'What ratio does your display show?' and Partner B uses the response frame 'My display shows a ratio of ___ to ___ because...'",
                "avoid": "Letting students just read the numbers off the table without connecting to the visual display.",
                "nonverbal": "Hand each partner an interview prompt card.",
                "say": "Ask your partner: 'How does your display show that ratio?' Use the sentence starter to explain your thinking."
              },
              "expanding": {
                "move": "Have the student listen to partner feedback, revise their verbal explanation to incorporate precise terminology ('for every', 'ratio', 'quantities'), and deliver a stronger second explanation.",
                "avoid": "Accepting the first draft explanation when the student has the capacity for more precise mathematical argumentation.",
                "nonverbal": "Tap the word bank on the board containing 'ratio', 'for every', and 'comparison'.",
                "say": "Now that your partner asked for clarification, explain your poster a second time using the phrase 'for every' to make your description even clearer."
              }
            },
            "mll_framework_note": null,
            "proficiency_divergence_note": null,
            "mlr": {
              "number": 1,
              "name": "Stronger and Clearer Each Time"
            }
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
          "receptive": "Read sorting criteria (color, area) and listen to a partner describe their sorting rules.",
          "productive": "Name sorting categories and state group counts aloud and in writing.",
          "interactive": "Negotiate sorting categories and verify object counts collaboratively with a partner.",
          "everyday_to_academic_bridge": "Bridge informal descriptive words (e.g., 'size', 'look like squares') to mathematical categories ('area', 'number of sides', 'color groups').",
          "elsf_guidelines_applied": [
            1,
            2,
            6
          ]
        },
        "functional_language": {
          "language_functions": [
            "categorize objects",
            "describe attributes",
            "count quantities"
          ],
          "example_phrases": [
            "We sorted the figures by...",
            "There are [number] groups of...",
            "Each group has [number] shapes."
          ],
          "l1_bridge": "Connect the everyday word 'sort' to cognates like 'clasificar' or 'ordenar' to clarify grouping by shared traits.",
          "elsf_guidelines_applied": [
            1,
            3,
            12
          ]
        }
      },
      {
        "activity_id": "1.2",
        "language_demands": {
          "receptive": "Read formal ratio sentence frames and listen to teacher modeling of category-to-quantity relationships.",
          "productive": "Write and speak complete ratio statements using 'to', colon notation, and 'for every' with matching order.",
          "interactive": "Compare written ratio statements with a partner to check whether named categories match the order of quantities.",
          "everyday_to_academic_bridge": "Bridge conversational comparison ('more red than blue') to structured relational statements ('the ratio of red items to blue items is 3 to 2').",
          "elsf_guidelines_applied": [
            1,
            6,
            7
          ]
        },
        "functional_language": {
          "language_functions": [
            "compare quantities",
            "express a ratio",
            "verify order of terms"
          ],
          "example_phrases": [
            "The ratio of [category A] to [category B] is [X] to [Y].",
            "There are [X] [category A] for every [Y] [category B].",
            "The ratio is [X] : [Y]."
          ],
          "l1_bridge": "Connect 'for every' to phrases like 'por cada' in Spanish to emphasize the paired association between two counts.",
          "elsf_guidelines_applied": [
            1,
            3,
            7,
            12
          ]
        }
      },
      {
        "activity_id": "1.3",
        "language_demands": {
          "receptive": "Read peers' visual displays and listen to their spoken ratio descriptions.",
          "productive": "Write ratio sentences and label visual displays with category names and counts.",
          "interactive": "Present visual displays to group members and critique whether statements match the displayed groupings.",
          "everyday_to_academic_bridge": "Bridge informal physical grouping ('these go together') to formal visual and symbolic ratio representations ('for every 2 squares there is 1 circle').",
          "elsf_guidelines_applied": [
            1,
            4,
            6
          ]
        },
        "functional_language": {
          "language_functions": [
            "justify visual representations",
            "describe part-to-part relationships",
            "refine written statements"
          ],
          "example_phrases": [
            "My display shows that for every [X] [items], there are [Y] [items].",
            "The ratio of [category 1] to [category 2] is [X] to [Y].",
            "The colon represents the word 'to'."
          ],
          "l1_bridge": "Use shared nonverbal gestures (grouping items with two hands) alongside home-language partner checks to confirm understanding of paired quantities.",
          "elsf_guidelines_applied": [
            3,
            4,
            12
          ]
        }
      }
    ]
  },
  "mlr_inference": {
    "activities": [
      {
        "activity_id": "1.1",
        "language_work": "Students use informal descriptive language to categorize geometric figures and communicate their sorting rules to a partner.",
        "mlrs": [
          {
            "number": 2,
            "name": "Collect and Display",
            "why_here": "Capture students' informal sorting vocabulary (such as 'pointy shapes', 'big ones', or 'blue figures') on a class chart. Displaying these terms alongside formal geometric and quantity language builds a shared reference for classifying groups."
          },
          {
            "number": 8,
            "name": "Discussion Supports",
            "why_here": "Provide sentence starters and use teacher revoicing as partners discuss sorting categories. This helps students clearly connect category attributes to counts before introducing formal ratio statements."
          }
        ]
      },
      {
        "activity_id": "1.2",
        "language_work": "Students learn and practice specific ratio sentence frames, mapping category order directly to number order in written and spoken forms.",
        "mlrs": [
          {
            "number": 1,
            "name": "Stronger and Clearer Each Time",
            "why_here": "Students draft their first ratio sentence independently, share with a peer to check number-to-category order, and revise for clarity. The partner feedback cycle ensures students catch reversed quantities before whole-class synthesis."
          },
          {
            "number": 8,
            "name": "Discussion Supports",
            "why_here": "Use choral repetition and structured sentence frames (such as 'The ratio of ___ to ___ is ___ to ___') during whole-class demonstration. Pointing to items while reciting embeds the syntax and rhythm of ratio statements."
          }
        ]
      },
      {
        "activity_id": "1.3",
        "language_work": "Students generate their own ratio statements from concrete collections and explain how their visual display represents those comparisons.",
        "mlrs": [
          {
            "number": 1,
            "name": "Stronger and Clearer Each Time",
            "why_here": "Students draft ratio statements about their collections, receive peer feedback on whether their visual display matches the written order, and refine their final captions. This iterative sharing cements the link between physical groupings and linguistic order."
          },
          {
            "number": 8,
            "name": "Discussion Supports",
            "why_here": "Provide printed sentence strips and gesture prompts (pointing from pile to pile while reading the ratio) during small-group sharing. This supports students in verbalizing multi-word ratio structures accurately."
          }
        ]
      }
    ]
  },
  "wristband": {
    "arc_one_line": "Sort objects into groups, then describe category comparisons using precise ratio language.",
    "preflight": [
      "Prepare collection bins and display visual sorting sentence frames prominently.",
      "Pair students intentionally to support mathematical dialogue and home-language bridging.",
      "Create anchor chart showing category order matching ratio number order."
    ],
    "top_signals": [
      "Names category names in exact sentence order.",
      "Matches colon notation order to category words.",
      "Uses 'for every' to relate both quantities."
    ],
    "top_frictions": [
      "Reverses number order to put larger first.",
      "Compares one category to total collection count.",
      "Omits category labels in spoken ratio descriptions."
    ],
    "activities": [
      {
        "activity_id": "1.1",
        "tiles": [
          {
            "observation_short": "Ambiguous sort rules cause group count confusion; categorizes without clear attribute definitions.",
            "friction_type": "language",
            "move_short": "Capture student sorting categories on board; prompt pairs to clarify labels so attributes like color and shape stay clearly distinguished.",
            "avoid_short": "Defining the sorting rules yourself.",
            "has_proficiency_variants": true,
            "glyph_observation": "UNCLEAR SORT CRITERIA",
            "mlr": {
              "number": 2,
              "name": "Collect and Display"
            }
          },
          {
            "observation_short": "States only group counts without naming the sorting category being counted.",
            "friction_type": "language-math",
            "move_short": "Revoice count with category name; provide frame 'I sorted by ___ into ___ groups' to establish quantity-category pairing.",
            "avoid_short": "Accepting bare numbers without category names.",
            "has_proficiency_variants": true,
            "glyph_observation": "COUNTS WITHOUT LABELS",
            "mlr": {
              "number": 8,
              "name": "Discussion Supports"
            }
          }
        ],
        "synthesis_short": "Display student sort charts; ask how naming categories helps describe two quantities together."
      },
      {
        "activity_id": "1.2",
        "tiles": [
          {
            "observation_short": "Correctly matches category word order to number order across words, colons, and 'for every'.",
            "friction_type": "language-math",
            "move_short": "Have students share sentences with partners to refine descriptions, ensuring first category name directly aligns with first number.",
            "avoid_short": "Letting order errors slide during sharing.",
            "is_crux_moment": true,
            "has_proficiency_variants": true,
            "glyph_observation": "PRECISE RATIO ORDER",
            "mlr": {
              "number": 1,
              "name": "Stronger and Clearer Each Time"
            }
          },
          {
            "observation_short": "Reverses numbers to put larger count first, disregarding the stated category sequence.",
            "friction_type": "language-math",
            "move_short": "Read student sentence aloud; point to each category and ask which number matches which group first.",
            "avoid_short": "Swapping the numbers for the student.",
            "has_proficiency_variants": true,
            "glyph_observation": "NUMBERS ORDER FLIPPED",
            "mlr": {
              "number": 8,
              "name": "Discussion Supports"
            }
          }
        ],
        "synthesis_short": "Surface two written ratio statements; ask why word order must match number order."
      },
      {
        "activity_id": "1.3",
        "tiles": [
          {
            "observation_short": "Compares part to whole total instead of comparing two distinct sorted categories.",
            "friction_type": "math",
            "move_short": "Gesture to the two separate piles; ask if second number shows one category or all items together.",
            "avoid_short": "Explaining part-to-part versus part-to-whole definitions.",
            "glyph_observation": "PART TO TOTAL CONFUSION",
            "mlr": {
              "number": 8,
              "name": "Discussion Supports"
            }
          },
          {
            "observation_short": "Creates visual display but struggles to articulate the matching ratio relationship in words.",
            "friction_type": "language",
            "move_short": "Prompt partner rehearsal using ratio frames; have partners critique clarity before finalizing their display statements.",
            "avoid_short": "Writing the display sentence for them.",
            "has_proficiency_variants": true,
            "glyph_observation": "DIAGRAM UNLINKED TO WORDS",
            "mlr": {
              "number": 1,
              "name": "Stronger and Clearer Each Time"
            }
          }
        ],
        "synthesis_short": "Highlight two student displays; ask how visual groupings show the 'for every' ratio relationship."
      }
    ],
    "mlr_legend": [
      {
        "mlr": {
          "number": 1,
          "name": "Stronger and Clearer Each Time"
        },
        "one_line_cue": "Partner draft, prompt for clarity, revise final statement."
      },
      {
        "mlr": {
          "number": 2,
          "name": "Collect and Display"
        },
        "one_line_cue": "Capture student language publicly; reference during discussions."
      },
      {
        "mlr": {
          "number": 8,
          "name": "Discussion Supports"
        },
        "one_line_cue": "Revoice, point to items, and provide structured sentence frames."
      }
    ],
    "lesson_synthesis_short": "Display a 3-to-2 object collection; ask how changing word order changes which quantity comes first."
  },
  "lesson_synthesis": {
    "prompt": "Consolidate the lesson by displaying 6 blue squares and 3 yellow circles. Point directly to the shapes and ask: 'If I write the ratio of blue squares to yellow circles as 3 to 6, what is incorrect about my statement, and how do we fix it to ensure our words and numbers match?' Conclude by recording all three standard notations—'6 to 3', '6:3', and '2 blue squares for every 1 yellow circle'—highlighting that a ratio describes two quantities simultaneously with strict attention to order.",
    "builds_on": [
      "Activity 1.1: students established distinct category names and accurate individual group counts.",
      "Activity 1.2: students learned to pair two quantities using 'to', ':', and 'for every'.",
      "Activity 1.3: students reinforced accurate order by organizing physical groups to match their written ratio sentences."
    ]
  },
  "provenance": {
    "pipeline_version": "2026-08-20.2",
    "cache_key": "0ff9011572493ba57c6da260ba2e0835",
    "provider": "gemini",
    "model": "gemini-3.7-flash",
    "thinking": "medium",
    "generated_at": "2026-08-20T23:59:56.978Z",
    "served_from_cache": false
  }
} as unknown as LessonData;
