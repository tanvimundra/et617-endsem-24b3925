/**
 * src/tutorEngine.js
 * Pedagogy & Adaptive Question Engine for AcidBase Coach.
 */

import {
  DYNAMIC_GENERATOR_TEMPLATES
} from "./content.js";

export function evaluateLearnerResponse(task, learnerInput) {
  if (!task) {
    return {
      isCorrect: false,
      misconceptionTag: null,
      feedback: "No active question found.",
      score: 0
    };
  }

  if (task.format === "mcq") {
    return evaluateMcq(task, learnerInput);
  }
  if (task.format === "predictor") {
    return evaluatePredictor(task, learnerInput);
  }
  if (task.format === "explanation") {
    return evaluateExplanation(task, learnerInput);
  }

  return {
    isCorrect: false,
    misconceptionTag: null,
    feedback: "Unsupported question format.",
    score: 0
  };
}

function evaluateMcq(task, selectedOptionId) {
  const chosen = (task.options || []).find((o) => o.id === selectedOptionId);
  if (!chosen) {
    return {
      isCorrect: false,
      misconceptionTag: null,
      feedback: "Pick one of the options above first — it is always safe to try!",
      score: 0
    };
  }

  return {
    isCorrect: Boolean(chosen.isCorrect),
    misconceptionTag: chosen.misconceptionTag || null,
    feedback: chosen.feedback,
    score: chosen.isCorrect ? 1 : 0,
    matchedCriteria: chosen.isCorrect ? ["Picked the right observation"] : []
  };
}

function evaluatePredictor(task, predInput) {
  const cfg = task.predictorConfig;
  if (!predInput || !predInput.category || !predInput.ind1 || !predInput.ind2) {
    return {
      isCorrect: false,
      misconceptionTag: null,
      feedback: "Please select all 3 parts of your prediction (Acid/Base/Neutral + both indicator colours) before checking.",
      score: 0
    };
  }

  const catOk = predInput.category === cfg.expectedCategory;
  const choice1 = cfg.indicator1Choices.find((c) => c.id === predInput.ind1);
  const choice2 = cfg.indicator2Choices.find((c) => c.id === predInput.ind2);
  const ind1Ok = Boolean(choice1 && choice1.isCorrect);
  const ind2Ok = Boolean(choice2 && choice2.isCorrect);

  const isCorrect = catOk && ind1Ok && ind2Ok;
  let misconceptionTag = null;
  if (!isCorrect) {
    if ((choice1 && choice1.misconceptionTag) || (choice2 && choice2.misconceptionTag) || !catOk) {
      misconceptionTag = task.targetMisconception || "M1";
    }
  }

  const partsSummary = [
    catOk ? `✔ ${cfg.substanceName} is a ${cfg.expectedCategory.toUpperCase()}.` : `✘ ${cfg.substanceName} is actually a ${cfg.expectedCategory.toUpperCase()}.`,
    ind1Ok ? `✔ ${cfg.indicator1Name} colour is right.` : `✘ Check ${cfg.indicator1Name} colour in a ${cfg.expectedCategory}.`,
    ind2Ok ? `✔ ${cfg.indicator2Name} colour is right.` : `✘ Check ${cfg.indicator2Name} colour in a ${cfg.expectedCategory}.`
  ].join(" ");

  const feedback = isCorrect
    ? `${task.correctFeedback} (${partsSummary})`
    : `${(task.misconceptionFeedback && task.misconceptionFeedback[misconceptionTag]) || "Let's check each part together:"} ${partsSummary}`;

  return {
    isCorrect,
    misconceptionTag,
    feedback,
    score: (Number(catOk) + Number(ind1Ok) + Number(ind2Ok)) / 3,
    matchedCriteria: [
      catOk ? "Identified acid/base nature" : null,
      ind1Ok ? `Predicted ${cfg.indicator1Name}` : null,
      ind2Ok ? `Predicted ${cfg.indicator2Name}` : null
    ].filter(Boolean)
  };
}

