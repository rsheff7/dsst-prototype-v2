import { LessonData } from './types';

// ---------------------------------------------------------------------------
// Demo lesson — IM Grade 6, Unit 2, Lesson 1 "Introducing Ratios and Ratio
// Language". Loaded by the home page sample, /framework, /how-to, /qa, /audit.
//
// PROVENANCE: generated 2026-08-26T00:28:11.538Z on gemini/gemini-3.7-flash
// (thinking=medium), pipeline 2026-08-22.5+76b7bb0788907be7, from
// "Grade 6 Mathematics, Unit 2.1 - Open Up Resources.pdf". Cache key 4f4ea6dc33bc679b409a5819278fd094.
//
// Generated on the launch model. The sample must match what a teacher receives;
// it was briefly regenerated on gemini-3.1-pro-preview for comparison and that
// has been reverted.
//
// The sample this replaced was generated on pipeline 2026-08-22.1, three
// versions back, and predated learner_profile entirely — so its WIDA chart
// rendered the generic 4x6 lens rows rather than this lesson's language. This
// one carries a learner_profile on all three activities and four MLL scenarios
// with band moves, one of them on the crux.
//
// To refresh: POST the source PDF to /api/analyze and paste the response here.
// ---------------------------------------------------------------------------

export const demoLesson = {
  "meta": {
    "grade": "6",
    "unit": "2",
    "lesson_number": "1",
    "lesson_title": "Introducing Ratios and Ratio Language",
    "total_time": "45 min"
  },
  "arc_statement": "Students begin by sorting figures into self-chosen categories and counting each subgroup, establishing that a single collection contains multiple quantifiable attributes. In the crux activity, they use structured sentence templates to express the relationship between two categories simultaneously, learning that reversing the order of words requires reversing the order of numbers. Finally, students sort their own collections, write matching ratio statements, and create visual displays that show both categories together.",
  "destination": "Students can write and say sentences using ratio language ('for every', 'to', ':') that match quantities in the correct order to describe an association between two categories.",
  "key_vocabulary": [
    {
      "term": "ratio",
      "definition": "An association between two or more quantities."
    },
    {
      "term": "for every",
      "definition": "A phrase used to describe how many items in one group correspond to a set number of items in another group."
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
      "function_summary": "This warm-up establishes that a single set of objects can be categorized in multiple distinct ways. Students count items within categories before linking two categories together in a single statement.",
      "learning_target": "Students sort a set of figures into categories based on different attributes and record the group counts.",
      "synthesis_prompt": "Synthesize toward categorizing and counting groups by pointing to the shapes on the board and recording student descriptions of color, size, and vertex counts alongside their group totals.",
      "is_crux": false,
      "friction_points": [
        {
          "description": "Students count the total number of shapes instead of partitioning them into distinct attribute groups.",
          "type": "math"
        },
        {
          "description": "Students use informal category descriptors like 'pointy ones' or 'big ones' without naming the measurable mathematical attribute.",
          "type": "language",
          "mlr": {
            "number": 2,
            "name": "Collect and Display"
          }
        }
      ],
      "success_signals": [
        "Students sort shapes into at least two distinct groups with accurate counts for each.",
        "Students name the sorting rule used to define each group."
      ],
      "teacher_moves": [
        {
          "text": "Write student descriptive phrases for categories on chart paper under headings for color, shape type, and size as they share out during whole-class discussion.",
          "mlr": {
            "number": 2,
            "name": "Collect and Display"
          }
        },
        {
          "text": "Hold up a green triangle and a blue triangle side by side, and ask which category each belongs to under a color sort versus a shape sort."
        }
      ],
      "causal_link": "Establishes category counts that serve as the input quantities for ratio sentences in Activity 1.2.",
      "extension": "Challenge students to find a sorting rule that produces exactly four distinct groups from the same image."
    },
    {
      "id": "1.2",
      "title": "The Teacher’s Collection",
      "function": "Crux",
      "duration": "~15 min",
      "grouping": "Partners",
      "language_demand": "high",
      "function_summary": "This crux activity introduces formal ratio templates ('to', ':', 'for every'). Students practice aligning the sequence of category names with the sequence of numerical values so that the mathematical meaning remains true.",
      "learning_target": "Students write and say ratio sentences describing quantities in a collection using correct word and number order.",
      "synthesis_prompt": "Synthesize toward writing ratio sentences in correct word and number order by writing 'The ratio of circles to squares is 3 to 6' on the board and asking a volunteer to point to where the 3 circles and 6 squares appear in the display.",
      "is_crux": true,
      "friction_points": [
        {
          "description": "Students write the larger number first regardless of which category name comes first in the sentence.",
          "type": "language-math",
          "mlr": {
            "number": 3,
            "name": "Critique, Correct, and Clarify"
          }
        },
        {
          "description": "Students write the ratio of a part to the total collection when asked for the ratio of one category to another category.",
          "type": "math"
        },
        {
          "description": "Students pause when reading the colon symbol aloud in ratio notation instead of saying the word 'to'.",
          "type": "language",
          "mlr": {
            "number": 1,
            "name": "Stronger and Clearer Each Time"
          }
        }
      ],
      "success_signals": [
        "Students match the first number in the ratio to the first category named in their sentence.",
        "Students read the expression '3:5' aloud using the phrase '3 to 5'."
      ],
      "teacher_moves": [
        {
          "text": "Display an anonymous sample sentence where the numbers are reversed, such as 'The ratio of 2 blue blocks to 5 yellow blocks is 5 to 2', and ask partners to discuss what makes the statement confusing and rewrite it correctly.",
          "mlr": {
            "number": 3,
            "name": "Critique, Correct, and Clarify"
          }
        },
        {
          "text": "Invite students to read their draft sentences to a partner, check each other's word and number order against the collection, and write an improved version before whole-class sharing.",
          "mlr": {
            "number": 1,
            "name": "Stronger and Clearer Each Time"
          }
        }
      ],
      "causal_link": "Provides the syntactical structures and notation needed to represent student-generated data in Activity 1.3.",
      "extension": "Ask students to write a ratio comparing one category to the total number of items in the entire collection."
    },
    {
      "id": "1.3",
      "title": "The Student’s Collection",
      "function": "Application",
      "duration": "~20 min",
      "grouping": "Partners",
      "language_demand": "medium",
      "function_summary": "Students apply ratio language to novel sets of physical or pictorial objects. They arrange items visually to justify their ratio sentences and connect written statements with physical groupings.",
      "learning_target": "Students create visual displays and ratio sentences to represent comparisons between categories in their own collections.",
      "synthesis_prompt": "Synthesize toward connecting visual displays with ratio sentences by placing two student posters with identical collections side by side—one arranged randomly and one grouped into equal batches—and asking how both show the ratio 2 to 1.",
      "is_crux": false,
      "friction_points": [
        {
          "description": "Students create posters with isolated numbers and category titles without a full connecting sentence using 'to', ':', or 'for every'.",
          "type": "language",
          "mlr": {
            "number": 1,
            "name": "Stronger and Clearer Each Time"
          }
        },
        {
          "description": "Students struggle to connect a grouped visual display to an equivalent simplified ratio sentence.",
          "type": "math",
          "mlr": {
            "number": 7,
            "name": "Compare and Connect"
          }
        }
      ],
      "success_signals": [
        "Students arrange objects or drawings into clear groups that correspond directly to the quantities in their written sentences.",
        "Students write at least two distinct ratio sentences comparing different category pairings from their collection."
      ],
      "teacher_moves": [
        {
          "text": "Select two student displays showing the same ratio with different visual arrangements, place them side by side, and ask students to point out where the numbers from the ratio appear in each layout.",
          "mlr": {
            "number": 7,
            "name": "Compare and Connect"
          }
        },
        {
          "text": "Have pairs exchange visual displays with another group, interpret the display to speak a ratio sentence aloud, and compare their spoken sentence with the authors' written statement.",
          "mlr": {
            "number": 1,
            "name": "Stronger and Clearer Each Time"
          }
        }
      ],
      "causal_link": "Consolidates understanding of ratio language by linking concrete displays to symbolic and verbal descriptions.",
      "extension": "Ask students to group their items into equal subsets to find another equivalent ratio sentence describing the same collection."
    }
  ],
  "adaptation_guardrails": {
    "mathematical_purpose": "Students learn to associate two quantities simultaneously using ratio language and notation while maintaining strict alignment between the order of category names and the order of numbers.",
    "safe_to_change": [
      "The physical objects used in the teacher and student collections (e.g., using counters, colored paper clips, or printed icons).",
      "The specific attributes students choose for sorting categories (e.g., color, size, texture, or shape).",
      "The format of the final visual display (e.g., drawing on paper, arranging physical manipulatives on a desk, or digital slides)."
    ],
    "do_not_remove": [
      {
        "text": "The structured sentence templates ('The ratio of ___ to ___ is ___ to ___' and 'For every ___ there are ___')."
      },
      {
        "text": "The public critique of a reversed-order ratio statement to establish why sequence matters.",
        "mlr": {
          "number": 3,
          "name": "Critique, Correct, and Clarify"
        }
      },
      {
        "text": "The partner exchange where students read their ratio sentences aloud while pointing to the corresponding items in the collection.",
        "mlr": {
          "number": 1,
          "name": "Stronger and Clearer Each Time"
        }
      }
    ],
    "rigor_check": "Can students independently identify which number corresponds to which category when the sentence structure changes from 'The ratio of A to B is X to Y' to 'For every Y of B there are X of A'?",
    "by_proficiency": {
      "emerging": {
        "text": "Provide pre-printed sentence strips with color-coded blanks where category color matches blank color, and ask students to point to items while reading the numbers aloud.",
        "mlr": {
          "number": 2,
          "name": "Collect and Display"
        }
      },
      "developing": {
        "text": "Provide sentence frames on an anchor chart and have students practice reading their completed ratio sentences with a partner before presenting to the class.",
        "mlr": {
          "number": 1,
          "name": "Stronger and Clearer Each Time"
        }
      },
      "expanding": {
        "text": "Ask students to write two different sentences for the same two categories by switching the order of the categories and explaining how the numbers change.",
        "mlr": {
          "number": 7,
          "name": "Compare and Connect"
        }
      }
    }
  },
  "anticipated_thinking": {
    "orientation": "Students arrive with strong intuitive skills for sorting and counting physical objects by obvious visual attributes like color and shape. The critical shift in this lesson is learning to express the relationship between two categories simultaneously using structured ratio language where word order strictly governs number order.",
    "activities": [
      {
        "activity_id": "1.1",
        "patterns": [
          {
            "label": "Sorting by Perceptual vs Geometric Attributes",
            "frequency": "most students",
            "type": "on-track",
            "description": "Students sort figures easily by obvious traits like color or shape, but need prompting to sort by geometric properties such as area or number of sides.",
            "move": "Ask students to count the square units inside each figure to verify the area before creating their area-based categories.",
            "is_mll_specific": false
          },
          {
            "label": "Overlapping or Inconsistent Category Rules",
            "frequency": "some students",
            "type": "misconception",
            "description": "A student creates categories where a single figure fits into multiple groups (e.g., 'blue shapes' and 'triangles') or leaves shapes unclassified.",
            "move": "Hold up a blue triangle and ask which single pile it belongs to, prompting the student to refine their rule so every item has exactly one group.",
            "is_mll_specific": false
          },
          {
            "label": "Informal Grouping and Comparison Phrasing",
            "frequency": "watch for this",
            "type": "language-math",
            "description": "Multilingual students use everyday words like 'piles', 'kinds', or 'more of these' instead of category names and exact counts.",
            "move": "Listen for informal grouping words, write them on a public anchor chart under 'Everyday Words', and scribe the formal category name next to each (MLR 2 Collect and Display). Reference the display during the whole-class share.",
            "is_mll_specific": true,
            "mlr": {
              "number": 2,
              "name": "Collect and Display"
            }
          }
        ],
        "sentence_frames": [
          {
            "frame": "I sorted the figures into [number] groups based on [attribute].",
            "mlr": {
              "number": 2,
              "name": "Collect and Display"
            }
          },
          {
            "frame": "There are [number] figures in the [category name] category and [number] figures in the [category name] category."
          }
        ],
        "questions_to_listen_for": [
          "What rule did you use to decide which group a shape belongs to?",
          "How did you check that every figure fits into exactly one category?"
        ]
      },
      {
        "activity_id": "1.2",
        "patterns": [
          {
            "label": "Reversing Number Order to Match Magnitude",
            "frequency": "some students",
            "type": "misconception",
            "description": "A student writes 'The ratio of blue to red is 5 to 2' when there are 2 blue and 5 red objects because they default to writing the larger number first.",
            "move": "Display an anonymous sample with reversed numbers on the board. Ask partners to identify the mismatch between word order and number order, then have the class rewrite the sentence correctly (MLR 3 Critique, Correct, and Clarify).",
            "is_mll_specific": true,
            "mlr": {
              "number": 3,
              "name": "Critique, Correct, and Clarify"
            }
          },
          {
            "label": "Accurate Word-to-Number Order Alignment",
            "frequency": "most students",
            "type": "on-track",
            "description": "Students consistently place the count of the first named category in the first numerical slot across colon, 'to', and 'for every' sentence formats.",
            "move": "Ask the student to read their sentence aloud while pointing to the matching group of items to confirm the correspondence.",
            "is_mll_specific": false
          },
          {
            "label": "Refining Ratio Descriptions Through Partner Exchange",
            "frequency": "watch for this",
            "type": "language-math",
            "description": "Multilingual students hesitate when transitioning between colon notation and 'for every' statements, mixing up category labels.",
            "move": "Have students read their draft ratio sentence to a partner. The partner asks 'Which category has which amount?' before each student writes a clearer second draft (MLR 1 Stronger and Clearer Each Time).",
            "is_mll_specific": true,
            "mlr": {
              "number": 1,
              "name": "Stronger and Clearer Each Time"
            }
          }
        ],
        "sentence_frames": [
          {
            "frame": "The ratio of [Category A] to [Category B] is [Amount A] to [Amount B].",
            "mlr": {
              "number": 3,
              "name": "Critique, Correct, and Clarify"
            }
          },
          {
            "frame": "There are [Amount A] of [Category A] for every [Amount B] of [Category B].",
            "mlr": {
              "number": 1,
              "name": "Stronger and Clearer Each Time"
            }
          }
        ],
        "questions_to_listen_for": [
          "Which category did you name first, and which number did you write first?",
          "How does your sentence change if you name Category B before Category A?"
        ]
      },
      {
        "activity_id": "1.3",
        "patterns": [
          {
            "label": "Connecting Visual Groupings to Ratio Sentences",
            "frequency": "some students",
            "type": "language-math",
            "description": "Students create distinct visual layouts (e.g., paired rows vs clustered sets) for the same ratio but struggle to explain how both represent the same relationship.",
            "move": "Place two different student visual displays side by side. Guide the class to locate where the ratio quantities appear in each display and connect both to the written ratio statement (MLR 7 Compare and Connect).",
            "is_mll_specific": true,
            "mlr": {
              "number": 7,
              "name": "Compare and Connect"
            }
          },
          {
            "label": "Clear One-to-One or Group-to-Group Visual Alignment",
            "frequency": "most students",
            "type": "on-track",
            "description": "Students arrange their collection in neat rows or distinct colored clusters that directly match their written 'for every' statements.",
            "move": "Ask students to explain how a visitor walking past their poster would know which ratio sentence matches their display without reading the title.",
            "is_mll_specific": false
          },
          {
            "label": "Simplifying Ratios into Unit or Scaled Subgroups",
            "frequency": "watch for this",
            "type": "extension",
            "description": "A student with 6 squares and 3 circles notices they can group them into 2 squares for every 1 circle instead of just reporting 6 to 3.",
            "move": "Have the student circle each group of 2 squares and 1 circle on their visual display to illustrate how the smaller grouped ratio describes the same total collection.",
            "is_mll_specific": false
          }
        ],
        "sentence_frames": [
          {
            "frame": "In this display, I see the ratio of [Category A] to [Category B] because there are [Amount A] [Category A] grouped with [Amount B] [Category B].",
            "mlr": {
              "number": 7,
              "name": "Compare and Connect"
            }
          },
          {
            "frame": "Our display shows [Amount A] [Category A] : [Amount B] [Category B] by arranging them in [description of arrangement]."
          }
        ],
        "questions_to_listen_for": [
          "Where in your visual display can we see the 'for every' relationship between the two groups?",
          "How does your partner's visual layout show the same ratio quantities as your written sentence?"
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
            "label": "Counts total shapes across the board instead of group amounts",
            "interpretation": "The student focuses on finding the total quantity of shapes rather than sorting into separate attribute bins. They understand counting but have not separated the set into mutually exclusive categories.",
            "is_mll": false,
            "flat_move": {
              "move": "Place a physical divider or piece of paper between the blue shapes and the green shapes on the desk. Point to one side and ask for the count of that pile alone.",
              "avoid": "Telling the student they counted the wrong thing or giving the category names directly.",
              "say": "Count just the shapes in this pile. How many are here?"
            },
            "proficiency_moves": null,
            "mll_framework_note": null,
            "proficiency_divergence_note": null
          },
          {
            "scenario_type": "partial-understanding",
            "label": "Uses informal descriptions for categories without recording distinct counts",
            "interpretation": "The student identifies visual differences using everyday descriptors ('the dark ones', 'the pointy ones') but has not formalized the category label or recorded the exact count for each group.",
            "is_mll": true,
            "flat_move": null,
            "proficiency_moves": {
              "emerging": {
                "move": "Write the student's word 'dark' on an index card next to the blue shape. Have the student tap each dark shape and count aloud, then write the numeral beside the card.",
                "avoid": "Replacing their informal word with 'blue' immediately before recording the count.",
                "nonverbal": "Tap each dark shape on the page, then write the digit in the air.",
                "say": "Dark shapes: 1, 2, 3, 4. Write 4 next to dark."
              },
              "developing": {
                "move": "Display the phrase 'shapes with 4 sides' next to the student's phrase 'box shapes'. Have them count the quadrilaterals and write the count in the category table.",
                "avoid": "Crossing out 'box shapes' on their paper.",
                "say": "You called these 'box shapes.' In math, we can also say 'shapes with 4 sides.' How many are in this group?"
              },
              "expanding": {
                "move": "Pair the student with a partner. Have them compare their informal category name with a math attribute term and write the final count for both categories.",
                "avoid": "Validating the category without checking the count.",
                "say": "Tell your partner what attribute defines your first group and how many items are in it."
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
            "scenario_type": "on-track",
            "label": "Sorts shapes by area by counting grid units accurately",
            "interpretation": "The student recognizes area as a measurable attribute, determines the area of each figure by counting square units, and groups figures with matching areas together.",
            "is_mll": false,
            "flat_move": {
              "move": "Ask the student to write the group counts on their paper and prepare to share how they determined figures with equal area during the whole-group discussion.",
              "avoid": "Interrupting the student to give alternative sorting rules.",
              "say": "You grouped them by area. Write down how many figures have an area of 4 and how many have an area of 6."
            },
            "proficiency_moves": null,
            "mll_framework_note": null,
            "proficiency_divergence_note": null
          },
          {
            "scenario_type": "productive-insight",
            "label": "Sorts by a structural geometric property like number of vertices or symmetry",
            "interpretation": "The student looks beyond surface color or simple size and uses geometric properties to categorize the collection into well-defined mathematical groups.",
            "is_mll": false,
            "flat_move": {
              "move": "Record the student's category names and counts on the board anchor display for the class to reference during the synthesis.",
              "avoid": "Redirecting the student back to the expected color or area categories.",
              "say": "Keep those categories and write down the exact count for each one in your notes."
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
            "label": "Inverts number order relative to category word order in ratio sentence",
            "interpretation": "The student places the larger number first by default or writes numbers in the order counted rather than aligning each number to its corresponding category name in the frame.",
            "is_mll": false,
            "flat_move": {
              "move": "Underline the first category name in their sentence with a blue marker and underline the first number with the same color. Underline the second category and second number with green. Point to each pair.",
              "avoid": "Switching the numbers for the student or telling them the sentence is backwards without pointing.",
              "say": "Read the first category aloud. Now check your table: how many items are in that category?"
            },
            "proficiency_moves": null,
            "mll_framework_note": null,
            "proficiency_divergence_note": null
          },
          {
            "scenario_type": "common-error",
            "label": "Omits category names in ratio sentence frame",
            "interpretation": "The student writes 'The ratio is 3 to 5' without specifying which quantities are being compared. They understand that two numbers are related but omit the referent nouns.",
            "is_mll": true,
            "flat_move": null,
            "proficiency_moves": {
              "emerging": {
                "move": "Write 'The ratio of _______ to _______ is 3 to 5' on a whiteboard. Place 3 red clips by the first blank and 5 blue clips by the second. Have the student point and say the color names.",
                "avoid": "Filling in the blanks for them.",
                "nonverbal": "Hold up a red clip, point to the first blank, then hold up a blue clip and point to the second blank.",
                "say": "3 of what? 5 of what? Say the name here."
              },
              "developing": {
                "move": "Display an anonymous sample: 'The ratio is 3 to 5.' Ask the student and their partner what information is missing if someone cannot see the collection.",
                "avoid": "Saying the sample is wrong without partner discussion.",
                "say": "If I close my eyes, what do the numbers 3 and 5 mean in this collection? Add the names to fix the sentence."
              },
              "expanding": {
                "move": "Display two statements: 'The ratio is 4 to 2' and 'The ratio of markers to erasers is 4 to 2.' Ask the student to explain why the second statement is complete.",
                "avoid": "Explaining the difference yourself.",
                "say": "Explain to your partner why the first statement does not give enough mathematical detail."
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
            "scenario_type": "partial-understanding",
            "label": "Writes ratio notation 3:5 but cannot articulate the 'for every' relationship",
            "interpretation": "The student copies the colon notation mechanically from the prompt but struggles to explain what association exists between the two groups when using words.",
            "is_mll": true,
            "flat_move": null,
            "proficiency_moves": {
              "emerging": {
                "move": "Physically pair 3 paperclips of one color with 5 paperclips of another color on the desk. Have the student point to each mini-group and repeat the frame.",
                "avoid": "Accepting just the colon symbol without spoken pairing.",
                "nonverbal": "Place two hands around one group of 3 and one group of 5 together.",
                "say": "There are 3 blue for every 5 red. Your turn to say it."
              },
              "developing": {
                "move": "Have the student rehearse their sentence with a partner using the phrase 'There are ___ for every ___.' Give 30 seconds of quiet think time before speaking.",
                "avoid": "Stepping in during partner rehearsal.",
                "say": "Tell your partner your 'for every' sentence. Listen to their sentence, then write yours again."
              },
              "expanding": {
                "move": "Have the student write a second draft of their sentence explaining what happens if the collection doubles.",
                "avoid": "Providing the doubled numbers directly.",
                "say": "Explain how your 'for every' sentence helps someone know what to expect if we add another matching set."
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
            "scenario_type": "productive-insight",
            "label": "Identifies a simplified unit ratio like 1 to 2 from a 3 to 6 collection",
            "interpretation": "The student groups items into equal sub-bundles (e.g., 1 red for every 2 blue) rather than only counting the gross totals in the collection.",
            "is_mll": false,
            "flat_move": {
              "move": "Ask the student to arrange the physical items into matching sub-groups on their desk to show both 3 to 6 and 1 to 2 side by side.",
              "avoid": "Teaching the formal cross-multiplication or reduction procedure.",
              "say": "Show me with the objects how you see 1 for every 2."
            },
            "proficiency_moves": null,
            "mll_framework_note": null,
            "proficiency_divergence_note": null
          },
          {
            "scenario_type": "on-track",
            "label": "Writes accurate ratio sentences in all three formats with matching order",
            "interpretation": "The student accurately matches the category order to the numeric order across 'to', ':', and 'for every' sentence structures.",
            "is_mll": false,
            "flat_move": {
              "move": "Have the student select one sentence and write it in large print on an index card for the synthesis display.",
              "avoid": "Assigning unrelated busywork.",
              "say": "Choose your clearest sentence and write it on this card for our class discussion."
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
            "label": "Compares one category to the total count without naming total as a category",
            "interpretation": "The student writes 'The ratio of blue tiles to tiles is 4 to 10' or writes 4 to 10 meaning blue to green, confusing part-to-part with part-to-whole comparisons.",
            "is_mll": false,
            "flat_move": {
              "move": "Point to the table rows. Ask the student whether 10 is the count of green tiles or the count of all tiles combined.",
              "avoid": "Telling the student that part-to-whole ratios are forbidden.",
              "say": "Look at the number 10. Does 10 describe the green tiles, or all the tiles in the whole collection?"
            },
            "proficiency_moves": null,
            "mll_framework_note": null,
            "proficiency_divergence_note": null
          },
          {
            "scenario_type": "productive-struggle",
            "label": "Creates an unordered pile of items in visual display that obscures the ratio",
            "interpretation": "The student has accurate ratio sentences written down but scatters or clusters items randomly on their poster so a viewer cannot see the association between groups.",
            "is_mll": true,
            "flat_move": null,
            "proficiency_moves": {
              "emerging": {
                "move": "Line up 2 red counters in a row, then line up 3 yellow counters directly underneath. Have the student continue the pattern with the remaining counters.",
                "avoid": "Arranging the entire display for them.",
                "nonverbal": "Move two objects into a top row and three objects into a bottom row as a physical model.",
                "say": "Look: 2 red on top, 3 yellow below. Make the next group look the same."
              },
              "developing": {
                "move": "Pair the student with a peer who arranged items in paired columns. Have both students look at the two displays and describe how the columns show the 'for every' sentence.",
                "avoid": "Telling them to copy the partner's poster.",
                "say": "Look at your partner's arrangement. How does their layout show the sentence?"
              },
              "expanding": {
                "move": "Ask the student to explain to a peer how someone walking past their poster could verify the ratio in 5 seconds without counting every single object individually.",
                "avoid": "Giving layout suggestions directly.",
                "say": "Explain how you can organize your shapes into equal groups so the ratio is clear at a glance."
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
            "scenario_type": "productive-insight",
            "label": "Organizes visual display into repeated paired sets matching the ratio",
            "interpretation": "The student visually represents the ratio structure by arranging physical objects or drawings into repeated unit groups (e.g., pairs of 2 red and 3 yellow).",
            "is_mll": false,
            "flat_move": {
              "move": "Select this display to be presented first during the gallery walk as a concrete anchor for comparing with other representations.",
              "avoid": "Changing the student's display format.",
              "say": "Leave your display set up this way. We will have the class look at how your groups show the ratio."
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
        "learner_profile": [
          {
            "band": "emerging",
            "discourse_does": "States one attribute or count at a time while pointing to shapes on the page.",
            "discourse_reaching": "Links the category name and its count in a single turn.",
            "sentence_does": "Uses simple statements like 'There are 3 blue' or 'It has 4 sides.'",
            "sentence_reaching": "Uses compound statements with 'and' such as 'There are 3 blue and 2 red.'",
            "word_does": "Uses everyday visual words like 'blue', 'big', 'square', 'corner'.",
            "word_reaching": "Uses category labels like 'color', 'area', and 'number of sides'."
          },
          {
            "band": "developing",
            "discourse_does": "Reports two attributes or group counts using linking words.",
            "discourse_reaching": "Explains a complete sorting rule and how each shape fits into a category.",
            "sentence_does": "Connects clauses with 'and' or 'but', such as 'These have 4 sides, but those have 3.'",
            "sentence_reaching": "Uses relative clauses such as 'The group that has shaded shapes has 5 pieces.'",
            "word_does": "Uses descriptive geometric words like 'shaded', 'unshaded', 'triangle', 'area'.",
            "word_reaching": "Uses comparative expressions like 'greater area' and 'same number of sides'."
          },
          {
            "band": "expanding",
            "discourse_does": "Organizes a full report comparing two different ways to sort the same set of figures.",
            "discourse_reaching": "Explains why changing the attribute changes the total number of resulting groups.",
            "sentence_does": "Uses complex sentences like 'When we sort by area, we get 2 groups, but sorting by color gives 4.'",
            "sentence_reaching": "Uses parallel structures to systematically define criteria for each group.",
            "word_does": "Uses precise terms like 'categories', 'attributes', 'area of square units', 'quadrilaterals'.",
            "word_reaching": "Uses classification language like 'classified according to' and 'partitioned into'."
          }
        ],
        "language_demands": {
          "receptive": "Read task prompts asking to sort figures by color, area, and self-chosen attributes; listen to peer descriptions of sorting rules.",
          "productive": "Name sorting attributes (color, size, number of sides, area) and state group counts verbally or in written notes.",
          "interactive": "Compare category choices and group counts with a partner to see if different sorting rules produce the same number of groups.",
          "everyday_to_academic_bridge": "Students bring everyday descriptive descriptors like 'pointy', 'shade', and 'big'; the task connects these to category labels and group counts.",
          "elsf_guidelines_applied": [
            1,
            2,
            6
          ]
        },
        "functional_language": {
          "language_functions": [
            "categorize objects by attribute",
            "describe group quantities"
          ],
          "example_phrases": [
            "sorted by color into three groups",
            "there are 4 large shapes and 2 small shapes"
          ],
          "l1_bridge": "Many terms for basic colors and geometric shapes share direct cognates across Spanish and English (e.g., categoría/category, color/color, grupo/group).",
          "elsf_guidelines_applied": [
            1,
            3,
            12
          ]
        }
      },
      {
        "activity_id": "1.2",
        "learner_profile": [
          {
            "band": "emerging",
            "discourse_does": "States single category counts and reads completed ratio sentence frames aloud with partner support.",
            "discourse_reaching": "Pairs two categories into a single ratio sentence independently.",
            "sentence_does": "Fills numbers into printed frames: 'The ratio of paperclips to erasers is 4 to 2.'",
            "sentence_reaching": "Speaks the frame aloud without reading word-for-word from paper.",
            "word_does": "Names collection items like 'clips', 'erasers', 'markers' alongside numbers.",
            "word_reaching": "Uses ratio connecting words 'to' and 'for every'."
          },
          {
            "band": "developing",
            "discourse_does": "Reads and writes two different ratio sentences for the same collection, maintaining correct order.",
            "discourse_reaching": "Explains why swapping the category words requires swapping the numbers.",
            "sentence_does": "Produces sentences using colon notation and 'to' phrases accurately.",
            "sentence_reaching": "Constructs explanations with 'because', such as 'I wrote 2 to 4 because erasers came first.'",
            "word_does": "Uses academic terms 'ratio', 'category', 'amount', 'for every'.",
            "word_reaching": "Uses relational vocabulary like 'in order', 'matches', 'corresponds to'."
          },
          {
            "band": "expanding",
            "discourse_does": "Explains the correspondence between category order and number order across multiple ratio formats.",
            "discourse_reaching": "Critiques peer statements where quantities are inverted and articulates the correction.",
            "sentence_does": "Uses conditional sentences like 'If we name circles first, the ratio is 3 to 6, but if squares come first, it is 6 to 3.'",
            "sentence_reaching": "Uses precise discourse markers like 'respectively' to justify quantity alignment.",
            "word_does": "Uses formal mathematical phrasing like 'ratio relationship', 'association between', 'order of terms'.",
            "word_reaching": "Uses analytical language like 'inverts the comparison' and 'maintains equivalence'."
          }
        ],
        "language_demands": {
          "receptive": "Read sentence frames containing ratio language ('ratio of _ to _ is _ to _', 'for every _ there are _'); listen to teacher model collection descriptions.",
          "productive": "Write and speak complete ratio sentences matching numbers to category names in strict corresponding order.",
          "interactive": "Read drafted ratio sentences to a partner to verify whether the order of words matches the order of quantities.",
          "everyday_to_academic_bridge": "Students move from isolated count statements ('4 paperclips, 2 erasers') to relational phrasing that binds quantities together ('4 paperclips for every 2 erasers').",
          "elsf_guidelines_applied": [
            1,
            2,
            6
          ]
        },
        "functional_language": {
          "language_functions": [
            "describe an association between quantities",
            "formulate precise ratio statements"
          ],
          "example_phrases": [
            "the ratio of paperclips to erasers is 4 to 2",
            "there are 4 paperclips for every 2 erasers"
          ],
          "l1_bridge": "The word 'ratio' translates to 'razón' in Spanish; drawing attention to the preposition 'to' (a) and 'for every' (por cada) supports relational meaning.",
          "elsf_guidelines_applied": [
            1,
            3,
            7
          ]
        }
      },
      {
        "activity_id": "1.3",
        "learner_profile": [
          {
            "band": "emerging",
            "discourse_does": "Points to physical groups of objects while reading a written ratio card.",
            "discourse_reaching": "Explains the physical grouping using simple sequence steps.",
            "sentence_does": "Uses present-tense statements: 'Here is 3 blocks, here is 1 block.'",
            "sentence_reaching": "Uses sequence connectors: 'First I make 3 red, then I add 1 blue.'",
            "word_does": "Names collection items and basic arrangement terms: 'pile', 'line', 'group'.",
            "word_reaching": "Uses relational phrasing: 'together', 'each time', 'for each'."
          },
          {
            "band": "developing",
            "discourse_does": "Describes how the physical display matches the ratio sentence by referencing equal groups.",
            "discourse_reaching": "Explains why arranging objects in equal groups makes the 'for every' relationship visible.",
            "sentence_does": "Uses cause and purpose clauses: 'We put them in pairs so you can see the ratio 2 to 1.'",
            "sentence_reaching": "Uses conditional clauses: 'If you look at each row, you see 2 red for every 1 yellow.'",
            "word_does": "Uses organizational words: 'display', 'equal groups', 'arrangement', 'represents'.",
            "word_reaching": "Uses explanatory words: 'demonstrates', 'shows clearly', 'unit rate'."
          },
          {
            "band": "expanding",
            "discourse_does": "Provides a sustained explanation connecting multiple representations (table, objects, sentences, colon notation).",
            "discourse_reaching": "Compares two different visual displays of the same ratio and evaluates which is clearer.",
            "sentence_does": "Uses complex justifying structures: 'Our display groups 6 counters into sets of 2, which proves there are 2 blues for every 1 green.'",
            "sentence_reaching": "Uses generalizing structures: 'Whenever you have a 2 to 1 ratio, the total count will always split into equal groups of 3.'",
            "word_does": "Uses comprehensive mathematical language: 'visual representation', 'ratio statement', 'simplified group'.",
            "word_reaching": "Uses metalinguistic comparison terms: 'consistent with', 'proportional representation'."
          }
        ],
        "language_demands": {
          "receptive": "Read partner visual displays; listen to peers explain how physical groupings represent written ratio sentences.",
          "productive": "Write ratio sentences for personal collections and present oral explanations connecting physical arrangements to numbers.",
          "interactive": "Discuss with a partner how to group objects visually (e.g., pairs, rows, clusters) so a visiting peer can instantly see the ratio.",
          "everyday_to_academic_bridge": "Students move from pointing to loose piles of items to arranging items into structured equal groups that visually justify 'for every' statements.",
          "elsf_guidelines_applied": [
            1,
            3,
            4
          ]
        },
        "functional_language": {
          "language_functions": [
            "explain a visual representation",
            "compare representations of ratios"
          ],
          "example_phrases": [
            "this display shows 3 red counters for every 1 blue counter",
            "we arranged them into 2 equal groups of 3"
          ],
          "l1_bridge": "Connecting the visual grouping 'groups of' to home language expressions for equal sharing (e.g., 'grupos iguales') reinforces unit grouping.",
          "elsf_guidelines_applied": [
            1,
            3,
            7,
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
        "language_work": "Students sort geometric figures by visual and geometric attributes, sharing informal category names and counts.",
        "mlrs": [
          {
            "number": 2,
            "name": "Collect and Display",
            "why_here": "Students describe sorting rules using informal words like 'pointy', 'flat', or 'small'; capturing these on a shared chart preserves student language to connect to ratio terms later."
          }
        ]
      },
      {
        "activity_id": "1.2",
        "language_work": "Students formulate structured ratio statements using colon notation, 'to', and 'for every' to relate two categories in a collection.",
        "mlrs": [
          {
            "number": 3,
            "name": "Critique, Correct, and Clarify",
            "why_here": "Students often write numbers in reverse order or omit category labels; analyzing a mismatched example on the board lets the class repair the order together."
          },
          {
            "number": 1,
            "name": "Stronger and Clearer Each Time",
            "why_here": "Students read their ratio sentences to a partner and refine their wording based on whether their partner can identify which category matches which number."
          }
        ]
      },
      {
        "activity_id": "1.3",
        "language_work": "Students explain how their physical arrangement of objects matches their written ratio sentences and compare displays across groups.",
        "mlrs": [
          {
            "number": 7,
            "name": "Compare and Connect",
            "why_here": "Students place two different groupings of the same items side by side to see how different visual arrangements show the exact same ratio relationship."
          },
          {
            "number": 1,
            "name": "Stronger and Clearer Each Time",
            "why_here": "Students circulate to explain their visual display to multiple peers, making their verbal explanation more precise with each turn."
          }
        ]
      }
    ]
  },
  "wristband": {
    "arc_one_line": "Sort shapes into categories, then write precise ratio statements matching words to numbers.",
    "preflight": [
      "Display sorting categories chart with color, shape, and size headings prominently.",
      "Pair students with mixed English proficiencies for collection ratio writing.",
      "Prepare sentence frame anchor charts showing 'to', ':', and 'for every'."
    ],
    "top_signals": [
      "Matches number order to named category words.",
      "Uses 'for every' to relate two quantities.",
      "Groups visual displays to show ratio equivalence."
    ],
    "top_frictions": [
      "Reversing number order when writing ratio statements.",
      "Confusing part-to-part counts with total collection count.",
      "Using additive language like more than instead."
    ],
    "activities": [
      {
        "activity_id": "1.1",
        "tiles": [
          {
            "observation_short": "Names vague sorting categories like 'cool shapes' instead of mathematical geometric attributes.",
            "friction_type": "language",
            "move_short": "Record student terms publicly; revoice 'pointy' as 'triangles' so students connect their visual observations to precise mathematical category language during synthesis.",
            "avoid_short": "Rejecting informal words without recording them.",
            "glyph_observation": "VAGUE CATEGORY NAMES",
            "mlr": {
              "number": 2,
              "name": "Collect and Display"
            }
          },
          {
            "observation_short": "Counts same shape in multiple groups; overlaps categories without disjoint counts.",
            "friction_type": "math",
            "move_short": "Display two different student count tables side by side; ask how many total figures exist so students notice category counts must sum to total.",
            "avoid_short": "Telling students which shapes they miscounted.",
            "glyph_observation": "OVERLAPPING SHAPE COUNTS",
            "mlr": {
              "number": 2,
              "name": "Collect and Display"
            }
          }
        ],
        "synthesis_short": "Surface distinct category counts chart. Ask: what two attributes can we compare simultaneously?"
      },
      {
        "activity_id": "1.2",
        "tiles": [
          {
            "observation_short": "Reversed order; wrote 3 to 5 for 5 circles and 3 squares.",
            "friction_type": "language-math",
            "move_short": "Write the reversed sentence on board anonymously; ask partners to identify the order mismatch and rewrite it so numbers align with words.",
            "avoid_short": "Correcting the number order for them.",
            "is_crux_moment": true,
            "has_proficiency_variants": true,
            "glyph_observation": "REVERSED RATIO ORDER",
            "mlr": {
              "number": 3,
              "name": "Critique, Correct, and Clarify"
            }
          },
          {
            "observation_short": "Says 'there are more circles' instead of stating exact ratio relationship quantities.",
            "friction_type": "language",
            "move_short": "Prompt partner exchange using the 'for every' sentence frame; students revise initial comparison from additive words into an exact numerical ratio statement.",
            "avoid_short": "Accepting vague comparison words like more.",
            "has_proficiency_variants": true,
            "glyph_observation": "ADDITIVE COMPARISON PHRASING",
            "mlr": {
              "number": 1,
              "name": "Stronger and Clearer Each Time"
            }
          }
        ],
        "synthesis_short": "Surface corrected ratio statement on board. Ask: why must number order strictly match word order?"
      },
      {
        "activity_id": "1.3",
        "tiles": [
          {
            "observation_short": "Scattered display; items placed randomly without visible grouping matching their ratio sentence.",
            "friction_type": "math",
            "move_short": "Place scattered display next to a grouped display; ask where the 'for every' relationship shows up visually to help them group items physically.",
            "avoid_short": "Rearranging student manipulatives into groups yourself.",
            "glyph_observation": "SCATTERED UNGROUPED DISPLAY",
            "mlr": {
              "number": 7,
              "name": "Compare and Connect"
            }
          },
          {
            "observation_short": "Struggles to explain how colon notation relates to their sorted collection items.",
            "friction_type": "language-math",
            "move_short": "Have students point to physical item groups while reading their colon statement to a partner, then draft a clearer written explanation together.",
            "avoid_short": "Explaining colon notation without physical pointing.",
            "has_proficiency_variants": true,
            "glyph_observation": "COLON NOTATION CONFUSION",
            "mlr": {
              "number": 1,
              "name": "Stronger and Clearer Each Time"
            }
          }
        ],
        "synthesis_short": "Display grouped items alongside ratio sentences. Ask: how does grouping make the ratio statement obvious?"
      }
    ],
    "mlr_legend": [
      {
        "mlr": {
          "number": 1,
          "name": "Stronger and Clearer Each Time"
        },
        "one_line_cue": "Students refine a math idea through partner exchange — each round produces a stronger and clearer version than the one before."
      },
      {
        "mlr": {
          "number": 2,
          "name": "Collect and Display"
        },
        "one_line_cue": "Capture student category phrases on board to reference publicly."
      },
      {
        "mlr": {
          "number": 3,
          "name": "Critique, Correct, and Clarify"
        },
        "one_line_cue": "Display reversed ratio error; prompt class to fix order."
      },
      {
        "mlr": {
          "number": 7,
          "name": "Compare and Connect"
        },
        "one_line_cue": "Place two different ratio displays together; highlight matching structure."
      }
    ],
    "lesson_synthesis_short": "Compare circles-to-squares ratio statements. Emphasize that switching category word order requires switching numerical values to maintain accuracy."
  },
  "lesson_synthesis": {
    "prompt": "Display a collection of 4 red triangles and 3 blue squares. Write 'The ratio of blue squares to red triangles is 4 to 3' on the board. Ask: 'Looking at our shapes, what needs to change in this sentence so it matches what we see?' After a student suggests swapping the numbers to 3 to 4 (or swapping the words), point to each group of shapes as the class reads the corrected sentence in unison.",
    "builds_on": [
      "Activity 1.1: students sorted figures into distinct attribute categories and counted each group.",
      "Activity 1.2: students matched category names to numbers using formal ratio sentence structures.",
      "Activity 1.3: students paired visual collections directly with written and spoken ratio statements."
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
        "activity_outcome": "Students can categorize objects by attributes and identify counts for each group to prepare for ratio comparisons.",
        "outcome_type": "formulate_precisely",
        "resolved_outcome_type": "formulate_precisely",
        "affordances": {
          "flawed_sample_provided": false,
          "error_harvestable": true,
          "splittable_materials": false,
          "student_products_differ": false,
          "public_share_step": true,
          "frames_already_printed": false,
          "context_word_count": 36
        },
        "function": "Setup",
        "lead": 2,
        "second": null,
        "because": "Students are producing the informal wording this lesson will make precise — capture it now so the class can refine and reuse it.",
        "teacher_prep": null
      },
      {
        "activity_id": "1.2",
        "activity_outcome": "Students can write or say a sentence that describes a ratio with words and numbers in the correct order.",
        "outcome_type": "formulate_precisely",
        "resolved_outcome_type": "formulate_precisely",
        "affordances": {
          "flawed_sample_provided": false,
          "error_harvestable": true,
          "splittable_materials": false,
          "student_products_differ": true,
          "public_share_step": true,
          "frames_already_printed": true,
          "context_word_count": 70
        },
        "function": "Crux",
        "lead": 3,
        "second": 1,
        "because": "This is where the precise form is first attempted, so the characteristic error is worth surfacing and correcting together before it sets.",
        "teacher_prep": "No wrong answer is printed — capture one from the room. While students work, copy a typical error onto the board anonymously and have the class repair it."
      },
      {
        "activity_id": "1.3",
        "activity_outcome": "Students can accurately write ratio sentences for a sorted collection and create a visual display matching their statements.",
        "outcome_type": "connect_representations",
        "resolved_outcome_type": "connect_representations",
        "affordances": {
          "flawed_sample_provided": false,
          "error_harvestable": true,
          "splittable_materials": false,
          "student_products_differ": true,
          "public_share_step": true,
          "frames_already_printed": true,
          "context_word_count": 85
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
    "pipeline_version": "2026-08-22.5+76b7bb0788907be7",
    "cache_key": "4f4ea6dc33bc679b409a5819278fd094",
    "provider": "gemini",
    "model": "gemini-3.7-flash",
    "thinking": "medium",
    "generated_at": "2026-08-26T00:28:11.538Z",
    "served_from_cache": false
  }
} as unknown as LessonData;
