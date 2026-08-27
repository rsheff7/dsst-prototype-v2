import { LessonData } from './types';

// ---------------------------------------------------------------------------
// Demo lesson — IM Grade 6, Unit 2, Lesson 1 "Introducing Ratios and Ratio
// Language". Loaded by the home page sample, /framework, /how-to, /qa, /audit.
//
// PROVENANCE: generated 2026-08-27T11:27:52.071Z on gemini/gemini-3.7-flash
// (thinking=medium), pipeline 2026-08-22.5+0e47bc81dddd64d2, from
// "Grade 6 Mathematics, Unit 2.1 - Open Up Resources.pdf". Cache key 0bdbba97e38a2f57f02c5f4bf488b778.
//
// Generated on the launch model, on the terminology update: mlr_inference
// carries lesson_outcome (was language_work), and the ELSF block is Language
// Mode. Regenerated rather than key-renamed in place so the sample reads the way
// the current prompt actually writes an outcome.
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
  "arc_statement": "Students begin by sorting visual shapes into informal categories and recording counts, establishing that a single collection contains multiple distinct groups. They then transition to comparing two quantities at once, learning formal ratio phrasing ('to', ':', 'for every') and discovering that word order dictates number order. Finally, students sort their own collections, write accurate ratio statements, and construct visual displays that make those mathematical comparisons explicit to peers.",
  "destination": "Students can write and say sentences describing a ratio between two quantities with words and numbers aligned in the correct order.",
  "key_vocabulary": [
    {
      "term": "ratio",
      "definition": "An association between two or more quantities."
    },
    {
      "term": "quantity",
      "definition": "An amount or count of items that can be measured or numbered."
    },
    {
      "term": "category",
      "definition": "A group or collection of items sharing a common property or characteristic."
    }
  ],
  "activities": [
    {
      "id": "1.1",
      "title": "What Kind and How Many?",
      "function": "Setup",
      "duration": "~10 min",
      "grouping": "Whole group",
      "language_demand": "low",
      "function_summary": "This warm-up establishes the foundational routine of classifying objects into distinct categories and quantifying them. It invites students to notice that the same collection can be grouped in multiple valid ways, such as by color or area. Capturing these informal sorting descriptions prepares the class to compare two specific categories simultaneously in upcoming activities.",
      "learning_target": "Students sort a set of figures into categories and count the number of items in each category.",
      "synthesis_prompt": "Synthesize toward sorting figures and recording group counts by posting student classification words on the board alongside their exact quantities and pointing to the two distinct numbers associated with a single set.",
      "is_crux": false,
      "friction_points": [
        {
          "description": "Students count the total number of figures correctly but lose track of which category sub-total belongs to which attribute label.",
          "type": "math"
        },
        {
          "description": "Students use vague everyday descriptive terms like 'big ones' or 'pointy things' instead of precise categorical labels.",
          "type": "language",
          "mlr": {
            "number": 2,
            "name": "Collect and Display"
          }
        }
      ],
      "success_signals": [
        "Students sort the set by color into distinct groups and state the exact count for each color.",
        "Students identify area or shape attributes as alternative valid sorting rules with correct counts."
      ],
      "teacher_moves": [
        {
          "text": "Write student sorting categories and exact counts on a shared anchor chart as they share verbally.",
          "mlr": {
            "number": 2,
            "name": "Collect and Display"
          }
        },
        {
          "text": "Invite students to point directly to the figures that fit their sorting rule on the shared display."
        }
      ],
      "causal_link": "Establishes category-count pairs required to formulate two-quantity ratio comparisons in 1.2.",
      "extension": "Ask students to find a fourth sorting rule that produces exactly two unequal groups."
    },
    {
      "id": "1.2",
      "title": "The Teacher’s Collection",
      "function": "Crux",
      "duration": "~15 min",
      "grouping": "Partners",
      "language_demand": "medium",
      "function_summary": "This crux activity introduces formal ratio language and notation to describe relationships between two quantities. Students encounter the essential convention that the order of named categories determines the order of the numbers in the statement. Successfully navigating this activity ensures students do not default to simply putting the larger number first regardless of wording.",
      "learning_target": "Students write sentences describing the ratio between categories in a collection using words and numbers in the matching order.",
      "synthesis_prompt": "Synthesize toward writing ratio sentences with matching word and number order by writing a student statement on the board, drawing arrows from each category word to its corresponding number, and asking which quantity must be read first.",
      "is_crux": true,
      "friction_points": [
        {
          "description": "Students write the larger quantity first in the ratio statement regardless of the order in which the category names are written.",
          "type": "language-math",
          "mlr": {
            "number": 3,
            "name": "Critique, Correct, and Clarify"
          }
        },
        {
          "description": "Students omit category nouns entirely, writing only numbers without indicating what the quantities represent.",
          "type": "language",
          "mlr": {
            "number": 1,
            "name": "Stronger and Clearer Each Time"
          }
        }
      ],
      "success_signals": [
        "Students write ratio statements using 'to', ':', or 'for every' with category names and counts in identical matching order.",
        "Students correctly identify that reversing the order of words requires reversing the order of numbers."
      ],
      "teacher_moves": [
        {
          "text": "Display an anonymous student statement with reversed numbers and ask partners to point out the mismatch and rewrite it accurately.",
          "mlr": {
            "number": 3,
            "name": "Critique, Correct, and Clarify"
          }
        },
        {
          "text": "Give students time to read their written ratio sentences to an elbow partner and revise for word-number order before whole-class recording.",
          "mlr": {
            "number": 1,
            "name": "Stronger and Clearer Each Time"
          }
        }
      ],
      "causal_link": "Provides the explicit linguistic structures and order rules applied independently to student collections in 1.3.",
      "extension": "Ask students to write a ratio statement comparing one category count to the total count of all objects in the collection."
    },
    {
      "id": "1.3",
      "title": "The Student’s Collection",
      "function": "Application",
      "duration": "~20 min",
      "grouping": "Partners",
      "language_demand": "high",
      "function_summary": "Students apply ratio concepts and linguistic conventions to sort physical or drawn collections of their own. They create visual displays paired with precise written ratio statements, linking concrete groupings to symbolic and verbal descriptions. Sharing these displays solidifies how physical groupings correspond directly to ratio statements across varied contexts.",
      "learning_target": "Students create a visual display that represents a ratio statement from their own sorted collection.",
      "synthesis_prompt": "Synthesize toward representing ratio statements through visual displays by displaying two different partner posters side by side and asking how both diagrams show the specific ratio stated in words.",
      "is_crux": false,
      "friction_points": [
        {
          "description": "Students draw collections without grouping or organizing items, making it difficult for viewers to visually verify the written ratio count.",
          "type": "math"
        },
        {
          "description": "Students struggle to explain how their visual arrangement proves the 'for every' relationship written in their sentence.",
          "type": "language-math",
          "mlr": {
            "number": 7,
            "name": "Compare and Connect"
          }
        }
      ],
      "success_signals": [
        "Students construct visual displays that clearly separate categories and reflect the exact counts in their written ratio statements.",
        "Students explain to peers how their visual groupings match the 'to', ':', or 'for every' wording in their sentences."
      ],
      "teacher_moves": [
        {
          "text": "Place two visual displays showing different arrangements of the same ratio side by side and ask students to identify how both show the same relationship.",
          "mlr": {
            "number": 7,
            "name": "Compare and Connect"
          }
        },
        {
          "text": "Have students practice describing their visual displays to a partner from another group, updating their written captions based on listener questions.",
          "mlr": {
            "number": 1,
            "name": "Stronger and Clearer Each Time"
          }
        }
      ],
      "causal_link": "Consolidates ratio language and visual representations needed for double number lines and tables in subsequent lessons.",
      "extension": "Challenge students to arrange their visual display into repeating unit groups to show a 'for every' relationship with smaller numbers."
    }
  ],
  "adaptation_guardrails": {
    "mathematical_purpose": "Students must learn that a ratio is an association between two quantities and that the order in which the categories are stated strictly dictates the order of the numbers in the ratio.",
    "safe_to_change": [
      "The physical objects or shapes provided for the collections in 1.1, 1.2, and 1.3.",
      "The format of the visual display in 1.3 (e.g., poster paper, whiteboard, digital slide, or physical table arrangement).",
      "Whether collections are sorted into two categories versus three categories."
    ],
    "do_not_remove": [
      {
        "text": "Do not remove the partner critique and revision step in 1.2, as students need to see and repair word-number order mismatches.",
        "mlr": {
          "number": 3,
          "name": "Critique, Correct, and Clarify"
        }
      },
      {
        "text": "Do not remove the public display and capture of informal sorting vocabulary during the warm-up.",
        "mlr": {
          "number": 2,
          "name": "Collect and Display"
        }
      },
      {
        "text": "Do not remove the requirement that students write the three standard phrasing forms ('to', ':', 'for every')."
      }
    ],
    "rigor_check": "Can students independently write a ratio sentence where the smaller quantity is named first without reversing the numbers?",
    "by_proficiency": {
      "emerging": {
        "text": "Provide pre-printed word cards with category labels and physical number tiles so students can physically swap positions to match word-number order before writing.",
        "mlr": {
          "number": 8,
          "name": "Discussion Supports"
        }
      },
      "developing": {
        "text": "Provide written sentence frames with color-coded blanks linking category names to their respective number blanks.",
        "mlr": {
          "number": 8,
          "name": "Discussion Supports"
        }
      },
      "expanding": {
        "text": "Ask students to write two distinct ratio sentences for their collection that reverse the category order and explain why the number order must also change.",
        "mlr": {
          "number": 1,
          "name": "Stronger and Clearer Each Time"
        }
      }
    }
  },
  "anticipated_thinking": {
    "orientation": "Students arrive knowing how to count objects and sort them into categories like color, shape, or size. The shift today is pairing two counts at the same time and naming them in the exact order stated, which requires paying close attention to word order rather than listing the larger number first.",
    "activities": [
      {
        "activity_id": "1.1",
        "patterns": [
          {
            "label": "Sorts by standard attributes accurately",
            "frequency": "most students",
            "type": "on-track",
            "description": "A student groups figures by color (blue, green) or area (small, large) and correctly counts the total number of items in each pile.",
            "move": "Ask the student to state both counts in a single sentence comparing the two groups.",
            "is_mll_specific": false
          },
          {
            "label": "Uses informal comparative language",
            "frequency": "some students",
            "type": "language-math",
            "description": "A student says 'there are way more blue ones than green ones' or 'for every two squares there is one triangle' using informal or everyday terms.",
            "move": "Record the student's exact phrasing on the board under a 'Comparing Groups' chart. Read it aloud to the class, highlight the two quantities being compared, and leave it visible to connect to the word 'ratio' in the next activity.",
            "is_mll_specific": true,
            "mlr": {
              "number": 2,
              "name": "Collect and Display"
            }
          },
          {
            "label": "Overlapping category definitions",
            "frequency": "watch for this",
            "type": "partial",
            "description": "A student invents a third sorting rule like 'shapes with 4 sides and shapes that are blue' where some shapes belong to both categories at once.",
            "move": "Ask the student to place one blue quadrilateral into a pile and ask: which group does this belong to if each item can only be in one pile?",
            "is_mll_specific": false
          }
        ],
        "sentence_frames": [
          {
            "frame": "I sorted the shapes into ___ groups based on their ___.",
            "mlr": {
              "number": 2,
              "name": "Collect and Display"
            }
          },
          {
            "frame": "There are ___ in the first group and ___ in the second group.",
            "mlr": {
              "number": 2,
              "name": "Collect and Display"
            }
          }
        ],
        "questions_to_listen_for": [
          "How did you decide which category each shape belongs to?",
          "Are there any shapes that fit into more than one of your groups?"
        ]
      },
      {
        "activity_id": "1.2",
        "patterns": [
          {
            "label": "Reverses number order to put larger quantity first",
            "frequency": "most students",
            "type": "misconception",
            "description": "A student looking at 4 red blocks and 7 yellow blocks writes 'The ratio of red blocks to yellow blocks is 7 to 4' because they instinctively put the larger number first.",
            "move": "Display the anonymous statement 'The ratio of red to yellow is 7 to 4' on the board. Ask the class to identify which category comes first in the sentence, check if the first number matches that category's count, and rewrite the statement correctly as 4 to 7.",
            "is_mll_specific": true,
            "mlr": {
              "number": 3,
              "name": "Critique, Correct, and Clarify"
            }
          },
          {
            "label": "Matches category order and quantity accurately",
            "frequency": "some students",
            "type": "on-track",
            "description": "A student writes 'The ratio of paperclips to erasers is 5 : 2' and correctly associates 5 with paperclips and 2 with erasers.",
            "move": "Ask the student to write the same relationship using the 'for every' sentence frame to reinforce flexible phrasing.",
            "is_mll_specific": false
          },
          {
            "label": "Struggles to draft full ratio sentence",
            "frequency": "watch for this",
            "type": "language-math",
            "description": "A student knows the counts (3 blue, 5 green) but is unsure how to place the category names and numbers into the printed frames.",
            "move": "Have the student read their draft ratio sentence to a partner. The partner points to the objects in the collection and asks: 'Which number goes with which color?' The student then revises their sentence to make the word and number order match precisely.",
            "is_mll_specific": true,
            "mlr": {
              "number": 1,
              "name": "Stronger and Clearer Each Time"
            }
          }
        ],
        "sentence_frames": [
          {
            "frame": "The ratio of [category A] to [category B] is ___ to ___.",
            "mlr": {
              "number": 3,
              "name": "Critique, Correct, and Clarify"
            }
          },
          {
            "frame": "There are ___ [category A] for every ___ [category B].",
            "mlr": {
              "number": 1,
              "name": "Stronger and Clearer Each Time"
            }
          }
        ],
        "questions_to_listen_for": [
          "Which category is named first in your sentence, and does its count come first?",
          "How would your sentence change if you named the second category first?"
        ]
      },
      {
        "activity_id": "1.3",
        "patterns": [
          {
            "label": "Groups objects into equal visual sets",
            "frequency": "some students",
            "type": "extension",
            "description": "A student with 6 buttons and 2 rings arranges them into two equal groups of 3 buttons and 1 ring to show '3 buttons for every 1 ring'.",
            "move": "Display this grouped display next to a display showing all 6 buttons in one pile and 2 rings in another. Ask the class how both displays represent the exact same collection using different ratio statements.",
            "is_mll_specific": true,
            "mlr": {
              "number": 7,
              "name": "Compare and Connect"
            }
          },
          {
            "label": "Visual display does not match written ratio statement",
            "frequency": "watch for this",
            "type": "partial",
            "description": "A student writes 'The ratio of cubes to spheres is 4 to 1' but their drawing shows 4 spheres and 1 cube.",
            "move": "Have the student explain their display to a peer using their written sentence. The peer asks: 'Where do you see the 4 cubes in your drawing?' The student then adjusts their visual display or sentence to make them match.",
            "is_mll_specific": true,
            "mlr": {
              "number": 1,
              "name": "Stronger and Clearer Each Time"
            }
          },
          {
            "label": "Accurately represents total collection and ratio statement",
            "frequency": "most students",
            "type": "on-track",
            "description": "A student creates a clear visual display with items separated by category and writes matching statements using both 'to' and ':' notations.",
            "move": "Ask the student to write a third statement describing a part-to-whole ratio using one category and the total number of items.",
            "is_mll_specific": false
          }
        ],
        "sentence_frames": [
          {
            "frame": "In this display, you can see the ratio of ___ to ___ is ___ : ___ because ___.",
            "mlr": {
              "number": 7,
              "name": "Compare and Connect"
            }
          },
          {
            "frame": "My partner's display shows ___ for every ___, which matches my statement because ___.",
            "mlr": {
              "number": 1,
              "name": "Stronger and Clearer Each Time"
            }
          }
        ],
        "questions_to_listen_for": [
          "Where in your visual display can someone see both numbers from your ratio?",
          "How does grouping your items into equal piles change the way you can describe the ratio?"
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
            "scenario_type": "productive-insight",
            "label": "Sorting by mathematical attributes using informal everyday language",
            "interpretation": "The student sorts shapes by number of sides or area rather than obvious perceptual traits like color. They use everyday words like 'pointy ones' or 'skinny shapes' to describe mathematical properties.",
            "is_mll": true,
            "flat_move": {
              "move": "",
              "avoid": ""
            },
            "proficiency_moves": {
              "emerging": {
                "move": "Write the student's category on the board. Point to one shape in their pile and say the formal term alongside their word. Invite the student to point to another shape that belongs in that group.",
                "avoid": "Correcting their word before writing their sorting rule on the board.",
                "nonverbal": "Point to the 3-sided shape in the student's pile, then tap the triangle category label on the board.",
                "say": "You put these together because they are pointy. In math, we call shapes with 3 sides triangles."
              },
              "developing": {
                "move": "Add the student's phrase to a public chart with the mathematical term beside it. Ask the student to tell their partner how many shapes share that property using both words.",
                "avoid": "Replacing their informal word on the chart without acknowledging why their grouping worked.",
                "nonverbal": "Trace the 4 sides of a rectangle in the display with a finger.",
                "say": "You noticed these all have four straight edges. Tell your partner: 'There are 4 quadrilaterals, or four-sided shapes.'"
              },
              "expanding": {
                "move": "Record the student's rule on the public display. Ask them to write a sentence on their paper comparing how many shapes fit their category versus how many do not.",
                "avoid": "Limiting the student to single-attribute counting when they are ready to describe set relationships.",
                "nonverbal": "",
                "say": "Write a sentence that tells someone how many figures have 4 sides and how many do not."
              }
            },
            "mll_framework_note": null,
            "proficiency_divergence_note": null
          },
          {
            "scenario_type": "common-error",
            "label": "Counting shapes without defining distinct categories",
            "interpretation": "The student counts all the figures in the collection sequentially (1 to 12) rather than partitioning the set into sub-groups. They see the collection as a single total rather than a set of categorical parts.",
            "is_mll": false,
            "flat_move": {
              "move": "Place two separate paper plates or index cards on the desk. Pick up one blue shape and one yellow shape, placing each on a different plate, and ask the student to sort the rest to match.",
              "avoid": "Telling the student which sorting rule to use before they attempt to separate the items physically.",
              "say": "Before counting all of them together, let's make groups. What makes this piece different from that piece?"
            },
            "proficiency_moves": null,
            "mll_framework_note": null,
            "proficiency_divergence_note": null
          },
          {
            "scenario_type": "on-track",
            "label": "Partitioning shapes clearly by color and recording group counts",
            "interpretation": "The student separates all figures into distinct color piles (e.g., 5 blue, 4 yellow, 3 red) and accurately records the number of items in each group in a table or list.",
            "is_mll": false,
            "flat_move": {
              "move": "Ask the student to test whether the same set of figures can be sorted into exactly two categories instead of three.",
              "avoid": "Stopping student exploration early once they find the first obvious color sort.",
              "say": "You have three color groups. Can you regroup these same shapes so there are only two categories?"
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
            "label": "Reversing the order of numbers relative to category names",
            "interpretation": "The student writes a ratio sentence where the numbers are flipped relative to the category names, such as writing 'The ratio of blue markers to red markers is 3 to 7' when there are 7 blue and 3 red. They default to writing the smaller number first.",
            "is_mll": true,
            "flat_move": {
              "move": "",
              "avoid": ""
            },
            "proficiency_moves": {
              "emerging": {
                "move": "Display an anonymous sample with reversed numbers on the board. Point to the first word in the sentence, then point to the actual objects. Point to the second word and point to its objects. Ask the student to point to which number should match the first item.",
                "avoid": "Swapping the numbers on their paper for them.",
                "nonverbal": "Touch the word 'blue' in the written sentence, then touch the pile of 7 blue markers on the desk.",
                "say": "The sentence says 'blue' first. How many blue markers do we have?"
              },
              "developing": {
                "move": "Write an anonymous reversed sentence on the board. Have partners talk for 30 seconds to identify why the numbers do not match the words, then invite this student to read the corrected sentence aloud.",
                "avoid": "Telling the student the rule 'first word gets first number' without having them verify against the physical piles.",
                "nonverbal": "Draw an arrow from the first category word to the first blank in the sentence frame on the board.",
                "say": "Look at the sentence on the board. What category is named first, and what number must go with it?"
              },
              "expanding": {
                "move": "Display the flawed sentence. Ask the student to write an explanation of how someone reading the statement would be misled about the teacher's collection if the numbers stay reversed.",
                "avoid": "Treating number reversal as a minor clerical slip rather than a mathematical mismatch.",
                "nonverbal": "",
                "say": "If a student in another room reads '3 to 7', what do they think we have more of? How do we rewrite this so it is true?"
              }
            },
            "mll_framework_note": null,
            "proficiency_divergence_note": null
          },
          {
            "scenario_type": "productive-struggle",
            "label": "Hesitating over 'for every' sentence structure",
            "interpretation": "The student understands the two quantities in the collection but gets stuck fitting category names into the 'There are __ of __ for every __ of __' frame because of the double preposition.",
            "is_mll": true,
            "flat_move": {
              "move": "",
              "avoid": ""
            },
            "proficiency_moves": {
              "emerging": {
                "move": "Have the student place 2 blue tiles in one hand and 3 red tiles in the other hand. Say the sentence slowly while tapping each hand as its category and amount are spoken. Have the student repeat the words while copying the hand gestures.",
                "avoid": "Replacing the 'for every' prompt with the simpler 'to' prompt.",
                "nonverbal": "Hold up 2 fingers on the left hand, then 3 fingers on the right hand to mark each group.",
                "say": "There are 2 blue tiles... for every 3 red tiles."
              },
              "developing": {
                "move": "Provide a two-column card with 'Group A' and 'Group B'. Have the student place their category counts onto the card, rehearse the sentence once with their partner, and then write the sentence on their paper.",
                "avoid": "Filling in the blanks on the student's paper.",
                "nonverbal": "Point to the first blank, then touch the student's first object pile.",
                "say": "Put the first count here and the second count here. Say the sentence to your partner before writing."
              },
              "expanding": {
                "move": "Have the student write their 'for every' draft, exchange papers with a partner, and check whether reversing the two categories changes the meaning of their sentence.",
                "avoid": "Accepting the completed sentence without having the student explain the pairing.",
                "nonverbal": "",
                "say": "Read your partner's 'for every' sentence. Check: did they put the number directly next to the item it counts?"
              }
            },
            "mll_framework_note": null,
            "proficiency_divergence_note": null
          },
          {
            "scenario_type": "on-track",
            "label": "Writing multiple correct ratio statements with consistent order",
            "interpretation": "The student writes both 'The ratio of A to B is X to Y' and 'The ratio of B to A is Y to X', correctly maintaining the correspondence between category names and amounts in both directions.",
            "is_mll": false,
            "flat_move": {
              "move": "Ask the student to write a third ratio sentence that compares one specific category to the total number of items in the entire collection.",
              "avoid": "Telling them that ratios can only compare part to part.",
              "say": "You compared category A to category B. How could you write a ratio that compares category A to the whole collection?"
            },
            "proficiency_moves": null,
            "mll_framework_note": null,
            "proficiency_divergence_note": null
          },
          {
            "scenario_type": "productive-insight",
            "label": "Noticing a simplified grouping structure within the collection",
            "interpretation": "The student notices that 6 green blocks and 2 yellow blocks can be grouped into 3 green blocks for every 1 yellow block, identifying an equivalent ratio before formal instruction on equivalence.",
            "is_mll": false,
            "flat_move": {
              "move": "Have the student arrange their blocks on the table in physical pairs (3 green next to 1 yellow, 3 green next to 1 yellow) and write both sentences: '6 to 2' and '3 to 1'.",
              "avoid": "Telling the student to erase 3 to 1 because 6 and 2 were the raw counts.",
              "say": "You noticed there are 3 greens for every 1 yellow. Arrange the blocks so everyone can see those equal groups."
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
            "scenario_type": "partial-understanding",
            "label": "Displaying items in isolated heaps without showing the ratio pairing",
            "interpretation": "The student creates a visual poster by grouping all items of type A in one corner and all items of type B in another corner. While the counts match their written statement, the display does not visually demonstrate the 'for every' association.",
            "is_mll": true,
            "flat_move": {
              "move": "",
              "avoid": ""
            },
            "proficiency_moves": {
              "emerging": {
                "move": "Physically move 2 paperclips and 1 counter side-by-side into a small cluster on their poster. Gesture for the student to make another identical cluster next to it with the remaining materials.",
                "avoid": "Rearranging their entire visual display for them.",
                "nonverbal": "Slide 2 paperclips and 1 counter together into a single circle drawn on the paper.",
                "say": "Look: 2 paperclips with 1 counter. Make another group just like this."
              },
              "developing": {
                "move": "Point to the student's written sentence 'There are 2 paperclips for every 1 counter.' Ask the student to slide their objects into small repeating sets on the table that match those exact words.",
                "avoid": "Accepting an unorganized pile because the written sentence is grammatically correct.",
                "nonverbal": "Draw small brackets or circles on the desk around paired sets of objects.",
                "say": "Your sentence says '2 for every 1.' How can you arrange the items in groups so a visitor sees that 2-to-1 pattern instantly?"
              },
              "expanding": {
                "move": "Select this student's display and a peer's paired-group display. Ask the student to compare both displays and explain how grouping items makes the ratio easier to see without counting every single object.",
                "avoid": "Telling the student their display is incorrect when the raw counts are accurate.",
                "nonverbal": "",
                "say": "Compare your display with Maria's. How does arranging the items in groups help someone check your ratio sentence quickly?"
              }
            },
            "mll_framework_note": null,
            "proficiency_divergence_note": null
          },
          {
            "scenario_type": "productive-insight",
            "label": "Physically partitioning a collection into equal sets to explain the ratio",
            "interpretation": "During the poster creation, the student organizes their objects into repeated equal rows or columns (e.g., 4 rows, each containing 3 buttons and 2 beads) to justify their ratio statement to their partner.",
            "is_mll": true,
            "flat_move": {
              "move": "",
              "avoid": ""
            },
            "proficiency_moves": {
              "emerging": {
                "move": "Point to one row of the student's display. Have the student count the items in that single row, then sweep a finger across all rows while the student states the total.",
                "avoid": "Asking the student to give a complex multi-clause explanation to the whole room without rehearsal.",
                "nonverbal": "Frame one row of items with two hands, then tap each item in that row.",
                "say": "In one row: 3 buttons, 2 beads. Tell your partner what is in one group."
              },
              "developing": {
                "move": "Have the student rehearse explaining their display with their partner using the sentence starter: 'First I grouped __ and __, and then I repeated it __ times.'",
                "avoid": "Letting only one partner explain the poster during the gallery walk.",
                "nonverbal": "Point to the first cluster, then gesture along the line of repeating clusters.",
                "say": "Practice telling your partner how your rows show the ratio before visitors come to your poster."
              },
              "expanding": {
                "move": "Invite the student to write a caption on their display explaining how their visual arrangement proves both '12 to 8' and '3 to 2' describe the exact same collection.",
                "avoid": "Keeping the discussion limited to only the total counts.",
                "nonverbal": "",
                "say": "Add a sentence to your poster explaining how your rows show both '3 to 2' and '12 to 8'."
              }
            },
            "mll_framework_note": null,
            "proficiency_divergence_note": null
          },
          {
            "scenario_type": "common-error",
            "label": "Writing a part-to-whole ratio without naming the total collection",
            "interpretation": "The student has 4 blue cubes and 6 red cubes (10 total) and writes 'The ratio of blue cubes to cubes is 4 to 10' or 'The ratio of blue to red is 4 to 10', confusing the second category amount with the total count.",
            "is_mll": false,
            "flat_move": {
              "move": "Point to the number 10 in the student's sentence, then point to the red cubes on their desk. Ask the student to count the red cubes aloud, then count all the cubes together.",
              "avoid": "Erasing the number 10 yourself.",
              "say": "You wrote 10 here. Are there 10 red cubes, or 10 cubes in all? How should we name that group in the sentence?"
            },
            "proficiency_moves": null,
            "mll_framework_note": null,
            "proficiency_divergence_note": null
          },
          {
            "scenario_type": "on-track",
            "label": "Creating a three-category table and drafting two distinct ratio statements",
            "interpretation": "The student accurately sorts objects into three distinct categories (e.g., pencils, erasers, sharpeners), records counts in the table, and produces two clear statements comparing two categories at a time with matching order.",
            "is_mll": false,
            "flat_move": {
              "move": "Challenge the student to write a single sentence that compares all three categories together in their collection.",
              "avoid": "Moving the student directly to clean-up before they explore extending ratios beyond two quantities.",
              "say": "You compared pencils to erasers, and erasers to sharpeners. Can you write a ratio sentence that describes all three categories at once?"
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
            "discourse_does": "States one attribute at a time while pointing to a single figure in the set.",
            "discourse_reaching": "Links two attributes together to describe a group of figures.",
            "sentence_does": "Produces single-clause statements such as 'There are 3 blue shapes.'",
            "sentence_reaching": "Produces compound statements using 'and', such as 'There are 3 blue shapes and 5 yellow shapes.'",
            "word_does": "Uses concrete attribute nouns and color words like 'blue', 'big', 'square'.",
            "word_reaching": "Uses category nouns like 'color', 'size', 'group'."
          },
          {
            "band": "developing",
            "discourse_does": "Reports two counts across different categories using a simple connecting word.",
            "discourse_reaching": "Organizes the full set into a structured comparison across all categories.",
            "sentence_does": "Produces compound sentences linking counts with 'and' or 'but', such as 'I sorted by area and there are 4 large and 2 small.'",
            "sentence_reaching": "Produces descriptive clauses that specify properties, such as 'The group that has shaded triangles has 3 items.'",
            "word_does": "Uses descriptive comparison vocabulary like 'sorted by', 'divided into', 'amount'.",
            "word_reaching": "Uses precise geometric category words like 'quadrilaterals', 'shaded region', 'area in square units'."
          },
          {
            "band": "expanding",
            "discourse_does": "Presents an organized sorting scheme that classifies every figure without overlap.",
            "discourse_reaching": "Explains alternative classification schemes that group the same figures differently.",
            "sentence_does": "Produces complex sentences with modifying clauses, such as 'When we sort by area, each shape with four square units belongs in the second column.'",
            "sentence_reaching": "Produces parallel structures to describe multiple subgroups systematically across the whole collection.",
            "word_does": "Uses academic classification terms like 'classified by', 'distinct attributes', 'subgroups'.",
            "word_reaching": "Uses structural attribute terms like 'non-overlapping categories', 'area equivalence'."
          }
        ],
        "language_demands": {
          "receptive": "Students listen to teacher prompts asking how to sort geometric figures and interpret visual differences such as shape, color, and area across the figures.",
          "productive": "Students state category names orally and record the number of items in each group on paper or on the board.",
          "interactive": "Students discuss possible sorting rules with peers, comparing why a figure fits into one group rather than another.",
          "everyday_to_academic_bridge": "Students bring everyday descriptive words like 'big', 'dark', or 'sides' and bridge to mathematical attributes like 'area', 'shaded', and 'number of vertices'.",
          "elsf_guidelines_applied": [
            1,
            2,
            6
          ]
        },
        "functional_language": {
          "language_functions": [
            "categorize objects",
            "count and compare quantities",
            "describe visual attributes"
          ],
          "example_phrases": [
            "We sorted the shapes by color into two groups.",
            "There are 4 large shapes and 6 small shapes.",
            "This group has shapes with four sides."
          ],
          "l1_bridge": "Students can name everyday attributes like colors or physical sizes in their home language, then point to the corresponding figures while adding the English count.",
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
            "discourse_does": "Points to an object pile and names its count followed by the second pile and its count.",
            "discourse_reaching": "Combines both counts into one spoken ratio sentence using a provided template.",
            "sentence_does": "Fills isolated blanks in printed frames like 'The ratio of pencils to pens is 3 to 2.'",
            "sentence_reaching": "Speaks a complete frame independently using 'for every', such as 'There are 3 pencils for every 2 pens.'",
            "word_does": "Uses relational words directly from the prompt like 'to', 'for every', 'ratio'.",
            "word_reaching": "Pairs quantity nouns with category labels correctly in speech without reading from the page."
          },
          {
            "band": "developing",
            "discourse_does": "States a ratio in one order and restates it in the reverse order with swapped numbers.",
            "discourse_reaching": "Explains why swapping the category names requires swapping the numbers to keep the statement true.",
            "sentence_does": "Produces two linked statements comparing the same collection, such as 'The ratio of cats to dogs is 4 to 1, and dogs to cats is 1 to 4.'",
            "sentence_reaching": "Produces explanatory sentences with 'because', such as 'The 4 comes first because cats was named first.'",
            "word_does": "Uses directional and relational terms like 'first quantity', 'second quantity', 'order'.",
            "word_reaching": "Uses precise relational terminology like 'corresponding amount', 'ratio relationship'."
          },
          {
            "band": "expanding",
            "discourse_does": "Identifies an error in a peer's sentence and describes how to fix the order of quantities.",
            "discourse_reaching": "Constructs an argument showing that different phrasing formats describe the exact same mathematical association.",
            "sentence_does": "Produces sentences connecting different representations, such as 'Writing 6 to 4 means there are 6 paper clips whenever there are 4 erasers.'",
            "sentence_reaching": "Produces conditional sentences, such as 'If we change the order of the categories to erasers first, then the ratio becomes 4 to 6.'",
            "word_does": "Uses meta-language for ratio structure like 'terms of the ratio', 'order of terms', 'symbol notation'.",
            "word_reaching": "Uses formal mathematical descriptions of association across multiple categories in a single set."
          }
        ],
        "language_demands": {
          "receptive": "Students read sentence templates on the page and listen to partner explanations of ratio relationships in the collection.",
          "productive": "Students write complete ratio statements using 'to', ':', and 'for every', keeping word and number positions strictly aligned.",
          "interactive": "Students read their completed sentences to a partner, check each other's word-to-number order, and discuss any discrepancies.",
          "everyday_to_academic_bridge": "Students move from informal comparison phrasing ('more paperclips than erasers') to structured ratio syntax ('the ratio of paperclips to erasers is 5 to 2').",
          "elsf_guidelines_applied": [
            1,
            2,
            6
          ]
        },
        "functional_language": {
          "language_functions": [
            "formulate ratio statements",
            "state two-quantity associations",
            "evaluate word-number order"
          ],
          "example_phrases": [
            "The ratio of paper clips to erasers is 6 to 4.",
            "The ratio of erasers to paper clips is 4 : 6.",
            "There are 3 pencils for every 2 pens."
          ],
          "l1_bridge": "Students can confirm the counts in their home language and trace the order of items with a finger before filling the English sentence frame.",
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
            "discourse_does": "Points to drawing groups one by one while stating the item counts.",
            "discourse_reaching": "Connects the drawing to the written sentence using sequence gestures and words.",
            "sentence_does": "Produces simple declarative sentences while pointing to the poster, such as 'This is 2 buttons. This is 5 beads.'",
            "sentence_reaching": "Produces sentences that link the visual group to the ratio word, such as 'Our picture shows 2 buttons for every 5 beads.'",
            "word_does": "Uses concrete item names and visual grouping words like 'group', 'drawing', 'boxes'.",
            "word_reaching": "Uses representation words like 'shows', 'represents', 'display'."
          },
          {
            "band": "developing",
            "discourse_does": "Explains how the layout of their poster represents the ratio written at the bottom.",
            "discourse_reaching": "Compares their layout to another group's poster and explains why both correctly show the same ratio.",
            "sentence_does": "Produces compound explanatory sentences with 'because' and 'so', such as 'We grouped them by twos so you can see there are 2 circles for every 3 stars.'",
            "sentence_reaching": "Produces purpose clauses, such as 'We drew circles around each pair in order to show the equal groups.'",
            "word_does": "Uses presentation vocabulary like 'arranged', 'divided', 'represented by'.",
            "word_reaching": "Uses analytical comparison terms like 'different grouping', 'equivalent view', 'association'."
          },
          {
            "band": "expanding",
            "discourse_does": "Sustains a multi-part explanation detailing how different visual features on the poster represent the ratio.",
            "discourse_reaching": "Critiques how clearly an unfamiliar visual display communicates its underlying ratio statement.",
            "sentence_does": "Produces complex sentences with embedded clauses, such as 'Although their poster uses tally marks and ours uses drawings, both displays show the same 3 to 1 ratio.'",
            "sentence_reaching": "Produces generalizing statements, such as 'Whenever a display groups items in equal sets of 3 and 1, it demonstrates a 3 to 1 ratio regardless of total count.'",
            "word_does": "Uses precise visual and mathematical vocabulary like 'visual representation', 'spatial arrangement', 'ratio relationship'.",
            "word_reaching": "Uses formal evaluative vocabulary like 'mathematical clarity', 'structural correspondence', 'invariant ratio'."
          }
        ],
        "language_demands": {
          "receptive": "Students read peer visual displays and listen to explanations during the gallery walk.",
          "productive": "Students write ratio statements and create annotated drawings, tables, or physical object arrangements on a poster.",
          "interactive": "Students present their displays to classmates, ask clarifying questions about peers' visual arrangements, and justify their representations.",
          "everyday_to_academic_bridge": "Students bridge from describing physical piles of items on a desk to constructing structured diagrams that visually group quantities to match ratio notation.",
          "elsf_guidelines_applied": [
            1,
            2,
            4
          ]
        },
        "functional_language": {
          "language_functions": [
            "explain a visual representation",
            "justify mathematical choices",
            "compare representations across groups"
          ],
          "example_phrases": [
            "Our poster shows 2 blue tiles for every 3 yellow tiles.",
            "We drew groups of 2 and 3 so you can see the ratio clearly.",
            "Both posters show a ratio of 4 to 1, but they arranged the shapes differently."
          ],
          "l1_bridge": "Students can sketch their visual groupings first and annotate the items in their home language, then use bilingual sentence starters to practice their English presentation with a partner.",
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
        "lesson_outcome": "Students can name categories and count quantities in a shape set to describe two groups at once.",
        "mlrs": [
          {
            "number": 2,
            "name": "Collect and Display",
            "why_here": "Students use informal words like 'pointy ones' or 'colored-in' while sorting figures. Capturing these on a public chart lets the class refine them into precise category names before writing ratio statements."
          }
        ]
      },
      {
        "activity_id": "1.2",
        "lesson_outcome": "Students can write ratio statements using 'to', ':', or 'for every' with category names and counts aligned in the exact matching order.",
        "mlrs": [
          {
            "number": 3,
            "name": "Critique, Correct, and Clarify",
            "why_here": "Students often write numbers in the reverse order of the categories they named. Displaying an anonymous sample with reversed numbers lets the room spot and repair the mismatch together before habits set."
          },
          {
            "number": 1,
            "name": "Stronger and Clearer Each Time",
            "why_here": "Students test their written ratio sentences with a partner to check whether the order of words matches the order of quantities. Hearing a partner read the sentence helps students revise their second draft for accuracy."
          }
        ]
      },
      {
        "activity_id": "1.3",
        "lesson_outcome": "Students can formulate ratio statements for their own sorted objects and create a visual display that demonstrates the two-quantity relationship.",
        "mlrs": [
          {
            "number": 7,
            "name": "Compare and Connect",
            "why_here": "Students place different visual displays side by side during a gallery walk. Comparing physical groupings reveals how distinct arrangements can represent the exact same ratio statement."
          },
          {
            "number": 1,
            "name": "Stronger and Clearer Each Time",
            "why_here": "Students explain their poster to visiting peers, receive feedback on whether their drawing matches their sentence, and refine their verbal explanation on successive rounds."
          }
        ]
      }
    ]
  },
  "wristband": {
    "arc_one_line": "From sorting collections to writing and modeling ordered ratio statements precisely.",
    "preflight": [
      "Pre-count teacher collection items into bags for clean two-category comparisons.",
      "Write ratio sentence frames visibly on board before student collection work.",
      "Pair emerging multilingual learners with partners sharing common home language background.",
      "Prepare chart paper and markers for Activity 1.3 paired visual displays."
    ],
    "top_signals": [
      "Matches number order directly to category words.",
      "Uses 'for every' to relate two groups.",
      "Groups display items into repeating visual pairs."
    ],
    "top_frictions": [
      "Reversing number order to put larger first.",
      "Comparing one category to total items counted.",
      "Omitting category labels from numerical ratio statements."
    ],
    "activities": [
      {
        "activity_id": "1.1",
        "tiles": [
          {
            "observation_short": "Lists vague sorting rules without countable descriptors; struggling to name distinct mathematical categories.",
            "friction_type": "language",
            "move_short": "Capture student words on display board; revoice informal sort names into precise category nouns so peers reuse math terms.",
            "avoid_short": "Supplying category names for students directly.",
            "has_proficiency_variants": true,
            "glyph_observation": "VAGUE CATEGORY LABELS",
            "mlr": {
              "number": 2,
              "name": "Collect and Display"
            }
          },
          {
            "observation_short": "Counts total shapes correctly but does not record individual category counts for comparisons.",
            "friction_type": "math",
            "move_short": "Point to display chart; ask student to count each color group separately so both quantities become visible.",
            "avoid_short": "Counting the separate piles yourself.",
            "glyph_observation": "COUNTS ONLY TOTAL",
            "mlr": {
              "number": 2,
              "name": "Collect and Display"
            }
          }
        ],
        "synthesis_short": "Highlight color and area category counts; ask how two quantities can be compared together."
      },
      {
        "activity_id": "1.2",
        "tiles": [
          {
            "observation_short": "Writes numbers in reverse order of category names; defaults to writing larger number first.",
            "friction_type": "language-math",
            "move_short": "Display anonymous reversed statement; ask class which quantity comes first so students realign word order to number order.",
            "avoid_short": "Silently correcting the reversed numbers.",
            "is_crux_moment": true,
            "has_proficiency_variants": true,
            "glyph_observation": "REVERSED RATIO ORDER",
            "mlr": {
              "number": 3,
              "name": "Critique, Correct, and Clarify"
            }
          },
          {
            "observation_short": "Compares category count to total collection amount instead of comparing the two separate categories.",
            "friction_type": "math",
            "move_short": "Have partners read statements aloud and identify if second number is another part or the entire collection.",
            "avoid_short": "Explaining part-to-part versus part-to-whole difference.",
            "glyph_observation": "USES TOTAL COUNT",
            "mlr": {
              "number": 1,
              "name": "Stronger and Clearer Each Time"
            }
          }
        ],
        "synthesis_short": "Display blue-to-yellow ratio statements; ask which number must come first and why order matters."
      },
      {
        "activity_id": "1.3",
        "tiles": [
          {
            "observation_short": "Arranges collection in random pile rather than grouped pairs that show ratio structure clearly.",
            "friction_type": "math",
            "move_short": "Place scattered display beside paired-group display; ask how grouping helps a viewer see the 'for every' relationship.",
            "avoid_short": "Rearranging student objects into pairs yourself.",
            "glyph_observation": "UNGROUPED ITEM DISPLAY",
            "mlr": {
              "number": 7,
              "name": "Compare and Connect"
            }
          },
          {
            "observation_short": "Writes numerical ratio correctly but omits category words entirely from their poster explanation sentence.",
            "friction_type": "language",
            "move_short": "Prompt partner review using sentence frame; have student revise poster caption so category names accompany every number.",
            "avoid_short": "Accepting numbers without category words.",
            "has_proficiency_variants": true,
            "glyph_observation": "MISSING CATEGORY WORDS",
            "mlr": {
              "number": 1,
              "name": "Stronger and Clearer Each Time"
            }
          }
        ],
        "synthesis_short": "Place two visual displays side by side; connect visual groupings to written ratio statements."
      }
    ],
    "mlr_legend": [
      {
        "mlr": {
          "number": 1,
          "name": "Stronger and Clearer Each Time"
        },
        "one_line_cue": "Refine mathematical explanations through successive paired conversations and revision."
      },
      {
        "mlr": {
          "number": 2,
          "name": "Collect and Display"
        },
        "one_line_cue": "Capture, display, and reference student mathematical language publicly."
      },
      {
        "mlr": {
          "number": 3,
          "name": "Critique, Correct, and Clarify"
        },
        "one_line_cue": "Analyze and improve an anonymous flawed math statement together."
      },
      {
        "mlr": {
          "number": 7,
          "name": "Compare and Connect"
        },
        "one_line_cue": "Compare two representations to identify shared underlying mathematical structure."
      }
    ],
    "lesson_synthesis_short": "Anchor class with teacher collection; ask how swapping word order changes the ratio meaning completely."
  },
  "lesson_synthesis": {
    "prompt": "Synthesize the lesson by displaying two ratio sentences on the board for the same collection—'The ratio of squares to circles is 6 to 3' and 'The ratio of circles to squares is 3 to 6'—and asking students to explain why both statements are mathematically correct even though the numbers are in different positions.",
    "builds_on": [
      "Activity 1.1: students sorted a single collection into distinct category amounts",
      "Activity 1.2: students learned that category naming order dictates number order",
      "Activity 1.3: students paired visual groupings with matching ratio sentences"
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
        "activity_outcome": "Students can identify categories and count amounts within a collection to set up two-quantity comparisons.",
        "outcome_type": "formulate_precisely",
        "resolved_outcome_type": "formulate_precisely",
        "affordances": {
          "flawed_sample_provided": false,
          "error_harvestable": true,
          "splittable_materials": false,
          "student_products_differ": true,
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
        "activity_outcome": "Students can write ratio statements using 'to', ':', or 'for every' with category names and counts in the correct order.",
        "outcome_type": "formulate_precisely",
        "resolved_outcome_type": "formulate_precisely",
        "affordances": {
          "flawed_sample_provided": false,
          "error_harvestable": true,
          "splittable_materials": false,
          "student_products_differ": true,
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
        "activity_outcome": "Students can formulate ratio statements for their own objects and represent them in a shared visual display.",
        "outcome_type": "connect_representations",
        "resolved_outcome_type": "connect_representations",
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
        "lead": 7,
        "second": 1,
        "because": "The outcome is seeing what two approaches share, which only happens when they are put side by side and the connection is named.",
        "teacher_prep": null
      }
    ]
  },
  "provenance": {
    "pipeline_version": "2026-08-22.5+0e47bc81dddd64d2",
    "cache_key": "0bdbba97e38a2f57f02c5f4bf488b778",
    "provider": "gemini",
    "model": "gemini-3.7-flash",
    "thinking": "medium",
    "generated_at": "2026-08-27T11:27:52.071Z",
    "served_from_cache": false
  }
} as unknown as LessonData;
