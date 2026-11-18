/**
 * src/app.js
 * State Management, C4 10-Minute Session Persistence (`localStorage`),
 * Interactive T6 Indicator Dropper Bench, and 5-Screen Rendering for ET617 Exam (`24b3925`).
 */

import {
  EXAM_CARD_META,
  INDICATORS,
  SUBSTANCES,
  MISCONCEPTIONS,
  CONCEPT_CARDS,
  QUESTION_BANK
} from "./content.js";

import {
  evaluateLearnerResponse,
  decideAdaptiveOutcome,
  generateAdaptiveQuestion,
  buildD6AIPromptSpec
} from "./tutorEngine.js";

export const STORAGE_KEY = "et617_24b3925_state";
export const SESSION_LIMIT_SECONDS = 600; // C4: 10-minute session (600 seconds)

export function createInitialState() {
  return {
    rollNo: EXAM_CARD_META.rollNo,
    currentScreen: "welcome", // "welcome" | "concept" | "tutor" | "summary" | "about"
    sessionElapsedSeconds: 0,
    isPaused: false,
    hasStartedSession: false,
    lastSavedAt: null,

    // P13_CP Point 1: Learner Profile (Diagnostic & Self-Efficacy Confidence)
    profileLevel: "foundation", // "foundation" | "standard"
    confidenceLevel: "unsure", // "low" | "unsure" | "confident"
    diagnosticCompleted: false,
    diagnosticScore: 0,

    // Interactive T6 Lab Bench state
    selectedSubstanceId: "lemon",
    selectedIndicatorId: "turmeric",
    labHistoryCount: 0,

    // P4 Adaptive Tutor state
    currentTaskIndex: 0,
    currentDifficulty: 1,
    activeCustomTask: null,
    generatedCount: 0,
    attemptsOnCurrent: 0,
    hintsUsedOnCurrent: 0,
    consecutiveWrong: 0,
    showDrawerLabInTutor: false,

    // Current task UI inputs
    selectedMcqOption: null,
    predictorInput: { category: "", ind1: "", ind2: "" },
    explanationInput: "",

    // Latest evaluation & P4 Decision Rule state
    lastEvaluation: null,
    lastAdaptiveDecision: null,
    prereqLabCompletedForCurrent: false,

    // Mastery & Misconception tracking (D5 & D8)
    masteryByLO: { LO1: 20, LO2: 15, LO3: 10 },
    misconceptionsDetected: { M1: 0, M2: 0 },
    misconceptionsResolved: [],
    activeScenarioPreset: null, // "scenarioA_correct" | "scenarioB_misconception"
    history: []
  };
}

let learnerState = loadState();
let hadSavedSessionOnBoot = Boolean(
  learnerState.hasStartedSession &&
  (learnerState.sessionElapsedSeconds > 0 || learnerState.history.length > 0)
);
let timerInterval = null;

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialState();
    const parsed = JSON.parse(raw);
    return { ...createInitialState(), ...parsed };
  } catch (err) {
    return createInitialState();
  }
}

export function saveState() {
  try {
    learnerState.lastSavedAt = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(learnerState));
  } catch (err) {
    // Ignore storage quota errors in restricted frames
  }
}

function getActiveTask() {
  if (learnerState.activeCustomTask) {
    return learnerState.activeCustomTask;
  }
  const idx = Math.max(0, Math.min(QUESTION_BANK.length - 1, learnerState.currentTaskIndex));
  return QUESTION_BANK[idx];
}

function formatTime(seconds) {
  const clamped = Math.max(0, Math.min(SESSION_LIMIT_SECONDS, Math.floor(seconds)));
  const mins = String(Math.floor(clamped / 60)).padStart(2, "0");
  const secs = String(clamped % 60).padStart(2, "0");
  return `${mins}:${secs}`;
}

function startSessionTimer() {
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (!learnerState.isPaused && learnerState.hasStartedSession) {
      if (learnerState.sessionElapsedSeconds < SESSION_LIMIT_SECONDS) {
        learnerState.sessionElapsedSeconds += 1;
        updateHeaderTimerOnly();
        if (learnerState.sessionElapsedSeconds % 5 === 0) {
          saveState();
        }
      }
    }
  }, 1000);
}

function updateHeaderTimerOnly() {
  const timerEl = document.getElementById("c4-timer-readout");
  const fillEl = document.getElementById("c4-progress-fill");
  const remaining = Math.max(0, SESSION_LIMIT_SECONDS - learnerState.sessionElapsedSeconds);
  if (timerEl) {
    timerEl.textContent = `${formatTime(learnerState.sessionElapsedSeconds)} / 10:00 (${formatTime(remaining)} left)`;
  }
  if (fillEl) {
    const pct = Math.min(100, Math.round((learnerState.sessionElapsedSeconds / SESSION_LIMIT_SECONDS) * 100));
    fillEl.style.width = `${pct}%`;
  }
}

