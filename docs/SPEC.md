# Specification — Complete (Stages 1 & 2)

**Recorded:** 18:31 IST (18 Nov 2026)
**Card:** `24b3925` | `P4` Adaptive Tutor | `P4-T4` Acids, bases & indicators (Cl. 7–10) | `L5` Anxious repeat learner | `C4` 10-minute sessions

## Part 1 — Learner & Pedagogy

### 1. Learner Persona (`L5`)
- **Name / Age:** Aarav, 13 years old (Class 8).
- **Context:** Failed his first school unit test on Acids, Bases & Indicators (scored 4/15); studies at home in the evening in short **10-minute blocks (`C4`)** on a shared Android phone (360 px) or laptop.
- **Goal:** Understand indicator colour changes and neutralisation well enough to pass his re-test without panicking.
- **Barrier / Frustration:** High test anxiety and low self-efficacy; confuses the colour rules across Litmus, Turmeric, China Rose, and Phenolphthalein when presented as static tables.
- **Misconceptions:**
  - **M1 (Indicator Overgeneralisation):** Believes all indicators turn red/pink in acids and blue/yellow in bases (confuses Turmeric and Phenolphthalein with Litmus).
  - **M2 (Neutralisation Direction Error):** Believes an acidic sting/indigestion can be treated with another acid (lemon/vinegar) instead of a mild base (baking soda/antacid).
- **Motivation Driver:** Non-judgmental coaching, visual interactive testing before guessing, and visible progress within a 10-minute session that saves automatically.

### 2. Learning Objectives (Bloom's Taxonomy)
- **LO1 (Understand — Classify):** Classify household and lab solutions as acidic, basic, or neutral from indicator observations.
- **LO2 (Apply — Predict):** Predict the colour change of Litmus, Turmeric, China Rose, and Phenolphthalein in unseen solutions.
- **LO3 (Analyse/Evaluate — Explain):** Explain why a real-life indicator change or neutralisation remedy works and why common misconceptions fail.

### 3. Theories Used
1. **Cognitive Load Theory (Sweller):** Offload 4-indicator memorisation via an interactive Indicator Dropper & Colour Strip tool (`T6`) and chunk sessions into 10-minute steps (`C4`).
2. **Scaffolding & ZPD (Vygotsky):** 3-step Hint Ladder + 3-branch Adaptive Decision Engine (`HARDER_QUESTION`, `ALTERNATIVE_EXPLANATION`, `PREREQUISITE_INSTRUCTION`).
3. **Self-Efficacy (Bandura) & Affective Filter:** Warm coach-like feedback that normalises mistakes as learning signals and lets Aarav pause/resume anytime (`C4`).
4. **Retrieval Practice & Elaborative Interrogation:** Multi-format practice (MCQ -> Interactive Prediction -> Short Explanation).

### 4. Design Principles
1. **DP1 (Cognitive Load + T6 Tool):** We will embed an interactive Indicator Dropper & Colour Reference Bench alongside concept cards because anxious learners need to see and test colour transitions rather than memorise abstract tables.
2. **DP2 (ZPD + P4 Decision Rule):** We will route every response to either a **Harder Question**, an **Alternative Visual Explanation**, or **Prerequisite Micro-Lab Instruction** based on accuracy, misconceptions (`M1`/`M2`), and hint usage because adaptive scaffolding prevents both boredom and helplessness.
3. **DP3 (Misconception Resolution — P2):** We will diagnose `M1` and `M2` explicitly in both structured choices and free-text explanations and show side-by-side misconception contrasts because learners must see *why* their intuitive rule failed.
4. **DP4 (Self-Efficacy + L5):** We will use a calm, coach-like tone, allow retries after hints, and provide a "Low Confidence / Show Prerequisite" button because reducing fear of failure keeps an anxious repeat learner engaged.
5. **DP5 (10-Minute Pacing & Resume — C4):** We will structure the complete learning journey into a 10-minute paced sequence with instant `localStorage` auto-save and a "Pause & Resume Later" control because bounded sessions fit Aarav's attention and lower overwhelm.

---

## Part 2 — Scope & Experience (Stage 2)

