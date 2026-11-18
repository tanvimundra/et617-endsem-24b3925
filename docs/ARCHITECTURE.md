# Architecture (`docs/ARCHITECTURE.md`)

**Recorded:** 18:32 IST (18 Nov 2026)
**Card:** `24b3925` | `P4` Adaptive Tutor | `P4-T4` Acids, bases & indicators | `L5` Anxious repeat learner | `C4` 10-minute sessions

## 1. Stack & Hosting
- **Stack:** Plain HTML5 + CSS3 + Vanilla JavaScript (ES Modules, zero build step, zero external runtime dependencies).
- **Why:** Runs natively in any browser, deploys in seconds as a static site, has zero bundler failure modes, and makes every function easy to explain and modify live during the viva.
- **Hosting:** Vercel / Render Static Site connected to `https://github.com/tanvimundra/et617-endsem-24b3925`.

## 2. Five-File Structure & Responsibilities
```text
C:\et617_exam\
├── index.html          # App shell, persistent C4 10-min header, 5 screen views, persistent 24b3925 footer
├── styles.css          # Warm coach theme (#d97706), 360px mobile-first layout, indicator colour swatches
├── src/
│   ├── content.js      # Pure data: indicator table, concept cards, 3-format question bank, dynamic templates, M1/M2 remedies
│   ├── tutorEngine.js  # Pure pedagogy & AI logic: diagnostic grading, 3-format evaluator, M1/M2 detector, P4 3-outcome decision rule, D6 AI prompt/validator
│   └── app.js          # Single learnerState, localStorage save/resume (C4), 10-min timer, DOM rendering & event wiring
├── DESIGN.md           # Committed exam design deliverable (D1, D2, D3, P4 rule)
└── docs/               # PROBLEM.md, SPEC.md, ARCHITECTURE.md, DECISIONS.md, STATE.md, REPORT.md, VIVA.md
```

## 3. Data Model

### Content Item (`src/content.js`)
Each task object has:
- `id`: string (`"q1_turmeric_mcq"`, `"q3_chinahibiscus_pred"`, `"q5_antbite_explain"`, or dynamically generated id)
- `lo`: `"LO1"` | `"LO2"` | `"LO3"`
- `bloom`: `"Understand"` | `"Apply"` | `"Analyse"`
- `difficulty`: `1` | `2` | `3`
- `format`: `"mcq"` | `"predictor"` | `"explanation"`
- `prompt`: conversational question stem tailored to Aarav (`L5`)
- `options` / `predictorConfig` / `explanationRubric`: format-specific structure
- `hints`: array of 3 progressive hints (`[hint1, hint2, hint3]`)
- `correctFeedback`: encouraging coach feedback explaining *why*
- `misconceptionFeedback`: `{ M1: "...", M2: "..." }`
- `altExplanationCard`: visual kitchen analogy + misconception contrast shown when `ALTERNATIVE_EXPLANATION` triggers
- `prerequisiteLabTask`: guided indicator drop check shown when `PREREQUISITE_INSTRUCTION` triggers

### Single Learner State (`learnerState` in `src/app.js`)
Saved under `localStorage` key **`et617_24b3925_state`**:
- If `localStorage` is empty or corrupted, `loadState()` safely returns `createInitialState()` (defaulting to Screen 1 `welcome`, `0` elapsed seconds, `foundation` profile, empty `history`).

## 4. Pedagogy Rules in Words (`src/tutorEngine.js`)
1. **Answer Evaluation (`evaluateLearnerResponse(task, response)`):**
   - **Format 1 (`mcq`):** Checks selected option ID; if wrong, inspects `option.misconceptionTag` (`"M1"` or `"M2"`).
   - **Format 2 (`predictor`):** Checks predicted indicator colour + substance classification (`acid` / `base` / `neutral`). Flags `"M1"` if the learner applies the Litmus red/blue rule to Turmeric or Phenolphthalein.
   - **Format 3 (`explanation`):** Evaluates free-text explanation against concept keywords (`baking soda`/`base`, `acid`/`formic`, `neutralis*`) and misconception triggers (`lemon`/`vinegar` on acidic sting $\rightarrow$ flags `"M2"`). Also builds the D6 structured AI evaluation prompt and runs output schema validation.