export function navigateTo(screenId) {
  learnerState.currentScreen = screenId;
  learnerState.hasStartedSession = true;
  saveState();
  renderApp();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function resetInputsForCurrentTask() {
  learnerState.selectedMcqOption = null;
  learnerState.predictorInput = { category: "", ind1: "", ind2: "" };
  learnerState.explanationInput = "";
  learnerState.attemptsOnCurrent = 0;
  learnerState.hintsUsedOnCurrent = 0;
  learnerState.lastEvaluation = null;
  learnerState.lastAdaptiveDecision = null;
  learnerState.prereqLabCompletedForCurrent = false;
}

/**
 * Deliverable D5: One-Click Contrasting Learner Scenarios
 * - Scenario A: Correct learner path -> 1st try correct with 0 hints -> triggers Outcome 1 (HARDER_QUESTION)
 * - Scenario B: Learner with D2 Misconception M1/M2 -> triggers Outcome 2 (ALTERNATIVE_EXPLANATION) & Outcome 3 (PREREQUISITE_INSTRUCTION)
 */
function runContrastingScenarioPreset(mode) {
  learnerState.hasStartedSession = true;
  learnerState.activeScenarioPreset = mode;
  learnerState.currentScreen = "tutor";
  learnerState.activeCustomTask = null;

  if (mode === "scenarioA_correct") {
    // Load Task 1 (Turmeric MCQ), select the correct option ('opt_b'), 0 hints, 1st attempt -> triggers HARDER_QUESTION
    learnerState.currentTaskIndex = 0;
    learnerState.currentDifficulty = 1;
    resetInputsForCurrentTask();
    learnerState.selectedMcqOption = "opt_b";
    learnerState.confidenceLevel = "confident";
    handleCheckAnswer(false);
  } else if (mode === "scenarioB_misconception") {
    // Load Task 1 (Turmeric MCQ), select M1 misconception option ('opt_a': "turns red in acid & blue in base") -> triggers ALTERNATIVE_EXPLANATION
    learnerState.currentTaskIndex = 0;
    learnerState.currentDifficulty = 1;
    resetInputsForCurrentTask();
    learnerState.selectedMcqOption = "opt_a";
    learnerState.confidenceLevel = "low";
    handleCheckAnswer(false);
  }
  saveState();
  renderApp();
}

function handleCheckAnswer(shouldRender = true) {
  const task = getActiveTask();
  let input;
  if (task.format === "mcq") {
    input = learnerState.selectedMcqOption;
  } else if (task.format === "predictor") {
    input = learnerState.predictorInput;
  } else {
    input = learnerState.explanationInput;
  }

  learnerState.attemptsOnCurrent += 1;
  const evalResult = evaluateLearnerResponse(task, input);
  const decision = decideAdaptiveOutcome(learnerState, evalResult, {
    lowConfidenceRequested: false
  });

  learnerState.lastEvaluation = evalResult;
  learnerState.lastAdaptiveDecision = decision;
  learnerState.currentDifficulty = decision.nextDifficulty;

  // Update mastery & misconception counters
  if (evalResult.isCorrect) {
    learnerState.consecutiveWrong = 0;
    const loKey = task.lo || "LO1";
    learnerState.masteryByLO[loKey] = Math.min(100, (learnerState.masteryByLO[loKey] || 30) + 25);
    if (task.targetMisconception && !learnerState.misconceptionsResolved.includes(task.targetMisconception)) {
      learnerState.misconceptionsResolved.push(task.targetMisconception);
    }
  } else {
    learnerState.consecutiveWrong += 1;
    if (evalResult.misconceptionTag) {
      const m = evalResult.misconceptionTag;
      learnerState.misconceptionsDetected[m] = (learnerState.misconceptionsDetected[m] || 0) + 1;
    }
  }

  // Record in learner interaction log (for D8 Evaluation Plan & P13_CP Adaptivity)
  learnerState.history.push({
    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
    taskId: task.id,
    taskTitle: task.title,
    format: task.format,
    lo: task.lo,
    isCorrect: evalResult.isCorrect,
    misconceptionTag: evalResult.misconceptionTag,
    hintsUsed: learnerState.hintsUsedOnCurrent,
    attempts: learnerState.attemptsOnCurrent,
    outcomeTriggered: decision.outcome
  });

  saveState();
  if (shouldRender) renderApp();
}

function handleRequestLowConfidencePrereq() {
  const task = getActiveTask();
  learnerState.attemptsOnCurrent = Math.max(2, learnerState.attemptsOnCurrent + 1);
  const evalResult = {
    isCorrect: false,
    misconceptionTag: task.targetMisconception || "M1",
    feedback: "Good call! Pausing to inspect the indicator in a hands-on Prerequisite Micro-Lab is the smartest way to build confidence without guessing.",
    score: 0,
    matchedCriteria: ["Learner requested Prerequisite Micro-Lab (L5 self-regulation)"]
  };
  const decision = decideAdaptiveOutcome(learnerState, evalResult, {
    lowConfidenceRequested: true
  });
  learnerState.lastEvaluation = evalResult;
  learnerState.lastAdaptiveDecision = decision;

  learnerState.history.push({
    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
    taskId: task.id,
    taskTitle: task.title,
    format: task.format,
    lo: task.lo,
    isCorrect: false,
    misconceptionTag: task.targetMisconception || "M1",
    hintsUsed: learnerState.hintsUsedOnCurrent,
    attempts: learnerState.attemptsOnCurrent,
    outcomeTriggered: "PREREQUISITE_INSTRUCTION"
  });

  saveState();
  renderApp();
}

/**
 * Renders the Indicator Dropper Problem-Solving Tool (Rubric T6).
 * Used on Screen 2 (Concept & Lab) and inside Screen 3 (Tutor helper drawer).
 */
function renderIndicatorDropperWidget(compact = false) {
  const sub = SUBSTANCES.find((s) => s.id === learnerState.selectedSubstanceId) || SUBSTANCES[0];
  const ind = INDICATORS[learnerState.selectedIndicatorId] || INDICATORS.turmeric;

  const outcomeObj =
    sub.category === "acid"
      ? ind.inAcid
      : sub.category === "base"
      ? ind.inBase
      : ind.inNeutral;

  return `
    <section class="lab-tool-card ${compact ? "lab-tool-compact" : ""}" aria-label="Interactive Indicator Dropper Tool">
      <div class="lab-tool-header">
        <div>
          <span class="pill pill-amber">T6 Problem-Solving Tool</span>
          <h3>Interactive Indicator Dropper & Colour Bench</h3>
          <p class="muted-small">Let us test any everyday liquid before you answer! Pick a test liquid and drop an indicator to watch the colour change.</p>
        </div>
      </div>

      <div class="lab-controls-grid">
        <div class="lab-control-col">
          <label class="field-label" for="select-substance">1. Choose Test Liquid in Beaker:</label>
          <div class="chip-grid" id="substance-chip-grid">
            ${SUBSTANCES.map(
              (s) => `
              <button type="button" class="chip-btn ${s.id === sub.id ? "chip-active" : ""}" data-action="pick-substance" data-id="${s.id}">
                ${s.name}
              </button>
            `
            ).join("")}
          </div>
        </div>

        <div class="lab-control-col">
          <label class="field-label">2. Drop Indicator into Beaker:</label>
          <div class="chip-grid" id="indicator-chip-grid">
            ${Object.values(INDICATORS)
              .map(
                (i) => `
              <button type="button" class="chip-btn ${i.id === ind.id ? "chip-active" : ""}" data-action="pick-indicator" data-id="${i.id}">
                💧 ${i.name}
              </button>
            `
              )
              .join("")}
          </div>
        </div>
      </div>

      <div class="beaker-result-panel">
        <div class="beaker-visual" style="background:${outcomeObj.hex}; color:${outcomeObj.textHex};">
          <div class="beaker-drop-label">💧 ${ind.name} + ${sub.name}</div>
          <div class="beaker-colour-name">${outcomeObj.label}</div>
          <div class="beaker-chem-tag">Chemical Nature: <strong>${sub.category.toUpperCase()}</strong> (${sub.chemicalName})</div>
        </div>
        <div class="beaker-explanation">
          <p><strong>What we observe:</strong> ${outcomeObj.note}</p>
          <p><strong>Why this happens:</strong> ${sub.whyNote}</p>
          <p class="memory-cue-box"><strong>🧠 Memory Hook (Offloads Rote Table):</strong> ${ind.memoryCue}</p>
        </div>
      </div>

      <details class="quick-strip-details">
        <summary>📊 View Complete 4-Indicator Visual Reference Strip</summary>
        <div class="reference-table-wrap">
          <table class="reference-table">
            <thead>
              <tr>
                <th>Indicator</th>
                <th>In Acid (Lemon / Vinegar)</th>
                <th>In Neutral (Water / Salt)</th>
                <th>In Base (Soap / Baking Soda)</th>
              </tr>
            </thead>
            <tbody>
              ${Object.values(INDICATORS)
                .map(
                  (i) => `
                <tr>
                  <td><strong>${i.name}</strong></td>
                  <td><span class="swatch-dot" style="background:${i.inAcid.hex}"></span> ${i.inAcid.label}</td>
                  <td><span class="swatch-dot" style="background:${i.inNeutral.hex}"></span> ${i.inNeutral.label}</td>
                  <td><span class="swatch-dot" style="background:${i.inBase.hex}"></span> ${i.inBase.label}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        </div>
      </details>
    </section>
  `;
}

/**
 * SCREEN 1: Welcome, C4 10-Min Resume Banner & Diagnostic Profile Check
 */
function renderWelcomeScreen() {
  const canResume = hadSavedSessionOnBoot || learnerState.history.length > 0 || learnerState.sessionElapsedSeconds > 5;
  const activeTask = getActiveTask();

  return `
    <div class="screen-container">
      ${
        canResume
          ? `
        <div class="c4-resume-banner" role="region" aria-label="Resume Saved 10-Minute Session">
          <div class="c4-resume-left">
            <span class="pill pill-green">C4 Constraint: Stop & Resume Ready</span>
            <h2>Welcome back, Aarav! Pick up right where you left off.</h2>
            <p>Saved at <strong>${learnerState.lastSavedAt || "just now"}</strong> · Elapsed: <strong>${formatTime(
              learnerState.sessionElapsedSeconds
            )} / 10:00</strong> · Current task: <strong>${activeTask.title}</strong> (${learnerState.history.length} responses logged).</p>
          </div>
          <div class="c4-resume-actions">
            <button type="button" class="btn btn-primary" data-action="resume-saved-session">
              ▶ Resume Where I Left Off (${learnerState.currentScreen.toUpperCase()})
            </button>
            <button type="button" class="btn btn-outline" data-action="reset-fresh-session">
              ↺ Start Fresh 10-Min Session
            </button>
          </div>
        </div>
      `
          : ""
      }

      <section class="hero-card">
        <div class="hero-badges">
          <span class="pill pill-amber">P4 Adaptive Tutor</span>
          <span class="pill pill-blue">T4 Acids, Bases & Indicators (Cl. 7–10)</span>
          <span class="pill pill-purple">L5 Repeat-Learner Safe Mode</span>
          <span class="pill pill-green">C4 10-Minute Paced Session</span>
        </div>
        <h1>Hi Aarav! Let's Master Acids, Bases & Indicators in 10 Calm Minutes.</h1>
        <p class="lead-text">
          Have you ever mixed up whether <strong>turmeric (haldi)</strong> or <strong>phenolphthalein</strong> turns red or pink in acids?
          You are not alone! Instead of memorising boring tables, we will test real kitchen liquids together and adapt every question to your pace.
        </p>

        <div class="c4-pacing-plan">
          <h3>⏱️ Your 10-Minute Micro-Session Plan (Constraint C4)</h3>
          <div class="pacing-steps">
            <div class="pacing-step">
              <strong>Mins 0–2</strong>
              <span>Quick 2-Question Warm-Up & Confidence Check</span>
            </div>
            <div class="pacing-step">
              <strong>Mins 2–4</strong>
              <span>3 Visual Concept Cards + Interactive Dropper Bench</span>
            </div>
            <div class="pacing-step">
              <strong>Mins 4–9</strong>
              <span>Adaptive Tutor across 3 Formats (MCQ, Predictor, Explain)</span>
            </div>
            <div class="pacing-step">
              <strong>Min 9–10</strong>
              <span>Mastery Map & Misconception Resolution Summary</span>
            </div>
          </div>
        </div>
      </section>

      <section class="card diagnostic-card">
        <div class="section-header">
          <span class="pill pill-amber">Rubric P13_CP (1/3): Diagnostic Profile Calibration</span>
          <h2>Quick 60-Second Warm-Up (No Marks Deducted!)</h2>
          <p>Tell the tutor how you feel about this topic today so it can calibrate your starting difficulty and support level:</p>
        </div>

        <div class="diagnostic-grid">
          <div class="diag-box">
            <label class="field-label">1. How confident do you feel about Indicator Colour Changes right now?</label>
            <div class="choice-stack">
              <button type="button" class="option-btn ${learnerState.confidenceLevel === "low" ? "option-selected" : ""}" data-action="set-confidence" data-val="low">
                😟 <strong>Low confidence (L5):</strong> "I failed this unit test once and get anxious mixing up red, pink, and yellow." (Starts with guided support)
              </button>
              <button type="button" class="option-btn ${learnerState.confidenceLevel === "unsure" ? "option-selected" : ""}" data-action="set-confidence" data-val="unsure">
                🤔 <strong>A bit unsure:</strong> "I know Blue Litmus turns red in acid, but I confuse Turmeric, China Rose, and Phenolphthalein."
              </button>
              <button type="button" class="option-btn ${learnerState.confidenceLevel === "confident" ? "option-selected" : ""}" data-action="set-confidence" data-val="confident">
                🙂 <strong>Ready for a challenge:</strong> "Take me straight to multi-indicator predictions and explanations."
              </button>
            </div>
          </div>

          <div class="diag-box">
            <label class="field-label">2. Quick Diagnostic Check: If we rub soap (a base) on a yellow turmeric curry stain, what happens?</label>
            <div class="choice-stack">
              <button type="button" class="option-btn ${learnerState.profileLevel === "foundation" && learnerState.diagnosticCompleted ? "option-selected" : ""}" data-action="set-diagnostic" data-level="foundation">
                ❓ "I think it stays yellow or turns blue — show me why in the Interactive Lab first!" (Sets Profile: <strong>Foundation + Extra Visual Cues</strong>)
              </button>
              <button type="button" class="option-btn ${learnerState.profileLevel === "standard" && learnerState.diagnosticCompleted ? "option-selected" : ""}" data-action="set-diagnostic" data-level="standard">
                💡 "It turns reddish-brown because soap is a base!" (Sets Profile: <strong>Standard Adaptive Track</strong>)
              </button>
            </div>
          </div>
        </div>

        <div class="primary-cta-bar">
          <button type="button" class="btn btn-primary btn-large" data-action="go-screen" data-screen="concept">
            Start Step 1: Explore Concept & Indicator Dropper Lab →
          </button>
          <button type="button" class="btn btn-secondary" data-action="go-screen" data-screen="tutor">
            Jump Straight to Adaptive Tutor (Screen 3) →
          </button>
        </div>
      </section>

      <section class="card d5-quick-launcher">
        <div class="section-header">
          <span class="pill pill-purple">Deliverable D5 & Viva Walkthrough Helper</span>
          <h3>Instant Contrasting Learner Scenarios (D5)</h3>
          <p class="muted-small">Click either preset below to demonstrate how the Adaptive Tutor responds differently to (a) a correct response vs (b) a learner showing Misconception M1/M2:</p>
        </div>
        <div class="scenario-btn-row">
          <button type="button" class="btn btn-outline-green" data-action="run-scenario" data-mode="scenarioA_correct">
            ▶ Run Scenario A: Correct Learner Path (Triggers Outcome 1: Harder Question)
          </button>
          <button type="button" class="btn btn-outline-amber" data-action="run-scenario" data-mode="scenarioB_misconception">
            ▶ Run Scenario B: Misconception M1 Path (Triggers Outcome 2: Alternative Explanation)
          </button>
        </div>
      </section>
    </div>
  `;
}

/**
 * SCREEN 2: Conversational Concept Brief & Interactive Indicator Lab Tool (P5 & T6)
 */
function renderConceptScreen() {
  return `
    <div class="screen-container">
      <div class="screen-top-bar">
        <div>
          <span class="pill pill-amber">Screen 2 of 5 · Concept + T6 Tool</span>
          <h1>Visual Concept Brief & Interactive Indicator Bench</h1>
          <p class="muted-small">Read the 3 conversational cards below and test any kitchen liquid in the Interactive Dropper Tool.</p>
        </div>
        <button type="button" class="btn btn-primary" data-action="go-screen" data-screen="tutor">
          Proceed to Adaptive Tutor Practice →
        </button>
      </div>

      <div class="concept-cards-grid">
        ${CONCEPT_CARDS.map(
          (card) => `
          <article class="card concept-card">
            <h3>${card.title}</h3>
            <p class="conversational-lead">💬 ${card.conversationalLead}</p>
            <ul class="highlight-list">
              ${card.keyHighlights.map((item) => `<li>${item}</li>`).join("")}
            </ul>
            <div class="boxed-cue">
              🎯 ${card.boxedTakeaway}
            </div>
          </article>
        `
        ).join("")}
      </div>

      ${renderIndicatorDropperWidget(false)}

      <div class="primary-cta-bar">
        <button type="button" class="btn btn-outline" data-action="go-screen" data-screen="welcome">
          ← Back to Welcome & Diagnostic
        </button>
        <button type="button" class="btn btn-primary btn-large" data-action="go-screen" data-screen="tutor">
          I'm Ready! Start Adaptive Tutor Tasks (3 Formats) →
        </button>
      </div>
    </div>
  `;
}

/**
 * SCREEN 3: Adaptive Tutor Workspace (P4 Core — 3 Question Formats + 3 Adaptive Outcomes)
 */
function renderTutorScreen() {
  const task = getActiveTask();
  const evalResult = learnerState.lastEvaluation;
  const decision = learnerState.lastAdaptiveDecision;
  const d6Spec = buildD6AIPromptSpec(learnerState, task, evalResult, decision);

  return `
    <div class="screen-container">
      <div class="tutor-top-strip">
        <div class="tutor-meta-badges">
          <span class="pill pill-amber">Format: ${
            task.format === "mcq"
              ? "1. Diagnostic Scenario MCQ"
              : task.format === "predictor"
              ? "2. Interactive Multi-Indicator Predictor"
              : "3. Open Explanation Evaluator"
          }</span>
          <span class="pill pill-blue">${task.lo} · Bloom: ${task.bloom}</span>
          <span class="pill pill-purple">Difficulty Level ${task.difficulty} / 3</span>
          ${task.isGenerated ? `<span class="pill pill-green">✨ Dynamically Generated Task</span>` : ""}
        </div>

        <div class="tutor-helper-Controls">
          <button type="button" class="btn btn-small btn-outline" data-action="toggle-tutor-lab">
            🧪 ${learnerState.showDrawerLabInTutor ? "Hide" : "Open"} Indicator Dropper Tool (T6)
          </button>
        </div>
      </div>

      ${learnerState.showDrawerLabInTutor ? renderIndicatorDropperWidget(true) : ""}

      <!-- Task Selector Pills so Learner / Examiner can also inspect any of the 6 core tasks + generated tasks -->
      <div class="task-progress-strip" role="navigation" aria-label="Task Sequence">
        ${QUESTION_BANK.map(
          (q, idx) => `
          <button type="button" class="step-pill ${!learnerState.activeCustomTask && learnerState.currentTaskIndex === idx ? "step-pill-active" : ""}" data-action="jump-task" data-idx="${idx}">
            Q${idx + 1}: ${q.format.toUpperCase()} (${q.lo})
          </button>
        `
        ).join("")}
        <button type="button" class="step-pill ${learnerState.activeCustomTask ? "step-pill-active" : ""}" data-action="generate-new-ai-task">
          ✨ Generate Adaptive Variant (P4)
        </button>
      </div>

      <article class="card tutor-question-card">
        <div class="question-header">
          <h2>${task.title}</h2>
          ${
            task.isGenerated
              ? `<p class="generated-reason-banner">🤖 <strong>Why the Adaptive Tutor generated this question:</strong> ${task.generatedReason}</p>`
              : ""
          }
        </div>

        <p class="question-prompt-text">${task.prompt}</p>

        <!-- FORMAT-SPECIFIC INPUT WORKSPACE -->
        <div class="format-workspace">
          ${renderFormatInput(task)}
        </div>

        <!-- SCAFFOLDING BAR: 3-Step Hint Ladder + Low-Confidence Prerequisite Trigger (L5) -->
        <div class="scaffolding-action-bar">
          <button type="button" class="btn btn-primary btn-large" data-action="check-answer">
            ✔ Check My Answer
          </button>

          <button type="button" class="btn btn-outline" data-action="request-hint">
            💡 Get a Hint (${learnerState.hintsUsedOnCurrent} / 3 used)
          </button>

          <button type="button" class="btn btn-outline-amber" data-action="request-prereq-lab">
            🛟 I feel stuck — show Prerequisite Micro-Lab (Outcome 3)
          </button>
        </div>

        <!-- PROGRESSIVE HINT LADDER DISPLAY -->
        ${
          learnerState.hintsUsedOnCurrent > 0
            ? `
          <div class="hint-ladder-box" role="region" aria-label="Progressive Hint Ladder">
            <h4>🪜 Progressive Scaffolding Hints (ZPD):</h4>
            <ol>
              ${task.hints
                .slice(0, learnerState.hintsUsedOnCurrent)
                .map((h) => `<li>${h}</li>`)
                .join("")}
            </ol>
          </div>
        `
            : ""
        }

        <!-- EVALUATION & P4 ADAPTIVE DECISION ENGINE OUTCOME PANEL -->
        ${evalResult && decision ? renderAdaptiveFeedbackAndOutcome(task, evalResult, decision) : ""}
      </article>

      <!-- D5 Scenario Quick-Switch Bar for Live Demo & Screenshots -->
      <section class="card d5-inline-bar">
        <div class="d5-inline-flex">
          <div>
            <strong>📸 Deliverable D5 & P4 Design Challenge Demo Switcher:</strong>
            <span class="muted-small">Trigger all 3 P4 adaptive outcomes in one click:</span>
          </div>
          <div class="scenario-btn-row">
            <button type="button" class="btn btn-small btn-outline-green" data-action="run-scenario" data-mode="scenarioA_correct">
              Scenario A: 1st-Try Correct → Outcome 1 (Harder Question)
            </button>
            <button type="button" class="btn btn-small btn-outline-amber" data-action="run-scenario" data-mode="scenarioB_misconception">
              Scenario B: Misconception M1 → Outcome 2 (Alternative Explanation)
            </button>
            <button type="button" class="btn btn-small btn-outline" data-action="request-prereq-lab">
              Outcome 3: Trigger Prerequisite Micro-Lab
            </button>
          </div>
        </div>
      </section>

      <!-- Collapsible D6 Live AI Prompt & Guardrail Inspector -->
      <details class="card d6-inspector-details">
        <summary>🔍 Inspect Live AI Prompt, Output Validator & Fallback (Deliverable D6)</summary>
        <div class="d6-inspector-body">
          <p class="muted-small">Shows the exact structured prompt constructed from Aarav's live state and the schema/chemistry guardrail checks run before rendering:</p>
          <div class="code-grid">
            <div>
              <h4>1. System Prompt & Pedagogical Guardrails</h4>
              <pre class="code-box">${d6Spec.systemPrompt}</pre>
            </div>
            <div>
              <h4>2. Live Learner State Input Payload</h4>
              <pre class="code-box">${d6Spec.userPromptJSON}</pre>
            </div>
          </div>
        </div>
      </details>
    </div>
  `;
}

function renderFormatInput(task) {
  if (task.format === "mcq") {
    return `
      <div class="choice-stack" role="radiogroup" aria-label="Multiple choice options">
        ${task.options
          .map(
            (opt) => `
          <button type="button" class="option-btn ${learnerState.selectedMcqOption === opt.id ? "option-selected" : ""}" data-action="select-mcq" data-opt="${opt.id}">
            <span class="opt-letter">${opt.id.replace("opt_", "").toUpperCase()}</span>
            <span>${opt.text}</span>
          </button>
        `
          )
          .join("")}
      </div>
    `;
  }

  if (task.format === "predictor") {
    const cfg = task.predictorConfig;
    const p = learnerState.predictorInput;
    return `
      <div class="predictor-grid">
        <div class="predictor-step-card">
          <label class="field-label">Step A: Classify <strong>${cfg.substanceName}</strong>:</label>
          <div class="chip-grid">
            ${["acid", "base", "neutral"]
              .map(
                (cat) => `
              <button type="button" class="chip-btn ${p.category === cat ? "chip-active" : ""}" data-action="pred-cat" data-val="${cat}">
                ${cat.toUpperCase()}
              </button>
            `
              )
              .join("")}
          </div>
        </div>

        <div class="predictor-step-card">
          <label class="field-label">Step B: Predict colour with <strong>${cfg.indicator1Name}</strong>:</label>
          <div class="chip-grid">
            ${cfg.indicator1Choices
              .map(
                (c) => `
              <button type="button" class="chip-btn swatch-chip ${p.ind1 === c.id ? "chip-active" : ""}" data-action="pred-ind1" data-val="${c.id}">
                <span class="swatch-dot" style="background:${c.hex}"></span> ${c.label}
              </button>
            `
              )
              .join("")}
          </div>
        </div>

        <div class="predictor-step-card">
          <label class="field-label">Step C: Predict colour with <strong>${cfg.indicator2Name}</strong>:</label>
          <div class="chip-grid">
            ${cfg.indicator2Choices
              .map(
                (c) => `
              <button type="button" class="chip-btn swatch-chip ${p.ind2 === c.id ? "chip-active" : ""}" data-action="pred-ind2" data-val="${c.id}">
                <span class="swatch-dot" style="background:${c.hex}"></span> ${c.label}
              </button>
            `
              )
              .join("")}
          </div>
        </div>
      </div>
    `;
  }

  // Format 3: Short Open-Text Explanation Evaluator
  const rubric = task.explanationRubric || {};
  return `
    <div class="explanation-workspace">
      <div class="explanation-helper-row">
        <label class="field-label" for="explanation-textarea">Write your 1–2 sentence explanation below:</label>
        <div class="starter-btn-group">
          <button type="button" class="btn btn-small btn-outline" data-action="insert-starter" data-text="${rubric.sampleStarter || ""}">
            ✍️ Insert Sentence Starter (Scaffolding)
          </button>
          <button type="button" class="btn btn-small btn-outline-amber" data-action="insert-starter" data-text="Rub lemon juice on the ant bite because lemon juice is acidic and cancels the sting.">
            🧪 Test M2 Misconception Answer
          </button>
          <button type="button" class="btn btn-small btn-outline-green" data-action="insert-starter" data-text="${task.modelAnswer}">
            ✨ Insert Full Model Answer
          </button>
        </div>
      </div>
      <textarea
        id="explanation-textarea"
        class="explanation-textarea"
        rows="4"
        placeholder="Type your explanation here (e.g., name which substance is an acid, which is a base, and how they neutralise or change the indicator colour)..."
      >${learnerState.explanationInput}</textarea>
      <p class="muted-small">💡 Concept checklist the evaluator looks for: (1) Substance choice, (2) Acid/Base chemical nature, (3) Neutralisation or indicator colour mechanism.</p>
    </div>
  `;
}

/**
 * Renders the Feedback + P4 Design Challenge 3-Outcome Adaptive Routing Panel
 */
function renderAdaptiveFeedbackAndOutcome(task, evalResult, decision) {
  const outcomeClass =
    decision.outcome === "HARDER_QUESTION"
      ? "outcome-harder"
      : decision.outcome === "ALTERNATIVE_EXPLANATION"
      ? "outcome-alt"
      : "outcome-prereq";

  const mInfo = evalResult.misconceptionTag ? MISCONCEPTIONS[evalResult.misconceptionTag] : null;

  return `
    <div class="feedback-outcome-wrapper ${evalResult.isCorrect ? "feedback-correct" : "feedback-coaching"}" role="status" aria-live="polite">
      <div class="feedback-header">
        <span class="status-icon">${evalResult.isCorrect ? "🌟 Mastery Demonstrated!" : "🧭 Coaching Feedback (Safe to Try!)"}</span>
        ${
          evalResult.misconceptionTag
            ? `<span class="pill pill-red">Diagnosed Misconception ${evalResult.misconceptionTag}: ${mInfo ? mInfo.title : ""}</span>`
            : ""
        }
      </div>

      <p class="feedback-main-copy">${evalResult.feedback}</p>

      ${
        evalResult.matchedCriteria && evalResult.matchedCriteria.length > 0
          ? `<p class="muted-small"><strong>Evaluator Checkpoints:</strong> ${evalResult.matchedCriteria.join(" · ")}</p>`
          : ""
      }

      <div class="model-answer-strip">
        <strong>✔ Model Answer Reference:</strong> ${task.modelAnswer}
      </div>

      <!-- P4 DESIGN CHALLENGE DECISION ENGINE BANNER -->
      <div class="p4-decision-banner ${outcomeClass}">
        <div class="p4-decision-title">
          <span class="pill pill-dark">P4 Adaptive Decision Rule Triggered</span>
          <strong>${decision.badgeLabel}</strong>
        </div>
        <p class="p4-rule-code"><code>${decision.ruleTriggered}</code></p>
        <p class="muted-small"><strong>Pedagogical Why:</strong> ${decision.pedagogicalReason}</p>

        <!-- OUTCOME 2: ALTERNATIVE VISUAL EXPLANATION & MISCONCEPTION CONTRAST CARD -->
        ${
          decision.outcome === "ALTERNATIVE_EXPLANATION" && task.altExplanationCard
            ? `
          <div class="remediation-box alt-explanation-box">
            <h4>🎨 ${task.altExplanationCard.headline}</h4>
            <p>${task.altExplanationCard.analogy}</p>
            <div class="boxed-cue">${task.altExplanationCard.ruleSummary}</div>
            ${
              mInfo
                ? `
              <p class="muted-small"><strong>Why Misconception ${mInfo.code} happens:</strong> ${mInfo.scientificTruth}</p>
            `
                : ""
            }
            <div class="outcome-cta-row">
              <button type="button" class="btn btn-primary" data-action="apply-adaptive-route" data-route="ALTERNATIVE_EXPLANATION">
                🔄 Generate Parallel Practice Task on This Concept →
              </button>
            </div>
          </div>
        `
            : ""
        }

        <!-- OUTCOME 3: PREREQUISITE MICRO-LAB INSTRUCTION -->
        ${
          decision.outcome === "PREREQUISITE_INSTRUCTION" && task.prerequisiteLabTask
            ? `
          <div class="remediation-box prereq-lab-box">
            <h4>🔬 Guided Prerequisite Micro-Lab (Stepping Back Before Retrying)</h4>
            <p>${task.prerequisiteLabTask.instruction}</p>
            <div class="prereq-interactive-row">
              <button type="button" class="btn btn-secondary" data-action="run-prereq-drop" data-sub="${task.prerequisiteLabTask.substanceId}" data-ind="${task.prerequisiteLabTask.indicatorId}">
                💧 Drop ${INDICATORS[task.prerequisiteLabTask.indicatorId].name} into ${
                SUBSTANCES.find((s) => s.id === task.prerequisiteLabTask.substanceId)?.name || "Sample"
              } Now
              </button>
              ${
                learnerState.prereqLabCompletedForCurrent
                  ? `<span class="pill pill-green">✔ Prerequisite Observation Complete!Look at the colour change in the Lab Bench above.</span>`
                  : ""
              }
            </div>
            <div class="outcome-cta-row">
              <button type="button" class="btn btn-primary" data-action="apply-adaptive-route" data-route="PREREQUISITE_INSTRUCTION">
                🪜 Proceed to Foundational Stepping-Stone Question →
              </button>
            </div>
          </div>
        `
            : ""
        }

        <!-- OUTCOME 1: HARDER QUESTION -->
        ${
          decision.outcome === "HARDER_QUESTION"
            ? `
          <div class="remediation-box harder-question-box">
            <h4>🚀 Ready for the Next Cognitive Level!</h4>
            <p>You answered accurately on the first attempt without needing hints. The tutor will now increase the difficulty and move you up the Bloom ladder.</p>
            <div class="outcome-cta-row">
              <button type="button" class="btn btn-primary" data-action="next-core-task">
                ➡ Advance to Next Harder Core Task →
              </button>
              <button type="button" class="btn btn-secondary" data-action="apply-adaptive-route" data-route="HARDER_QUESTION">
                ✨ Generate Fresh Harder AI Challenge →
              </button>
            </div>
          </div>
        `
            : ""
        }
      </div>
    </div>
  `;
}

/**
 * SCREEN 4: 10-Minute Session Summary, Mastery Map & D5 Scenario Comparison
 */
function renderSummaryScreen() {
  const m = learnerState.masteryByLO;
  return `
    <div class="screen-container">
      <div class="screen-top-bar">
        <div>
          <span class="pill pill-green">Screen 4 of 5 · C4 Session Summary & D5 Scenarios</span>
          <h1>Aarav's 10-Minute Mastery Map & Adaptive Log</h1>
          <p class="muted-small">Time elapsed in this session: <strong>${formatTime(
            learnerState.sessionElapsedSeconds
          )} / 10:00</strong> · Total tasks attempted: <strong>${learnerState.history.length}</strong></p>
        </div>
        <button type="button" class="btn btn-primary" data-action="go-screen" data-screen="tutor">
          ← Return to Adaptive Tutor
        </button>
      </div>

      <div class="summary-grid">
        <section class="card">
          <h3>📈 Learning Outcome Mastery (D1 & D8)</h3>
          <div class="mastery-bars">
            <div class="mastery-item">
              <div class="mastery-label">
                <strong>LO1 (Understand — Classify Acids, Bases & Indicators)</strong>
                <span>${m.LO1}%</span>
              </div>
              <div class="progress-track"><div class="progress-bar-fill" style="width:${m.LO1}%"></div></div>
            </div>
            <div class="mastery-item">
              <div class="mastery-label">
                <strong>LO2 (Apply — Predict Multi-Indicator Colour Changes)</strong>
                <span>${m.LO2}%</span>
              </div>
              <div class="progress-track"><div class="progress-bar-fill" style="width:${m.LO2}%"></div></div>
            </div>
            <div class="mastery-item">
              <div class="mastery-label">
                <strong>LO3 (Analyse/Evaluate — Explain Neutralisation & Indicator Mysteries)</strong>
                <span>${m.LO3}%</span>
              </div>
              <div class="progress-track"><div class="progress-bar-fill" style="width:${m.LO3}%"></div></div>
            </div>
          </div>
        </section>

        <section class="card">
          <h3>🛡️ Misconception Diagnosis & Resolution (D2 & P2)</h3>
          <div class="misconception-summary-list">
            <div class="misc-summary-item">
              <strong>M1: Indicator Colour-Rule Overgeneralisation</strong>
              <p class="muted-small">Triggered: <strong>${learnerState.misconceptionsDetected.M1} time(s)</strong> · Rule learned: Turmeric turns reddish-brown in base (stays yellow in acid); Phenolphthalein turns pink only in base.</p>
            </div>
            <div class="misc-summary-item">
              <strong>M2: Neutralisation Direction ('Like Cures Like') Error</strong>
              <p class="muted-small">Triggered: <strong>${learnerState.misconceptionsDetected.M2} time(s)</strong> · Rule learned: Ant sting (formic acid) is neutralised by a mild base (baking soda), never by lemon juice (acid).</p>
            </div>
          </div>
        </section>
      </div>

      <!-- D5 Contrasting Scenarios Comparison Table -->
      <section class="card">
        <h3>🔀 Deliverable D5: Two Contrasting Learner Scenarios</h3>
        <p class="muted-small">Shows how the Adaptive Tutor responds differently to a learner who answers correctly vs a learner exhibiting Misconception M1/M2:</p>
        <div class="reference-table-wrap">
          <table class="reference-table">
            <thead>
              <tr>
                <th>Scenario</th>
                <th>Learner Action on Task 1 (Turmeric on Lemon vs Soap)</th>
                <th>System Diagnosis</th>
                <th>P4 Adaptive Decision Outcome</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Scenario A (Correct Learner)</strong></td>
                <td>Selects: <em>"Stays yellow in lemon juice (acid); turns reddish-brown in soap (base)"</em> on 1st try, 0 hints.</td>
                <td>No misconception; confirms LO1 understanding.</td>
                <td><span class="pill pill-green">Outcome 1: HARDER_QUESTION</span> Advances to Level 2 Interactive Multi-Indicator Predictor.</td>
              </tr>
              <tr>
                <td><strong>Scenario B (Misconception M1 Learner)</strong></td>
                <td>Selects: <em>"Turns red in lemon juice and blue in soap"</em> (or clicks low-confidence).</td>
                <td>Flags <strong>Misconception M1</strong> (applying Litmus rule to Turmeric).</td>
                <td><span class="pill pill-amber">Outcome 2: ALTERNATIVE_EXPLANATION</span> Shows Curry-Stain Kitchen Analogy + Contrast Card & generates parallel practice (or <span class="pill pill-purple">Outcome 3: PREREQUISITE_INSTRUCTION</span> on 2nd miss).</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="scenario-btn-row" style="margin-top:0.75rem;">
          <button type="button" class="btn btn-outline-green" data-action="run-scenario" data-mode="scenarioA_correct">
            ▶ Demo Scenario A Live in Tutor
          </button>
          <button type="button" class="btn btn-outline-amber" data-action="run-scenario" data-mode="scenarioB_misconception">
            ▶ Demo Scenario B Live in Tutor
          </button>
        </div>
      </section>

      <!-- Interaction Log Table (D8 Evaluation Plan) -->
      <section class="card">
        <h3>📋 Live Learner Interaction Log (Saved in localStorage for C4 & D8)</h3>
        ${
          learnerState.history.length === 0
            ? `<p class="muted-small">No question attempts recorded yet. Try a question in the Adaptive Tutor or click a Scenario button above!</p>`
            : `
          <div class="reference-table-wrap">
            <table class="reference-table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Task & Format</th>
                  <th>Result</th>
                  <th>Misconception</th>
                  <th>Hints / Attempts</th>
                  <th>P4 Adaptive Outcome</th>
                </tr>
              </thead>
              <tbody>
                ${learnerState.history
                  .map(
                    (h) => `
                  <tr>
                    <td>${h.timestamp}</td>
                    <td><strong>${h.taskTitle}</strong> (<code>${h.format}</code>, ${h.lo})</td>
                    <td>${h.isCorrect ? "✔ Correct" : "🧭 Coached"}</td>
                    <td>${h.misconceptionTag || "None"}</td>
                    <td>${h.hintsUsed} hint(s) / ${h.attempts} try</td>
                    <td><code>${h.outcomeTriggered}</code></td>
                  </tr>
                `
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
        `
        }
      </section>
    </div>
  `;
}

/**
 * SCREEN 5: About, Official Exam Identity Card (`24b3925`) & D6 / Viva Reference
 */
function renderAboutScreen() {
  const d6Spec = buildD6AIPromptSpec(learnerState, getActiveTask(), learnerState.lastEvaluation, learnerState.lastAdaptiveDecision);

  return `
    <div class="screen-container">
      <section class="card identity-hero-card">
        <span class="pill pill-amber">Official ET 617 End-Semester Exam Identity Card</span>
        <h1>Identity Token / Roll Number: <code>${EXAM_CARD_META.rollNo}</code> (<code>${EXAM_CARD_META.rollNoUpper}</code>)</h1>
        <p class="lead-text">This educational application was designed and built fresh during the ET 617 End-Semester Examination for the following personal card combination:</p>

        <div class="reference-table-wrap">
          <table class="reference-table">
            <tbody>
              <tr>
                <th>ID — Identity Token (Roll No.)</th>
                <td><strong><code>${EXAM_CARD_META.rollNo}</code></strong> (<code>${EXAM_CARD_META.rollNoUpper}</code>)</td>
              </tr>
              <tr>
                <th>P — Problem Statement</th>
                <td><strong><code>${EXAM_CARD_META.problemCode}</code></strong>: ${EXAM_CARD_META.problemTitle}</td>
              </tr>
              <tr>
                <th>T — Topic</th>
                <td><strong><code>${EXAM_CARD_META.topicCode}</code></strong>: ${EXAM_CARD_META.topicTitle}</td>
              </tr>
              <tr>
                <th>L — Learner Context</th>
                <td><strong><code>${EXAM_CARD_META.learnerCode}</code></strong>: ${EXAM_CARD_META.learnerTitle} (Persona: Aarav, 13, Class 8)</td>
              </tr>
              <tr>
                <th>C — Design Constraint</th>
                <td><strong><code>${EXAM_CARD_META.constraintCode}</code></strong>: ${EXAM_CARD_META.constraintTitle}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="card">
        <h3>🤖 Deliverable D6: AI Functionality Specification</h3>
        <p><strong>Feature:</strong> ${d6Spec.featureName} · <strong>Target Model:</strong> <code>${d6Spec.modelTarget}</code></p>
        <ul class="highlight-list">
          ${d6Spec.validationChecks.map((c) => `<li><strong>Validation Check:</strong> ${c}</li>`).join("")}
          <li><strong>Fallback Behaviour:</strong> ${d6Spec.fallbackMechanism}</li>
        </ul>
        <div class="code-grid">
          <div>
            <h4>Actual System Prompt</h4>
            <pre class="code-box">${d6Spec.systemPrompt}</pre>
          </div>
          <div>
            <h4>Actual Learner Context Payload</h4>
            <pre class="code-box">${d6Spec.userPromptJSON}</pre>
          </div>
        </div>
      </section>
    </div>
  `;
}

/**
 * Main Render Function: Updates Header, Active Screen View, Pause Overlay, and Persistent Identity Footer
 */
export function renderApp() {
  const root = document.getElementById("app-main");
  if (!root) return;

  // Update active navigation tab states
  document.querySelectorAll("[data-nav-screen]").forEach((btn) => {
    const target = btn.getAttribute("data-nav-screen");
    btn.classList.toggle("nav-tab-active", target === learnerState.currentScreen);
  });

  // Update C4 Header Timer & Pause button
  updateHeaderTimerOnly();
  const pauseBtn = document.getElementById("c4-pause-btn");
  if (pauseBtn) {
    pauseBtn.textContent = learnerState.isPaused ? "▶ Resume 10-Min Session" : "⏸ Pause & Save (C4)";
  }

  // Render Pause Modal Banner if paused
  const pauseBanner = document.getElementById("c4-pause-drawer");
  if (pauseBanner) {
    if (learnerState.isPaused) {
      const task = getActiveTask();
      pauseBanner.hidden = false;
      pauseBanner.innerHTML = `
        <div class="pause-drawer-inner">
          <div>
            <span class="pill pill-green">C4 Session Paused & Saved in localStorage</span>
            <strong>Your progress is safely saved at ${formatTime(learnerState.sessionElapsedSeconds)} / 10:00 (Screen: ${learnerState.currentScreen.toUpperCase()}, Task: ${task.title}).</strong>
            <p class="muted-small">You can close or refresh this browser tab right now and resume from this exact spot whenever you return!</p>
          </div>
          <button type="button" class="btn btn-primary" data-action="toggle-pause">
            ▶ Resume Session Now
          </button>
        </div>
      `;
    } else {
      pauseBanner.hidden = true;
      pauseBanner.innerHTML = "";
    }
  }

  // Render active screen
  if (learnerState.currentScreen === "welcome") {
    root.innerHTML = renderWelcomeScreen();
  } else if (learnerState.currentScreen === "concept") {
    root.innerHTML = renderConceptScreen();
  } else if (learnerState.currentScreen === "tutor") {
    root.innerHTML = renderTutorScreen();
  } else if (learnerState.currentScreen === "summary") {
    root.innerHTML = renderSummaryScreen();
  } else {
    root.innerHTML = renderAboutScreen();
  }

  // Wire textarea live input for Format 3 (Explanation)
  const textarea = document.getElementById("explanation-textarea");
  if (textarea) {
    textarea.addEventListener("input", (e) => {
      learnerState.explanationInput = e.target.value;
      saveState();
    });
  }
}

/**
 * Global Delegated Event Listener
 */
function setupEventListeners() {
  document.body.addEventListener("click", (e) => {
    const navBtn = e.target.closest("[data-nav-screen]");
    if (navBtn) {
      navigateTo(navBtn.getAttribute("data-nav-screen"));
      return;
    }

    const actionEl = e.target.closest("[data-action]");
    if (!actionEl) return;

    const action = actionEl.getAttribute("data-action");

    switch (action) {
      case "go-screen":
        navigateTo(actionEl.getAttribute("data-screen"));
        break;

      case "toggle-pause":
        learnerState.isPaused = !learnerState.isPaused;
        learnerState.hasStartedSession = true;
        saveState();
        renderApp();
        break;

      case "resume-saved-session":
        learnerState.isPaused = false;
        learnerState.hasStartedSession = true;
        if (learnerState.currentScreen === "welcome") {
          learnerState.currentScreen = "tutor";
        }
        saveState();
        renderApp();
        break;

      case "reset-fresh-session":
        localStorage.removeItem(STORAGE_KEY);
        hadSavedSessionOnBoot = false;
        learnerState = createInitialState();
        saveState();
        renderApp();
        break;

      case "set-confidence":
        learnerState.confidenceLevel = actionEl.getAttribute("data-val");
        learnerState.hasStartedSession = true;
        if (learnerState.confidenceLevel === "low") {
          learnerState.profileLevel = "foundation";
        }
        saveState();
        renderApp();
        break;

      case "set-diagnostic":
        learnerState.profileLevel = actionEl.getAttribute("data-level");
        learnerState.diagnosticCompleted = true;
        learnerState.hasStartedSession = true;
        saveState();
        renderApp();
        break;

      case "pick-substance":
        learnerState.selectedSubstanceId = actionEl.getAttribute("data-id");
        learnerState.labHistoryCount += 1;
        saveState();
        renderApp();
        break;

      case "pick-indicator":
        learnerState.selectedIndicatorId = actionEl.getAttribute("data-id");
        learnerState.labHistoryCount += 1;
        saveState();
        renderApp();
        break;

      case "toggle-tutor-lab":
        learnerState.showDrawerLabInTutor = !learnerState.showDrawerLabInTutor;
        saveState();
        renderApp();
        break;

      case "jump-task": {
        const idx = Number(actionEl.getAttribute("data-idx") || 0);
        learnerState.activeCustomTask = null;
        learnerState.currentTaskIndex = idx;
        learnerState.currentDifficulty = QUESTION_BANK[idx].difficulty;
        resetInputsForCurrentTask();
        saveState();
        renderApp();
        break;
      }

      case "select-mcq":
        learnerState.selectedMcqOption = actionEl.getAttribute("data-opt");
        saveState();
        renderApp();
        break;

      case "pred-cat":
        learnerState.predictorInput.category = actionEl.getAttribute("data-val");
        saveState();
        renderApp();
        break;

      case "pred-ind1":
        learnerState.predictorInput.ind1 = actionEl.getAttribute("data-val");
        saveState();
        renderApp();
        break;

      case "pred-ind2":
        learnerState.predictorInput.ind2 = actionEl.getAttribute("data-val");
        saveState();
        renderApp();
        break;

      case "insert-starter":
        learnerState.explanationInput = actionEl.getAttribute("data-text") || "";
        saveState();
        renderApp();
        break;

      case "request-hint":
        learnerState.hintsUsedOnCurrent = Math.min(3, learnerState.hintsUsedOnCurrent + 1);
        saveState();
        renderApp();
        break;

      case "check-answer":
        handleCheckAnswer(true);
        break;

      case "request-prereq-lab":
        handleRequestLowConfidencePrereq();
        break;

      case "run-prereq-drop":
        learnerState.selectedSubstanceId = actionEl.getAttribute("data-sub") || "soap";
        learnerState.selectedIndicatorId = actionEl.getAttribute("data-ind") || "turmeric";
        learnerState.showDrawerLabInTutor = true;
        learnerState.prereqLabCompletedForCurrent = true;
        saveState();
        renderApp();
        break;

      case "next-core-task":
        learnerState.activeCustomTask = null;
        learnerState.currentTaskIndex = (learnerState.currentTaskIndex + 1) % QUESTION_BANK.length;
        learnerState.currentDifficulty = QUESTION_BANK[learnerState.currentTaskIndex].difficulty;
        resetInputsForCurrentTask();
        saveState();
        renderApp();
        break;

      case "apply-adaptive-route": {
        const route = actionEl.getAttribute("data-route") || "ALTERNATIVE_EXPLANATION";
        const currentTask = getActiveTask();
        const mFocus =
          (learnerState.lastEvaluation && learnerState.lastEvaluation.misconceptionTag) ||
          currentTask.targetMisconception ||
          "M1";
        learnerState.generatedCount += 1;
        const { task: generated } = generateAdaptiveQuestion(learnerState, route, mFocus);
        learnerState.activeCustomTask = generated;
        resetInputsForCurrentTask();
        saveState();
        renderApp();
        break;
      }

      case "generate-new-ai-task": {
        const lastOutcome =
          (learnerState.lastAdaptiveDecision && learnerState.lastAdaptiveDecision.outcome) ||
          "ALTERNATIVE_EXPLANATION";
        learnerState.generatedCount += 1;
        const { task: generated } = generateAdaptiveQuestion(learnerState, lastOutcome, "M1");
        learnerState.activeCustomTask = generated;
        resetInputsForCurrentTask();
        saveState();
        renderApp();
        break;
      }

      case "run-scenario":
        runContrastingScenarioPreset(actionEl.getAttribute("data-mode"));
        break;

      default:
        break;
    }
  });
}

// Boot application
document.addEventListener("DOMContentLoaded", () => {
  setupEventListeners();
  startSessionTimer();
  renderApp();
});
