import { LessonData } from './types';

// ---------------------------------------------------------------------------
// Demo lesson — IM Grade 6, Unit 2, Lesson 1 "Introducing Ratios and Ratio
// Language". Loaded by the home page sample, /framework, /how-to, /qa, /audit.
//
// PROVENANCE: generated 2026-08-25T23:55:20.076Z on gemini/gemini-3.1-pro-preview
// (thinking=medium), pipeline 2026-08-22.5+76b7bb0788907be7, from
// "Grade 6 Mathematics, Unit 2.1 - Open Up Resources.pdf". Cache key 945236ff8e353c5547bec5c546241b49.
//
// GENERATED ON PRO, NOT THE LAUNCH MODEL. Production runs gemini-3.7-flash; this
// sample came from gemini-3.1-pro-preview on the preview deployment, generated
// with ?fresh=1 so it was never written to the cache. It is here to be read and
// compared. Before launch this should either be regenerated on Flash or the
// model decision revisited deliberately — a sample that does not match what
// teachers receive is worse than a stale one.
//
// The previous sample was generated on pipeline 2026-08-22.1, three versions
// back, and predated learner_profile entirely — so its WIDA chart rendered the
// generic 4x6 lens rows rather than this lesson's language. This one carries a
// learner_profile on all four activities.
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
  "arc_statement": "Students begin by sorting and counting collections of items informally. They then transition to describing these collections using formal ratio language, focusing heavily on the order of the words and numbers. The lesson culminates with students creating their own visual displays and writing matching ratio sentences, solidifying that the sequence in the sentence must mirror the quantities in the collection.",
  "destination": "Students can write and say sentences that describe a ratio, matching the order of the numbers to the order of the categories.",
  "key_vocabulary": [
    {
      "term": "ratio",
      "definition": "An association between two or more quantities, often written as 'a to b' or 'a : b'."
    },
    {
      "term": "category",
      "definition": "A group of items that share a common attribute, such as color or shape."
    }
  ],
  "activities": [
    {
      "id": "1.1",
      "title": "What Kind and How Many?",
      "function": "Setup",
      "duration": "10 min",
      "grouping": "Whole group",
      "language_demand": "low",
      "function_summary": "This activity activates prior knowledge about sorting and counting. It provides the raw materials (categories and quantities) that students will soon use to build formal ratio sentences.",
      "learning_target": "Students sort a collection of items into categories and count the number of items in each category.",
      "synthesis_prompt": "Synthesize toward sorting and counting by asking a student to point to the pile of blue items and state the total count.",
      "is_crux": false,
      "friction_points": [
        {
          "description": "Students struggle to name a third way to sort the figures.",
          "type": "math"
        },
        {
          "description": "Students use informal language like 'bunches' or 'piles' instead of categories.",
          "type": "language",
          "mlr": {
            "number": 2,
            "name": "Collect and Display"
          }
        }
      ],
      "success_signals": [
        "Students clearly identify distinct attributes like color or area.",
        "Students accurately count the items in each identified group."
      ],
      "teacher_moves": [
        {
          "text": "Write the words students use to describe their groups on the board, grouping similar terms together.",
          "mlr": {
            "number": 2,
            "name": "Collect and Display"
          }
        },
        {
          "text": "Ask a student to point to the specific attribute on the figure that determined its group."
        }
      ],
      "causal_link": "Sets up the quantities and categories needed for the ratio sentences in 1.2.",
      "extension": "Ask students if an item could belong to more than one category at the same time."
    },
    {
      "id": "1.2",
      "title": "The Teacher’s Collection",
      "function": "Crux",
      "duration": "15 min",
      "grouping": "Partners",
      "language_demand": "medium",
      "function_summary": "This is where students first encounter formal ratio sentence frames. The critical work is mapping the quantities they counted to the specific blanks in the sentences, ensuring the order matches.",
      "learning_target": "Students write sentences describing the ratio of categories in a collection using correct word and number order.",
      "synthesis_prompt": "Synthesize toward correct word and number order by writing 'ratio of red to blue is 5 to 3' and asking the class to point to the red items first.",
      "is_crux": true,
      "friction_points": [
        {
          "description": "Students write the numbers in the reverse order of the category words.",
          "type": "language-math",
          "mlr": {
            "number": 3,
            "name": "Critique, Correct, and Clarify"
          }
        },
        {
          "description": "Students leave blanks empty because they are unsure which number goes where.",
          "type": "language",
          "mlr": {
            "number": 1,
            "name": "Stronger and Clearer Each Time"
          }
        }
      ],
      "success_signals": [
        "Students write '3 to 2' when the words are 'squares to circles'.",
        "Students self-correct when reading their sentence aloud and noticing a mismatch."
      ],
      "teacher_moves": [
        {
          "text": "Write a flipped sentence on the board anonymously and ask the class to identify what needs fixing.",
          "mlr": {
            "number": 3,
            "name": "Critique, Correct, and Clarify"
          }
        },
        {
          "text": "Have students read their completed sentence to a partner, then revise it if the partner notices an order mismatch.",
          "mlr": {
            "number": 1,
            "name": "Stronger and Clearer Each Time"
          }
        }
      ],
      "causal_link": "Establishes the strict order rule required for the independent application in 1.3.",
      "extension": "null"
    },
    {
      "id": "1.3",
      "title": "The Student’s Collection",
      "function": "Application",
      "duration": "15 min",
      "grouping": "Small groups",
      "language_demand": "medium",
      "function_summary": "Students apply the order rule to a collection they design themselves. They translate between a visual representation and the formal written ratio.",
      "learning_target": "Students create a visual display of a collection and write ratio sentences that match their display.",
      "synthesis_prompt": "Synthesize toward matching visual displays to sentences by holding up a student's drawing and asking the class to read the matching ratio sentence together.",
      "is_crux": false,
      "friction_points": [
        {
          "description": "The visual display shows 4 stars and 2 moons, but the sentence says '2 to 4'.",
          "type": "math"
        },
        {
          "description": "Students struggle to articulate how their drawing matches their sentence.",
          "type": "language",
          "mlr": {
            "number": 1,
            "name": "Stronger and Clearer Each Time"
          }
        }
      ],
      "success_signals": [
        "The visual display clearly groups items by category.",
        "The written sentence perfectly mirrors the quantities shown in the display."
      ],
      "teacher_moves": [
        {
          "text": "Have students explain their drawing to a partner, then write a new sentence based on the partner's feedback.",
          "mlr": {
            "number": 1,
            "name": "Stronger and Clearer Each Time"
          }
        },
        {
          "text": "Point to the first word in the sentence and ask the student to point to that item in their drawing."
        }
      ],
      "causal_link": "null",
      "extension": "Ask students to write a sentence using the 'for every' frame for their display."
    },
    {
      "id": "summary",
      "title": "Lesson 1 Summary",
      "function": "Synthesis",
      "duration": "5 min",
      "grouping": "Whole group",
      "language_demand": "medium",
      "function_summary": "This section formalizes the definition of a ratio and reviews the correct ways to describe the collections seen during the lesson.",
      "learning_target": "Students consolidate their understanding of ratio language and the importance of order.",
      "synthesis_prompt": "Synthesize toward the importance of order by displaying the final squares and circles image and asking a student to trace the connection from the word 'squares' to the number '3'.",
      "is_crux": false,
      "friction_points": [
        {
          "description": "Students read the summary but cannot explain why '3 to 6' is different from '6 to 3'.",
          "type": "language-math",
          "mlr": {
            "number": 1,
            "name": "Stronger and Clearer Each Time"
          }
        },
        {
          "description": "Students confuse the 'for every' structure with the 'ratio of' structure.",
          "type": "language"
        }
      ],
      "success_signals": [
        "Students can articulate that swapping the numbers changes which item has more.",
        "Students correctly identify the quantities in the summary images."
      ],
      "teacher_moves": [
        {
          "text": "Have students turn to a partner and explain why the order matters, then write down their best explanation.",
          "mlr": {
            "number": 1,
            "name": "Stronger and Clearer Each Time"
          }
        },
        {
          "text": "Cover the numbers in the summary text and ask students to supply them based on the image."
        }
      ],
      "causal_link": "null",
      "extension": "null"
    }
  ],
  "adaptation_guardrails": {
    "mathematical_purpose": "Establishing that a ratio describes two quantities and the order of the words must match the order of the numbers.",
    "safe_to_change": [
      "The specific items used in the teacher's collection.",
      "The colors used in the visual displays.",
      "The number of categories students sort into initially."
    ],
    "do_not_remove": [
      {
        "text": "The partner share where students read their sentences aloud to check for order.",
        "mlr": {
          "number": 1,
          "name": "Stronger and Clearer Each Time"
        }
      },
      {
        "text": "The public correction of a flipped sentence.",
        "mlr": {
          "number": 3,
          "name": "Critique, Correct, and Clarify"
        }
      },
      {
        "text": "The requirement to create a visual display that matches the written sentence."
      }
    ],
    "rigor_check": "Are students relying on the visual order of the items on the table, or are they actively matching the category words to the numbers in the sentence?",
    "by_proficiency": {
      "emerging": {
        "text": "Have the student point to the physical items while saying the corresponding number.",
        "mlr": {
          "number": 1,
          "name": "Stronger and Clearer Each Time"
        }
      },
      "developing": {
        "text": "Provide a sentence frame with the category words already filled in, leaving only the numbers blank.",
        "mlr": {
          "number": 1,
          "name": "Stronger and Clearer Each Time"
        }
      },
      "expanding": {
        "text": "Ask the student to explain to a partner how the meaning of the sentence changes if the numbers are swapped.",
        "mlr": {
          "number": 1,
          "name": "Stronger and Clearer Each Time"
        }
      }
    }
  },
  "anticipated_thinking": {
    "orientation": "Students will bring an intuitive ability to sort and count items, but they will likely struggle to map the order of the words to the order of the numbers in a formal ratio sentence. The work of this lesson is helping them see that 'the ratio of A to B is 3 to 2' means something fundamentally different than 'the ratio of A to B is 2 to 3.'",
    "activities": [
      {
        "activity_id": "1.1",
        "patterns": [
          {
            "label": "Sorting by color",
            "frequency": "most students",
            "type": "on-track",
            "description": "Students correctly identify the colors and count the shapes in each group.",
            "move": "Ask them to describe how they decided which shape goes in which group.",
            "is_mll_specific": false
          },
          {
            "label": "Informal comparison language",
            "frequency": "some students",
            "type": "language-math",
            "description": "Students use phrases like 'there are more blue ones' or '3 of these and 2 of those' without formal ratio language.",
            "move": "Listen for and record these informal phrases on the board. Point to them and ask the class how we might make them more precise.",
            "is_mll_specific": true,
            "mlr": {
              "number": 2,
              "name": "Collect and Display"
            }
          },
          {
            "label": "Struggling with 'area' category",
            "frequency": "watch for this",
            "type": "partial",
            "description": "Students are unsure how to sort by area, perhaps confusing it with shape type.",
            "move": "Ask them to look at the size of the shapes and find the ones that take up the same amount of space.",
            "is_mll_specific": false
          }
        ],
        "sentence_frames": [
          {
            "frame": "I sorted the shapes by ________."
          },
          {
            "frame": "There are ________ groups because ________.",
            "mlr": {
              "number": 2,
              "name": "Collect and Display"
            }
          }
        ],
        "questions_to_listen_for": [
          "How did you decide to group these together?",
          "What do all the items in this group have in common?"
        ]
      },
      {
        "activity_id": "1.2",
        "patterns": [
          {
            "label": "Flipping the order",
            "frequency": "most students",
            "type": "misconception",
            "description": "Students write the numbers in the opposite order of the words, defaulting to putting the larger number first.",
            "move": "Write the flawed sentence on the board anonymously. Ask the class: 'Does this sentence match our collection? How can we fix it so the numbers match the words?'",
            "is_mll_specific": true,
            "mlr": {
              "number": 3,
              "name": "Critique, Correct, and Clarify"
            }
          },
          {
            "label": "Correct order, informal words",
            "frequency": "some students",
            "type": "partial",
            "description": "Students match the numbers to the categories but don't use the provided sentence frames.",
            "move": "Have them share their sentence with a partner. Their partner asks: 'Can you say that using the word ratio?' Then have them write a stronger version.",
            "is_mll_specific": true,
            "mlr": {
              "number": 1,
              "name": "Stronger and Clearer Each Time"
            }
          },
          {
            "label": "Accurate ratio sentences",
            "frequency": "some students",
            "type": "on-track",
            "description": "Students correctly use the frames, matching the order of words and numbers.",
            "move": "Ask them to write a second sentence using a different frame from the list.",
            "is_mll_specific": false
          }
        ],
        "sentence_frames": [
          {
            "frame": "The ratio of ________ to ________ is ________ to ________."
          },
          {
            "frame": "I know the order is correct because ________."
          }
        ],
        "questions_to_listen_for": [
          "Which number goes with which category?",
          "Does the order of the numbers matter?"
        ]
      },
      {
        "activity_id": "1.3",
        "patterns": [
          {
            "label": "Visual doesn't match sentence",
            "frequency": "watch for this",
            "type": "misconception",
            "description": "The student's visual display shows a different ratio than the one written in their sentence.",
            "move": "Ask them to point to the part of the visual that represents the first category in their sentence, then the second.",
            "is_mll_specific": false
          },
          {
            "label": "Vague category names",
            "frequency": "some students",
            "type": "language-math",
            "description": "Students use vague words like 'things' or 'pieces' instead of specific category names in their sentences.",
            "move": "Have them read their sentence to a partner. The partner asks: 'What exactly are the items?' The student then revises their sentence to be more specific.",
            "is_mll_specific": true,
            "mlr": {
              "number": 1,
              "name": "Stronger and Clearer Each Time"
            }
          },
          {
            "label": "Clear and matching display",
            "frequency": "most students",
            "type": "on-track",
            "description": "Students create a visual that perfectly matches their written ratio sentence.",
            "move": "Ask them how someone looking at their display would know which number comes first in the ratio.",
            "is_mll_specific": false
          }
        ],
        "sentence_frames": [
          {
            "frame": "My visual shows the ratio ________ to ________."
          },
          {
            "frame": "For every ________, I drew ________."
          }
        ],
        "questions_to_listen_for": [
          "How does your picture show the ratio?",
          "What does this part of your drawing represent?"
        ]
      },
      {
        "activity_id": "summary",
        "patterns": [
          {
            "label": "Explaining order importance",
            "frequency": "most students",
            "type": "on-track",
            "description": "Students can articulate that the first number must match the first word.",
            "move": "Ask them to give an example of what happens if you flip the numbers.",
            "is_mll_specific": false
          },
          {
            "label": "Incomplete explanation",
            "frequency": "some students",
            "type": "language-math",
            "description": "Students know order matters but struggle to explain why clearly.",
            "move": "Have them explain it to a partner first. The partner asks clarifying questions. Then, have them write a stronger, clearer explanation.",
            "is_mll_specific": true,
            "mlr": {
              "number": 1,
              "name": "Stronger and Clearer Each Time"
            }
          },
          {
            "label": "Still flipping order",
            "frequency": "watch for this",
            "type": "misconception",
            "description": "Students still mix up the order of numbers and categories when summarizing.",
            "move": "Point to a visual and ask them to touch the items as they say the sentence.",
            "is_mll_specific": false
          }
        ],
        "sentence_frames": [
          {
            "frame": "When writing a ratio, the order matters because ________."
          },
          {
            "frame": "If I say the ratio of A to B, the first number must be ________."
          }
        ],
        "questions_to_listen_for": [
          "Why can't we just write the numbers in any order?",
          "How do we know which number comes first?"
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
            "label": "Sorts and counts accurately",
            "interpretation": "The student has successfully grouped the items by a single attribute and quantified each group, preparing them for ratio comparisons.",
            "is_mll": false,
            "flat_move": {
              "move": "Ask them to write the total number next to each group on their paper.",
              "avoid": "Moving them immediately to writing ratio sentences before the next activity begins.",
              "nonverbal": "Point to the sorted groups and hand them a pencil.",
              "say": "Write the number of items next to each group."
            },
            "proficiency_moves": null,
            "mll_framework_note": "null",
            "proficiency_divergence_note": "null"
          },
          {
            "scenario_type": "productive-struggle",
            "label": "Points to groups without naming categories",
            "interpretation": "The student can physically sort the items but lacks or is hesitant to use the English vocabulary to name the attribute they sorted by.",
            "is_mll": true,
            "flat_move": null,
            "proficiency_moves": {
              "emerging": {
                "move": "Ask what is the same about the items in one group. Listen for any descriptive word, write it on the board, and say it aloud.",
                "avoid": "Naming the category for them before they offer a word.",
                "nonverbal": "Point to one specific group of sorted items and gesture a circle around them.",
                "say": "What is the same about these?"
              },
              "developing": {
                "move": "Ask them to name the two groups. Write their exact phrases on the board and read them back.",
                "avoid": "Correcting informal language like 'pointy ones' to 'triangles' immediately.",
                "nonverbal": "Point back and forth between the two distinct groups.",
                "say": "What do you call this group, and what do you call that group?"
              },
              "expanding": {
                "move": "Ask them to describe their sorting rule to a partner. Listen to their conversation and write the category names they use on the board.",
                "avoid": "Skipping the partner share and asking them to report directly to you.",
                "nonverbal": "Gesture between the student and their elbow partner.",
                "say": "Tell your partner how you decided what goes where."
              }
            },
            "mll_framework_note": null,
            "proficiency_divergence_note": "Emerging relies on teacher-supplied vocabulary based on student pointing; Expanding requires the student to articulate the rule to a peer.",
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
            "label": "Numbers and words are flipped",
            "interpretation": "The student understands the quantities but has not yet mapped the syntactic rule that the order of the numbers must match the order of the category words.",
            "is_mll": true,
            "flat_move": null,
            "proficiency_moves": {
              "emerging": {
                "move": "Write the flipped sentence on a whiteboard. Ask the student to count the items for the first word written.",
                "avoid": "Telling them the order is wrong.",
                "nonverbal": "Point to the first category word in the sentence, then point to the physical collection.",
                "say": "Let's check. Count these for me."
              },
              "developing": {
                "move": "Write the flipped sentence on a whiteboard anonymously. Ask pairs to read it and check the collection to see if the numbers match the objects.",
                "avoid": "Pointing out the mismatch yourself.",
                "nonverbal": "Hand the whiteboard to the pair and gesture to the collection.",
                "say": "Read this sentence. Does it match what is on the table?"
              },
              "expanding": {
                "move": "Write the flipped sentence on a whiteboard. Ask pairs to discuss why a reader might get confused by this sentence, then write a corrected version together.",
                "avoid": "Providing the corrected version for them to copy.",
                "nonverbal": "Tap the numbers and the words in the sentence.",
                "say": "Tell your partner why this sentence might confuse someone who can't see the table. Then fix it."
              }
            },
            "mll_framework_note": null,
            "proficiency_divergence_note": "Emerging focuses on physically verifying the count against the written word; Expanding focuses on analyzing why the sentence is confusing to a reader.",
            "mlr": {
              "number": 3,
              "name": "Critique, Correct, and Clarify"
            }
          },
          {
            "scenario_type": "partial-understanding",
            "label": "Writes numbers without category names",
            "interpretation": "The student recognizes the ratio relationship but is treating it as a bare number operation rather than a description of a specific context.",
            "is_mll": false,
            "flat_move": {
              "move": "Ask them what objects the numbers represent in the collection.",
              "avoid": "Accepting the bare numbers or filling in the words for them.",
              "nonverbal": "Point to the numbers on their paper.",
              "say": "What does the 5 mean, and what does the 2 mean?"
            },
            "proficiency_moves": null,
            "mll_framework_note": "null",
            "proficiency_divergence_note": "null"
          },
          {
            "scenario_type": "productive-insight",
            "label": "Uses a scaled-down equivalent ratio",
            "interpretation": "The student notices the multiplicative structure and groups the items, writing '1 to 2' for a collection of 3 and 6.",
            "is_mll": false,
            "flat_move": {
              "move": "Ask them to show you where that smaller group lives inside their larger collection.",
              "avoid": "Telling them they must use the total counts of 3 and 6.",
              "nonverbal": "Hand them a pencil and gesture to the collection.",
              "say": "Show me where that 1 and 2 is in your pile."
            },
            "proficiency_moves": null,
            "mll_framework_note": "null",
            "proficiency_divergence_note": "null"
          }
        ]
      },
      {
        "activity_id": "1.3",
        "scenarios": [
          {
            "scenario_type": "common-error",
            "label": "Drawing does not match written sentence",
            "interpretation": "The student has lost track of the correspondence between their visual representation and their written statement.",
            "is_mll": false,
            "flat_move": {
              "move": "Ask them to read their sentence aloud while pointing to the corresponding shapes in their drawing.",
              "avoid": "Pointing out the discrepancy yourself.",
              "nonverbal": "Point to the first word in their sentence, then gesture to the drawing.",
              "say": "Read this out loud, and point to the shapes as you say them."
            },
            "proficiency_moves": null,
            "mll_framework_note": "null",
            "proficiency_divergence_note": "null"
          },
          {
            "scenario_type": "productive-struggle",
            "label": "Draws correctly but leaves sentence frame blank",
            "interpretation": "The student understands the ratio visually but needs support bridging from the visual representation to the formal academic sentence structure.",
            "is_mll": true,
            "flat_move": null,
            "proficiency_moves": {
              "emerging": {
                "move": "Have them point to their drawing while a partner says what they see. Then they swap roles.",
                "avoid": "Forcing them to write the sentence before they have heard it spoken.",
                "nonverbal": "Guide the student's finger to point at the first group of shapes in their drawing.",
                "say": "Point to your shapes. Partner, what do you see?"
              },
              "developing": {
                "move": "Have them tell a partner what they drew. The partner asks 'How many?' for each category before they write anything in the frame.",
                "avoid": "Letting them write in silence without oral rehearsal.",
                "nonverbal": "Cover the sentence frame with your hand temporarily.",
                "say": "Tell your partner what is in your drawing first."
              },
              "expanding": {
                "move": "Have them draft a sentence, read it to a partner, and ask the partner if the order of the words matches the drawing. They revise based on the answer.",
                "avoid": "Checking the sentence for them.",
                "nonverbal": "Gesture between the written sentence and the drawing.",
                "say": "Write a draft. Ask your partner: does my word order match my picture?"
              }
            },
            "mll_framework_note": null,
            "proficiency_divergence_note": "Emerging relies on partner observation; Developing rehearses orally before writing; Expanding drafts and revises based on peer feedback regarding order.",
            "mlr": {
              "number": 1,
              "name": "Stronger and Clearer Each Time"
            }
          },
          {
            "scenario_type": "on-track",
            "label": "Writes multiple correct sentences for a 3-category collection",
            "interpretation": "The student is fluent with the ratio language and can flexibly describe different pairs within a larger set.",
            "is_mll": false,
            "flat_move": {
              "move": "Ask them to choose their favorite sentence and practice reading it aloud to prepare for the class share.",
              "avoid": "Asking them to write even more sentences.",
              "nonverbal": "Tap the paper where the sentences are written.",
              "say": "Pick the one you want to share with the class and practice saying it."
            },
            "proficiency_moves": null,
            "mll_framework_note": "null",
            "proficiency_divergence_note": "null"
          }
        ]
      },
      {
        "activity_id": "summary",
        "scenarios": [
          {
            "scenario_type": "partial-understanding",
            "label": "Drops connecting words when reading ratio",
            "interpretation": "The student is focusing heavily on the nouns and numbers, omitting the functional language ('ratio of', 'to', 'for every') that makes the mathematical relationship precise.",
            "is_mll": true,
            "flat_move": null,
            "proficiency_moves": {
              "emerging": {
                "move": "Say the full sentence slowly, emphasizing the connecting words. Ask them to repeat it with you.",
                "avoid": "Accepting the telegraphic speech without modeling the full structure.",
                "nonverbal": "Point to the squares, then point to the circles in the image as you say the words.",
                "say": "The ratio of squares to circles. Say it with me."
              },
              "developing": {
                "move": "Provide the written frame 'The ratio of ___ to ___ is ___ to ___.' Ask them to read their numbers into the frame with a partner.",
                "avoid": "Correcting them verbally without providing a visual anchor for the missing words.",
                "nonverbal": "Point to the blank spaces in the sentence frame as they speak.",
                "say": "Read this frame to your partner, and fill in your words."
              },
              "expanding": {
                "move": "Ask them to listen to a partner say the sentence, notice which small connecting words the partner used, and try saying it again.",
                "avoid": "Telling them exactly which words they missed.",
                "nonverbal": "Cup your ear to signal listening.",
                "say": "Listen to how your partner says it. What small words did they use? Try it again."
              }
            },
            "mll_framework_note": null,
            "proficiency_divergence_note": "Emerging uses choral repetition; Developing uses a visual frame with a partner; Expanding analyzes a partner's syntax to improve their own.",
            "mlr": {
              "number": 1,
              "name": "Stronger and Clearer Each Time"
            }
          },
          {
            "scenario_type": "on-track",
            "label": "Uses 'for every' correctly with grouped quantities",
            "interpretation": "The student has internalized both the ratio language and the concept of equivalent ratios through grouping.",
            "is_mll": false,
            "flat_move": {
              "move": "Ask them how they know that statement is true when the picture shows a larger total number of items.",
              "avoid": "Simply saying 'good job' and moving on.",
              "nonverbal": "Gesture to the entire collection on the board.",
              "say": "How do you know there are 2 for every 1, when I see 6 and 3 up here?"
            },
            "proficiency_moves": null,
            "mll_framework_note": "null",
            "proficiency_divergence_note": "null"
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
            "discourse_does": "Names a single category like 'color' or 'blue'.",
            "discourse_reaching": "Connecting the category name to the count of items.",
            "sentence_does": "Says 'five blue'.",
            "sentence_reaching": "Using a complete statement like 'There are five blue shapes.'",
            "word_does": "Uses everyday color or shape words.",
            "word_reaching": "Adopting the agreed-upon class category names."
          },
          {
            "band": "developing",
            "discourse_does": "Reports the category and the count together.",
            "discourse_reaching": "Describing the entire sorting rule for the collection.",
            "sentence_does": "Says 'I have five blue and three red.'",
            "sentence_reaching": "Using 'sorted by' to explain the grouping.",
            "word_does": "Uses 'group' and 'category'.",
            "word_reaching": "Using 'amount' or 'quantity'."
          },
          {
            "band": "expanding",
            "discourse_does": "Explains the sorting rule and lists the resulting groups and counts.",
            "discourse_reaching": "Comparing different ways to sort the same collection.",
            "sentence_does": "Says 'If we sort by color, there are three groups.'",
            "sentence_reaching": "Using conditional structures to propose alternative sorts.",
            "word_does": "Uses 'category', 'amount', and specific shape names.",
            "word_reaching": "Using 'ratio' informally."
          }
        ],
        "language_demands": {
          "receptive": "Listen to peer descriptions of how they sorted the collection.",
          "productive": "Name the categories used to sort the items and state the count for each.",
          "interactive": "Discuss different possible ways to sort the same collection.",
          "everyday_to_academic_bridge": "Moving from everyday descriptions of objects (like 'the blue ones') to formal category names.",
          "elsf_guidelines_applied": [
            1,
            2,
            6
          ]
        },
        "functional_language": {
          "language_functions": [
            "describe categories",
            "quantify items"
          ],
          "example_phrases": [
            "I sorted by...",
            "There are [number] in this group."
          ],
          "l1_bridge": "Students can use everyday language or L1 to name the categories before translating to English shape or color names.",
          "elsf_guidelines_applied": [
            1,
            3,
            7,
            12
          ]
        }
      },
      {
        "activity_id": "1.2",
        "learner_profile": [
          {
            "band": "emerging",
            "discourse_does": "Points to the two groups and says their numbers.",
            "discourse_reaching": "Placing the numbers into the provided sentence frame.",
            "sentence_does": "Says 'three squares, two circles'.",
            "sentence_reaching": "Using the 'is ___ to ___' structure.",
            "word_does": "Uses number words and shape names.",
            "word_reaching": "Using the word 'ratio'."
          },
          {
            "band": "developing",
            "discourse_does": "Reads a completed sentence frame aloud.",
            "discourse_reaching": "Self-correcting if the word order doesn't match the number order.",
            "sentence_does": "Says 'The ratio of squares to circles is 3 to 2.'",
            "sentence_reaching": "Explaining why the 3 comes first.",
            "word_does": "Uses 'ratio' and 'to'.",
            "word_reaching": "Using 'for every'."
          },
          {
            "band": "expanding",
            "discourse_does": "Writes multiple ratio sentences for the same collection.",
            "discourse_reaching": "Explaining how the two sentences describe the same picture differently.",
            "sentence_does": "Says 'For every 3 squares, there are 2 circles.'",
            "sentence_reaching": "Using parallel structure to flip the ratio: 'and for every 2 circles, there are 3 squares.'",
            "word_does": "Uses 'ratio', 'category', and 'for every'.",
            "word_reaching": "Using 'association' or 'relationship'."
          }
        ],
        "language_demands": {
          "receptive": "Read the provided ratio sentence frames.",
          "productive": "Write sentences matching the frames, ensuring the order of words matches the order of numbers.",
          "interactive": "Discuss the order of words and numbers with a partner to check for accuracy.",
          "everyday_to_academic_bridge": "Bridging from '3 squares and 2 circles' to 'The ratio of squares to circles is 3 to 2.'",
          "elsf_guidelines_applied": [
            1,
            2,
            6
          ]
        },
        "functional_language": {
          "language_functions": [
            "describe a ratio",
            "sequence quantities"
          ],
          "example_phrases": [
            "The ratio of [category 1] to [category 2] is [number 1] to [number 2].",
            "For every [number 1] [category 1], there are [number 2] [category 2]."
          ],
          "l1_bridge": "The concept of 'for every' can be mapped to L1 phrases indicating rate or correspondence.",
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
        "learner_profile": [
          {
            "band": "emerging",
            "discourse_does": "Shows their physical sort and points to the groups.",
            "discourse_reaching": "Matching their physical groups to a written ratio sentence.",
            "sentence_does": "Says 'four here, two here'.",
            "sentence_reaching": "Using the '___ : ___' format verbally.",
            "word_does": "Uses basic nouns for their items.",
            "word_reaching": "Using 'category' to describe their groups."
          },
          {
            "band": "developing",
            "discourse_does": "Reads their ratio sentence while pointing to the corresponding parts of their display.",
            "discourse_reaching": "Explaining how the display proves the sentence.",
            "sentence_does": "Says 'The ratio of red to blue is 4 to 2.'",
            "sentence_reaching": "Adding 'because' to link the sentence to the visual.",
            "word_does": "Uses 'ratio' and the category names.",
            "word_reaching": "Using 'visual display' or 'represent'."
          },
          {
            "band": "expanding",
            "discourse_does": "Presents their display and reads multiple corresponding sentences.",
            "discourse_reaching": "Critiquing whether a peer's sentence matches their display.",
            "sentence_does": "Says 'My display shows that for every 4 red items, there are 2 blue items.'",
            "sentence_reaching": "Using comparative language to discuss different displays.",
            "word_does": "Uses 'ratio', 'for every', and specific category names.",
            "word_reaching": "Using 'equivalent' informally if they grouped items."
          }
        ],
        "language_demands": {
          "receptive": "Interpret a peer's visual display of a sorted collection.",
          "productive": "Write ratio sentences for their own collection and explain how the display matches the sentence.",
          "interactive": "Share the display and sentences with the class or group.",
          "everyday_to_academic_bridge": "Translating a physical arrangement of items into a formal written ratio sentence.",
          "elsf_guidelines_applied": [
            1,
            2,
            6
          ]
        },
        "functional_language": {
          "language_functions": [
            "represent a ratio visually",
            "describe a ratio"
          ],
          "example_phrases": [
            "My display shows...",
            "The ratio of [category 1] to [category 2] is [number 1] : [number 2]."
          ],
          "l1_bridge": "Students can arrange items physically to show the ratio before attaching English words.",
          "elsf_guidelines_applied": [
            1,
            3,
            7,
            12
          ]
        }
      },
      {
        "activity_id": "summary",
        "learner_profile": [
          {
            "band": "emerging",
            "discourse_does": "Repeats a modeled ratio sentence.",
            "discourse_reaching": "Generating a new ratio sentence for a familiar picture.",
            "sentence_does": "Says 'Ratio is 3 to 2.'",
            "sentence_reaching": "Including the category names in the sentence.",
            "word_does": "Uses 'ratio' and numbers.",
            "word_reaching": "Using 'association' or 'quantities'."
          },
          {
            "band": "developing",
            "discourse_does": "Reads a complete ratio sentence from the summary.",
            "discourse_reaching": "Explaining the importance of the order of the words and numbers.",
            "sentence_does": "Says 'The ratio of squares to circles is 3 to 2.'",
            "sentence_reaching": "Using 'because' to justify the order.",
            "word_does": "Uses 'ratio', 'category', and 'order'.",
            "word_reaching": "Using 'association'."
          },
          {
            "band": "expanding",
            "discourse_does": "Explains what a ratio is using an example from the lesson.",
            "discourse_reaching": "Creating a new context for a ratio.",
            "sentence_does": "Says 'A ratio is an association between two quantities, like 3 squares for every 2 circles.'",
            "sentence_reaching": "Using abstract terms like 'quantities' and 'association' confidently.",
            "word_does": "Uses 'ratio', 'association', and 'quantities'.",
            "word_reaching": "Using 'represent' or 'describe'."
          }
        ],
        "language_demands": {
          "receptive": "Read the summary text and the formal definition of a ratio.",
          "productive": "State a ratio sentence accurately, maintaining the correct order.",
          "interactive": "Refine a ratio sentence with a partner to ensure precision.",
          "everyday_to_academic_bridge": "Solidifying the formal definition of 'ratio' as an association between quantities.",
          "elsf_guidelines_applied": [
            1,
            2,
            6
          ]
        },
        "functional_language": {
          "language_functions": [
            "define a ratio",
            "describe an association"
          ],
          "example_phrases": [
            "A ratio is...",
            "The ratio of [category 1] to [category 2] is [number 1] to [number 2]."
          ],
          "l1_bridge": "Discussing the concept of 'association' using familiar L1 examples like ingredients in a recipe.",
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
        "language_work": "Students use informal language to describe how they sort a collection of items.",
        "mlrs": [
          {
            "number": 2,
            "name": "Collect and Display",
            "why_here": "Students are producing the informal wording this lesson will make precise — capture it now so the class can refine and reuse it."
          }
        ]
      },
      {
        "activity_id": "1.2",
        "language_work": "Students write their first formal ratio sentences, focusing on matching the order of words to the order of numbers.",
        "mlrs": [
          {
            "number": 3,
            "name": "Critique, Correct, and Clarify",
            "why_here": "This is where the precise form is first attempted, so the characteristic error is worth surfacing and correcting together before it sets."
          },
          {
            "number": 1,
            "name": "Stronger and Clearer Each Time",
            "why_here": "After analyzing a flawed sentence, students need an immediate opportunity to revise their own drafts to ensure the order matches."
          }
        ]
      },
      {
        "activity_id": "1.3",
        "language_work": "Students connect a physical or visual display to a written ratio sentence and explain the connection to peers.",
        "mlrs": [
          {
            "number": 1,
            "name": "Stronger and Clearer Each Time",
            "why_here": "Students already hold a formulation; the work now is making it clearer for a reader who cannot see their thinking."
          }
        ]
      },
      {
        "activity_id": "summary",
        "language_work": "Students consolidate the formal definition of a ratio and practice saying ratio sentences accurately.",
        "mlrs": [
          {
            "number": 1,
            "name": "Stronger and Clearer Each Time",
            "why_here": "Students hold an idea worth sharpening, and a second draft is the shortest route to precision."
          }
        ]
      }
    ]
  },
  "wristband": {
    "arc_one_line": "Sort items, count categories, and write precise ratio sentences matching order.",
    "preflight": [
      "Prep a physical collection of items to sort.",
      "Write the three ratio sentence frames on the board.",
      "Identify a student error in order to use for MLR 3."
    ],
    "top_signals": [
      "Matches number order to category word order.",
      "Uses the provided sentence frames accurately.",
      "Groups items visually to match the ratio."
    ],
    "top_frictions": [
      "Flips the numbers relative to the words.",
      "Writes fractions instead of ratio notation.",
      "Struggles to name clear, distinct categories."
    ],
    "activities": [
      {
        "activity_id": "1.1",
        "tiles": [
          {
            "observation_short": "Naming categories informally — using everyday words instead of math attributes.",
            "friction_type": "language",
            "move_short": "Record their category names on the board. MLR 2 Collect and Display validates their language while setting up the shift to precise ratio terms.",
            "avoid_short": "Correcting their informal words.",
            "glyph_observation": "INFORMAL CATEGORIES",
            "mlr": {
              "number": 2,
              "name": "Collect and Display"
            }
          },
          {
            "observation_short": "Struggling to see a third way to sort the shapes.",
            "friction_type": "math",
            "move_short": "Ask what else is different about the shapes. MLR 8 wait time gives them space to notice attributes like number of sides or shading.",
            "avoid_short": "Telling them the third way.",
            "glyph_observation": "STUCK ON SORTING",
            "mlr": {
              "number": 2,
              "name": "Collect and Display"
            }
          }
        ],
        "synthesis_short": "Point to the displayed categories. Ask: how do these groups help us compare amounts?"
      },
      {
        "activity_id": "1.2",
        "tiles": [
          {
            "observation_short": "Numbers flipped — defaulted to bigger-first; missed the word order.",
            "friction_type": "language-math",
            "move_short": "Display the flipped sentence anonymously. MLR 3 Critique, Correct, and Clarify lets the class spot the mismatch and fix the order together.",
            "avoid_short": "Fixing the order yourself.",
            "is_crux_moment": true,
            "has_proficiency_variants": true,
            "glyph_observation": "NUMBERS FLIPPED",
            "mlr": {
              "number": 3,
              "name": "Critique, Correct, and Clarify"
            }
          },
          {
            "observation_short": "Wrote a correct sentence but didn't use the provided frames.",
            "friction_type": "language",
            "move_short": "Have them read it to a partner. MLR 1 Stronger and Clearer prompts them to rewrite it using the formal frame structure.",
            "avoid_short": "Accepting the informal draft.",
            "glyph_observation": "IGNORED FRAMES",
            "mlr": {
              "number": 1,
              "name": "Stronger and Clearer Each Time"
            }
          }
        ],
        "synthesis_short": "Surface the corrected sentence. Ask: why does the order of the numbers have to match the words?"
      },
      {
        "activity_id": "1.3",
        "tiles": [
          {
            "observation_short": "Visual display doesn't clearly match the written ratio sentence.",
            "friction_type": "math",
            "move_short": "Partner swap displays. MLR 1 Stronger and Clearer lets the partner say what they see, prompting a revision to make the grouping obvious.",
            "avoid_short": "Pointing out the mismatch.",
            "glyph_observation": "UNCLEAR DISPLAY",
            "mlr": {
              "number": 1,
              "name": "Stronger and Clearer Each Time"
            }
          },
          {
            "observation_short": "Using 'out of' language instead of 'to' or 'for every'.",
            "friction_type": "language-math",
            "move_short": "Revoice using the frame. MLR 8 revoicing shifts them from part-whole fraction language to part-part ratio language.",
            "avoid_short": "Saying 'out of' is wrong.",
            "has_proficiency_variants": true,
            "glyph_observation": "OUT OF LANGUAGE",
            "mlr": {
              "number": 1,
              "name": "Stronger and Clearer Each Time"
            }
          }
        ],
        "synthesis_short": "Show two contrasting visual displays. Ask: how do both of these show a 3 to 2 ratio?"
      },
      {
        "activity_id": "summary",
        "tiles": [
          {
            "observation_short": "Can say the ratio but struggles to explain what it means.",
            "friction_type": "language",
            "move_short": "Draft an explanation, share with a partner. MLR 1 Stronger and Clearer builds their confidence to articulate the association between quantities.",
            "avoid_short": "Skipping the partner share.",
            "glyph_observation": "CANNOT EXPLAIN",
            "mlr": {
              "number": 1,
              "name": "Stronger and Clearer Each Time"
            }
          },
          {
            "observation_short": "Confuses the colon notation with division or fractions.",
            "friction_type": "math",
            "move_short": "Read the colon aloud as 'to'. MLR 8 choral response reinforces that the colon is just another way to write the word 'to'.",
            "avoid_short": "Explaining fractions.",
            "glyph_observation": "COLON CONFUSION",
            "mlr": {
              "number": 1,
              "name": "Stronger and Clearer Each Time"
            }
          }
        ],
        "synthesis_short": "Display the 3 to 6 and 1 to 2 sentences. Ask: how do both describe the same collection?"
      }
    ],
    "mlr_legend": [
      {
        "mlr": {
          "number": 1,
          "name": "Stronger and Clearer Each Time"
        },
        "one_line_cue": "Draft, partner share, revise for precision."
      },
      {
        "mlr": {
          "number": 2,
          "name": "Collect and Display"
        },
        "one_line_cue": "Record student words, display, refine together."
      },
      {
        "mlr": {
          "number": 3,
          "name": "Critique, Correct, and Clarify"
        },
        "one_line_cue": "Display error, ask what's wrong, fix together."
      }
    ],
    "lesson_synthesis_short": "Surface the 'for every' frame. Ask: how does the order of words tell us the order of numbers?"
  },
  "lesson_synthesis": {
    "prompt": "Display the image of 3 squares and 2 circles. Ask a student to read the sentence 'The ratio of squares to circles is 3 to 2.' Ask the class what the picture would look like if the sentence said '2 to 3'.",
    "builds_on": [
      "1.1: students named the categories",
      "1.2: students matched number order to word order",
      "1.3: students connected sentences to visual displays"
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
        "activity_outcome": "Students can sort items into categories and count them to prepare for describing ratios.",
        "outcome_type": "formulate_precisely",
        "resolved_outcome_type": "formulate_precisely",
        "affordances": {
          "flawed_sample_provided": false,
          "error_harvestable": false,
          "splittable_materials": false,
          "student_products_differ": false,
          "public_share_step": false,
          "frames_already_printed": false,
          "context_word_count": 35
        },
        "function": "Setup",
        "lead": 2,
        "second": null,
        "because": "Students are producing the informal wording this lesson will make precise — capture it now so the class can refine and reuse it.",
        "teacher_prep": null
      },
      {
        "activity_id": "1.2",
        "activity_outcome": "Students can write a sentence that describes a ratio, ensuring words and numbers are in the correct order.",
        "outcome_type": "formulate_precisely",
        "resolved_outcome_type": "formulate_precisely",
        "affordances": {
          "flawed_sample_provided": false,
          "error_harvestable": true,
          "splittable_materials": false,
          "student_products_differ": false,
          "public_share_step": false,
          "frames_already_printed": true,
          "context_word_count": 55
        },
        "function": "Crux",
        "lead": 3,
        "second": 1,
        "because": "This is where the precise form is first attempted, so the characteristic error is worth surfacing and correcting together before it sets.",
        "teacher_prep": "No wrong answer is printed — capture one from the room. While students work, copy a typical error onto the board anonymously and have the class repair it."
      },
      {
        "activity_id": "1.3",
        "activity_outcome": "Students can write and say a sentence that describes a ratio based on their own sorted collection.",
        "outcome_type": "formulate_precisely",
        "resolved_outcome_type": "formulate_precisely",
        "affordances": {
          "flawed_sample_provided": false,
          "error_harvestable": true,
          "splittable_materials": false,
          "student_products_differ": true,
          "public_share_step": true,
          "frames_already_printed": true,
          "context_word_count": 65
        },
        "function": "Application",
        "lead": 1,
        "second": null,
        "because": "Students already hold a formulation; the work now is making it clearer for a reader who cannot see their thinking.",
        "teacher_prep": null
      },
      {
        "activity_id": "summary",
        "activity_outcome": "Students can say words and numbers in the correct order to accurately describe a ratio.",
        "outcome_type": "formulate_precisely",
        "resolved_outcome_type": "formulate_precisely",
        "affordances": {
          "flawed_sample_provided": false,
          "error_harvestable": false,
          "splittable_materials": false,
          "student_products_differ": false,
          "public_share_step": false,
          "frames_already_printed": false,
          "context_word_count": 85
        },
        "function": "Synthesis",
        "lead": 1,
        "second": null,
        "because": "Students hold an idea worth sharpening, and a second draft is the shortest route to precision.",
        "teacher_prep": null
      }
    ]
  },
  "provenance": {
    "pipeline_version": "2026-08-22.5+76b7bb0788907be7",
    "cache_key": "945236ff8e353c5547bec5c546241b49",
    "provider": "gemini",
    "model": "gemini-3.1-pro-preview",
    "thinking": "medium",
    "generated_at": "2026-08-25T23:55:20.076Z",
    "served_from_cache": false
  }
} as unknown as LessonData;
