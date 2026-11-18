/**
 * src/app.js
 * Clean, child-friendly 5-Screen Learning App for AcidBase Coach.
 * Keeps all exam card/Deliverable metadata tucked cleanly inside Screen 5 (About) and the subtle footer.
 */

import {
  EXAM_CARD_META,
  INDICATORS,
  SUBSTANCES,
  CONCEPT_CARDS,
  QUESTION_BANK
} from "./content.js";

import {
  evaluateLearnerResponse,
  decideAdaptiveOutcome,
  generateAdaptiveQuestion
} from "./tutorEngine.js";

export const STORAGE_KEY = "et617_24b3925_state";
export const SESSION_LIMIT_SECONDS = 600; // 10-minute session (600 seconds)

export function createInitialState() {
  return {
    rollNo: EXAM_CARD_META.rollNo,
    currentScreen: "welcome", // "welcome" | "concept" | "tutor" | "summary" | "about"
    sessionElapsedSeconds: 0,
    isPaused: false,
    hasStartedSession: false,
    lastSavedAt: null,

    profileLevel: "foundation",
    confidenceLevel: "unsure",
    diagnosticCompleted: false,

    selectedSubstanceId: "lemon",
    selectedIndicatorId: "turmeric",
    labHistoryCount: 0,

    currentTaskIndex: 0,
    currentDifficulty: 1,
    activeCustomTask: null,
    generatedCount: 0,
    attemptsOnCurrent: 0,
    hintsUsedOnCurrent: 0,
    consecutiveWrong: 0,
    showDrawerLabInTutor: false,

    selectedMcqOption: null,
    predictorInput: { category: "", ind1: "", ind2: "" },
    explanationInput: "",

    lastEvaluation: null,
    lastAdaptiveDecision: null,
    prereqLabCompletedForCurrent: false,

    masteryByLO: { LO1: 20, LO2: 15, LO3: 10 },
    misconceptionsDetected: { M1: 0, M2: 0 },
    misconceptionsResolved: [],
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
      minute: "2-digit"
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(learnerState));
  } catch (err) {
    // Ignore storage quota errors
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
  if (timerEl) {
    timerEl.textContent = `${formatTime(learnerState.sessionElapsedSeconds)} / 10:00`;
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

  learnerState.history.push({
    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
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
    feedback: "Good call! Testing the indicator in our mini-beaker first is the best way to see the colour change without guessing.",
    score: 0,
    matchedCriteria: []
  };
  const decision = decideAdaptiveOutcome(learnerState, evalResult, {
    lowConfidenceRequested: true
  });
  learnerState.lastEvaluation = evalResult;
  learnerState.lastAdaptiveDecision = decision;

  learnerState.history.push({
    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
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
 * Interactive Indicator Dropper Lab Bench (Screen 2 & Helper Drawer in Screen 3)
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
    <section class="lab-tool-card ${compact ? "lab-tool-compact" : ""}" aria-label="Interactive Colour Dropper Lab">
      <div class="lab-tool-header">
        <div>
          <span class="pill pill-amber">Interactive Colour Lab</span>
          <h3>Test Liquids with Indicators</h3>
          <p class="muted-small">Pick any liquid below and add a drop of indicator to watch what colour it turns in the beaker.</p>
        </div>
      </div>

      <div class="lab-controls-grid">
        <div class="lab-control-col">
          <label class="field-label">1. Pick a Liquid in the Beaker:</label>
          <div class="chip-grid">
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
          <label class="field-label">2. Add an Indicator Drop:</label>
          <div class="chip-grid">
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
          <div class="beaker-chem-tag">Type: <strong>${sub.category.toUpperCase()}</strong> (${sub.chemicalName})</div>
        </div>
        <div class="beaker-explanation">
          <p><strong>What happens:</strong> ${outcomeObj.note}</p>
          <p><strong>Why:</strong> ${sub.whyNote}</p>
          <p class="memory-cue-box"><strong>🧠 Easy Memory Clue:</strong> ${ind.memoryCue}</p>
        </div>
      </div>

      <details class="quick-strip-details">
        <summary>📊 See All 4 Indicators Colour Chart</summary>
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
 * SCREEN 1: Friendly Student Welcome, Resume Banner & Warm-Up
 */
function renderWelcomeScreen() {
  const canResume = hadSavedSessionOnBoot || learnerState.history.length > 0 || learnerState.sessionElapsedSeconds > 5;
  const activeTask = getActiveTask();

  return `
    <div class="screen-container">
      ${
        canResume
          ? `
        <div class="c4-resume-banner" role="region" aria-label="Resume Saved Study Session">
          <div class="c4-resume-left">
            <span class="pill pill-green">Saved Progress Found</span>
            <h2>Welcome back! Want to pick up right where you left off?</h2>
            <p>Last saved at <strong>${learnerState.lastSavedAt || "just now"}</strong> · Time used: <strong>${formatTime(
              learnerState.sessionElapsedSeconds
            )} of 10:00</strong> · Current question: <strong>${activeTask.title}</strong>.</p>
          </div>
          <div class="c4-resume-actions">
            <button type="button" class="btn btn-primary" data-action="resume-saved-session">
              ▶ Continue My Session
            </button>
            <button type="button" class="btn btn-outline" data-action="reset-fresh-session">
              ↺ Start Over Fresh
            </button>
          </div>
        </div>
      `
          : ""
      }

      <section class="hero-card">
        <div class="hero-badges">
          <span class="pill pill-amber">Class 7–10 Science</span>
          <span class="pill pill-green">10-Minute Guided Practice</span>
        </div>
        <h1>Let's Master Acids, Bases & Indicators — Without Memorising Scary Tables!</h1>
        <p class="lead-text">
          Ever mixed up whether <strong>turmeric (haldi)</strong> or <strong>phenolphthalein</strong> turns red, pink, or yellow?
          Don't worry! Here there are no harsh red "FAIL" marks. We will test kitchen liquids in a virtual beaker and take it one small step at a time.
        </p>

        <div class="c4-pacing-plan">
          <h3>⏱️ Our 10-Minute Game Plan (Pause & Resume Anytime)</h3>
          <div class="pacing-steps">
            <div class="pacing-step">
              <strong>Step 1 (1 min)</strong>
              <span>Quick check-in on how you feel today</span>
            </div>
            <div class="pacing-step">
              <strong>Step 2 (3 mins)</strong>
              <span>3 visual notes + test liquids in the Colour Lab</span>
            </div>
            <div class="pacing-step">
              <strong>Step 3 (5 mins)</strong>
              <span>Practice Coach that adapts to your answers</span>
            </div>
            <div class="pacing-step">
              <strong>Step 4 (1 min)</strong>
              <span>See the skills you unlocked today</span>
            </div>
          </div>
        </div>
      </section>

      <section class="card diagnostic-card">
        <div class="section-header">
          <h2>Quick Warm-Up Check-In</h2>
          <p class="muted-small">Answer these 2 quick questions so your Practice Coach can pick the best starting step for you:</p>
        </div>

        <div class="diagnostic-grid">
          <div class="diag-box">
            <label class="field-label">1. How do you feel about Acids, Bases & Indicators right now?</label>
            <div class="choice-stack">
              <button type="button" class="option-btn ${learnerState.confidenceLevel === "low" ? "option-selected" : ""}" data-action="set-confidence" data-val="low">
                😟 <strong>A little nervous:</strong> "I found this hard on my last test and mix up which indicator turns which colour."
              </button>
              <button type="button" class="option-btn ${learnerState.confidenceLevel === "unsure" ? "option-selected" : ""}" data-action="set-confidence" data-val="unsure">
                🤔 <strong>Somewhere in the middle:</strong> "I know Litmus, but I get confused by Turmeric, China Rose, and Phenolphthalein."
              </button>
              <button type="button" class="option-btn ${learnerState.confidenceLevel === "confident" ? "option-selected" : ""}" data-action="set-confidence" data-val="confident">
                🙂 <strong>Pretty confident:</strong> "I'm ready to try predictions and real-life questions!"
              </button>
            </div>
          </div>

          <div class="diag-box">
            <label class="field-label">2. Quick Kitchen Guess: What happens when you rub soap on a yellow curry (haldi) stain?</label>
            <div class="choice-stack">
              <button type="button" class="option-btn ${learnerState.profileLevel === "foundation" && learnerState.diagnosticCompleted ? "option-selected" : ""}" data-action="set-diagnostic" data-level="foundation">
                ❓ "I'm not sure — let's test it in the Colour Lab first!"
              </button>
              <button type="button" class="option-btn ${learnerState.profileLevel === "standard" && learnerState.diagnosticCompleted ? "option-selected" : ""}" data-action="set-diagnostic" data-level="standard">
                💡 "It turns reddish-brown because soap is a base!"
              </button>
            </div>
          </div>
        </div>

        <div class="primary-cta-bar">
          <button type="button" class="btn btn-primary btn-large" data-action="go-screen" data-screen="concept">
            Next: Open Notes & Colour Lab →
          </button>
          <button type="button" class="btn btn-outline" data-action="go-screen" data-screen="tutor">
            Go Straight to Practice Questions →
          </button>
        </div>
      </section>
    </div>
  `;
}

/**
 * SCREEN 2: Notes & Interactive Colour Lab
 */
function renderConceptScreen() {
  return `
    <div class="screen-container">
      <div class="screen-top-bar">
        <div>
          <span class="pill pill-amber">Step 2 · Notes & Colour Lab</span>
          <h1>3 Easy Rules & Your Colour Dropper Bench</h1>
          <p class="muted-small">Read the 3 short cards below, then try dropping different indicators into the beaker!</p>
        </div>
        <button type="button" class="btn btn-primary" data-action="go-screen" data-screen="tutor">
          Try Practice Questions →
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
          ← Back to Start
        </button>
        <button type="button" class="btn btn-primary btn-large" data-action="go-screen" data-screen="tutor">
          I'm Ready! Start Practice Coach →
        </button>
      </div>
    </div>
  `;
}

/**
 * SCREEN 3: Practice Coach (Clean for the Learner)
 */
function renderTutorScreen() {
  const task = getActiveTask();
  const evalResult = learnerState.lastEvaluation;
  const decision = learnerState.lastAdaptiveDecision;

  const formatLabel =
    task.format === "mcq"
      ? "Multiple Choice"
      : task.format === "predictor"
      ? "Predict the Colour Change"
      : "Explain in Your Own Words";

  return `
    <div class="screen-container">
      <div class="tutor-top-strip">
        <div class="tutor-meta-badges">
          <span class="pill pill-amber">${formatLabel}</span>
          <span class="pill pill-blue">Skill: ${task.bloom}</span>
          <span class="pill pill-purple">Level ${task.difficulty} of 3</span>
          ${task.isGenerated ? `<span class="pill pill-green">✨ Custom Practice Question</span>` : ""}
        </div>

        <div class="tutor-helper-controls">
          <button type="button" class="btn btn-small btn-outline" data-action="toggle-tutor-lab">
            🧪 ${learnerState.showDrawerLabInTutor ? "Hide" : "Open"} Colour Dropper Lab
          </button>
        </div>
      </div>

      ${learnerState.showDrawerLabInTutor ? renderIndicatorDropperWidget(true) : ""}

      <!-- Question Number Strip -->
      <div class="task-progress-strip" role="navigation" aria-label="Practice Questions">
        ${QUESTION_BANK.map(
          (q, idx) => `
          <button type="button" class="step-pill ${!learnerState.activeCustomTask && learnerState.currentTaskIndex === idx ? "step-pill-active" : ""}" data-action="jump-task" data-idx="${idx}">
            Question ${idx + 1}
          </button>
        `
        ).join("")}
        <button type="button" class="step-pill ${learnerState.activeCustomTask ? "step-pill-active" : ""}" data-action="generate-new-ai-task">
          ✨ Give Me a Fresh Practice Question
        </button>
      </div>

      <article class="card tutor-question-card">
        <div class="question-header">
          <h2>${task.title}</h2>
          ${
            task.isGenerated
              ? `<p class="generated-reason-banner">🎯 <strong>Picked for you:</strong> ${task.generatedReason}</p>`
              : ""
          }
        </div>

        <p class="question-prompt-text">${task.prompt}</p>

        <div class="format-workspace">
          ${renderFormatInput(task)}
        </div>

        <!-- Learner Action Bar -->
        <div class="scaffolding-action-bar">
          <button type="button" class="btn btn-primary btn-large" data-action="check-answer">
            ✔ Check My Answer
          </button>

          <button type="button" class="btn btn-outline" data-action="request-hint">
            💡 Show a Hint (${learnerState.hintsUsedOnCurrent} / 3)
          </button>

          <button type="button" class="btn btn-outline-amber" data-action="request-prereq-lab">
            🛟 I'm not sure — let's test it in the beaker first
          </button>
        </div>

        <!-- Progressive Hints -->
        ${
          learnerState.hintsUsedOnCurrent > 0
            ? `
          <div class="hint-ladder-box" role="region" aria-label="Helpful Hints">
            <h4>🪜 Helpful Clues:</h4>
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

        <!-- Coaching Feedback & Next Step -->
        ${evalResult && decision ? renderAdaptiveFeedbackAndOutcome(task, evalResult, decision) : ""}
      </article>
    </div>
  `;
}

function renderFormatInput(task) {
  if (task.format === "mcq") {
    return `
      <div class="choice-stack" role="radiogroup" aria-label="Answer options">
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
          <label class="field-label">Part 1: Is <strong>${cfg.substanceName}</strong> an acid, base, or neutral?</label>
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
          <label class="field-label">Part 2: What colour will <strong>${cfg.indicator1Name}</strong> turn?</label>
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
          <label class="field-label">Part 3: What colour will <strong>${cfg.indicator2Name}</strong> turn?</label>
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

  const rubric = task.explanationRubric || {};
  return `
    <div class="explanation-workspace">
      <div class="explanation-helper-row">
        <label class="field-label" for="explanation-textarea">Write your answer in 1–2 simple sentences:</label>
        <div class="starter-btn-group">
          <button type="button" class="btn btn-small btn-outline" data-action="insert-starter" data-text="${rubric.sampleStarter || ""}">
            ✍️ Use a Sentence Starter
          </button>
        </div>
      </div>
      <textarea
        id="explanation-textarea"
        class="explanation-textarea"
        rows="4"
        placeholder="Type your explanation here (for example: which liquid is an acid, which is a base, and how they react)..."
      >${learnerState.explanationInput}</textarea>
      <p class="muted-small">💡 Tip: Try to mention which substance is an <strong>acid</strong>, which is a <strong>base</strong>, and how they <strong>neutralise</strong> or change colour.</p>
    </div>
  `;
}

function renderAdaptiveFeedbackAndOutcome(task, evalResult, decision) {
  const outcomeClass =
    decision.outcome === "HARDER_QUESTION"
      ? "outcome-harder"
      : decision.outcome === "ALTERNATIVE_EXPLANATION"
      ? "outcome-alt"
      : "outcome-prereq";

  return `
    <div class="feedback-outcome-wrapper ${evalResult.isCorrect ? "feedback-correct" : "feedback-coaching"}" role="status" aria-live="polite">
      <div class="feedback-header">
        <span class="status-icon">${evalResult.isCorrect ? "🌟 Great Job!" : "🧭 Coach Tip — Let's Look Closer"}</span>
      </div>

      <p class="feedback-main-copy">${evalResult.feedback}</p>

      <div class="model-answer-strip">
        <strong>✔ Complete Answer:</strong> ${task.modelAnswer}
      </div>

      <div class="p4-decision-banner ${outcomeClass}">
        <div class="p4-decision-title">
          <strong>${decision.badgeLabel}</strong>
        </div>
        <p style="margin:0.35rem 0;">${decision.ruleTriggered}</p>

        <!-- Outcome 2: Everyday Kitchen Analogy + Parallel Question -->
        ${
          decision.outcome === "ALTERNATIVE_EXPLANATION" && task.altExplanationCard
            ? `
          <div class="remediation-box alt-explanation-box">
            <h4>🎨 ${task.altExplanationCard.headline}</h4>
            <p>${task.altExplanationCard.analogy}</p>
            <div class="boxed-cue">${task.altExplanationCard.ruleSummary}</div>
            <div class="outcome-cta-row">
              <button type="button" class="btn btn-primary" data-action="apply-adaptive-route" data-route="ALTERNATIVE_EXPLANATION">
                🔄 Try a Similar Practice Question →
              </button>
            </div>
          </div>
        `
            : ""
        }

        <!-- Outcome 3: Hands-On Mini-Lab Before Retrying -->
        ${
          decision.outcome === "PREREQUISITE_INSTRUCTION" && task.prerequisiteLabTask
            ? `
          <div class="remediation-box prereq-lab-box">
            <h4>🔬 Hands-On Mini-Lab Check</h4>
            <p>${task.prerequisiteLabTask.instruction}</p>
            <div class="prereq-interactive-row">
              <button type="button" class="btn btn-secondary" data-action="run-prereq-drop" data-sub="${task.prerequisiteLabTask.substanceId}" data-ind="${task.prerequisiteLabTask.indicatorId}">
                💧 Drop ${INDICATORS[task.prerequisiteLabTask.indicatorId].name} into ${
                SUBSTANCES.find((s) => s.id === task.prerequisiteLabTask.substanceId)?.name || "Beaker"
              }
              </button>
              ${
                learnerState.prereqLabCompletedForCurrent
                  ? `<span class="pill pill-green">✔ Look at the colour change in the beaker at the top of the page!</span>`
                  : ""
              }
            </div>
            <div class="outcome-cta-row">
              <button type="button" class="btn btn-primary" data-action="apply-adaptive-route" data-route="PREREQUISITE_INSTRUCTION">
                🪜 Try an Easier Stepping-Stone Question →
              </button>
            </div>
          </div>
        `
            : ""
        }

        <!-- Outcome 1: Advance to Harder Question -->
        ${
          decision.outcome === "HARDER_QUESTION"
            ? `
          <div class="remediation-box harder-question-box">
            <div class="outcome-cta-row">
              <button type="button" class="btn btn-primary" data-action="next-core-task">
                ➡ Next Harder Question →
              </button>
              <button type="button" class="btn btn-secondary" data-action="apply-adaptive-route" data-route="HARDER_QUESTION">
                ✨ Try a Bonus Challenge →
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
 * SCREEN 4: My Progress (Clean & Encouraging for the Student)
 */
function renderSummaryScreen() {
  const m = learnerState.masteryByLO;
  return `
    <div class="screen-container">
      <div class="screen-top-bar">
        <div>
          <span class="pill pill-green">Step 4 · My Progress</span>
          <h1>What You Have Learned Today</h1>
          <p class="muted-small">Study time used: <strong>${formatTime(
            learnerState.sessionElapsedSeconds
          )} of 10:00</strong> · Questions practiced: <strong>${learnerState.history.length}</strong></p>
        </div>
        <button type="button" class="btn btn-primary" data-action="go-screen" data-screen="tutor">
          ← Back to Practice Coach
        </button>
      </div>

      <div class="summary-grid">
        <section class="card">
          <h3>📈 Your Science Skills</h3>
          <div class="mastery-bars">
            <div class="mastery-item">
              <div class="mastery-label">
                <strong>1. Spotting Acids, Bases & Neutral Liquids</strong>
                <span>${m.LO1}%</span>
              </div>
              <div class="progress-track"><div class="progress-bar-fill" style="width:${m.LO1}%"></div></div>
            </div>
            <div class="mastery-item">
              <div class="mastery-label">
                <strong>2. Predicting Indicator Colour Changes</strong>
                <span>${m.LO2}%</span>
              </div>
              <div class="progress-track"><div class="progress-bar-fill" style="width:${m.LO2}%"></div></div>
            </div>
            <div class="mastery-item">
              <div class="mastery-label">
                <strong>3. Explaining Real-Life Neutralisation</strong>
                <span>${m.LO3}%</span>
              </div>
              <div class="progress-track"><div class="progress-bar-fill" style="width:${m.LO3}%"></div></div>
            </div>
          </div>
        </section>

        <section class="card">
          <h3>🧠 Key Rules to Remember for Your Test</h3>
          <ul class="highlight-list">
            <li><strong>Litmus:</strong> Blue turns <strong>Red</strong> in Acid; Red turns <strong>Blue</strong> in Base.</li>
            <li><strong>Turmeric (Haldi):</strong> Stays <strong>Yellow</strong> in Acid; turns <strong>Reddish-Brown</strong> only in Base (like soap).</li>
            <li><strong>China Rose (Gudhal):</strong> Turns <strong>Dark Pink (Magenta)</strong> in Acid and <strong>Green</strong> in Base.</li>
            <li><strong>Phenolphthalein:</strong> Stays <strong>Colourless</strong> in Acid and turns <strong>Bright Pink</strong> only in Base.</li>
            <li><strong>Neutralisation:</strong> Always calm an Acid (like an ant bite) with a mild Base (like baking soda), never with lemon juice!</li>
          </ul>
        </section>
      </div>

      <section class="card">
        <h3>📋 Your Recent Practice Activity</h3>
        ${
          learnerState.history.length === 0
            ? `<p class="muted-small">You haven't checked any practice questions yet. Head over to <strong>Practice Coach</strong> to try your first one!</p>`
            : `
          <div class="reference-table-wrap">
            <table class="reference-table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Question</th>
                  <th>Status</th>
                  <th>Hints Used</th>
                  <th>Coach Next Step</th>
                </tr>
              </thead>
              <tbody>
                ${learnerState.history
                  .map(
                    (h) => `
                  <tr>
                    <td>${h.timestamp}</td>
                    <td><strong>${h.taskTitle}</strong></td>
                    <td>${h.isCorrect ? "🌟 Solved" : "🧭 Practiced with Coach"}</td>
                    <td>${h.hintsUsed}</td>
                    <td>${
                      h.outcomeTriggered === "HARDER_QUESTION"
                        ? "Level Up Challenge"
                        : h.outcomeTriggered === "ALTERNATIVE_EXPLANATION"
                        ? "Kitchen Analogy + Extra Practice"
                        : "Hands-On Mini-Lab"
                    }</td>
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
 * SCREEN 5: About Screen (Required by Section 2 Identity Rules)
 */
function renderAboutScreen() {
  return `
    <div class="screen-container">
      <section class="card identity-hero-card">
        <span class="pill pill-amber">About AcidBase Coach</span>
        <h1>Identity Token: <code>${EXAM_CARD_META.rollNo}</code> (<code>${EXAM_CARD_META.rollNoUpper}</code>)</h1>
        <p class="lead-text">
          AcidBase Coach is an adaptive science learning application designed to help middle-school students master <strong>Acids, Bases, and Indicators</strong> in calm, resumable 10-minute study sessions.
        </p>

        <div class="reference-table-wrap">
          <table class="reference-table">
            <tbody>
              <tr>
                <th style="width:30%">ID — Identity Token (Roll No.)</th>
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
                <td><strong><code>${EXAM_CARD_META.learnerCode}</code></strong>: ${EXAM_CARD_META.learnerTitle}</td>
              </tr>
              <tr>
                <th>C — Design Constraint</th>
                <td><strong><code>${EXAM_CARD_META.constraintCode}</code></strong>: ${EXAM_CARD_META.constraintTitle}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  `;
}

export function renderApp() {
  const root = document.getElementById("app-main");
  if (!root) return;

  document.querySelectorAll("[data-nav-screen]").forEach((btn) => {
    const target = btn.getAttribute("data-nav-screen");
    btn.classList.toggle("nav-tab-active", target === learnerState.currentScreen);
  });

  updateHeaderTimerOnly();
  const pauseBtn = document.getElementById("c4-pause-btn");
  if (pauseBtn) {
    pauseBtn.textContent = learnerState.isPaused ? "▶ Resume" : "⏸ Pause & Save";
  }

  const pauseBanner = document.getElementById("c4-pause-drawer");
  if (pauseBanner) {
    if (learnerState.isPaused) {
      const task = getActiveTask();
      pauseBanner.hidden = false;
      pauseBanner.innerHTML = `
        <div class="pause-drawer-inner">
          <div>
            <span class="pill pill-green">Session Paused & Saved</span>
            <strong>Your progress is saved at ${formatTime(learnerState.sessionElapsedSeconds)} / 10:00 (Current question: ${task.title}).</strong>
            <p class="muted-small">You can take a break or close this tab and continue right from this spot anytime!</p>
          </div>
          <button type="button" class="btn btn-primary" data-action="toggle-pause">
            ▶ Continue Session
          </button>
        </div>
      `;
    } else {
      pauseBanner.hidden = true;
      pauseBanner.innerHTML = "";
    }
  }

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

  const textarea = document.getElementById("explanation-textarea");
  if (textarea) {
    textarea.addEventListener("input", (e) => {
      learnerState.explanationInput = e.target.value;
      saveState();
    });
  }
}

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

      default:
        break;
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setupEventListeners();
  startSessionTimer();
  renderApp();
});
