/**
 * src/content.js
 * Pure educational content & chemistry data for ET617 End-Sem Exam (Roll No: 24b3925).
 * No DOM or UI logic lives here so content and misconception rules are easy to inspect and edit.
 */

export const EXAM_CARD_META = {
  rollNo: "24b3925",
  rollNoUpper: "24B3925",
  problemCode: "P4",
  problemTitle: "Adaptive tutor with automatic question generation",
  topicCode: "P4-T4",
  topicTitle: "Acids, bases and indicators (Class 7–10)",
  learnerCode: "L5",
  learnerTitle: "Learner repeating the topic after failing it once, high anxiety and low self-efficacy",
  constraintCode: "C4",
  constraintTitle: "10-minute sessions — One complete learning sequence fits in 10 minutes; stop and resume where left off",
  sessionLimitSeconds: 600
};

/**
 * Topic-Specific Problem-Solving Tool Data (Rubric T6):
 * 4 NCERT Class 7-10 Indicators + 8 Everyday Substances.
 */
export const INDICATORS = {
  litmus: {
    id: "litmus",
    name: "Litmus (Blue & Red)",
    source: "Natural dye from lichens",
    inAcid: { label: "Turns Red", hex: "#ef4444", textHex: "#ffffff", note: "Blue litmus turns red; red litmus stays red." },
    inBase: { label: "Turns Blue", hex: "#2563eb", textHex: "#ffffff", note: "Red litmus turns blue; blue litmus stays blue." },
    inNeutral: { label: "Stays Purple / No Change", hex: "#7c3aed", textHex: "#ffffff", note: "Neither red nor blue litmus changes colour." },
    memoryCue: "B-R-A (Blue to Red in Acid) and R-B-B (Red to Blue in Base)."
  },
  turmeric: {
    id: "turmeric",
    name: "Turmeric (Haldi)",
    source: "Natural kitchen indicator",
    inAcid: { label: "Stays Bright Yellow", hex: "#facc15", textHex: "#1e293b", note: "Turmeric does NOT turn red in acids! It stays yellow." },
    inBase: { label: "Turns Reddish-Brown", hex: "#991b1b", textHex: "#ffffff", note: "Soap or baking soda turns yellow haldi reddish-brown." },
    inNeutral: { label: "Stays Bright Yellow", hex: "#facc15", textHex: "#1e293b", note: "Remains yellow in pure water or salt solution." },
    memoryCue: "Think of a curry stain on a shirt: rubbing soap (a base) turns yellow haldi reddish-brown!"
  },
  chinaRose: {
    id: "chinaRose",
    name: "China Rose (Gudhal)",
    source: "Natural floral indicator (warm water extract of hibiscus petals)",
    inAcid: { label: "Turns Dark Pink (Magenta)", hex: "#db2777", textHex: "#ffffff", note: "Light pink gudhal extract deepens to dark pink/magenta in acids." },
    inBase: { label: "Turns Green", hex: "#16a34a", textHex: "#ffffff", note: "Turns a distinct leafy green in basic solutions." },
    inNeutral: { label: "Stays Pale Pink", hex: "#f9a8d4", textHex: "#1e293b", note: "Keeps its original light pink petal colour." },
    memoryCue: "Gudhal Gardens: Green in Base, Magenta in Acid."
  },
  phenolphthalein: {
    id: "phenolphthalein",
    name: "Phenolphthalein",
    source: "Synthetic laboratory indicator",
    inAcid: { label: "Stays Colourless", hex: "#e2e8f0", textHex: "#0f172a", note: "Looks like plain water in acids — never turns pink in acid!" },
    inBase: { label: "Turns Bright Pink", hex: "#ec4899", textHex: "#ffffff", note: "Turns vivid pink/fuchsia as soon as a base is present." },
    inNeutral: { label: "Stays Colourless", hex: "#e2e8f0", textHex: "#0f172a", note: "Remains clear and colourless in neutral solutions." },
    memoryCue: "Phenolphthalein is shy in acid (colourless) and blushes Pink only in Base."
  }
};