### 5. Scope (MoSCoW) — Mapped to Design Principles
- **MUST 1 (DP2, DP3, DP4):** **P4 Adaptive Tutor Engine** supporting **3 question formats** ((1) Scenario MCQ, (2) Interactive Indicator Colour-Change Predictor & Classifier, (3) Short Explanation Evaluator) + **3-branch Decision Rule** (`HARDER_QUESTION`, `ALTERNATIVE_EXPLANATION`, `PREREQUISITE_INSTRUCTION`) diagnosing misconceptions `M1` and `M2`.
- **MUST 2 (DP1, Rubric T6 & P5):** **Interactive Indicator Dropper & Colour Reference Strip Tool** (test Litmus, Turmeric, China Rose, and Phenolphthalein on everyday acids, bases, and neutral liquids) + conversational concept cards with visual highlights.
- **MUST 3 (DP5, Constraint C4 & Identity Rules):** **10-Minute Session Manager** (visual 10:00 pacing bar, Pause/Resume drawer, automatic `localStorage` persistence under `et617_24b3925_state`) + persistent Identity Token `24b3925` in the footer of every screen and on the About screen.
- **SHOULD 1 (Deliverable D5 & D6):** **Contrasting Scenario Preset Runner** (1-click triggers for D5 Scenario A: Correct Path -> Harder Question, and Scenario B: Misconception `M1`/`M2` -> Alternative Explanation / Prerequisite Instruction) + **D6 AI Prompt & Validator Inspector**.
- **WON'T (Out of Scope, by design):** Quantitative pH log calculations ($\text{pH} = -\log[\text{H}^+]$), multi-user accounts, or unguided open chat (excluded to prevent cognitive overload for a Class 8 anxious repeat learner in a 10-minute session).

### 6. Five Connected Screens & Learner Flow (`D4`)
1. **Screen 1 — Welcome, C4 Resume Banner & Diagnostic Warm-Up (`welcome`):**
   - If saved session exists in `localStorage`, prominently offers **"Resume 10-Min Session from Step X"** or **"Start Fresh"**.
   - Runs a quick 2-item Diagnostic Check + Self-Efficacy Confidence Check to set initial `profileLevel` (`foundation` vs `standard`).
2. **Screen 2 — Conversational Concept Brief & Interactive Indicator Lab Tool (`concept`):**
   - Bite-sized conversational cards ("Let's test together...") with highlighted rules.
   - Interactive **Indicator Dropper Bench (`T6` tool)** where Aarav selects any substance (Lemon Juice, Vinegar, Tap Water, Baking Soda, Soap Water, Ant Sting) and drops Litmus, Turmeric, China Rose, or Phenolphthalein to observe real-time colour changes.
3. **Screen 3 — Adaptive Tutor Workspace (`tutor`):**
   - Renders adaptive tasks across the **3 formats** (`mcq`, `predictor`, `explanation`).
   - Includes a collapsible **Quick Indicator Strip (`T6`)**, **3-step Hint Ladder**, and **"I feel stuck / Show Prerequisite (`L5`)"** button.
   - Displays the **Adaptive Decision Banner** after every check: explicitly shows the rule evaluated and whether the next step is **Outcome 1: Harder Question**, **Outcome 2: Alternative Explanation (with M1/M2 Contrast Card)**, or **Outcome 3: Prerequisite Micro-Lab Instruction**.
4. **Screen 4 — 10-Minute Session Summary, Mastery Map & D5 Scenario Replay (`summary`):**
   - Shows mastery across LO1, LO2, LO3, misconceptions resolved (`M1`, `M2`), time spent inside the 10-minute window, and full interaction log.
   - Includes **D5 Scenario Comparison View** so the learner/examiner can inspect or launch Scenario A (Correct Path) and Scenario B (Misconception Path).
5. **Screen 5 — About, Exam Card & D6 AI Specification Inspector (`about`):**
   - Displays official card (`Roll No: 24b3925`, `P4`, `P4-T4`, `L5`, `C4`), pedagogical traceability, the live **D6 AI Prompt / Validator / Fallback Inspector**, and the **"Where to Change What"** quick reference.

### 7. Learner Data Recorded (`learnerState` in `localStorage`)
- `sessionId`, `rollNo` (`24b3925`), `currentScreen`, `sessionElapsedSeconds` (out of `600` sec / 10 mins), `isPaused`, `lastSavedAt`
- `profileLevel` (`foundation` | `standard`), `confidenceRating` (1–3)
- `currentTaskIndex`, `currentDifficulty` (1–3), `activeOutcomeMode` (`normal` | `HARDER_QUESTION` | `ALTERNATIVE_EXPLANATION` | `PREREQUISITE_INSTRUCTION`)
- `attemptsOnCurrent`, `hintsUsedOnCurrent`, `consecutiveWrong`
- `masteryByLO`: `{ LO1: number, LO2: number, LO3: number }`
- `misconceptionsDetected`: `{ M1: count, M2: count }`, `misconceptionsResolved`: `string[]`
- `history`: array of `{ timestamp, taskId, format, learnerAnswer, isCorrect, misconceptionTag, hintsUsed,attempts, outcomeTriggered }`

### 8. UI Rules in Force
- **Palette:** Warm light mode (`#fffbeb` / `#ffffff` background, `#d97706` amber primary button, `#0f172a` high-contrast slate text >= 7:1 contrast).
- **Indicator Swatches:** Real visual colour pills with text labels (never colour alone — accessible for colour-vision differences).
- **Mobile-first (`360px`+):** Touch targets >= 44 px, one primary task per screen, persistent header (10-min C4 bar + Pause button) and persistent footer (`Identity Token: 24b3925 | P4 · T4 · L5 · C4`).