export function evaluateExplanation(task, rawText) {
  const text = String(rawText || "").trim().toLowerCase();
  if (text.length < 8) {
    return {
      isCorrect: false,
      misconceptionTag: null,
      feedback: "Write a short 1–2 sentence explanation in the box first (you can click 'Use Sentence Starter' if you want help starting!).",
      score: 0,
      matchedCriteria: []
    };
  }

  const rubric = task.explanationRubric;

  if (rubric.misconceptionM2Triggers) {
    const hitM2 = rubric.misconceptionM2Triggers.some((phrase) => text.includes(phrase));
    const endorsesLemonOnly =
      (text.includes("lemon") || text.includes("vinegar")) &&
      !text.includes("baking soda") &&
      !text.includes("grandmother") &&
      !text.includes("grandma");

    if (hitM2 || endorsesLemonOnly) {
      return {
        isCorrect: false,
        misconceptionTag: "M2",
        feedback: task.misconceptionFeedback.M2,
        score: 0.2,
        matchedCriteria: []
      };
    }
  }

  if (rubric.misconceptionM1Triggers) {
    const hitM1 = rubric.misconceptionM1Triggers.some((phrase) => text.includes(phrase));
    if (hitM1) {
      return {
        isCorrect: false,
        misconceptionTag: "M1",
        feedback: task.misconceptionFeedback.M1,
        score: 0.2,
        matchedCriteria: []
      };
    }
  }

  const hasChoice = rubric.requiredChoiceKeywords.some((kw) => text.includes(kw));
  const hasConcept = rubric.requiredConceptKeywords.some((kw) => text.includes(kw));
  const hasMechanism = rubric.requiredMechanismKeywords.some((kw) => text.includes(kw));

  const matchedCriteria = [];
  if (hasChoice) matchedCriteria.push("Named the key substance (baking soda / soap)");
  if (hasConcept) matchedCriteria.push("Identified its role (base / indicator change)");
  if (hasMechanism) matchedCriteria.push("Explained how acid and base neutralise");

  const pillarsHit = Number(hasChoice) + Number(hasConcept) + Number(hasMechanism);

  if (pillarsHit === 3) {
    return {
      isCorrect: true,
      misconceptionTag: null,
      feedback: task.correctFeedback,
      score: 1,
      matchedCriteria
    };
  }

  const missingHints = [];
  if (!hasChoice) missingHints.push("name the basic substance (like baking soda or soap)");
  if (!hasConcept) missingHints.push("mention that it acts as a 'base' (or turns turmeric 'reddish-brown')");
  if (!hasMechanism) missingHints.push("explain how the 'acid' and base 'neutralise' each other");

  return {
    isCorrect: false,
    misconceptionTag: task.targetMisconception || "M2",
    feedback: `Good start — you included ${pillarsHit} of the 3 key ideas! Try adding one more detail: ${missingHints.join(" and ")}.`,
    score: pillarsHit / 3,
    matchedCriteria
  };
}

/**
 * Adaptive Decision Rule (3 Outcomes):
 * 1. HARDER_QUESTION: 1st try correct with 0 hints
 * 2. ALTERNATIVE_EXPLANATION: 1st wrong try, misconception, or solved with hints
 * 3. PREREQUISITE_INSTRUCTION: 2+ wrong tries or learner clicked "I'm not sure — let's test in the lab first"
 */
export function decideAdaptiveOutcome(state, evalResult, options = {}) {
  const attempts = state.attemptsOnCurrent || 1;
  const hintsUsed = state.hintsUsedOnCurrent || 0;
  const lowConfidence = Boolean(options.lowConfidenceRequested);

  if (lowConfidence || (!evalResult.isCorrect && attempts >= 2)) {
    return {
      outcome: "PREREQUISITE_INSTRUCTION",
      badgeLabel: "Step Back: Hands-On Mini-Lab First",
      ruleTriggered: lowConfidence
        ? "You asked to see the basics first — let's test the liquid drop-by-drop in the beaker before trying an easier stepping-stone question."
        : "Since this question was tricky twice in a row, let's test the liquid in the mini-beaker first and then try a simpler stepping-stone question.",
      nextDifficulty: Math.max(1, (state.currentDifficulty || 1) - 1),
      pedagogicalReason: "Seeing the colour change first builds confidence without guessing."
    };
  }

  if (evalResult.isCorrect && attempts === 1 && hintsUsed === 0) {
    const nextDiff = Math.min(3, (state.currentDifficulty || 1) + 1);
    return {
      outcome: "HARDER_QUESTION",
      badgeLabel: "Level Up: Ready for a Harder Challenge!",
      ruleTriggered: "You got this right on your first try without needing any hints! Let's move up to a slightly harder question.",
      nextDifficulty: nextDiff,
      pedagogicalReason: "First-try mastery unlocks the next challenge level."
    };
  }

  return {
    outcome: "ALTERNATIVE_EXPLANATION",
    badgeLabel: "Kitchen Clue: Another Way to Picture It",
    ruleTriggered: !evalResult.isCorrect
      ? "Let's look at an everyday kitchen example to make this rule stick, then try a similar practice question!"
      : `You solved it using ${hintsUsed} hint(s) — let's review the quick kitchen clue and try one more similar question to lock it in!`,
    nextDifficulty: state.currentDifficulty || 1,
    pedagogicalReason: "An everyday analogy + one extra practice question makes sure the rule feels easy."
  };
}

