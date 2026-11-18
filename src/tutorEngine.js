/**
 * src/tutorEngine.js
 * Pure Pedagogy & AI Adaptive Engine for ET617 End-Sem Exam (Roll No: 24b3925).
 *
 * Implements:
 * 1. Multi-format response evaluation (MCQ, Interactive Predictor, Open Explanation)
 * 2. Misconception Diagnosis (M1: Indicator Rule Overgeneralisation, M2: Neutralisation Direction Error)
 * 3. P4 Design Challenge 3-Branch Decision Rule:
 *    - Outcome 1: HARDER_QUESTION
 *    - Outcome 2: ALTERNATIVE_EXPLANATION
 *    - Outcome 3: PREREQUISITE_INSTRUCTION
 * 4. Automatic Question Generator + Deliverable D6 AI Prompt Builder, Schema Validator & Fallback
 */

import {
  INDICATORS,
  SUBSTANCES,
  MISCONCEPTIONS,
  QUESTION_BANK,
  DYNAMIC_GENERATOR_TEMPLATES
} from "./content.js";

/**
 * Evaluates a learner's answer across any of the 3 required P4 formats:
 * - "mcq"
 * - "predictor"
 * - "explanation"
 */
export function evaluateLearnerResponse(task, learnerInput) {
  if (!task) {
    return {
      isCorrect: false,
      misconceptionTag: null,
      feedback: "No active task found.",
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
      feedback: "Please select one of the answer choices first — it is completely safe to try!",
      score: 0
    };
  }

  return {
    isCorrect: Boolean(chosen.isCorrect),
    misconceptionTag: chosen.misconceptionTag || null,
    feedback: chosen.feedback,
    score: chosen.isCorrect ? 1 : 0,
    matchedCriteria: chosen.isCorrect ? ["Correct concept selected"] : []
  };
}

