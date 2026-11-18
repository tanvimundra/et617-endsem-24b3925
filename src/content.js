/**
 * src/content.js
 * Learner-facing educational content & chemistry data for AcidBase Coach.
 * Written in a warm, natural tone for Class 7-10 students (zero exam jargon on learner screens).
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

export const INDICATORS = {
  litmus: {
    id: "litmus",
    name: "Litmus (Blue & Red)",
    source: "Natural dye from lichens",
    inAcid: { label: "Turns Red", hex: "#ef4444", textHex: "#ffffff", note: "Blue litmus turns red; red litmus stays red." },
    inBase: { label: "Turns Blue", hex: "#2563eb", textHex: "#ffffff", note: "Red litmus turns blue; blue litmus stays blue." },
    inNeutral: { label: "Stays Purple / No Change", hex: "#7c3aed", textHex: "#ffffff", note: "Neither red nor blue litmus changes colour." },
    memoryCue: "B-R-A (Blue turns Red in Acid) and R-B-B (Red turns Blue in Base)."
  },
  turmeric: {
    id: "turmeric",
    name: "Turmeric (Haldi)",
    source: "Natural kitchen indicator",
    inAcid: { label: "Stays Bright Yellow", hex: "#facc15", textHex: "#1e293b", note: "Turmeric does NOT turn red in acids — it stays bright yellow!" },
    inBase: { label: "Turns Reddish-Brown", hex: "#991b1b", textHex: "#ffffff", note: "Soap or baking soda turns yellow haldi reddish-brown." },
    inNeutral: { label: "Stays Bright Yellow", hex: "#facc15", textHex: "#1e293b", note: "Remains yellow in pure water or salt solution." },
    memoryCue: "Think of a curry stain on a white shirt: rubbing soap (a base) turns yellow haldi reddish-brown!"
  },
  chinaRose: {
    id: "chinaRose",
    name: "China Rose (Gudhal)",
    source: "Natural floral indicator made from hibiscus petals in warm water",
    inAcid: { label: "Turns Dark Pink (Magenta)", hex: "#db2777", textHex: "#ffffff", note: "Light pink gudhal water deepens to dark pink/magenta in acids." },
    inBase: { label: "Turns Leafy Green", hex: "#16a34a", textHex: "#ffffff", note: "Turns a distinct leafy green in basic solutions." },
    inNeutral: { label: "Stays Pale Pink", hex: "#f9a8d4", textHex: "#1e293b", note: "Keeps its original light pink petal colour." },
    memoryCue: "Gudhal Garden: Green in Base, Magenta (Dark Pink) in Acid."
  },
  phenolphthalein: {
    id: "phenolphthalein",
    name: "Phenolphthalein",
    source: "Laboratory indicator liquid",
    inAcid: { label: "Stays Colourless", hex: "#e2e8f0", textHex: "#0f172a", note: "Looks like plain clear water in acids — never turns pink in acid!" },
    inBase: { label: "Turns Bright Pink", hex: "#ec4899", textHex: "#ffffff", note: "Turns vivid pink as soon as a base is present." },
    inNeutral: { label: "Stays Colourless", hex: "#e2e8f0", textHex: "#0f172a", note: "Remains clear and colourless in neutral solutions." },
    memoryCue: "Phenolphthalein stays invisible (colourless) in acid and blushes Bright Pink only in Base."
  }
};

export const SUBSTANCES = [
  {
    id: "lemon",
    name: "Lemon Juice",
    category: "acid",
    chemicalName: "Citric acid",
    everydayContext: "Sour kitchen juice",
    whyNote: "Contains citric acid (sour taste, acidic nature)."
  },
  {
    id: "vinegar",
    name: "Vinegar (Sirka)",
    category: "acid",
    chemicalName: "Acetic acid",
    everydayContext: "Cooking & pickle liquid",
    whyNote: "Contains dilute acetic acid."
  },
  {
    id: "antSting",
    name: "Ant Sting Drop",
    category: "acid",
    chemicalName: "Formic acid (Methanoic acid)",
    everydayContext: "Injected when a red ant bites skin",
    whyNote: "Contains formic acid — calmed by rubbing a mild base like baking soda."
  },
  {
    id: "soap",
    name: "Soap Water",
    category: "base",
    chemicalName: "Alkaline soap solution",
    everydayContext: "Slippery washing liquid",
    whyNote: "Feels soapy and basic; turns turmeric reddish-brown and red litmus blue."
  },
  {
    id: "bakingSoda",
    name: "Baking Soda Solution",
    category: "base",
    chemicalName: "Sodium hydrogen carbonate",
    everydayContext: "Gentle kitchen base & ant-bite relief",
    whyNote: "A mild, safe base that cancels out excess acid on skin."
  },
  {
    id: "magnesia",
    name: "Milk of Magnesia",
    category: "base",
    chemicalName: "Magnesium hydroxide",
    everydayContext: "Antacid medicine for stomach acidity",
    whyNote: "Mild base taken to calm excess hydrochloric acid in the stomach."
  },
  {
    id: "water",
    name: "Pure Tap Water",
    category: "neutral",
    chemicalName: "H2O",
    everydayContext: "Everyday drinking water",
    whyNote: "Neither acidic nor basic; indicators keep their neutral colour."
  },
  {
    id: "saltWater",
    name: "Common Salt Water",
    category: "neutral",
    chemicalName: "Sodium chloride in water",
    everydayContext: "Formed when acid and base neutralise",
    whyNote: "Neutral solution — does not change litmus, turmeric, or phenolphthalein."
  }
];

export const MISCONCEPTIONS = {
  M1: {
    code: "M1",
    title: "Mixing Up Indicator Colour Rules",
    learnerBelief: "Thinking every indicator turns red/pink in acids and blue/yellow in bases like Litmus.",
    scientificTruth: "Litmus turns red in acid, but Turmeric stays yellow in acid and turns reddish-brown only in bases. Phenolphthalein stays colourless in acid and turns pink only in bases."
  },
  M2: {
    code: "M2",
    title: "Adding Acid to an Acidic Problem",
    learnerBelief: "Thinking an acidic sting (like an ant bite) can be treated with another acid like lemon juice or vinegar.",
    scientificTruth: "To cancel out (neutralise) an acid, we need an opposite partner — a mild base like baking soda or calamine. Adding lemon juice adds more acid!"
  }
};

export const CONCEPT_CARDS = [
  {
    id: "c1_acid_base",
    stepNumber: 1,
    title: "1. Let's Spot Acids & Bases in Our Kitchen",
    conversationalLead: "Let us forget long chemical tables for a moment! We already use acids and bases at home every day.",
    keyHighlights: [
      "First: Acids taste sour (like lemon juice, vinegar, and curd). Because we should never taste unknown liquids, we use special dyes called indicators to test them!",
      "Second: Bases feel slippery or soapy (like soap water, baking soda solution, and milk of magnesia).",
      "Third: Neutral liquids (like pure water and salt water) are neither acidic nor basic."
    ],
    boxedTakeaway: "Quick Tip: Acid = Sour liquids (Lemon, Vinegar, Ant sting) | Base = Soapy or antacid helpers (Soap, Baking Soda, Milk of Magnesia)."
  },
  {
    id: "c2_indicators",
    stepNumber: 2,
    title: "2. The 4 Indicators — And the Common Trap to Avoid",
    conversationalLead: "Here is the #1 trick question in school tests: many students assume EVERY indicator turns red in acid like Litmus. Let us see how each one actually behaves!",
    keyHighlights: [
      "Litmus: Blue Litmus turns RED in Acid, and Red Litmus turns BLUE in Base.",
      "Turmeric (Haldi): Stays bright YELLOW in Acid, and turns REDDISH-BROWN in Base (just like soap on a curry stain!).",
      "China Rose (Gudhal): Turns DARK PINK (Magenta) in Acid and leafy GREEN in Base.",
      "Phenolphthalein: Stays completely COLOURLESS in Acid and turns BRIGHT PINK only in Base."
    ],
    boxedTakeaway: "Memory Clue: Reddish-brown turmeric and Pink phenolphthalein mean BASE, never acid!"
  },
  {
    id: "c3_neutralisation",
    stepNumber: 3,
    title: "3. Neutralisation: How Opposite Partners Cancel Out",
    conversationalLead: "What happens when an acid and a base meet? They cancel each other out to form harmless Salt + Water!",
    keyHighlights: [
      "Rule of Opposites: To calm down an ACID problem, we must add a mild BASE (never another acid!).",
      "Ant Bite Relief: An ant injects Formic Acid into the skin. Rubbing moist Baking Soda (a mild base) neutralises the acid and stops the burning.",
      "Indigestion Relief: Our stomach makes Hydrochloric Acid. Drinking Milk of Magnesia (a mild base) gently neutralises the extra acid."
    ],
    boxedTakeaway: "Memory Clue: Putting lemon juice (acid) on an ant bite (acid) doubles the sting! Always pair an Acid with a Base."
  }
];

export const QUESTION_BANK = [
  {
    id: "q1_mcq_turmeric",
    title: "Question 1: The Curry Stain Test",
    lo: "LO1",
    bloom: "Classify",
    difficulty: 1,
    format: "mcq",
    targetMisconception: "M1",
    prompt: "Imagine you put yellow turmeric (haldi) paste onto two white cloth strips. On Strip A you squeeze lemon juice (an acid). On Strip B you rub soap water (a base). What colours will you see on Strip A and Strip B?",
    options: [
      {
        id: "opt_a",
        text: "Strip A (lemon juice) turns red; Strip B (soap water) turns blue.",
        isCorrect: false,
        misconceptionTag: "M1",
        feedback: "Take a breath — that is a super common mix-up! You used the Litmus rule ('acid = red, base = blue') for turmeric. Unlike litmus, haldi stays yellow in acids and turns reddish-brown in bases."
      },
      {
        id: "opt_b",
        text: "Strip A (lemon juice) stays bright yellow; Strip B (soap water) turns reddish-brown.",
        isCorrect: true,
        misconceptionTag: null,
        feedback: "Spot on! Lemon juice is an acid so turmeric stays yellow, while soap water is a base so it turns turmeric reddish-brown — just like washing a curry stain with soap!"
      },
      {
        id: "opt_c",
        text: "Strip A (lemon juice) turns reddish-brown; Strip B (soap water) stays yellow.",
        isCorrect: false,
        misconceptionTag: "M1",
        feedback: "You picked the right two colours (yellow and reddish-brown), just swapped! Turmeric turns reddish-brown only when it touches a BASE like soap."
      },
      {
        id: "opt_d",
        text: "Both strips turn colourless.",
        isCorrect: false,
        misconceptionTag: "M1",
        feedback: "Turmeric is a bright yellow kitchen spice — it never turns colourless. Only phenolphthalein is colourless in acids."
      }
    ],
    hints: [
      "Hint 1 (Kitchen clue): Have you ever seen soap rubbed on a yellow curry (haldi) stain on clothes? What colour does the soap turn the stain?",
      "Hint 2 (Rule): Soap is a base, and it turns turmeric reddish-brown. In sour acids like lemon juice, turmeric stays bright yellow.",
      "Hint 3 (Try it): Click 'Open Colour Dropper Lab' above and drop Turmeric into Lemon Juice and Soap Water!"
    ],
    modelAnswer: "Strip A (lemon juice, acid) stays bright yellow; Strip B (soap water, base) turns reddish-brown.",
    altExplanationCard: {
      headline: "Kitchen Picture: Why Turmeric Acts Differently from Litmus",
      analogy: "In Indian cooking, we often squeeze sour lemon or tamarind (acids) into yellow haldi dal — and the food stays bright YELLOW! It only turns REDDISH-BROWN later when we rub alkaline SOAP on the plate or shirt.",
      ruleSummary: "Turmeric in Acid = Stays Yellow | Turmeric in Base = Turns Reddish-Brown"
    },
    prerequisiteLabTask: {
      substanceId: "soap",
      indicatorId: "turmeric",
      instruction: "Let's see this with our own eyes first: click the button below to drop Turmeric into Soap Water in the beaker!"
    }
  },
  {
    id: "q2_mcq_phenolphthalein",
    title: "Question 2: The Mystery Clear Liquid",
    lo: "LO1",
    bloom: "Classify",
    difficulty: 1,
    format: "mcq",
    targetMisconception: "M1",
    prompt: "Beaker X has a clear colourless liquid. When we add 2 drops of phenolphthalein, the liquid turns bright PINK. If we now dip red litmus paper into Beaker X, what will happen?",
    options: [
      {
        id: "opt_a",
        text: "Red litmus stays red, because the pink colour means Beaker X is an acid.",
        isCorrect: false,
        misconceptionTag: "M1",
        feedback: "Careful! It is really tempting to think 'pink or red means acid', but phenolphthalein turns bright pink ONLY in a BASE. In acids, phenolphthalein stays completely colourless!"
      },
      {
        id: "opt_b",
        text: "Red litmus turns blue, because phenolphthalein turns pink only in a base.",
        isCorrect: true,
        misconceptionTag: null,
        feedback: "Great two-step thinking! First, pink phenolphthalein tells us Beaker X is a base. Second, a base turns red litmus blue!"
      },
      {
        id: "opt_c",
        text: "Red litmus turns leafy green.",
        isCorrect: false,
        misconceptionTag: "M1",
        feedback: "Leafy green is the base colour for China Rose (Gudhal)! Litmus paper only switches between red and blue."
      },
      {
        id: "opt_d",
        text: "Neither litmus paper changes because Beaker X is pure water.",
        isCorrect: false,
        misconceptionTag: null,
        feedback: "In pure water, phenolphthalein stays clear and colourless. Since it turned bright pink, Beaker X must be a base."
      }
    ],
    hints: [
      "Hint 1: First ask: Which type of liquid makes phenolphthalein blush bright pink — an acid or a base?",
      "Hint 2: Phenolphthalein stays colourless in acid and turns bright pink in a BASE. So Beaker X is a base!",
      "Hint 3: Now use the Litmus rule for a base: R-B-B (Red litmus turns Blue in Base)."
    ],
    modelAnswer: "Red litmus turns blue because phenolphthalein turns bright pink only in basic solutions.",
    altExplanationCard: {
      headline: "Another Way to Picture It: Phenolphthalein's 'Invisible vs Blush' Rule",
      analogy: "Think of Phenolphthalein as invisible ink in acids and water — it stays 100% clear. It only 'blushes' BRIGHT PINK when it meets a BASE like baking soda or soap!",
      ruleSummary: "Pink Phenolphthalein = Base -> Base turns Red Litmus Blue"
    },
    prerequisiteLabTask: {
      substanceId: "bakingSoda",
      indicatorId: "phenolphthalein",
      instruction: "Let's test Phenolphthalein in Baking Soda (a base) in the beaker below so you can watch it turn bright pink."
    }
  },
  {
    id: "q3_predictor_chinahibiscus",
    title: "Question 3: Predict the Colours in Vinegar",
    lo: "LO2",
    bloom: "Predict",
    difficulty: 2,
    format: "predictor",
    targetMisconception: "M1",
    prompt: "Let's predict before we pour! We have a small bowl of kitchen Vinegar (Sirka). Pick: (1) whether Vinegar is an acid, base, or neutral, (2) what colour China Rose (Gudhal) will turn in it, and (3) what colour Turmeric will show in it.",
    predictorConfig: {
      substanceName: "Vinegar (Sirka)",
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
      "Hint 1: Vinegar tastes sour in pickles and noodles — that means it is an Acid (acetic acid).",
      "Hint 2: Remember 'Gudhal Garden': China Rose turns Green in Base, and Dark Pink (Magenta) in Acid!",
      "Hint 3: And in an acid like vinegar or lemon, Turmeric stays Bright Yellow."
    ],
    correctFeedback: "Awesome prediction! Vinegar is an acid, so China Rose turns Dark Pink (Magenta) while Turmeric stays Bright Yellow.",
    misconceptionFeedback: {
      M1: "Let's check those colours! Vinegar is sour, so it is an acid. In an acid, China Rose turns Dark Pink (Green is for bases!), and Turmeric stays Bright Yellow (Reddish-Brown is only for bases!)."
    },
    modelAnswer: "Nature: Acid | China Rose in Vinegar: Dark Pink (Magenta) | Turmeric in Vinegar: Stays Bright Yellow.",
    altExplanationCard: {
      headline: "Side-by-Side Comparison: China Rose vs Turmeric in Acids",
      analogy: "Both Gudhal (China Rose) and Haldi (Turmeric) come from plants, but in sour Vinegar (Acid), Gudhal deepens to Dark Pink while Haldi stays Yellow.",
      ruleSummary: "Vinegar (Acid) -> China Rose = Dark Pink (Magenta) | Turmeric = Stays Yellow"
    },
    prerequisiteLabTask: {
      substanceId: "vinegar",
      indicatorId: "chinaRose",
      instruction: "Click below to drop China Rose into Vinegar in our beaker and watch the colour change!"
    }
  },
  {
    id: "q4_predictor_magnesia",
    title: "Question 4: Predict the Colours in an Antacid",
    lo: "LO2",
    bloom: "Predict",
    difficulty: 2,
    format: "predictor",
    targetMisconception: "M1",
    prompt: "Doctors give Milk of Magnesia to calm extra acid in the stomach. Predict: (1) Is Milk of Magnesia an acid, base, or neutral? (2) What colour will China Rose turn in it? (3) What colour will Phenolphthalein turn in it?",
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
      "Hint 1: Because our stomach already has excess acid, an antacid medicine must be the opposite — a mild BASE!",
      "Hint 2: In a BASE, China Rose (Gudhal) turns leafy GREEN.",
      "Hint 3: In a BASE, Phenolphthalein blushes BRIGHT PINK."
    ],
    correctFeedback: "Nailed it! Milk of Magnesia is a mild base — it turns China Rose leafy green and makes Phenolphthalein blush bright pink!",
    misconceptionFeedback: {
      M1: "Think about what an antacid does: to calm stomach acid, Milk of Magnesia must be a BASE. In a base, China Rose turns Green and Phenolphthalein turns Bright Pink."
    },
    modelAnswer: "Nature: Base | China Rose: Leafy Green | Phenolphthalein: Bright Pink.",
    altExplanationCard: {
      headline: "Why Every Antacid Is a Mild Base",
      analogy: "An 'ant-acid' works against acid — so it has to be a gentle base! When tested, it shows classic base colours: Green with China Rose and Bright Pink with Phenolphthalein.",
      ruleSummary: "Milk of Magnesia = Base -> China Rose: Green | Phenolphthalein: Bright Pink"
    },
    prerequisiteLabTask: {
      substanceId: "magnesia",
      indicatorId: "chinaRose",
      instruction: "Click below to test Milk of Magnesia with China Rose in our beaker!"
    }
  },
  {
    id: "q5_explain_antbite",
    title: "Question 5: Real-Life Science — The Ant Bite Remedy",
    lo: "LO3",
    bloom: "Explain",
    difficulty: 3,
    format: "explanation",
    targetMisconception: "M2",
    prompt: "While playing in the garden, a red ant bites your hand and injects formic acid, causing a burning pain. Your friend says: 'Quick, rub lemon juice on it!' Your grandmother says: 'No, rub moist baking soda on it!' Who is right, and explain WHY in 1–2 simple sentences.",
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
      sampleStarter: "Grandmother is right because an ant bite injects formic acid, and baking soda is a mild base that..."
    },
    hints: [
      "Hint 1: What liquid does the ant inject? Formic ACID. And what is inside lemon juice? Citric ACID!",
      "Hint 2: What happens if you rub lemon juice (acid) onto formic acid? Acid + Acid = MORE acid and worse burning!",
      "Hint 3: To cancel (neutralise) an acid, we need an opposite partner — a mild BASE like baking soda."
    ],
    correctFeedback: "Wonderful explanation! You clearly explained that the ant sting is acidic (formic acid), lemon juice would only add more acid, and baking soda is a mild base that neutralises the sting.",
    misconceptionFeedback: {
      M2: "Hold on! Both an ant sting (formic acid) and lemon juice (citric acid) are ACIDS. Rubbing acid on an acid makes the burning worse! You need an opposite partner — a mild BASE like baking soda — to neutralise the formic acid."
    },
    modelAnswer: "Grandmother is right: the ant bite injects formic acid, so rubbing moist baking soda (a mild base) neutralises the acid and stops the burning. Lemon juice is also an acid, so it would make the sting worse.",
    altExplanationCard: {
      headline: "Picture the Acid-Base Seesaw",
      analogy: "Think of an ant bite as tipping your skin's seesaw all the way down on the ACID side. Squeezing lemon juice adds even more weight to the ACID side! Moist baking soda sits on the BASE side and balances the seesaw back to NEUTRAL.",
      ruleSummary: "Ant Sting (Formic Acid) + Baking Soda (Mild Base) -> Neutralised & Calm!"
    },
    prerequisiteLabTask: {
      substanceId: "antSting",
      indicatorId: "litmus",
      instruction: "Click below to test Ant Sting Drop and Baking Soda in our beaker to see that one is an Acid and the other is a Base."
    }
  },
  {
    id: "q6_explain_currystain",
    title: "Question 6: Explain the Colour-Changing Curry Stain",
    lo: "LO3",
    bloom: "Explain",
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
      sampleStarter: "Soap is a base, so it turns the turmeric stain reddish-brown. When we squeeze lemon juice (an acid)..."
    },
    hints: [
      "Hint 1: Part (a): Is soap an acid or a base? Soap is a base, which turns yellow turmeric reddish-brown.",
      "Hint 2: Part (b): Lemon juice is an acid (citric acid). What happens when you add an acid on top of the basic soap?",
      "Hint 3: The acid in lemon juice neutralises the basic soap on the cloth, bringing back turmeric's bright yellow colour!"
    ],
    correctFeedback: "Awesome explanation! You connected both ideas: soap (a base) turns the turmeric stain reddish-brown, and lemon juice (an acid) neutralises the soap so turmeric turns yellow again.",
    misconceptionFeedback: {
      M1: "Double-check which item is the acid and which is the base! Soap is a BASE (turns turmeric reddish-brown), and lemon juice is an ACID (neutralises the soap and turns turmeric back to yellow)."
    },
    modelAnswer: "Soap is a base, which reacts with turmeric to turn the stain reddish-brown. Squeezing acidic lemon juice neutralises the basic soap on the cloth, restoring turmeric's yellow colour.",
    altExplanationCard: {
      headline: "Picture Turmeric as a Two-Way Switch",
      analogy: "Turmeric acts like a two-way colour switch: rubbing Base (soap) flips it to Reddish-Brown; squeezing Acid (lemon juice) neutralises the soap and flips it back to Yellow!",
      ruleSummary: "Yellow Turmeric + Soap (Base) -> Reddish-Brown | + Lemon (Acid) -> Back to Yellow"
    },
    prerequisiteLabTask: {
      substanceId: "soap",
      indicatorId: "turmeric",
      instruction: "Click below to test Turmeric with Soap Water and Lemon Juice in the beaker."
    }
  }
];

export const DYNAMIC_GENERATOR_TEMPLATES = {
  substancesByType: {
    acid: [
      { name: "Tamarind Water (Imli)", acidName: "Tartaric acid" },
      { name: "Sour Curd (Dahi)", acidName: "Lactic acid" },
      { name: "Amla Juice", acidName: "Vitamin C (Ascorbic acid)" },
      { name: "Raw Mango Juice", acidName: "Citric & malic acid" }
    ],
    base: [
      { name: "Lime Water (Chuna Water)", baseName: "Calcium hydroxide" },
      { name: "Window Cleaner Liquid", baseName: "Ammonium hydroxide" },
      { name: "Calamine Lotion", baseName: "Mild basic lotion" }
    ]
  }
};