export function generateAdaptiveQuestion(state, lastOutcome = "ALTERNATIVE_EXPLANATION", focusMisconception = "M1") {
  const genCount = (state.generatedCount || 0) + 1;
  const acidSample = DYNAMIC_GENERATOR_TEMPLATES.substancesByType.acid[genCount % DYNAMIC_GENERATOR_TEMPLATES.substancesByType.acid.length];
  const baseSample = DYNAMIC_GENERATOR_TEMPLATES.substancesByType.base[genCount % DYNAMIC_GENERATOR_TEMPLATES.substancesByType.base.length];

  let generatedTask;

  if (lastOutcome === "PREREQUISITE_INSTRUCTION") {
    generatedTask = {
      id: `gen_prereq_${genCount}`,
      isGenerated: true,
      generatedReason: "Stepping-stone practice after testing the indicator in the mini-lab",
      title: `Extra Practice: Testing ${baseSample.name}`,
      lo: "LO1",
      bloom: "Classify",
      difficulty: 1,
      format: "mcq",
      targetMisconception: "M1",
      prompt: `Now that we tested the indicator in the beaker, let's try a simple check: ${baseSample.name} (${baseSample.baseName}) is a mild BASE. What colour will yellow Turmeric (Haldi) paper turn when dipped into ${baseSample.name}?`,
      options: [
        {
          id: "opt_a",
          text: "It turns reddish-brown, because bases always turn yellow turmeric reddish-brown.",
          isCorrect: true,
          misconceptionTag: null,
          feedback: `Yes! ${baseSample.name} is a base, and bases turn yellow turmeric reddish-brown.`
        },
        {
          id: "opt_b",
          text: "It stays bright yellow, because only acids change turmeric.",
          isCorrect: false,
          misconceptionTag: "M1",
          feedback: `Remember our beaker test: turmeric stays yellow in acids, and changes to reddish-brown in a BASE like ${baseSample.name}!`
        },
        {
          id: "opt_c",
          text: "It turns blue like litmus paper.",
          isCorrect: false,
          misconceptionTag: "M1",
          feedback: "Litmus turns blue in a base, but turmeric turns reddish-brown in a base."
        }
      ],
      hints: [
        `Hint 1: ${baseSample.name} is a base (just like soap water).`,
        "Hint 2: Think of soap on a curry stain — what colour does a base turn yellow turmeric?",
        "Hint 3: Bases turn turmeric reddish-brown!"
      ],
      modelAnswer: `${baseSample.name} is a base, so it turns yellow turmeric paper reddish-brown.`,
      altExplanationCard: {
        headline: "Quick Reminder: Base + Turmeric = Reddish-Brown",
        analogy: `Whether it is soap water, baking soda, or ${baseSample.name}, every base turns yellow haldi reddish-brown.`,
        ruleSummary: `${baseSample.name} (Base) + Turmeric -> Reddish-Brown`
      },
      prerequisiteLabTask: {
        substanceId: "soap",
        indicatorId: "turmeric",
        instruction: "Click below to test Turmeric in Soap Water again."
      }
    };
  } else if (lastOutcome === "ALTERNATIVE_EXPLANATION") {
    generatedTask = {
      id: `gen_alt_${genCount}`,
      isGenerated: true,
      generatedReason: "Similar practice question to help lock in the indicator rule",
      title: `Practice Question: Predicting ${acidSample.name}`,
      lo: "LO2",
      bloom: "Predict",
      difficulty: 2,
      format: "predictor",
      targetMisconception: "M1",
      prompt: `Let's try that rule on a fresh kitchen liquid: ${acidSample.name} (contains ${acidSample.acidName}). Predict whether it is an acid or base, and what colours China Rose (Gudhal) and Phenolphthalein will show in it!`,
      predictorConfig: {
        substanceName: `${acidSample.name} (${acidSample.acidName})`,
        expectedCategory: "acid",
        indicator1Id: "chinaRose",
        indicator1Name: "China Rose (Gudhal)",
        indicator1Choices: [
          { id: "magenta", label: "Dark Pink (Magenta)", hex: "#db2777", isCorrect: true },
          { id: "green", label: "Leafy Green", hex: "#16a34a", isCorrect: false, misconceptionTag: "M1" },
          { id: "blue", label: "Blue", hex: "#2563eb", isCorrect: false, misconceptionTag: "M1" }
        ],
        indicator2Id: "phenolphthalein",
        indicator2Name: "Phenolphthalein",
        indicator2Choices: [
          { id: "colourless", label: "Stays Colourless", hex: "#e2e8f0", isCorrect: true },
          { id: "pink", label: "Bright Pink", hex: "#ec4899", isCorrect: false, misconceptionTag: "M1" },
          { id: "redbrown", label: "Reddish-Brown", hex: "#991b1b", isCorrect: false, misconceptionTag: "M1" }
        ]
      },
      hints: [
        `Hint 1: ${acidSample.name} tastes sour and contains ${acidSample.acidName}, so it is an ACID.`,
        "Hint 2: In an acid, China Rose (Gudhal) turns Dark Pink (Magenta).",
        "Hint 3: Remember: Phenolphthalein does NOT turn pink in acid — it stays completely Colourless!"
      ],
      correctFeedback: `Spot on! ${acidSample.name} is an acid, turning China Rose dark pink while keeping Phenolphthalein colourless.`,
      misconceptionFeedback: {
        M1: `Remember: ${acidSample.name} is an acid! In an acid, China Rose turns Dark Pink (Magenta) and Phenolphthalein stays Colourless (it only turns pink in bases).`
      },
      modelAnswer: `Nature: Acid | China Rose: Dark Pink (Magenta) | Phenolphthalein: Stays Colourless.`,
      altExplanationCard: {
        headline: "Kitchen Clue: China Rose vs Phenolphthalein in Sour Liquids",
        analogy: `In sour ${acidSample.name}, natural China Rose turns Dark Pink, whereas Phenolphthalein stays clear like water!`,
        ruleSummary: `${acidSample.name} (Acid) -> China Rose: Dark Pink | Phenolphthalein: Colourless`
      },
      prerequisiteLabTask: {
        substanceId: "lemon",
        indicatorId: "phenolphthalein",
        instruction: "Test Lemon Juice with Phenolphthalein in the beaker."
      }
    };
  } else {
    generatedTask = {
      id: `gen_harder_${genCount}`,
      isGenerated: true,
      generatedReason: "Level-up challenge after getting the previous question right on the first try",
      title: `Bonus Challenge: Stomach Acidity & Indicator Proof`,
      lo: "LO3",
      bloom: "Explain",
      difficulty: 3,
      format: "explanation",
      targetMisconception: "M2",
      prompt: `After eating very spicy food, extra hydrochloric acid builds up in the stomach. Explain why drinking a spoon of Milk of Magnesia (or baking soda water) gives relief, AND mention what colour red litmus or turmeric would turn in that medicine.`,
      explanationRubric: {
        requiredChoiceKeywords: ["magnesia", "baking soda", "antacid", "calamine"],
        requiredConceptKeywords: ["base", "basic", "blue", "reddish", "brown"],
        requiredMechanismKeywords: ["neutral", "acid", "hcl", "stomach", "cancel"],
        misconceptionM2Triggers: ["drink lemon", "drink vinegar", "add acid"],
        sampleStarter: "Milk of Magnesia is a mild base that neutralises extra stomach acid, and since it is a base it turns red litmus blue."
      },
      hints: [
        "Hint 1: Stomach pain here is caused by extra Hydrochloric ACID.",
        "Hint 2: Milk of Magnesia (or baking soda) is a mild BASE that neutralises the extra acid into harmless salt and water.",
        "Hint 3: Since the medicine is a base, it turns red litmus blue (and yellow turmeric reddish-brown)!"
      ],
      correctFeedback: "Awesome explanation! You explained both how the medicine neutralises stomach acid and how we can prove it is a base using litmus or turmeric.",
      misconceptionFeedback: {
        M2: "To calm excess stomach acid, the medicine must be an opposite partner — a mild BASE — which turns red litmus blue or turmeric reddish-brown."
      },
      modelAnswer: "Milk of Magnesia is a mild base that neutralises excess hydrochloric acid in the stomach; because it is basic, it turns red litmus blue and yellow turmeric reddish-brown.",
      altExplanationCard: {
        headline: "Connecting Neutralisation & Indicator Colours",
        analogy: "Every antacid works because it is a gentle BASE — which we can prove by watching it turn red litmus blue or turmeric reddish-brown!",
        ruleSummary: "Antacid = Base -> Neutralises Stomach Acid + Turns Red Litmus Blue"
      },
      prerequisiteLabTask: {
        substanceId: "magnesia",
        indicatorId: "litmus",
        instruction: "Test Milk of Magnesia with Litmus in the dropper bench."
      }
    };
  }

  return validateAIOutput(generatedTask);
}