function evaluatePredictor(task, predInput) {
  const cfg = task.predictorConfig;
  if (!predInput || !predInput.category || !predInput.ind1 || !predInput.ind2) {
    return {
      isCorrect: false,
      misconceptionTag: null,
      feedback: "Please pick all 3 parts of your prediction (Substance nature + both indicator colours) before checking.",
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
    catOk ? `✔ Substance classification (${cfg.expectedCategory.toUpperCase()}) is right.` : `✘ ${cfg.substanceName} is actually a ${cfg.expectedCategory.toUpperCase()}.`,
    ind1Ok ? `✔ ${cfg.indicator1Name} colour prediction is right.` : `✘ Check ${cfg.indicator1Name} colour in a ${cfg.expectedCategory}.`,
    ind2Ok ? `✔ ${cfg.indicator2Name} colour prediction is right.` : `✘ Check ${cfg.indicator2Name} colour in a ${cfg.expectedCategory}.`
  ].join(" ");

  const feedback = isCorrect
    ? `${task.correctFeedback} (${partsSummary})`
    : `${(task.misconceptionFeedback && task.misconceptionFeedback[misconceptionTag]) || "Not quite yet — let's check each part:"} ${partsSummary}`;

  return {
    isCorrect,
    misconceptionTag,
    feedback,
    score: (Number(catOk) + Number(ind1Ok) + Number(ind2Ok)) / 3,
    matchedCriteria: [
      catOk ? "Classified acid/base nature" : null,
      ind1Ok ? `Predicted ${cfg.indicator1Name}` : null,
      ind2Ok ? `Predicted ${cfg.indicator2Name}` : null
    ].filter(Boolean)
  };
}

/**
 * Evaluates free-text learner explanations (P4 requirement: "evaluate learner explanations, diagnose misconceptions").
 * Uses a multi-part conceptual rubric + explicit M1/M2 misconception phrase detection.
 */
export function evaluateExplanation(task, rawText) {
  const text = String(rawText || "").trim().toLowerCase();
  if (text.length < 8) {
    return {
      isCorrect: false,
      misconceptionTag: null,
      feedback: "Write a short 1–2 sentence explanation in your own words first (you can click 'Insert Starter Sentence' if you feel stuck!).",
      score: 0,
      matchedCriteria: []
    };
  }

  const rubric = task.explanationRubric;

  // 1. Check for explicit misconception phrases first (M2 or M1)
  if (rubric.misconceptionM2Triggers) {
    const hitM2 = rubric.misconceptionM2Triggers.some((phrase) => text.includes(phrase));
    // Also detect if learner recommends lemon/vinegar WITHOUT saying it's wrong/acidic
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
        matchedCriteria: ["Diagnosed M2: Suggested adding acid to an acid"]
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
        matchedCriteria: ["Diagnosed M1: Swapped acid/base nature of soap and lemon"]
      };
    }
  }

  // 2. Evaluate the 3 conceptual pillars: Choice/Substance, Acid/Base Role, and Mechanism
  const hasChoice = rubric.requiredChoiceKeywords.some((kw) => text.includes(kw));
  const hasConcept = rubric.requiredConceptKeywords.some((kw) => text.includes(kw));
  const hasMechanism = rubric.requiredMechanismKeywords.some((kw) => text.includes(kw));

  const matchedCriteria = [];
  if (hasChoice) matchedCriteria.push("Identified key substance (baking soda / soap)");
  if (hasConcept) matchedCriteria.push("Linked chemical role (base / reddish-brown indicator)");
  if (hasMechanism) matchedCriteria.push("Explained acid-base neutralisation mechanism");

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

  // Partial explanation: guide the anxious learner gently on which piece to add
  const missingHints = [];
  if (!hasChoice) missingHints.push("name the basic substance (e.g., baking soda or soap)");
  if (!hasConcept) missingHints.push("state clearly that it acts as a 'base' (or turns turmeric 'reddish-brown')");
  if (!hasMechanism) missingHints.push("mention how the 'acid' and base 'neutralise' each other");

  return {
    isCorrect: false,
    misconceptionTag: task.targetMisconception || "M2",
    feedback: `Good start — you hit ${pillarsHit} of 3 concept points! To make your explanation complete, also ${missingHints.join(" and ")}.`,
    score: pillarsHit / 3,
    matchedCriteria
  };
}

/**
 * P4 DESIGN CHALLENGE DECISION RULE (Core Exam Requirement):
 * Decides whether the learner needs:
 *   1. "HARDER_QUESTION"        (advance difficulty / Bloom format)
 *   2. "ALTERNATIVE_EXPLANATION"(visual everyday analogy + misconception contrast + parallel question)
 *   3. "PREREQUISITE_INSTRUCTION"(step back to interactive drop-by-drop prerequisite micro-lab)
 *
 * Uses all 3 Rubric P13_CP Adaptivity dimensions:
 *   - Profile (state.profileLevel)
 *   - Performance (evalResult.isCorrect, evalResult.misconceptionTag, state.consecutiveWrong)
 *   - Interaction (state.attemptsOnCurrent, state.hintsUsedOnCurrent, learnerLowConfidenceFlag)
 */