2. **P4 Adaptive Decision Rule (`decideAdaptiveOutcome(state, evalResult)`):**
   - **Outcome 1 — `HARDER_QUESTION`:** Triggered when `evalResult.isCorrect === true && state.attemptsOnCurrent === 1 && state.hintsUsedOnCurrent === 0`. Increases `currentDifficulty` (up to 3) and advances to the next higher question format (`mcq` $\rightarrow$ `predictor` $\rightarrow$ `explanation`).
   - **Outcome 2 — `ALTERNATIVE_EXPLANATION`:** Triggered when `(state.attemptsOnCurrent === 1 && !evalResult.isCorrect)` OR `evalResult.misconceptionTag` is `"M1"`/`"M2"` OR `(evalResult.isCorrect && state.hintsUsedOnCurrent >= 1)`. Displays the **Alternative Visual Analogy & Misconception Contrast Card** and generates a parallel question targeting that exact concept.
   - **Outcome 3 — `PREREQUISITE_INSTRUCTION`:** Triggered when `(state.attemptsOnCurrent >= 2 && !evalResult.isCorrect)` OR learner clicks **"I'm not sure — show me the basics first"**. Opens the **Guided Prerequisite Micro-Lab** where Aarav tests the indicator drop-by-drop before retrying.

## 5. Numbered Data Flow
1. **Learner Action:** Learner clicks `"Check Answer"`, `"Get a Hint"`, `"I feel stuck"`, or `"Pause 10-Min Session"` in `index.html`.
2. **Event Handler (`src/app.js`):** Reads current input and passes `(currentTask, learnerInput, learnerState)` to `src/tutorEngine.js`.
3. **Pedagogy Engine (`src/tutorEngine.js`):** Pure functions `evaluateLearnerResponse()` and `decideAdaptiveOutcome()` return `{ isCorrect, misconceptionTag, feedbackText, adaptiveOutcome, nextTask }`.
4. **State Update & Persistence (`src/app.js`):** Updates `learnerState` (mastery, misconception counters, history log, active outcome card) and immediately calls `saveState()` to write JSON to `localStorage["et617_24b3925_state"]`.
5. **Render (`src/app.js`):** Re-renders the active screen, feedback panel, P4 Adaptive Decision Banner, and 10-minute C4 session header.

## 6. "Where to Change What" Table (Live Viva Reference)

| What to Change | File | Function / Constant / Key |
| :--- | :--- | :--- |
| **Identity Token (`24b3925`) & Card Info** | `src/content.js` & `index.html` | `EXAM_CARD_META` object & `footer#identity-footer` |
| **Indicator Colour Rules & Substances (`T6` tool)** | `src/content.js` | `INDICATORS` and `SUBSTANCES` tables |
| **Questions (3 Formats) & Misconception Feedback (`M1`/`M2`)** | `src/content.js` | `QUESTION_BANK` and `DYNAMIC_TEMPLATES` |
| **P4 Adaptive Decision Rule (Harder / Alt / Prerequisite thresholds)** | `src/tutorEngine.js` | `decideAdaptiveOutcome(state, evalResult)` |
| **Free-Text Explanation Grading Rubric & Misconception Detector** | `src/tutorEngine.js` | `evaluateExplanation(task, text)` |
| **D6 AI Prompt Template, API Call & Output Validator** | `src/tutorEngine.js` | `buildAIPrompt()`, `validateAIOutput()`, `generateAdaptiveQuestion()` |
| **C4 10-Minute Session Duration (`600` sec) & Timer Logic** | `src/app.js` | `SESSION_LIMIT_SECONDS = 600` & `tickSessionTimer()` |
| **`localStorage` Key & Empty-State Fallback** | `src/app.js` | `STORAGE_KEY = "et617_24b3925_state"`, `loadState()`, `saveState()` |
| **Theme Colours (`--accent`, `--bg`) & Mobile Width** | `styles.css` | `:root` CSS variables at top of `styles.css` |
| **Screen Order & Navigation Tabs** | `src/app.js` & `index.html` | `navigateTo(screenId)` |