export const SUBSTANCES = [
  {
    id: "lemon",
    name: "Lemon Juice",
    category: "acid",
    chemicalName: "Citric acid",
    everydayContext: "Sour kitchen juice",
    whyNote: "Contains citric acid, which releases H+ ions in water."
  },
  {
    id: "vinegar",
    name: "Vinegar (Sirka)",
    category: "acid",
    chemicalName: "Acetic acid",
    everydayContext: "Cooking & pickle preservative",
    whyNote: "Contains dilute acetic acid (sour taste, acidic nature)."
  },
  {
    id: "antSting",
    name: "Ant Sting Fluid",
    category: "acid",
    chemicalName: "Formic acid (Methanoic acid)",
    everydayContext: "Injected when a red ant bites skin",
    whyNote: "Contains formic acid — must be neutralised with a mild base like baking soda."
  },
  {
    id: "soap",
    name: "Soap Water",
    category: "base",
    chemicalName: "Sodium / Potassium hydroxide salts",
    everydayContext: "Slippery washing solution",
    whyNote: "Feels soapy and basic; turns turmeric reddish-brown and red litmus blue."
  },
  {
    id: "bakingSoda",
    name: "Baking Soda Solution",
    category: "base",
    chemicalName: "Sodium hydrogen carbonate (NaHCO3)",
    everydayContext: "Gentle kitchen base & ant-bite relief",
    whyNote: "A mild, safe base that neutralises excess acid on skin or in the stomach."
  },
  {
    id: "magnesia",
    name: "Milk of Magnesia",
    category: "base",
    chemicalName: "Magnesium hydroxide Mg(OH)2",
    everydayContext: "Medical antacid for indigestion",
    whyNote: "Mild base taken to neutralise excess hydrochloric acid in the stomach."
  },
  {
    id: "water",
    name: "Distilled / Tap Water",
    category: "neutral",
    chemicalName: "Pure H2O",
    everydayContext: "Everyday drinking water",
    whyNote: "Neither acidic nor basic (pH 7); indicators keep their neutral colour."
  },
  {
    id: "saltWater",
    name: "Common Salt Solution",
    category: "neutral",
    chemicalName: "Sodium chloride (NaCl) in water",
    everydayContext: "Neutral salt formed by strong acid + strong base",
    whyNote: "Neutral solution — does not change litmus, turmeric, or phenolphthalein."
  }
];

/**
 * Target Misconceptions from Deliverable D2 (Persona Aarav, L5):
 */
export const MISCONCEPTIONS = {
  M1: {
    code: "M1",
    title: "Indicator Colour-Rule Overgeneralisation",
    learnerBelief: "Assuming ALL indicators turn red/pink in acids and blue/yellow in bases (applying the Litmus rule to Turmeric and Phenolphthalein).",
    scientificTruth: "Each indicator has its own chemical structure: Litmus turns red in acid, but Turmeric stays yellow in acid and turns reddish-brown ONLY in bases. Phenolphthalein stays colourless in acid and turns pink ONLY in bases.",
    visualAnalogy: "Think of a yellow curry (haldi) stain on a white shirt: squeezing lemon (acid) on it keeps it yellow, while rubbing soap (base) turns the spot reddish-brown!",
    contrastTable: [
      { indicator: "Litmus", acid: "Red", base: "Blue" },
      { indicator: "Turmeric (Haldi)", acid: "Yellow (no change!)", base: "Reddish-Brown" },
      { indicator: "China Rose (Gudhal)", acid: "Dark Pink (Magenta)", base: "Green" },
      { indicator: "Phenolphthalein", acid: "Colourless (clear!)", base: "Bright Pink" }
    ]
  },
  M2: {
    code: "M2",
    title: "Neutralisation Direction ('Like Cures Like') Misconception",
    learnerBelief: "Thinking an acidic burn or sting (ant bite / stomach acidity) can be treated by rubbing another strong household acid like lemon juice or vinegar.",
    scientificTruth: "Neutralisation requires an OPPOSITE chemical partner: Acid + Base -> Salt + Water. Adding lemon juice (citric acid) to an ant bite (formic acid) adds MORE acid and worsens the burn! You must use a mild base like baking soda or calamine.",
    visualAnalogy: "Imagine a seesaw tipped all the way down on the 'Acid' side. Sitting on the same 'Acid' side pushes it down harder — you have to place weight on the 'Base' side (baking soda) to balance it back to 'Neutral'!",
    contrastTable: [
      { problem: "Ant Bite (Formic Acid)", wrongRemedy: "Lemon / Vinegar (Adds more acid!)", rightRemedy: "Moist Baking Soda / Calamine (Mild Base)" },
      { problem: "Stomach Indigestion (Excess HCl Acid)", wrongRemedy: "Fizzy sour soda / citrus", rightRemedy: "Milk of Magnesia antacid (Mild Base)" },
      { problem: "Basic Wasp / Soil Treatment", wrongRemedy: "Adding quicklime (Base)", rightRemedy: "Adding organic compost / mild acid" }
    ]
  }
};