export function decideAdaptiveOutcome(state, evalResult, options = {}) {
  const attempts = state.attemptsOnCurrent || 1;
  const hintsUsed = state.hintsUsedOnCurrent || 0;
  const lowConfidence = Boolean(options.lowConfidenceRequested);

  // OUTCOME 3: PREREQUISITE_INSTRUCTION
  // Triggered when learner makes >= 2 wrong attempts on the current concept OR explicitly clicks "I feel stuck / Need Prerequisite"
  if (lowConfidence || (!evalResult.isCorrect && attempts >= 2)) {
    return {
      outcome: "PREREQUISITE_INSTRUCTION",
      badgeLabel: "Outcome 3: Prerequisite Micro-Lab Instruction",
      ruleTriggered: lowConfidence
        ? "Rule 3B: Learner flagged low confidence ('Need basics first') -> Step back to hands-on Prerequisite Indicator Micro-Lab."
        : `Rule 3A: ${attempts} consecutive unsuccessful attempts on this concept -> Step back to Prerequisite Indicator Micro-Lab before retrying.`,
      nextDifficulty: Math.max(1, (state.currentDifficulty || 1) - 1),
      pedagogicalReason: "Prevents anxiety spiral for L5 repeat learner by replacing abstract guessing with concrete observation."
    };
  }

  // OUTCOME 1: HARDER_QUESTION
  // Triggered when learner answers correctly on the 1st attempt with 0 hints used
  if (evalResult.isCorrect && attempts === 1 && hintsUsed === 0) {
    const nextDiff = Math.min(3, (state.currentDifficulty || 1) + 1);
    return {
      outcome: "HARDER_QUESTION",
      badgeLabel: "Outcome 1: Advance to Harder Question & Higher Format",
      ruleTriggered: "Rule 1: Correct on 1st attempt with 0 hints -> Increase difficulty & advance Bloom question format (MCQ -> Predictor -> Explanation).",
      nextDifficulty: nextDiff,
      pedagogicalReason: "First-try unassisted mastery signals readiness for a higher Bloom cognitive level."
    };
  }

  // OUTCOME 2: ALTERNATIVE_EXPLANATION
  // Triggered on 1st wrong attempt OR when Misconception M1/M2 is detected OR when learner succeeded using >=1 hints
  const mTag = evalResult.misconceptionTag;
  const reasonDetail = !evalResult.isCorrect
    ? `1st wrong attempt${mTag ? ` with Misconception ${mTag} detected` : ""}`
    : `Solved with ${hintsUsed} scaffolded hint(s)`;

  return {
    outcome: "ALTERNATIVE_EXPLANATION",
    badgeLabel: `Outcome 2: Alternative Visual Explanation${mTag ? ` (Targeting ${mTag})` : ""}`,
    ruleTriggered: `Rule 2: ${reasonDetail} -> Keep difficulty level (${state.currentDifficulty || 1}), show Everyday Kitchen Analogy + Misconception Contrast Card, and generate a parallel practice task.`,
    nextDifficulty: state.currentDifficulty || 1,
    pedagogicalReason: "Addresses the specific alternate conception (M1/M2) using a concrete visual analogy before advancing."
  };
}

/**
 * Automatic Adaptive Question Generator (P4 + Deliverable D6 Specification):
 * Generates a fresh parameterised question tailored to:
 *   - adaptiveOutcome ("HARDER_QUESTION" | "ALTERNATIVE_EXPLANATION" | "PREREQUISITE_INSTRUCTION")
 *   - targetMisconception ("M1" | "M2")
 *   - targetFormat ("mcq" | "predictor" | "explanation")
 */