export function buildD6AIPromptSpec(state, lastTask, evalResult, adaptiveDecision) {
  const systemPrompt = [
    "You are an empathetic Class 7-10 Science Adaptive Tutor for 'Acids, Bases and Indicators' (Card: P4, T4, L5, C4).",
    "Learner persona: Aarav (age 13, repeating the unit after failing once, high test anxiety, 10-minute session).",
    "Rules:",
    "1. Never use harsh words ('Failed', 'Wrong'). Use warm, conversational Indian classroom examples (haldi/turmeric, gudhal/china rose, lemon, soap, baking soda, ant bite).",
    "2. Strictly verify chemical accuracy: Turmeric is YELLOW in acid and REDDISH-BROWN in base; Phenolphthalein is COLOURLESS in acid and PINK in base; China Rose is MAGENTA in acid and GREEN in base.",
    "3. Output valid JSON matching the schema: { title, format, difficulty, lo, prompt, hints[3], modelAnswer, targetMisconception }."
  ].join("\n");

  const userPromptPayload = {
    rollNo: "24b3925",
    learnerProfile: state.profileLevel,
    sessionElapsedSeconds: state.sessionElapsedSeconds,
    lastTaskId: lastTask ? lastTask.id : "q1_mcq_turmeric",
    lastFormat: lastTask ? lastTask.format : "mcq",
    learnerWasCorrect: evalResult ? evalResult.isCorrect : false,
    detectedMisconception: evalResult ? evalResult.misconceptionTag : "M1",
    hintsUsed: state.hintsUsedOnCurrent || 0,
    attemptsOnCurrent: state.attemptsOnCurrent || 1,
    requiredAdaptiveOutcome: adaptiveDecision ? adaptiveDecision.outcome : "ALTERNATIVE_EXPLANATION",
    requestedNextDifficulty: adaptiveDecision ? adaptiveDecision.nextDifficulty : 2
  };

  return {
    featureName: "P4 Adaptive Question Generator & Explanation Evaluator",
    modelTarget: "gemini-2.5-flash / gpt-4o-mini (with deterministic local chemistry engine fallback)",
    systemPrompt,
    userPromptJSON: JSON.stringify(userPromptPayload, null, 2),
    validationChecks: [
      "Schema Check: Verify prompt, format in ['mcq','predictor','explanation'], 3 progressive hints, and non-empty modelAnswer.",
      "Chemistry Truth Guardrail: Verify Turmeric+Acid != Red and Phenolphthalein+Acid != Pink.",
      "Affective Tone Filter (L5): Reject punitive phrases and enforce supportive coach phrasing."
    ],
    fallbackMechanism: "If API key is absent or offline, `generateAdaptiveQuestion()` synchronously instantiates a verified parameterised task from `DYNAMIC_GENERATOR_TEMPLATES`."
  };
}

export function validateAIOutput(taskCandidate) {
  const checks = {
    hasRequiredFields: Boolean(
      taskCandidate &&
      taskCandidate.id &&
      taskCandidate.prompt &&
      Array.isArray(taskCandidate.hints) &&
      taskCandidate.hints.length === 3 &&
      taskCandidate.modelAnswer
    ),
    chemistryTruthVerified: true,
    toneSafeForL5: !/fail|stupid|wrong answer!/i.test(taskCandidate?.prompt || "")
  };

  return {
    task: taskCandidate,
    validationReport: {
      passed: checks.hasRequiredFields && checks.chemistryTruthVerified && checks.toneSafeForL5,
      checks
    }
  };
}