/**
 * Conversational Concept Cards (Rubric C3 & P5 — Active voice, 'we'/'us', highlighted visual cues)
 */
export const CONCEPT_CARDS = [
  {
    id: "c1_acid_base",
    stepNumber: 1,
    title: "1. Let's Spot Acids & Bases Around Us",
    conversationalLead: "Let us forget scary chemical formulas for a minute! We already meet acids and bases in our kitchen every single day.",
    keyHighlights: [
      "First: Acids taste sour (like lemon juice, vinegar, curd) and release H+ ions. Note: Never taste lab chemicals — that is why we use indicators!",
      "Second: Bases feel slippery or soapy (like soap water, baking soda, milk of magnesia) and release OH- ions.",
      "Third: Neutral substances (like pure water or common salt solution) are neither acidic nor basic."
    ],
    boxedTakeaway: "Visual Cue: Acid = Sour kitchen liquids (Lemon, Vinegar, Ant sting) | Base = Soapy or antacid helpers (Soap, Baking Soda, Milk of Magnesia)."
  },
  {
    id: "c2_indicators",
    stepNumber: 2,
    title: "2. The 4 Indicators — And the Trap Everyone Falls Into (M1)",
    conversationalLead: "Here is the #1 reason students lose marks on unit tests: our brain tries to use the Litmus rule ('Acid = Red') for EVERY indicator. Let us break that trap right now!",
    keyHighlights: [
      "Litmus is the classic: Blue Litmus turns RED in Acid, and Red Litmus turns BLUE in Base.",
      "Turmeric (Haldi) surprises people: it stays YELLOW in Acid, and turns REDDISH-BROWN in Base (like soap on a curry stain!).",
      "China Rose (Gudhal) turns DARK PINK (Magenta) in Acid and leafy GREEN in Base.",
      "Phenolphthalein stays completely COLOURLESS in Acid and turns BRIGHT PINK only in Base."
    ],
    boxedTakeaway: "Watch out for Trap M1: Reddish-brown turmeric and Pink phenolphthalein mean BASE, not acid!"
  },
  {
    id: "c3_neutralisation",
    stepNumber: 3,
    title: "3. Neutralisation: How Opposite Partners Cancel Out (M2)",
    conversationalLead: "What happens when we mix an acid and a base in the right amount? They cancel each other's sting to form harmless Salt + Water!",
    keyHighlights: [
      "Rule of Opposites: To calm down an ACID problem, we must add a mild BASE (never another acid!).",
      "Real-life case 1 (Ant Bite): An ant injects Formic Acid. Rubbing Baking Soda (mild base) neutralises the acid and stops the burning.",
      "Real-life case 2 (Indigestion): Our stomach makes excess Hydrochloric Acid. Drinking Milk of Magnesia (mild base) neutralises it safely."
    ],
    boxedTakeaway: "Watch out for Trap M2: Putting lemon juice (acid) on an ant bite (acid) doubles the acid! Always pair Acid with Base."
  }
];