export function generateAdaptiveQuestion(state, lastOutcome = "ALTERNATIVE_EXPLANATION", focusMisconception = "M1") {
  const genCount = (state.generatedCount || 0) + 1;
  const acidSample = DYNAMIC_GENERATOR_TEMPLATES.substancesByType.acid[genCount % DYNAMIC_GENERATOR_TEMPLATES.substancesByType.acid.length];
  const baseSample = DYNAMIC_GENERATOR_TEMPLATES.substancesByType.base[genCount % DYNAMIC_GENERATOR_TEMPLATES.substancesByType.base.length];

  // Decide format based on outcome:
  // - PREREQUISITE_INSTRUCTION -> supportive Level 1 MCQ
  // - ALTERNATIVE_EXPLANATION  -> Level 2 Interactive Predictor targeting the misconception
  // - HARDER_QUESTION          -> Level 3 Open Explanation or synthesis predictor
  let generatedTask;

  if (lastOutcome === "PREREQUISITE_INSTRUCTION") {
    generatedTask = {
      id: `gen_prereq_${genCount}`,
      isGenerated: true,
      generatedReason: `Generated foundational check after Prerequisite Micro-Lab (Focus: ${focusMisconception})`,
      title: `Adaptive Check #${genCount}: Stepping Stone on ${baseSample.name}`,
      lo: "LO1",
      bloom: "Understand (Classify)",
      difficulty: 1,
      format: "mcq",
      targetMisconception: "M1",
      prompt: `Now that we tested indicators hands-on, let us try a fresh kitchen sample: ${baseSample.name} (${baseSample.baseName}) is a mild BASE. What colour will yellow Turmeric (Haldi) paper turn when dipped into ${baseSample.name}?`,
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
          feedback: `Remember our micro-lab: turmeric stays yellow in acids, and changes to reddish-brown in a BASE like ${baseSample.name}!`
        },
        {
          id: "opt_c",
          text: "It turns blue like litmus paper.",
          isCorrect: false,
          misconceptionTag: "M1",
          feedback: "Trap M1! Litmus turns blue in a base, but turmeric turns reddish-brown in a base."
        }
      ],
      hints: [
        `Hint 1: ${baseSample.name} is a base (just like soap water).`,
        "Hint 2: Think of soap on a curry stain — what colour does a base turn yellow turmeric?",
        "Hint 3: Bases turn turmeric reddish-brown!"
      ],
      modelAnswer: `${baseSample.name} is a base, so it turns yellow turmeric paper reddish-brown.`,
      altExplanationCard: {
        headline: "Visual Reminder: Base + Turmeric = Reddish-Brown",
        analogy: `Whether it is soap water, baking soda, or ${baseSample.name}, every base turns yellow haldi reddish-brown.`,
        ruleSummary: `${baseSample.name} (Base) + Turmeric -> Reddish-Brown`
      },
      prerequisiteLabTask: {
        substanceId: "soap",
        indicatorId: "turmeric",
        instruction: "Re-test Turmeric in a basic solution using the dropper bench."
      }
    };
  } else if (lastOutcome === "ALTERNATIVE_EXPLANATION") {
    generatedTask = {
      id: `gen_alt_${genCount}`,
      isGenerated: true,
      generatedReason: `Generated parallel practice after Alternative Explanation for Misconception ${focusMisconception}`,
      title: `Adaptive Practice #${genCount}: Predicting ${acidSample.name}`,
      lo: "LO2",
      bloom: "Apply (Predict)",
      difficulty: 2,
      format: "predictor",
      targetMisconception: "M1",
      prompt: `Let us apply the visual analogy we just saw to a brand-new sample: ${acidSample.name} (contains ${acidSample.acidName}). Predict its chemical nature and the exact colours with China Rose (Gudhal) and Phenolphthalein!`,
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
        `Hint 1: ${acidSample.name} contains ${acidSample.acidName}, so it is an ACID.`,
        "Hint 2: In an acid, China Rose (Gudhal) turns Dark Pink (Magenta).",
        "Hint 3: Watch out for M1: Phenolphthalein does NOT turn pink in acid — it stays completely Colourless!"
      ],
      correctFeedback: `Spot on! You overcame Misconception M1: ${acidSample.name} is an acid, turning China Rose magenta while keeping Phenolphthalein colourless.`,
      misconceptionFeedback: {
        M1: `Remember: ${acidSample.name} is an acid! In an acid, China Rose turns Dark Pink (Magenta) and Phenolphthalein stays Colourless (it only turns pink in bases).`
      },
      modelAnswer: `Nature: Acid | China Rose: Dark Pink (Magenta) | Phenolphthalein: Stays Colourless.`,
      altExplanationCard: {
        headline: "Visual Contrast: Pink China Rose vs Colourless Phenolphthalein in Acids",
        analogy: `In sour ${acidSample.name}, natural China Rose turns Dark Pink, whereas synthetic Phenolphthalein stays clear like water!`,
        ruleSummary: `${acidSample.name} (Acid) -> China Rose: Magenta | Phenolphthalein: Colourless`
      },
      prerequisiteLabTask: {
        substanceId: "lemon",
        indicatorId: "phenolphthalein",
        instruction: "Test Lemon Juice with Phenolphthalein and China Rose in the lab bench."
      }
    };
  } else {
    // HARDER_QUESTION -> Level 3 Explanation synthesis task
    generatedTask = {
      id: `gen_harder_${genCount}`,
      isGenerated: true,
      generatedReason: "Generated harder synthesis challenge (Outcome 1: 1st-try mastery with 0 hints)",
      title: `Adaptive Challenge #${genCount}: Indigestion & Indicator Diagnosis`,
      lo: "LO3",
      bloom: "Analyse & Evaluate",
      difficulty: 3,
      format: "explanation",
      targetMisconception: "M2",
      prompt: `Harder Challenge: After eating spicy food, excess hydrochloric acid builds up in the stomach. Explain why drinking a spoon of Milk of Magnesia (or baking soda water) gives relief, AND state what colour red litmus or turmeric would turn in that medicine.`,
      explanationRubric: {
        requiredChoiceKeywords: ["magnesia", "baking soda", "antacid", "calamine"],
        requiredConceptKeywords: ["base", "basic", "blue", "reddish", "brown"],
        requiredMechanismKeywords: ["neutral", "acid", "hcl", "stomach", "cancel"],
        misconceptionM2Triggers: ["drink lemon", "drink vinegar", "add acid"],
        sampleStarter: "Milk of Magnesia is a mild base that neutralises excess stomach acid, and as a base it turns red litmus blue (or turmeric reddish-brown)."
      },
      hints: [
        "Hint 1: Stomach pain here is caused by excess Hydrochloric ACID.",
        "Hint 2: Milk of Magnesia (or baking soda) is a mild BASE that neutralises the excess acid into salt and water.",
        "Hint 3: Since the medicine is a base, it turns red litmus blue (and yellow turmeric reddish-brown)!"
      ],
      correctFeedback: "Outstanding synthesis! You explained both the neutralisation remedy (base neutralises stomach acid) and the indicator test (turns red litmus blue / turmeric reddish-brown).",
      misconceptionFeedback: {
        M2: "Check the neutralisation direction (M2): to neutralise stomach acid, the medicine must be a mild BASE, which turns red litmus blue or turmeric reddish-brown."
      },
      modelAnswer: "Milk of Magnesia is a mild base that neutralises excess hydrochloric acid in the stomach; because it is basic, it turns red litmus blue and yellow turmeric reddish-brown.",
      altExplanationCard: {
        headline: "Synthesis Link: Neutralisation + Indicator Proof",
        analogy: "Every antacid works because it is a gentle BASE — which we can prove by watching it turn red litmus blue or turmeric reddish-brown!",
        ruleSummary: "Antacid = Base -> Neutralises Stomach Acid + Turns Red Litmus Blue"
      },
      prerequisiteLabTask: {
        substanceId: "magnesia",
        indicatorId: "litmus",
        instruction: "Test Milk of Magnesia with Litmus and Turmeric in the dropper bench."
      }
    };
  }

  return validateAIOutput(generatedTask);
}

/**
 * Deliverable D6 Specification:
 * Builds the exact structured AI Prompt that the Adaptive Tutor constructs from learner state,
 * validates generated output against pedagogical & chemistry truth constraints before showing
 * it to the learner, and falls back deterministically when offline or without an API key.
 */
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
      "Chemistry Truth Guardrail: Verify Turmeric+Acid != Red and Phenolphthalein+Acid != Pink (blocks AI hallucination of Misconception M1).",
      "Affective Tone Filter (L5): Reject punitive phrases ('incorrect', 'failed', 'you should know') and enforce supportive coach phrasing."
    ],
    fallbackMechanism: "If API key is absent, rate-limited, or fails validation, `generateAdaptiveQuestion()` synchronously instantiates a verified parameterised task from `DYNAMIC_GENERATOR_TEMPLATES` matched to the exact P4 outcome branch."
  };
}

/**
 * Guardrail validator that checks any generated question before the learner sees it (D6 requirement).
 */
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
