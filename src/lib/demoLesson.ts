import { LessonData } from './types';
import { MLRS } from './mlrs';

const MLR1 = { number: 1 as const, name: MLRS[1].name };
const MLR2 = { number: 2 as const, name: MLRS[2].name };
const MLR7 = { number: 7 as const, name: MLRS[7].name };
const MLR8 = { number: 8 as const, name: MLRS[8].name };

export const demoLesson: LessonData = {
  mlr_inference: {
    activities: [
      {
        activity_id: '1.1',
        language_work:
          'Students use everyday phrases to describe groups they have sorted. The lesson is listening for one phrase in particular — "for every" — which will become the language of Activity 1.2.',
        mlrs: [
          {
            number: 2,
            name: MLRS[2].name,
            why_here:
              'Activity 1.1 is the first time the teacher hears how students naturally talk about groups. Capturing their phrases — especially "for every" — and writing them on the board makes student language available as a resource the rest of the lesson can reuse.',
          },
          {
            number: 8,
            name: MLRS[8].name,
            why_here:
              'When a student uses "for every" without prompting, the teacher pauses the room and revoices it. That is MLR 8 — using a single student\'s language as a discussion anchor through revoicing and wait time.',
          },
        ],
      },
      {
        activity_id: '1.2',
        language_work:
          'Students attach precise ratio language to a diagram, using one of three forms (X to Y, X:Y, X for every Y). The three forms ARE the language work of the lesson — the math is in saying the relationship aloud.',
        mlrs: [
          {
            number: 1,
            name: MLRS[1].name,
            why_here:
              'Students write a first attempt at a ratio sentence using the frame. The partner share + revise cycle is where flipped-order errors get caught and where the language gets stronger. Without partner feedback, the first attempt stays the only attempt.',
          },
          {
            number: 8,
            name: MLRS[8].name,
            why_here:
              'Reading the sentence aloud (a key MLR 8 mechanic) is what turns the silent fill-in-the-blank into language work. The sentence frames themselves function as discussion supports.',
          },
        ],
      },
      {
        activity_id: '1.3',
        language_work:
          'Students apply the ratio language to their own example, then make a visual display. The work is consolidation — using the language unprompted and seeing the same ratio in two forms.',
        mlrs: [
          {
            number: 1,
            name: MLRS[1].name,
            why_here:
              'Students who only have the colon form here need a path to the verbal forms. MLR 1 is that path: say it, write it, refine it. Each form is a stronger draft of the same relationship.',
          },
          {
            number: 7,
            name: MLRS[7].name,
            why_here:
              'When a student notices their ratio matches their partner\'s but with different items, that is the moment for MLR 7 — compare the two ratios, connect them, surface the idea that ratios depend on what you compare.',
          },
        ],
      },
    ],
  },

  meta: {
    grade: 'Grade 6',
    unit: 'Unit 2',
    lesson_number: 'Lesson 1',
    lesson_title: 'Introducing Ratios and Ratio Language',
    total_time: '~45 min',
  },

  arc_statement:
    'Students walk into this lesson already noticing how groups of things relate — they can see when there are more of one kind than another, when items come in pairs, when a pattern repeats. What this lesson adds is the language to describe that noticing precisely. Activity 1.2 is the first time they try the language out loud, using three different ratio forms, and that is where the words become theirs. The lesson lands when students can describe a collection by naming the relationship — "the ratio of squares to circles is 3 to 6" — and they know what they are saying.',

  destination:
    'Students can describe a collection of objects using ratio language in three forms: "X to Y," "X:Y," and "X for every Y." Each form says the same relationship a different way.',

  key_vocabulary: [
    {
      term: 'ratio',
      definition:
        'A way to describe a relationship between two quantities. You can say it with the word "to," with a colon, or with the phrase "for every."',
    },
  ],

  activities: [
    {
      id: '1.1',
      title: 'Warm-Up: What Kind and How Many?',
      function: 'Setup',
      duration: '~8 min',
      grouping: 'Whole group',
      language_demand: 'low',
      function_summary:
        'Students show you how they already think about sorting and counting groups — every student brings a way of seeing relationships, even before any ratio language enters the room. What you are listening for: which students naturally pair quantities together ("there are 3 of these for every 1 of those") and which students are focused on totals first. Both are doing real mathematical work. The lesson will move both groups toward seeing the relationship between quantities.',
      is_crux: false,
      friction_points: [
        {
          description:
            'Students argue over which way of sorting the figures is "correct" instead of accepting that there are many.',
          type: 'math',
        },
      ],
      success_signals: [
        'Students say things like "there are 3 of these for every 1 of those" without being asked to.',
        'Students compare their categorizations to a partner\'s and notice they used different numbers.',
        'A student counts both groups out loud, then pauses — like they sense the relationship matters.',
      ],
      teacher_moves: [
        {
          text:
            'Do not tell students which way of sorting is right. There are many. Validate that.',
        },
        {
          text:
            'MLR 2 in action: when you hear a student say something like "there are 2 X\'s for every 1 Y," write the exact phrase on the board. Tell them you will come back to it in 1.2. Keep listening — capture two or three student phrases for the display so the class has language to reuse.',
          mlr: MLR2,
        },
      ],
      causal_link: null,
      extension: null,
    },
    {
      id: '1.2',
      title: "Activity 1: The Teacher's Collection",
      function: 'Crux',
      duration: '~15 min',
      grouping: 'Partners',
      language_demand: 'high',
      function_summary:
        'This is the most important part of the lesson. Students take a collection you have prepared (markers, blocks, paper clips — whatever you have) and try to write a sentence using one of the three ratio forms. Some students will breeze through. Others will stare at the page. Both happen for the same reason: this is the first time they have been asked to put a relationship into words. Listen for students reading their sentence aloud as they fill it in. That is how the language becomes theirs.',
      is_crux: true,
      friction_points: [
        {
          description:
            'Students fill in the sentence frame in the wrong order — they write the second number first.',
          type: 'language-math',
          mlr: MLR8,
        },
        {
          description:
            'Students write ratio sentences that are mathematically correct but ignore the sentence frames completely.',
          type: 'language',
          mlr: MLR1,
        },
      ],
      success_signals: [
        'A student fills in "There are 3 markers for every 5 pencils" and you can hear them reading it back to check.',
        'Students write all three forms for the same ratio and notice they say the same thing different ways.',
        'A student catches themselves writing the numbers in the wrong order and rewrites without being told.',
      ],
      teacher_moves: [
        {
          text:
            'MLR 8 in action: slow groups down here. After they write, ask them to read the sentence aloud — once to themselves, once to their partner. Wait 3 seconds before responding to what you hear. The pause is what makes the reading-aloud do its work.',
          mlr: MLR8,
        },
        {
          text:
            'MLR 1 in action: when a student gets a flipped order on the first try, pair them with a partner who has the correct order. The partner asks "which one comes first in your sentence?" The student rewrites — that is the stronger draft.',
          mlr: MLR1,
        },
        {
          text:
            'Do not fix flipped ratios immediately. Ask "which one comes first — the X or the Y?" and let them figure it out.',
        },
      ],
      causal_link:
        'If students write a ratio sentence themselves here — really write it, not just copy from the frame — then 1.3 is a chance for them to practice. If they only fill in blanks here, 1.3 is the first time they actually try, and that is when the language and math issues show up at the same time.',
      extension: null,
    },
    {
      id: '1.3',
      title: "Activity 2: The Student's Collection",
      function: 'Application',
      duration: '~15 min',
      grouping: 'Individual',
      language_demand: 'high',
      function_summary:
        'Students take what they learned about writing ratio sentences and try it on a collection they sort themselves — their own school supplies, items on their desk, classroom objects. You will see the language work or not work depending on whether the lesson landed in 1.2. The visual display step at the end is where they see their ratio represented two ways: in words, and as a picture.',
      is_crux: false,
      friction_points: [
        {
          description:
            'Students sort their collection into three categories but only write a ratio for two of them. The "three categories" instruction creates a multi-ratio situation they do not have language for yet.',
          type: 'math',
        },
        {
          description:
            'Students cannot decide which category to put first in the sentence — the frame requires them to label one category as "one category" and the other as "another category."',
          type: 'language-math',
          mlr: MLR8,
        },
      ],
      success_signals: [
        'A student writes a ratio sentence and points to the items in their collection that prove it.',
        'A student uses two of the three sentence forms for the same ratio and notices they describe the same thing.',
        'A student\'s visual display shows clear groupings — they used the ratio as a tool to organize.',
      ],
      teacher_moves: [
        {
          text:
            'If a student sorts into three categories but writes only one ratio, accept it. Do not demand all three combinations — that comes in later lessons.',
        },
        {
          text:
            'MLR 8 in action: when a student catches their own mistake before you do, revoice it for the class. "[Name] just used a ratio to check their own work — say that again so we all hear it." Choral repeat optional.',
          mlr: MLR8,
        },
      ],
      causal_link:
        'What you see here tells you what landed in 1.2. Students writing ratios fluently? 1.2 worked. Students still stuck? They need more time with 1.2 next time you teach it.',
      extension:
        'Use two colors to shade a rectangle so there are 2 square units of one color for every 1 square unit of the other color. Then draw a different shape that does NOT have an area of 24 square units, and shade it in the same 2-to-1 ratio.',
    },
  ],

  adaptation_guardrails: {
    mathematical_purpose:
      'Students must produce ratio language themselves — not select from options, not fill in pre-labeled blanks. The sentence frames are scaffolds, not multiple choice. The mathematical work of this lesson IS the language: turning a relationship between two quantities into words.',
    safe_to_change: [
      'Swap the categorization examples for items relevant to your students (sports equipment, music genres) — keep the math, change the surface.',
      'Reduce the number of ratio forms students must write from three to two. Keep "X to Y" and "X for every Y" — drop the colon form.',
      'Pair students in 1.3 instead of asking them to work alone. The talk is the work.',
    ],
    do_not_remove: [
      {
        text:
          'Students must label their own categories. Pre-labeled categories remove the language work entirely.',
      },
      {
        text:
          'Students must read their ratio sentence aloud at some point. Silent fill-in-the-blank is not the same activity — without the read-aloud, MLR 8 disappears and so does most of the language work.',
        mlr: MLR8,
      },
      {
        text:
          'The visual display in 1.3 must come AFTER the sentence. Drawing first lets students count without language.',
      },
    ],
    rigor_check:
      'If I make this adaptation, will my student still be producing ratio language themselves — or am I just having them point at the right answer?',
    by_proficiency: {
      entering: {
        text:
          'Pair the student with someone who shares their home language. Let them write the ratio sentence in their home language first, then translate one form into English. The math work is in writing the sentence — not in English specifically. This is MLR 1 with the first draft in home language.',
        mlr: MLR1,
      },
      developing: {
        text:
          'Provide the sentence frames written out clearly. Let the student say the sentence aloud with their partner before writing it alone. Hearing the sentence said correctly first is the support — that is the partner-share step of MLR 1.',
        mlr: MLR1,
      },
      bridging: {
        text:
          'Use the lesson as written. Push these students to write all three forms and explain which one feels most natural. Comparing the three forms is MLR 7 — they are connecting different representations of the same relationship.',
        mlr: MLR7,
      },
    },
  },

  anticipated_thinking: {
    orientation:
      'Students walk in already noticing how groups of things relate — pairs, repeats, "more of these than those." Their thinking will take the most work in Activity 1.2, when they have to attach precise ratio language to that everyday noticing, and again when they have to recognize that "3 to 6," "3:6," and "3 for every 6" all describe the same relationship.',
    activities: [
      {
        activity_id: '1.1',
        patterns: [
          {
            label: 'Sorts by surface features',
            frequency: 'most students',
            type: 'on-track',
            description: 'Students sort the figures by color, shape, or size. They count each group.',
            move:
              'Accept the categorization. Ask: "how many of each? Your partner sorted differently — how many of each in their groups?"',
            is_mll_specific: false,
          },
          {
            label: 'Uses "for every" language without prompting',
            frequency: 'watch for this',
            type: 'on-track',
            description:
              'A student says something like "there are 3 of these for every 1 of those." This is the language the lesson is heading toward.',
            move:
              'MLR 8 in action: stop the room. Have the student repeat what they said — twice if needed. Revoice it once yourself: "So you are saying there are 3 of these for every 1 of those?" Make sure the class hears the words "for every" clearly. Tell them you will come back to that exact way of saying it in a few minutes.',
            is_mll_specific: false,
            mlr: MLR8,
          },
          {
            label: 'Argues for the "right" way to sort',
            frequency: 'some students',
            type: 'partial',
            description:
              'Students push back against a partner\'s categorization. They want there to be one right answer.',
            move:
              'Validate that there are many ways. The fact that they are talking about it is what matters — the disagreement IS the lesson.',
            is_mll_specific: false,
          },
        ],
        sentence_frames: [
          { frame: 'I sorted by __ because __.', mlr: MLR8 },
          { frame: 'I see __ groups of __.' },
          { frame: 'My partner sorted by __, so they have __ groups.' },
        ],
        questions_to_listen_for: [
          'Are students comparing their categorizations to others?',
          'Is anyone using "for every" language naturally yet?',
        ],
      },
      {
        activity_id: '1.2',
        patterns: [
          {
            label: 'Fills in the blanks in the wrong order',
            frequency: 'most students',
            type: 'misconception',
            description:
              'A student writes "The ratio of squares to circles is 6 to 3" when the collection has 3 squares and 6 circles.',
            move:
              'MLR 8 in action: ask them to read it aloud — slowly. Wait. Then ask: "which one comes first in the sentence — squares or circles?" Wait 3 seconds. Let them feel the order matter without telling them they are wrong.',
            is_mll_specific: false,
            mlr: MLR8,
          },
          {
            label: 'Notices the three forms say the same thing',
            frequency: 'some students',
            type: 'extension',
            description:
              'A student writes all three forms for the same ratio and pauses — like they are noticing something.',
            move:
              'MLR 8 in action: stop the room and ask the student to share with the class. Revoice their observation once for the class. This is the synthesis the lesson is going for — make their noticing public.',
            is_mll_specific: false,
            mlr: MLR8,
          },
          {
            label: 'Skips the sentence frames',
            frequency: 'some students',
            type: 'partial',
            description:
              'A student writes a sentence about the collection in their own words, ignoring the frame.',
            move:
              'MLR 1 in action: affirm the meaning of what they wrote — that is their first draft. Pair them with a partner. The partner asks: "can you say that same thing using one of the sentence frames? Why do you think we are using the frame?" The student rewrites using the frame — that is the stronger draft.',
            is_mll_specific: false,
            mlr: MLR1,
          },
          {
            label: 'Stuck — has not written anything',
            frequency: 'watch for this',
            type: 'language-math',
            description:
              'A student stares at the sentence frame. They cannot decide which category to label first.',
            move:
              'MLR 8 in action: the support depends on proficiency. For Entering, point at one item in the collection, then at the first blank in the frame; then point at the other item and the second blank — assign the order with gestures so they can focus on the numbers. For Developing, help them say the two category names aloud first, then return to the frame. For Bridging, ask which of the three forms feels easiest to start with. Wait 3+ seconds at every proficiency.',
            is_mll_specific: true,
            mlr: MLR8,
          },
        ],
        sentence_frames: [
          { frame: 'The ratio of __ to __ is __ to __.' },
          { frame: 'There are __ __ for every __ __.' },
        ],
        questions_to_listen_for: [
          'Are students reading their sentences aloud, or just filling in numbers?',
          'When students get the order right, can they explain why one number comes first?',
        ],
      },
      {
        activity_id: '1.3',
        patterns: [
          {
            label: 'Sorts into 3, writes a ratio for 2',
            frequency: 'most students',
            type: 'partial',
            description:
              'A student sorts items into pens, pencils, and markers. They write "The ratio of pens to pencils is 4 to 6" and stop.',
            move:
              'Accept it. This is the right amount of work for this lesson. Multi-ratio situations come later. Do not demand all three combinations.',
            is_mll_specific: false,
          },
          {
            label: 'Points to the collection to verify',
            frequency: 'some students',
            type: 'on-track',
            description:
              'A student writes the ratio sentence, then points to a group of items in their collection: "see? 4 pens here, 6 pencils here."',
            move:
              'MLR 7 in action: confirm with one question. "Now what is the ratio of pens to markers? Same kind of sentence?" Asking them to produce a second ratio from the same collection surfaces the connection — same items, different relationship.',
            is_mll_specific: false,
            mlr: MLR7,
          },
          {
            label: 'Display shows the ratio without writing it',
            frequency: 'watch for this',
            type: 'extension',
            description:
              'A student arranges items in their visual display to show the ratio (4 pens in one row, 6 pencils in another) but has not labeled the display.',
            move:
              'MLR 7 in action: stop the class. Show the display. Ask: "what ratio does this show? Can someone say it in words?" Compare the visual to the verbal forms on the board. Make the connection between picture and sentence public.',
            is_mll_specific: false,
            mlr: MLR7,
          },
        ],
        sentence_frames: [
          { frame: 'I sorted my collection by __.' },
          { frame: 'The ratio of __ to __ is __ to __.' },
          { frame: 'I can see this in my display because __.', mlr: MLR8 },
        ],
        questions_to_listen_for: [
          'Are students using the sentence forms, or making up their own language?',
          'Does the visual display match the ratio they wrote?',
        ],
      },
    ],
  },

  decision_guide: {
    activities: [
      {
        activity_id: '1.1',
        scenarios: [
          {
            scenario_type: 'on-track',
            label: 'A multilingual student is sorting the figures silently — they have grouped the figures clearly but have not spoken during the activity.',
            interpretation:
              'The student is doing the sorting work. The silence is not absence of thinking — it is the absence of English right now. Their hands and eyes are showing you the math. Asking them to explain in English right now will likely make them sort less well. Letting the sort itself be the contribution is the right move at this point in the lesson.',
            is_mll: true,
            mlr: MLR8,
            flat_move: null,
            proficiency_moves: {
              entering: {
                move: 'Use a gesture to acknowledge their groups. Ask one question with your hands.',
                say: null,
                nonverbal:
                  'Point to one of their groups and smile. Then point to a single item and look puzzled — eyebrows up, head slightly tilted — as if asking "what makes this one fit here?" Let them respond with gestures, single words in any language, or by reorganizing.',
                avoid: 'Asking "can you explain?" The student is explaining with their hands. The English-language version of explaining is not available right now.',
              },
              developing: {
                move: 'Ask for a single word, not a sentence.',
                say: '"What makes these the same?" Point to one group. If they answer with one word — in any language — point at it and try to repeat it. Then ask the same question about another group.',
                nonverbal: null,
                avoid: 'Asking for a full sentence. One word is the right amount of language for right now.',
              },
              bridging: {
                move: 'Ask what they noticed first. Let them choose the words.',
                say: '"What did you notice first when you started sorting? You can use whatever words you want."',
                nonverbal: null,
                avoid: 'Asking them to name "the rule." Ask what they noticed — they have language for that.',
              },
            },
            mll_framework_note:
              'For an Entering student, you ask with gestures and accept gestures back — the sort itself is the contribution. For a Developing student, one word is enough; translation can wait. For a Bridging student, ask what they noticed (concrete) instead of asking for a rule (abstract).',
            proficiency_divergence_note: null,
          },
          {
            scenario_type: 'productive-insight',
            label: 'A student says "there are 3 of these for every 1 of those" without being asked to.',
            interpretation:
              'This student just used the exact language the lesson is heading toward — without being taught it yet. It is the most important moment of activity 1.1. The risk is that you let it pass and the rest of the class never hears it.',
            is_mll: false,
            mlr: MLR2,
            flat_move: {
              move: 'Stop the room. Have the student repeat what they said. Write the phrase on the board.',
              say: '"Hold on — I want everyone to hear what [name] just said. Can you say it again? Class — did you hear those words? \'For every.\' I am writing that on the board. We are going to come back to that in a minute."',
              nonverbal: null,
              avoid: 'Saying "great!" and moving on. The praise privatizes the insight. The class needs to hear the words and see them on the board — that is what MLR 2 does.',
            },
            proficiency_moves: null,
            mll_framework_note: null,
            proficiency_divergence_note: null,
          },
        ],
      },
      {
        activity_id: '1.2',
        scenarios: [
          {
            scenario_type: 'common-error',
            label: 'A student wrote "The ratio of squares to circles is 6 to 3" when the collection has 3 squares and 6 circles.',
            interpretation:
              'The student filled in the blanks but in the wrong order — they put the bigger number first because it felt natural, or they did not pay attention to which word came first. This is a language-math error. The order of the words determines the order of the numbers.',
            is_mll: false,
            mlr: MLR8,
            flat_move: {
              move: 'Ask them to read it aloud and decide which one comes first.',
              say: '"Read your sentence out loud. Now — which one comes first in the sentence: squares or circles? Look at the collection. Does that match?"',
              nonverbal: null,
              avoid: 'Correcting the order yourself. Let them feel the misalignment between the words and the numbers.',
            },
            proficiency_moves: null,
            mll_framework_note: null,
            proficiency_divergence_note: null,
          },
          {
            scenario_type: 'productive-insight',
            label: 'A student asks "why do we have to write all three forms? They say the same thing."',
            interpretation:
              'This student just noticed the big idea of the lesson — that the three forms are the same relationship said three ways. This is the synthesis the lesson wants. The risk is that you answer the question for them and the rest of the class never wrestles with it.',
            is_mll: false,
            mlr: MLR7,
            flat_move: {
              move: 'Throw the question back to the class. Compare two forms side by side.',
              say: '"That is a great question. Class — [name] just asked why we are writing all three forms. Look at \'3 to 6\' and \'3 for every 6.\' What is the same? What is different? Talk to your partner for one minute."',
              nonverbal: null,
              avoid: 'Answering the question directly. MLR 7 is the move here — let them compare and connect the forms themselves.',
            },
            proficiency_moves: null,
            mll_framework_note: null,
            proficiency_divergence_note: null,
          },
          {
            scenario_type: 'common-error',
            label: 'A student is staring at the sentence frame and has not written anything.',
            interpretation:
              'The student is stuck on the language, not the math. They likely know how many of each item are in the collection. What they cannot do is decide which item to label "one category" and which to label "another category" in the sentence frame. This is language-math friction — the framework is asking for a labeling decision that does not feel natural.',
            is_mll: true,
            mlr: MLR8,
            flat_move: null,
            proficiency_moves: {
              entering: {
                move: 'Point to one item in the collection and gesture: this one first.',
                say: null,
                nonverbal:
                  'Point to one type of item in the collection. Then point to the first blank in the sentence frame. Then point to the second type of item and the second blank. Use the gesture to assign the order so the student can focus on counting and writing numbers.',
                avoid:
                  'Re-reading the sentence frame aloud. The frame is the issue — adding more English to the situation does not help.',
              },
              developing: {
                move: 'Help them name the categories first, then return to the frame.',
                say: '"Before you fill in the sentence, tell me — what two categories did you make? Use those words to fill in the first blank. The numbers come after."',
                nonverbal: null,
                avoid:
                  'Asking "what is the ratio?" That assumes they already have the language. They do not. Start with the categories.',
              },
              bridging: {
                move: 'Ask which form feels easier to start with.',
                say: '"Two of the forms ask you to label the categories with words; the third just uses numbers and a colon. Which would be easiest to try first? Start there and the others will follow."',
                nonverbal: null,
                avoid:
                  'Treating the stuck-ness as a math issue. The math is probably fine. The support is in choosing where to start with the language.',
              },
            },
            mll_framework_note:
              'For an Entering student, you assign the order with gestures so they can focus on the numbers. For a Developing student, you help them name the categories in English before asking for the full sentence. For a Bridging student, you give them choice over which form to start with — they have the English; what they need is permission to find their own entry point.',
            proficiency_divergence_note:
              'All three proficiency levels use MLR 8 mechanics, but the support shifts: nonverbal pointing for Entering, sentence-priming for Developing, choice-of-form for Bridging.',
          },
          {
            scenario_type: 'partial-understanding',
            label: 'A student wrote a ratio sentence in their home language and is not sure how to translate it.',
            interpretation:
              'The math is done. The student understood the task and produced the sentence — just not in English. This is a translation moment, not a math moment. Treating it as a math issue would be a mistake.',
            is_mll: true,
            mlr: MLR1,
            flat_move: null,
            proficiency_moves: {
              entering: {
                move: 'Affirm what they wrote. Help them swap in the English category names.',
                say: null,
                nonverbal:
                  'Point to the student\'s sentence. Smile. Point to the items in the collection and say the English names ("pens, pencils") clearly. Point back to the sentence — they fill in the English where their home-language words were.',
                avoid:
                  'Asking them to rewrite the whole sentence. The work is done — the only English they need is the category names.',
              },
              developing: {
                move: 'Translate the structure with them, not the content.',
                say: '"Your sentence is right. In English, we say it like this: \'The ratio of __ to __ is __ to __.\' Use your same numbers — just swap your words for these English words."',
                nonverbal: null,
                avoid:
                  'Reading the English sentence aloud and asking them to copy. The point is for them to make the translation, not for you to do it.',
              },
              bridging: {
                move: 'Acknowledge the choice; ask them to write the English version next to it.',
                say: '"Your home-language version is correct. Try writing it in English now using one of the sentence frames. Which form do you want to try?"',
                nonverbal: null,
                avoid:
                  'Treating the home-language version as a draft. It is a complete answer. The English version is additional, not a replacement.',
              },
            },
            mll_framework_note:
              'For an Entering student, you swap only the category names — the structure is already there. For a Developing student, you give them the English structure to work with. For a Bridging student, you let them choose which form to try in English.',
            proficiency_divergence_note:
              'All three proficiency levels use MLR 1 — each move is the same routine (first draft to stronger draft) with the draft cycle scoped to what the student can take on: category-names only for Entering, structure transfer for Developing, choice of form for Bridging.',
          },
        ],
      },
      {
        activity_id: '1.3',
        scenarios: [
          {
            scenario_type: 'partial-understanding',
            label: 'A multilingual student is only using the colon form (3:6) and is skipping the verbal forms ("3 to 6," "3 for every 6").',
            interpretation:
              'The student has the math. They are choosing the colon form because it requires the least English. Letting them stay only in the colon form means they never practice the verbal forms — which are the work this lesson is doing. But pushing them to write a verbal sentence right now might make them hide more. The support is finding a low-pressure way to try the verbal form.',
            is_mll: true,
            mlr: MLR1,
            flat_move: null,
            proficiency_moves: {
              entering: {
                move: 'Affirm the colon form. Show the "for every" version with your fingers.',
                say: null,
                nonverbal:
                  'Point to the colon (3:6). Smile and nod. Then hold up three fingers on one hand, six on the other. Move your hands together and apart, looking from the student to the fingers. Tap the words "for every" in the sentence frame and look encouraging. You are showing that the colon and the words say the same thing. Do not require writing.',
                avoid: 'Marking the colon-only form as incomplete. It is correct. The verbal forms are additional, not required.',
              },
              developing: {
                move: 'Ask them to read the colon form aloud. Then ask if they can say the same thing with "to."',
                say: '"Read your ratio out loud — \'three colon six.\' Now — can you say that same thing using the word \'to\'?" Let them say it without writing. Saying it aloud is the bridge.',
                nonverbal: null,
                avoid: 'Making them write the verbal form right now. Saying it aloud is the step before writing.',
              },
              bridging: {
                move: 'Offer the choice of which form to try next.',
                say: '"You have the colon form. Which of the other two forms feels easier to try — the \'to\' one or the \'for every\' one? Pick one and write that next."',
                nonverbal: null,
                avoid: 'Telling them which form to write next. The choice is part of the support.',
              },
            },
            mll_framework_note:
              'For an Entering student, gestures and the colon form together count as success — the verbal forms can wait. For a Developing student, saying the verbal form aloud is the bridge before writing it. For a Bridging student, choice over which form to try next gives them safe entry into the harder language.',
            proficiency_divergence_note:
              'For Entering, this becomes MLR 8 — the colon form plus the gesture is the success criterion; no verbal form is required. For Developing and Bridging, MLR 1 carries the work: saying it, then writing it, as successive stronger drafts.',
          },
          {
            scenario_type: 'productive-struggle',
            label: 'A student crossed out their first ratio sentence and is rereading the sentence frame.',
            interpretation:
              'The student tried something, realized it was not right, and is now rereading to figure out what to change. This is exactly what learning looks like — they are doing the work themselves. If you step in now to help, you take that work away.',
            is_mll: false,
            mlr: MLR8,
            flat_move: {
              move: 'Wait. Watch what they do next.',
              say: null,
              nonverbal:
                'Stand near them but not over them. If they look up, nod once and step away. The signal is "I see you working — keep going." MLR 8 wait time applies here at length — 10+ seconds.',
              avoid:
                'Asking "are you stuck?" or "do you need help?" They are not stuck — they are working. The wrong question stops the work.',
            },
            proficiency_moves: null,
            mll_framework_note: null,
            proficiency_divergence_note: null,
          },
          {
            scenario_type: 'productive-insight',
            label: 'A student says "my partner and I have different ratios but the same numbers — how?"',
            interpretation:
              'The student noticed that they and their partner sorted the same collection in different ways and got different ratios from the same items. This is a big idea — that ratios depend on what you choose to compare. The risk is that you explain it instead of letting the class wrestle with it.',
            is_mll: false,
            mlr: MLR7,
            flat_move: {
              move: 'Pull the observation into the room. Put both ratios on the board side by side.',
              say: '"That is a great question. [Name] noticed that they and their partner had the same items but different ratios. I am putting both of your ratios up here — class, what is the same about them? What is different? Talk to your partner for one minute."',
              nonverbal: null,
              avoid: 'Answering the question directly. MLR 7 is the move here — let them compare the two ratios and connect them to the idea that ratios depend on what you compare.',
            },
            proficiency_moves: null,
            mll_framework_note: null,
            proficiency_divergence_note: null,
          },
        ],
      },
    ],
  },

  wristband: {
    arc_one_line: 'Sort, see it, say it: turn relationships into ratio language.',
    preflight: [
      'Pre-pair: match each MLL with a partner who shares their home language for 1.2.',
      'Pre-plan capture: which 2 student phrases will you write on the board during 1.1?',
      'Pre-call: which 2 students will you call on first in 1.2 to anchor the language?',
      'Pre-display: sentence frames printed AND on the board before 1.2 begins.',
    ],
    top_signals: [
      'Students use "for every" without being asked.',
      'Students read their ratio sentences aloud.',
      'Students notice the three forms say the same thing.',
    ],
    top_frictions: [
      'Numbers written in the frame in the wrong order.',
      'Students freeze at the labeled-category step.',
      'MLLs stay only in the colon form.',
    ],
    activities: [
      {
        activity_id: '1.1',
        tiles: [
          {
            observation_short:
              'Student says "for every" unprompted — they\'re previewing the lesson\'s target language.',
            friction_type: 'language',
            mlr: MLR8,
            move_short:
              'Stop the room. Have them say it again so everyone hears "for every." MLR 8 revoicing turns one student\'s words into class language you can return to in 1.2.',
            avoid_short: '"Great!" and moving on — privatizes the insight.',
            glyph_observation: 'SAYS "FOR EVERY"',
            glyph_move: 'STOP · REPEAT · REVOICE',
          },
          {
            observation_short:
              'Two students argue about the "right" sort — they expect one categorization to be correct.',
            friction_type: 'math',
            move_short:
              'Affirm BOTH sorts as mathematically valid. "You both have a way that works." Different categorizations of the same items will produce different ratios — that IS the lesson.',
            avoid_short: 'Picking a winner — kills the lesson\'s move.',
            glyph_observation: 'ARGUES "RIGHT" SORT',
            glyph_move: 'VALIDATE MANY WAYS',
          },
          {
            observation_short:
              'MLL sorting cleanly but silent — hands are doing the math; English isn\'t available right now.',
            friction_type: 'language',
            mlr: MLR8,
            move_short:
              'Smile and point at the groups. Use one nonverbal question — point + puzzled face — to invite a regroup. MLR 8 nonverbal supports: the gesture IS the math question.',
            avoid_short: '"Can you explain?" — English they don\'t have.',
            has_proficiency_variants: true,
            glyph_observation: 'MLL SORTS SILENTLY',
            glyph_move: 'GESTURES · ACCEPT GESTURES',
          },
        ],
      },
      {
        activity_id: '1.2',
        tiles: [
          {
            observation_short:
              'Numbers flipped in the frame — likely defaulted to bigger-first; word order didn\'t register.',
            friction_type: 'language-math',
            mlr: MLR8,
            move_short:
              'Have them read it aloud. Ask "which one comes first — squares or circles?" MLR 8 read-aloud lets them feel the mismatch between words and numbers — and they self-correct.',
            avoid_short: 'Correcting the order yourself.',
            glyph_observation: 'NUMBERS FLIPPED',
            glyph_move: 'READ ALOUD · WHICH FIRST?',
          },
          {
            observation_short:
              'MLL frozen at the frame — stuck on which category to label first. Not a math problem; a labeling problem.',
            friction_type: 'language-math',
            mlr: MLR8,
            move_short:
              'Point to one item, then the first blank; point to the other item, then the second blank. Gesture assigns the order so they can focus on counting. MLR 8 nonverbal scaffold.',
            avoid_short: 'Re-reading the frame aloud — more English isn\'t the help.',
            has_proficiency_variants: true,
            glyph_observation: 'MLL FROZEN AT FRAME',
            glyph_move: 'POINT ITEM · POINT BLANK',
          },
          {
            observation_short:
              'Asks "why all three forms?" — they\'re noticing equivalence. This IS the lesson\'s big idea surfacing.',
            friction_type: 'math',
            mlr: MLR7,
            move_short:
              'Throw it to the class: "Look at \'3 to 6\' and \'3 for every 6\' — same? different?" MLR 7 compare-and-connect. They reach equivalence themselves.',
            avoid_short: 'Answering it yourself — privatizes the synthesis.',
            is_crux_moment: true,
            glyph_observation: 'ASKS "ALL THREE?"',
            glyph_move: 'THROW TO CLASS · COMPARE',
          },
        ],
      },
      {
        activity_id: '1.3',
        tiles: [
          {
            observation_short:
              'MLL using only the colon form (3:6) — choosing what needs the least English. The math is right; the verbal work is being skipped.',
            friction_type: 'language',
            mlr: MLR1,
            move_short:
              'Affirm the colon as correct. Ask them to SAY "three to six" aloud — no writing yet. Saying first, writing next. MLR 1: each form is a stronger draft of the same relationship.',
            avoid_short: 'Marking the colon-only as incomplete — it isn\'t.',
            has_proficiency_variants: true,
            glyph_observation: 'COLON ONLY',
            glyph_move: 'AFFIRM · SAY THEN WRITE',
          },
          {
            observation_short:
              'Student crossed out their ratio and is rereading the frame — self-correcting in real time.',
            friction_type: 'math',
            move_short:
              'Stand near, don\'t speak. If they look up, nod and step back. MLR 8 wait time at length — 10+ seconds. The work is happening; your job is not to interrupt it.',
            avoid_short: '"Are you stuck?" — they aren\'t.',
            mlr: MLR8,
            glyph_observation: 'CROSSED OUT · REREADING',
            glyph_move: 'WAIT · STEP AWAY',
          },
          {
            observation_short:
              'Partners have the same items but wrote different ratios — they\'ve surfaced that ratios depend on what you compare.',
            friction_type: 'math',
            mlr: MLR7,
            move_short:
              'Put both ratios on the board. Ask: "Same items — how can the ratios be different?" MLR 7 compare-and-connect. They reach "we picked different categories." Sets up tomorrow.',
            avoid_short: 'Explaining it — the wrestle IS the learning.',
            glyph_observation: 'SAME ITEMS · DIFFERENT RATIOS',
            glyph_move: 'BOTH ON BOARD · COMPARE',
          },
        ],
      },
    ],
    mlr_legend: [
      {
        mlr: MLR1,
        one_line_cue: 'First draft → partner → stronger draft.',
      },
      {
        mlr: MLR8,
        one_line_cue: 'Revoice, wait, frames, repeat together.',
      },
      {
        mlr: MLR7,
        one_line_cue: 'Two solutions side by side; name what they share.',
      },
    ],
  },
};