/**
 * Core Question Bank (Deliverable D3 & Problem P4):
 * Covers 3 distinct formats:
 *   1. "mcq" (Scenario Multiple-Choice with M1/M2 diagnostic tags)
 *   2. "predictor" (Interactive Multi-Select Indicator Colour + Substance Classification)
 *   3. "explanation" (Short Open-Text Explanation with Rubric & Misconception Diagnosis)
 */
export const QUESTION_BANK = [
  {
    id: "q1_mcq_turmeric",
    title: "Task 1: The Curry Stain Test",
    lo: "LO1",
    bloom: "Understand (Classify)",
    difficulty: 1,
    format: "mcq",
    targetMisconception: "M1",
    prompt: "Let us imagine Aarav drops yellow turmeric (haldi) paste onto two white cloth strips. On Strip A he squeezes lemon juice (an acid). On Strip B he rubs soap water (a base). What colours will we see on Strip A and Strip B?",
    options: [
      {
        id: "opt_a",
        text: "Strip A (lemon juice) turns red; Strip B (soap water) turns blue.",
        isCorrect: false,
        misconceptionTag: "M1",
        feedback: "Pause and take a breath! You just met Trap M1: applying the Litmus rule ('acid = red, base = blue') to turmeric. Remember: turmeric is NOT litmus!"
      },
      {
        id: "opt_b",
        text: "Strip A (lemon juice) stays yellow; Strip B (soap water) turns reddish-brown.",
        isCorrect: true,
        misconceptionTag: null,
        feedback: "Spot on! Lemon juice is acidic so turmeric stays yellow, while soap water is basic so it turns turmeric reddish-brown — just like washing a curry stain with soap!"
      },
      {
        id: "opt_c",
        text: "Strip A (lemon juice) turns reddish-brown; Strip B (soap water) stays yellow.",
        isCorrect: false,
        misconceptionTag: "M1",
        feedback: "So close, you know the right two colours (yellow and reddish-brown), but swapped acid and base! Turmeric turns reddish-brown only in a BASE like soap."
      },
      {
        id: "opt_d",
        text: "Both strips turn colourless.",
        isCorrect: false,
        misconceptionTag: "M1",
        feedback: "Turmeric is a bright yellow natural dye — it never turns colourless. Only phenolphthalein is colourless in acids."
      }
    ],
    hints: [
      "Hint 1 (Everyday clue): Have you ever seen soap rubbed on a yellow haldi curry stain on clothes? What colour does the soap turn the stain?",
      "Hint 2 (Chemical rule): Soap is a base, and it turns turmeric reddish-brown. In acids like lemon juice, turmeric does not change colour at all.",
      "Hint 3 (Direct check): Open the Indicator Dropper Tool above and drop Turmeric into Lemon Juice and Soap Water!"
    ],
    modelAnswer: "Strip A (lemon juice, acid) stays bright yellow; Strip B (soap water, base) turns reddish-brown.",
    altExplanationCard: {
      headline: "Alternative Visual Explanation: Why Turmeric Doesn't Follow Litmus (M1)",
      analogy: "In our kitchen, haldi (turmeric) is cooked with sour lemon or tamarind (acids) every day — and the curry stays bright YELLOW! It only turns REDDISH-BROWN when touched by alkaline SOAP in the washbasin.",
      ruleSummary: "Turmeric in Acid = Yellow | Turmeric in Base = Reddish-Brown"
    },
    prerequisiteLabTask: {
      substanceId: "soap",
      indicatorId: "turmeric",
      instruction: "Let's test this hands-on first: Click the button below to drop Turmeric into Soap Water and Lemon Juice in our mini-beaker before we retry."
    }
  },
  {
    id: "q2_mcq_phenolphthalein",
    title: "Task 2: The Mystery Colourless Beaker",
    lo: "LO1",
    bloom: "Understand (Classify)",
    difficulty: 1,
    format: "mcq",
    targetMisconception: "M1",
    prompt: "We have a clear liquid in Beaker X. When we add 2 drops of phenolphthalein, the liquid turns bright PINK. If we now dip red litmus paper into Beaker X, what will happen?",
    options: [
      {
        id: "opt_a",
        text: "Red litmus stays red, because pink colour means Beaker X is an acid.",
        isCorrect: false,
        misconceptionTag: "M1",
        feedback: "Aha — Trap M1 caught! It is super tempting to think 'pink/red = acid', but phenolphthalein turns bright pink ONLY in a BASE. In acids, phenolphthalein is completely colourless!"
      },
      {
        id: "opt_b",
        text: "Red litmus turns blue, because phenolphthalein turns pink only in a base.",
        isCorrect: true,
        misconceptionTag: null,
        feedback: "Brilliant reasoning! Step 1: Phenolphthalein turning pink proves Beaker X is a base. Step 2: A base turns red litmus blue!"
      },
      {
        id: "opt_c",
        text: "Red litmus turns green.",
        isCorrect: false,
        misconceptionTag: "M1",
        feedback: "Green is the base colour for China Rose (Gudhal) indicator! Litmus only switches between red and blue."
      },
      {
        id: "opt_d",
        text: "Neither litmus paper changes because Beaker X is neutral.",
        isCorrect: false,
        misconceptionTag: null,
        feedback: "In a neutral liquid like water, phenolphthalein stays colourless. Since it turned bright pink, Beaker X cannot be neutral."
      }
    ],
    hints: [
      "Hint 1: First ask: Which type of solution makes phenolphthalein blush bright pink — acid or base?",
      "Hint 2: Phenolphthalein is colourless in acid and turns bright pink in a BASE. So Beaker X is definitely a base!",
      "Hint 3: Now apply the Litmus rule for a base: R-B-B (Red litmus turns Blue in Base)."
    ],
    modelAnswer: "Red litmus turns blue because phenolphthalein turns bright pink only in basic solutions.",
    altExplanationCard: {
      headline: "Alternative Visual Explanation: Phenolphthalein's 'Shy vs Blush' Rule (M1)",
      analogy: "Think of Phenolphthalein as invisible ink in acids and water (stays 100% clear/colourless). It only 'blushes' BRIGHT PINK when it meets a BASE like baking soda or soap!",
      ruleSummary: "Phenolphthalein Pink => Solution is a Base => Turns Red Litmus Blue"
    },
    prerequisiteLabTask: {
      substanceId: "bakingSoda",
      indicatorId: "phenolphthalein",
      instruction: "Let's test Phenolphthalein in Baking Soda (base) vs Vinegar (acid) in the mini-lab to see why Pink means Base."
    }
  },
  {
    id: "q3_predictor_chinahibiscus",
    title: "Task 3: Interactive Indicator Prediction Bench",
    lo: "LO2",
    bloom: "Apply (Predict)",
    difficulty: 2,
    format: "predictor",
    targetMisconception: "M1",
    prompt: "Let us predict before we pour! We have a bowl of Vinegar (Sirka) from the kitchen. Select: (1) whether Vinegar is acidic, basic, or neutral, (2) what colour China Rose (Gudhal) indicator will turn in it, and (3) what colour Turmeric will show in it.",
    predictorConfig: {
      substanceName: "Vinegar (Acetic Acid)",
      expectedCategory: "acid",
      indicator1Id: "chinaRose",
      indicator1Name: "China Rose (Gudhal)",
      indicator1Choices: [
        { id: "magenta", label: "Dark Pink (Magenta)", hex: "#db2777", isCorrect: true },
        { id: "green", label: "Leafy Green", hex: "#16a34a", isCorrect: false, misconceptionTag: "M1" },
        { id: "blue", label: "Blue", hex: "#2563eb", isCorrect: false, misconceptionTag: "M1" }
      ],
      indicator2Id: "turmeric",
      indicator2Name: "Turmeric (Haldi)",
      indicator2Choices: [
        { id: "yellow", label: "Stays Bright Yellow", hex: "#facc15", isCorrect: true },
        { id: "redbrown", label: "Reddish-Brown", hex: "#991b1b", isCorrect: false, misconceptionTag: "M1" },
        { id: "pink", label: "Bright Pink", hex: "#ec4899", isCorrect: false, misconceptionTag: "M1" }
      ]
    },
    hints: [
      "Hint 1: Taste memory — vinegar is sour, which means it is an Acid (acetic acid).",
      "Hint 2: Remember 'Gudhal Gardens': China Rose turns Green in Base, and Dark Pink (Magenta) in Acid!",
      "Hint 3: And what does Turmeric do in an acid like vinegar or lemon? It stays Bright Yellow (never reddish-brown!)."
    ],
    correctFeedback: "Awesome prediction! Vinegar is an acid, so China Rose turns Dark Pink (Magenta) while Turmeric stays Bright Yellow.",
    misconceptionFeedback: {
      M1: "Watch out for M1! Vinegar is an acid: China Rose turns Dark Pink (Magenta) in acids (Green is for bases!), and Turmeric stays Bright Yellow in acids (Reddish-Brown is only for bases!)."
    },
    modelAnswer: "Nature: Acid | China Rose in Vinegar: Dark Pink (Magenta) | Turmeric in Vinegar: Stays Bright Yellow.",
    altExplanationCard: {
      headline: "Alternative Visual Explanation: Comparing Natural Indicators Side by Side (M1)",
      analogy: "Both Gudhal (China Rose) and Haldi (Turmeric) come from plants, but they react differently: in sour Vinegar (Acid), Gudhal deepens to Magenta while Haldi stays Yellow.",
      ruleSummary: "Vinegar (Acid) -> China Rose = Magenta | Turmeric = Stays Yellow"
    },
    prerequisiteLabTask: {
      substanceId: "vinegar",
      indicatorId: "chinaRose",
      instruction: "Let's test Vinegar with both China Rose and Turmeric in our interactive dropper bench to see the exact colours!"
    }
  },
  {
    id: "q4_predictor_magnesia",
    title: "Task 4: Predicting Antacid Indicator Results",
    lo: "LO2",
    bloom: "Apply (Predict)",
    difficulty: 2,
    format: "predictor",
    targetMisconception: "M1",
    prompt: "A doctor gives Milk of Magnesia (Magnesium hydroxide) to calm stomach acidity. Predict: (1) Is Milk of Magnesia an acid, base, or neutral? (2) What colour will China Rose turn in it? (3) What colour will Phenolphthalein turn in it?",
    predictorConfig: {
      substanceName: "Milk of Magnesia (Antacid)",
      expectedCategory: "base",
      indicator1Id: "chinaRose",
      indicator1Name: "China Rose (Gudhal)",
      indicator1Choices: [
        { id: "green", label: "Leafy Green", hex: "#16a34a", isCorrect: true },
        { id: "magenta", label: "Dark Pink (Magenta)", hex: "#db2777", isCorrect: false, misconceptionTag: "M1" },
        { id: "yellow", label: "Bright Yellow", hex: "#facc15", isCorrect: false, misconceptionTag: "M1" }
      ],
      indicator2Id: "phenolphthalein",
      indicator2Name: "Phenolphthalein",
      indicator2Choices: [
        { id: "pink", label: "Bright Pink", hex: "#ec4899", isCorrect: true },
        { id: "colourless", label: "Stays Colourless", hex: "#e2e8f0", isCorrect: false, misconceptionTag: "M1" },
        { id: "redbrown", label: "Reddish-Brown", hex: "#991b1b", isCorrect: false, misconceptionTag: "M1" }
      ]
    },
    hints: [
      "Hint 1: Stomach juice already has excess acid (HCl). To neutralise it, an antacid like Milk of Magnesia must be a mild BASE!",
      "Hint 2: In a BASE, China Rose (Gudhal) turns leafy GREEN.",
      "Hint 3: In a BASE, Phenolphthalein blushes BRIGHT PINK."
    ],
    correctFeedback: "Nailed it! Milk of Magnesia is a mild base — it turns China Rose leafy green and makes Phenolphthalein blush bright pink!",
    misconceptionFeedback: {
      M1: "Let's check that! Because an antacid neutralises stomach acid, Milk of Magnesia is a BASE (not an acid). In a base, China Rose turns Green and Phenolphthalein turns Bright Pink."
    },
    modelAnswer: "Nature: Base | China Rose: Leafy Green | Phenolphthalein: Bright Pink.",
    altExplanationCard: {
      headline: "Alternative Visual Explanation: Why Antacids Are Bases (M1 & M2)",
      analogy: "An antacid is literally 'anti-acid' — a gentle base! When tested with indicators, it shows classic base colours: Green with China Rose and Bright Pink with Phenolphthalein.",
      ruleSummary: "Milk of Magnesia = Mild Base -> China Rose: Green | Phenolphthalein: Bright Pink"
    },
    prerequisiteLabTask: {
      substanceId: "magnesia",
      indicatorId: "chinaRose",
      instruction: "Drop China Rose and Phenolphthalein into Milk of Magnesia in the mini-beaker below to observe both base colours."
    }
  },
  {
    id: "q5_explain_antbite",
    title: "Task 5: Real-Life Neutralisation — The Ant Sting Dilemma",
    lo: "LO3",
    bloom: "Analyse & Explain",
    difficulty: 3,
    format: "explanation",
    targetMisconception: "M2",
    prompt: "While gardening, a red ant bites your hand and injects formic acid, causing a sharp burning sensation. Your friend says: 'Quick, rub lemon juice on it!' Your grandmother says: 'No, rub moist baking soda on it!' Who is right, and explain WHY in 1–2 simple sentences using the terms acid, base, and neutralise.",
    explanationRubric: {
      requiredChoiceKeywords: ["baking soda", "grandmother", "grandma", "sodium hydrogen carbonate", "bicarbonate"],
      requiredConceptKeywords: ["base", "basic", "alkaline"],
      requiredMechanismKeywords: ["neutral", "cancel", "formic acid", "acid"],
      misconceptionM2Triggers: [
        "lemon juice is right",
        "friend is right",
        "use lemon",
        "rub lemon",
        "apply lemon",
        "vinegar works",
        "lemon neutralises"
      ],
      sampleStarter: "Grandmother is right because an ant sting contains formic acid, and baking soda is a mild base that..."
    },
    hints: [
      "Hint 1: What chemical does the ant inject? Formic ACID. And what is inside lemon juice? Citric ACID!",
      "Hint 2: What happens if you put lemon juice (acid) on formic acid? Acid + Acid = MORE acid and worse burning (Misconception M2)!",
      "Hint 3: To cancel (neutralise) an acid, we need a mild BASE. Baking soda is a mild base that neutralises formic acid into harmless salt and water."
    ],
    correctFeedback: "Superb scientific explanation! You clearly identified that the ant sting is acidic (formic acid), lemon juice would only add more acid, and baking soda is a mild base that neutralises the acid to relieve the pain.",
    misconceptionFeedback: {
      M2: "Hold on — you just triggered Misconception M2 ('Like Cures Like')! An ant sting already injects formic ACID. Lemon juice contains citric ACID. Rubbing acid on acid increases the burning! We need an opposite partner — a mild BASE like baking soda — to neutralise the formic acid."
    },
    modelAnswer: "Grandmother is right: the ant bite injects formic acid, so rubbing moist baking soda (a mild base) neutralises the acid and stops the burning. Lemon juice is also an acid (citric acid), so it would only make the acidic sting worse.",
    altExplanationCard: {
      headline: "Alternative Visual Explanation: The Acid-Base Seesaw (Resolving M2)",
      analogy: "Think of an ant sting as tipping your skin's seesaw down on the ACID side. Squeezing lemon juice adds more weight to the ACID side! Moist baking soda sits on the BASE side and brings the seesaw back to NEUTRAL.",
      ruleSummary: "Ant Sting (Formic Acid) + Baking Soda (Mild Base) -> Neutralisation (Relief!)"
    },
    prerequisiteLabTask: {
      substanceId: "antSting",
      indicatorId: "litmus",
      instruction: "Test both Ant Sting Fluid and Baking Soda Solution in our mini-lab to see that Ant Sting is an Acid (turns litmus red) and Baking Soda is a Base (turns litmus blue)."
    }
  },
  {
    id: "q6_explain_currystain",
    title: "Task 6: Master Synthesis — The Color-Changing Curry Stain",
    lo: "LO3",
    bloom: "Evaluate & Explain",
    difficulty: 3,
    format: "explanation",
    targetMisconception: "M1",
    prompt: "Explain this two-part kitchen mystery in 1–2 sentences: (a) Why does a yellow turmeric curry stain on a white shirt turn reddish-brown when we rub soap on it? (b) Why does squeezing lemon juice onto that reddish-brown spot turn it yellow again?",
    explanationRubric: {
      requiredChoiceKeywords: ["soap", "base", "basic"],
      requiredConceptKeywords: ["reddish", "brown", "turmeric", "indicator"],
      requiredMechanismKeywords: ["lemon", "acid", "acidic", "neutral", "yellow"],
      misconceptionM1Triggers: [
        "soap is an acid",
        "lemon is a base",
        "turmeric turns red in acid"
      ],
      sampleStarter: "Soap is a base, so it turns the turmeric indicator reddish-brown. When we squeeze lemon juice (an acid)..."
    },
    hints: [
      "Hint 1: Part (a): Turmeric is a natural indicator. Is soap an acid or a base? Soap is a base, which turns turmeric reddish-brown.",
      "Hint 2: Part (b): Lemon juice is an acid (citric acid). What happens when you add an acid to the basic soap on the cloth?",
      "Hint 3: The acid in lemon juice neutralises the basic soap, returning the cloth to an acidic/neutral state where turmeric is bright yellow again!"
    ],
    correctFeedback: "Master-level chemistry explanation! You connected both concepts: soap (a base) turns the turmeric indicator reddish-brown, and lemon juice (an acid) neutralises the base so turmeric returns to its yellow colour.",
    misconceptionFeedback: {
      M1: "Careful with which substance is the acid and which is the base (Misconception M1)! Soap is a BASE (turns turmeric reddish-brown), and lemon juice is an ACID (neutralises the soap and turns turmeric back to yellow)."
    },
    modelAnswer: "Soap is basic, which reacts with the natural turmeric indicator to turn the stain reddish-brown. Squeezing acidic lemon juice neutralises the basic soap on the cloth, restoring turmeric's yellow colour.",
    altExplanationCard: {
      headline: "Alternative Visual Explanation: Reversible Indicator Switch (M1 + M2)",
      analogy: "Turmeric acts like a two-way light switch: Base (soap) flips it to Reddish-Brown; adding Acid (lemon juice) neutralises the soap and flips the switch back to Yellow!",
      ruleSummary: "Yellow Turmeric + Soap (Base) -> Reddish-Brown | + Lemon (Acid) -> Neutralised back to Yellow"
    },
    prerequisiteLabTask: {
      substanceId: "soap",
      indicatorId: "turmeric",
      instruction: "Test Turmeric with Soap Water (base) and Lemon Juice (acid) side by side in the mini-lab."
    }
  }
];

/**
 * Parameterised Templates for Automatic Adaptive Question Generation (P4 & D6):
 * Generates fresh questions dynamically based on target format, difficulty, and misconception focus.
 */
export const DYNAMIC_GENERATOR_TEMPLATES = {
  substancesByType: {
    acid: [
      { name: "Tamarind Water (Imli)", acidName: "Tartaric acid" },
      { name: "Sour Curd (Dahi)", acidName: "Lactic acid" },
      { name: "Amla Juice", acidName: "Ascorbic acid (Vitamin C)" },
      { name: "Dilute Hydrochloric Acid", acidName: "HCl" }
    ],
    base: [
      { name: "Lime Water (Chuna Water)", baseName: "Calcium hydroxide" },
      { name: "Window Cleaner Spray", baseName: "Ammonium hydroxide" },
      { name: "Calamine Lotion", baseName: "Zinc carbonate (mild base)" }
    ]
  }
};
