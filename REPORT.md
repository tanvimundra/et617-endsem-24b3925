# ET 617 End-Semester Examination Report (`24b3925`)

---

## Identity Card

| Card Field | Code | Selection |
| :--- | :--- | :--- |
| **ID — Identity Token (Roll No.)** | `24b3925` | `24b3925` (`24B3925`) |
| **P — Problem Statement** | `P4` | Adaptive tutor with automatic question generation (*Adaptive learning · Assessment · Generative AI*) |
| **T — Topic** | `P4-T4` | Acids, bases and indicators (Class 7–10) |
| **L — Learner Context** | `L5` | Learner repeating the topic after failing it once, high anxiety and low self-efficacy |
| **C — Design Constraint** | `C4` | 10-minute sessions — One complete learning sequence fits in 10 minutes; the learner can stop and resume where they left off |
| **Live Hosted Application URL** | — | `https://et617-24b3925.vercel.app` (Backup: `https://tanvimundra.github.io/et617-endsem-24b3925/`) |
| **GitHub Repository URL** | — | `https://github.com/tanvimundra/et617-endsem-24b3925` |

---

## D1 — Educational Problem, Learning Outcomes & Context of Use

### The Educational Problem (4 Sentences)
Middle-school students studying **Acids, Bases, and Indicators (Class 7–10)** often attempt to memorise 12 disconnected indicator colour transitions by rote without linking them to everyday chemical behaviour. For a repeat learner who has already failed the topic once (**L5**), forgetting a single indicator rule triggers test anxiety, cognitive overload, and low self-efficacy ("I always confuse whether turmeric or litmus turns red in acid"). Conventional online quizzes worsen this anxiety by marking responses "Wrong" without diagnosing *which* alternate conception caused the mistake or adapting the difficulty of the next task. **AcidBase Coach** addresses this gap through a calm, resumable **10-minute adaptive tutoring sequence (C4)** that provides an interactive indicator dropper bench, evaluates multiple question formats including free-text explanations (**P4**), diagnoses specific misconceptions, and routes the learner to prerequisite lab exploration, everyday visual analogies, or harder synthesis challenges.

### Three Measurable Learning Outcomes (Bloom's Taxonomy Action Verbs)
1. **LO1 — Classify (Bloom: Understand):** Given indicator colour observations from Litmus, Turmeric, China Rose, or Phenolphthalein, the learner will accurately **classify** household and laboratory liquids as acidic, basic, or neutral.
2. **LO2 — Predict (Bloom: Apply):** Given an everyday test solution (such as lemon juice, vinegar, soap water, baking soda, or milk of magnesia) and two indicators, the learner will **predict** the exact resulting colour changes before testing.
3. **LO3 — Explain & Diagnose (Bloom: Analyse / Evaluate):** Given a real-world acid-base scenario (such as treating an acidic ant sting or washing a turmeric curry stain with soap and lemon), the learner will **explain** the chemical mechanism in their own words and **diagnose** why common misconceptions fail.

### Context of Use
- **Where & When:** Used at home in the evening during focused **10-minute study sessions (C4)** ahead of a school Science re-test.
- **Device & Persistence:** Accessed on a personal or shared Android smartphone (360 px mobile-first layout) or laptop browser, with automatic state persistence in `localStorage` (`et617_24b3925_state`) so the learner can pause at any moment and resume from the exact screen, question, and timer second.

---

## D2 — Learner Persona (`L5` Seed Expanded)

- **Name & Age:** **Aarav**, 13 years old, Class 8 student at an urban Indian middle school.
- **Learner Context (`L5`):** Aarav scored 4/15 on his first school unit test on *Acids, Bases and Salts* and must sit for a re-test this week. He experiences high test anxiety when confronted with dense chemical tables or punitive countdown timers, and his self-efficacy in Science is currently fragile.
- **Prior Knowledge of Prerequisites:**
  - Recognises everyday sour substances (lemon juice, curd, vinegar) and slippery substances (soap water) from home experience.
  - Remembers the basic Litmus rule (**Blue litmus turns red in acid; Red litmus turns blue in base**), but mixes up natural and synthetic indicators when tested together.
- **Two Specific Target Misconceptions (`M1` and `M2`):**
  1. **Misconception `M1` (Indicator Colour-Rule Overgeneralisation):** Aarav overgeneralises the Litmus rule ("Acid = Red/Pink, Base = Blue/Yellow") to *every* indicator. Specifically, he believes **Turmeric turns red in acids** (whereas turmeric stays bright yellow in acids and turns **reddish-brown only in bases** like soap) and believes **Phenolphthalein turns pink in acids** (whereas it stays colourless in acids and turns **bright pink only in bases**).
  2. **Misconception `M2` (Neutralisation Direction / "Like Cures Like" Error):** When solving real-life neutralisation problems (such as a red ant bite injecting formic acid, or stomach indigestion from excess $\text{HCl}$), Aarav believes applying another strong household acid like **lemon juice or vinegar** will "cancel out or wash away" the sting, instead of applying an **opposite mild base** (moist baking soda, calamine, or milk of magnesia) to neutralise the acid into salt and water.
- **Device, Time & Language:** Uses a family Android phone (360 px width) or laptop for **10 minutes at a time (`C4`)**. Reads clear, conversational Indian English anchored in familiar household items (*haldi/turmeric*, *gudhal/china rose*, *sirka/vinegar*, baking soda).
- **Motivation Driver:** Rebuilds self-efficacy through **safe-to-try hands-on experimentation** (testing drops in a virtual beaker before guessing), **progressive 3-step hints**, and **non-judgmental coaching feedback** that frames mistakes as useful clues.

---

## D3 — Educational Content (Concept + 6 Tasks in 3 Formats + Model Feedback)

### 1. Core Concept Explanation (Conversational Style + Visual Cues, Rubric C3 & P5)
- **Card 1 — Spotting Acids & Bases Around Us:** Uses conversational active voice (*"Let us forget scary chemical formulas for a minute!"*). Highlights that **Acids** taste sour and release $\text{H}^+$ ions (lemon juice, vinegar, ant sting formic acid), **Bases** feel soapy and release $\text{OH}^-$ ions (soap water, baking soda, milk of magnesia), and **Neutral** liquids (pure water, salt water) do neither.
- **Card 2 — Breaking the Indicator Trap (`M1`):** Explicitly contrasts the 4 NCERT indicators:
  - **Litmus:** Acid $\rightarrow$ **Red** | Base $\rightarrow$ **Blue** | Neutral $\rightarrow$ **Purple**
  - **Turmeric (*Haldi*):** Acid/Neutral $\rightarrow$ **Stays Bright Yellow** | Base $\rightarrow$ **Reddish-Brown**
  - **China Rose (*Gudhal*):** Acid $\rightarrow$ **Dark Pink (Magenta)** | Base $\rightarrow$ **Leafy Green**
  - **Phenolphthalein:** Acid/Neutral $\rightarrow$ **Colourless** | Base $\rightarrow$ **Bright Pink**
- **Card 3 — Neutralisation & The Rule of Opposites (`M2`):** $\text{Acid} + \text{Base} \rightarrow \text{Salt} + \text{Water}$. Emphasises that an acidic problem (ant bite / stomach acidity) requires a **mild base** (baking soda / milk of magnesia), never another acid.

### 2. Six Learning Tasks Across Three Formats (Exceeds D3 $\ge 5$ tasks in $\ge 2$ formats & P4 $\ge 3$ formats)

| Task ID & Format | Prompt Summary | Model Answer | Correct Feedback | Misconception Feedback (`M1` / `M2`) |
| :--- | :--- | :--- | :--- | :--- |
| **Task 1 (`q1_mcq_turmeric`)**<br>Format 1: Diagnostic Scenario MCQ (`LO1`) | Aarav drops yellow turmeric paste on Strip A (lemon juice, acid) and Strip B (soap water, base). What colours appear? | Strip A (lemon juice) stays bright yellow; Strip B (soap water) turns reddish-brown. | *"Spot on! Lemon juice is acidic so turmeric stays yellow, while soap water is basic so it turns turmeric reddish-brown — just like washing a curry stain with soap!"* | **Targets `M1`:** *"Pause and take a breath! You met Trap M1: applying the Litmus rule ('acid = red, base = blue') to turmeric. Turmeric stays yellow in acid and turns reddish-brown only in a base like soap."* |
| **Task 2 (`q2_mcq_phenolphthalein`)**<br>Format 1: Scenario MCQ (`LO1`) | Clear liquid in Beaker X turns phenolphthalein bright pink. What happens when red litmus paper is dipped into Beaker X? | Red litmus turns blue, because phenolphthalein turns pink only in a base. | *"Brilliant reasoning! Step 1: Phenolphthalein turning pink proves Beaker X is a base. Step 2: A base turns red litmus blue!"* | **Targets `M1`:** *"Trap M1 caught! It is tempting to think 'pink/red = acid', but phenolphthalein turns bright pink ONLY in a BASE. In acids, it stays colourless!"* |
| **Task 3 (`q3_predictor_chinahibiscus`)**<br>Format 2: Interactive Multi-Indicator Predictor (`LO2`) | Classify Vinegar (*Sirka*) and predict the exact colour of (a) China Rose (*Gudhal*) and (b) Turmeric in it. | Nature: **Acid** \| China Rose: **Dark Pink (Magenta)** \| Turmeric: **Stays Bright Yellow**. | *"Awesome prediction! Vinegar is an acid, so China Rose turns Dark Pink (Magenta) while Turmeric stays Bright Yellow."* | **Targets `M1`:** *"Watch out for M1! Vinegar is an acid: China Rose turns Dark Pink (Magenta) in acids (Green is for bases!), and Turmeric stays Bright Yellow in acids."* |
| **Task 4 (`q4_predictor_magnesia`)**<br>Format 2: Interactive Multi-Indicator Predictor (`LO2`) | Classify Milk of Magnesia (antacid) and predict the colour of (a) China Rose and (b) Phenolphthalein in it. | Nature: **Base** \| China Rose: **Leafy Green** \| Phenolphthalein: **Bright Pink**. | *"Nailed it! Milk of Magnesia is a mild base — it turns China Rose leafy green and makes Phenolphthalein blush bright pink!"* | **Targets `M1`:** *"Because an antacid neutralises stomach acid, Milk of Magnesia is a BASE. In a base, China Rose turns Green and Phenolphthalein turns Bright Pink."* |
| **Task 5 (`q5_explain_antbite`)**<br>Format 3: Open Explanation Evaluator (`LO3`) | Red ant bite injects formic acid. Friend says rub lemon juice; grandmother says rub moist baking soda. Who is right and why? | Grandmother is right: the ant bite injects formic acid, so moist baking soda (a mild base) neutralises the acid. Lemon juice is citric acid and would worsen the sting. | *"Superb scientific explanation! You identified that the ant sting is acidic, lemon juice adds more acid, and baking soda (a mild base) neutralises it."* | **Targets `M2`:** *"Hold on — you triggered Misconception M2 ('Like Cures Like')! Both ant sting (formic acid) and lemon juice (citric acid) are ACIDS. Adding acid to acid increases burning! Use a mild BASE (baking soda) to neutralise it."* |
| **Task 6 (`q6_explain_currystain`)**<br>Format 3: Open Explanation Evaluator (`LO3`) | Explain why a yellow curry stain turns reddish-brown with soap, and turns yellow again when lemon juice is squeezed on it. | Soap is basic, turning the turmeric indicator reddish-brown. Acidic lemon juice neutralises the basic soap, restoring turmeric's yellow colour. | *"Master-level explanation! You connected both indicator colour change (soap = base -> reddish-brown) and acid-base neutralisation (lemon = acid -> back to yellow)."* | **Targets `M1`:** *"Careful with which is acid and which is base (M1)! Soap is a BASE (turns turmeric reddish-brown), and lemon juice is an ACID (neutralises the soap back to yellow)."* |

---

## D4 — Working Application (Live URL & 5-Screen Map)

- **Live Hosted URL (Vercel):** `https://et617-24b3925.vercel.app` (and GitHub Pages mirror: `https://tanvimundra.github.io/et617-endsem-24b3925/`)
- **Identity Token Visibility:** Roll number `24b3925` (`24B3925`) is displayed in the persistent header, the persistent footer of **all 5 screens**, and on Screen 5 (`About & Card`).
- **C4 Constraint Visibility:** Persistent top bar shows the **10-minute session timer (`MM:SS / 10:00`)**, progress bar, and **`⏸ Pause & Save (C4)`** button. Every interaction auto-saves to `localStorage["et617_24b3925_state"]`, and Screen 1 displays a green **"Resume Where I Left Off"** banner whenever saved progress exists.

### Screen Map & Transitions (5 Connected Screens)
```text
[Screen 1: Welcome, C4 Resume Banner & Diagnostic Warm-Up]
   │  (Learner Input: Confidence rating + Diagnostic choice OR "Resume Saved Session")
   ▼
[Screen 2: Conversational Concept Cards & Interactive Indicator Dropper Lab (T6 Tool)]
   │  (Learner Input: Pick any of 8 liquids + drop Litmus/Turmeric/China Rose/Phenolphthalein -> System Output: Live colour beaker + chemical why)
   ▼
[Screen 3: Adaptive Tutor Workspace (P4 — 3 Question Formats + 3 Adaptive Outcomes)]
   ├──► Outcome 1 (1st-try correct, 0 hints) ──► [HARDER_QUESTION: Advances difficulty & format MCQ -> Predictor -> Explanation]
   ├──► Outcome 2 (1st miss / M1 or M2 / hint) ──► [ALTERNATIVE_EXPLANATION: Visual Kitchen Analogy Card + Parallel Generated Question]
   └──► Outcome 3 (2nd miss / Low Confidence)  ──► [PREREQUISITE_INSTRUCTION: Guided Drop-by-Drop Micro-Lab + Stepping-Stone Task]
   │
   ▼
[Screen 4: 10-Minute Session Summary, LO1–LO3 Mastery Map & D5 Contrasting Scenarios]
   │
   ▼
[Screen 5: About, Official Exam Card (24b3925) & Live D6 AI Prompt / Validator Inspector]
```

---

## D5 — Two Contrasting Learner Scenarios (Live App Paths)

### Scenario A — Learner Who Responds Correctly (`scenarioA_correct`)
1. **Learner Action:** On Screen 3 (`Task 1: The Curry Stain Test`), the learner selects **Option B** (*"Strip A (lemon juice) stays yellow; Strip B (soap water) turns reddish-brown"*) on the **1st attempt with 0 hints** and clicks **✔ Check My Answer**.
2. **System Diagnosis & Feedback:** The evaluator confirms `isCorrect = true`, `misconceptionTag = null`, increases `LO1` mastery (+25%), and displays green mastery feedback explaining why lemon juice (acid) keeps turmeric yellow while soap (base) turns it reddish-brown.
3. **Adaptive Routing (`Outcome 1: HARDER_QUESTION`):** The P4 Decision Engine fires `Rule 1: Correct on 1st attempt with 0 hints -> Increase difficulty & advance Bloom question format`, unlocking the button to advance to a **Level 2 Interactive Multi-Indicator Predictor** or generate a **Level 3 Harder Synthesis Challenge**.

### Scenario B — Learner Who Shows a D2 Misconception (`scenarioB_misconception`)
1. **Learner Action:**
   - *Path B1 (`M1` in MCQ/Predictor):* On `Task 1`, Aarav selects **Option A** (*"Strip A (lemon juice) turns red; Strip B (soap water) turns blue"*).
   - *Path B2 (`M2` in Open Explanation):* On `Task 5 (The Ant Sting Dilemma)`, Aarav writes *"Rub lemon juice on the ant bite because lemon juice is acidic and cancels the sting."*
2. **System Diagnosis & Feedback:**
   - In Path B1, the evaluator diagnoses **`Misconception M1: Indicator Colour-Rule Overgeneralisation`** and explains in a calm coach tone that the Litmus red/blue rule does not apply to turmeric.
   - In Path B2, `evaluateExplanation()` detects the `M2` trigger phrase (*"rub lemon"* / endorsing acid on an acidic sting without baking soda) and diagnoses **`Misconception M2: Neutralisation Direction ('Like Cures Like') Error`**.
3. **Adaptive Routing (`Outcome 2: ALTERNATIVE_EXPLANATION` & `Outcome 3: PREREQUISITE_INSTRUCTION`):**
   - On the 1st misconception response, the P4 Decision Engine fires `Rule 2 -> Outcome 2: ALTERNATIVE_EXPLANATION`, rendering the **Visual Kitchen Analogy & Misconception Contrast Card** (Curry-stain analogy for `M1`; Acid-Base Seesaw analogy for `M2`) and generating a **parallel practice question** (`gen_alt_1`) on a new substance (e.g., *Tamarind Water* or *Lime Water*) to verify that the misconception is resolved.
   - If Aarav misses a second time or clicks **"🛟 I feel stuck — show Prerequisite Micro-Lab"**, the engine fires `Rule 3 -> Outcome 3: PREREQUISITE_INSTRUCTION`, opening the **Guided Prerequisite Micro-Lab** so he can drop the indicator into the beaker hands-on before attempting a foundational stepping-stone question (`gen_prereq_1`).

*(See embedded Scenario A and Scenario B screenshots in the printable PDF report view `report.html`.)*

---

## D6 — AI Functionality Specification

### Feature: P4 Adaptive Question Generator & Free-Text Explanation Evaluator (`src/tutorEngine.js`)

1. **What the AI Feature Does:**
   - Dynamically constructs context-aware assessment tasks across 3 formats (`mcq`, `predictor`, `explanation`) and evaluates open-ended learner explanations based on the learner's diagnostic profile, prior response accuracy, detected misconception (`M1` or `M2`), hint usage, and active P4 Decision Outcome (`HARDER_QUESTION`, `ALTERNATIVE_EXPLANATION`, or `PREREQUISITE_INSTRUCTION`).
2. **Exact Input Prompt & Payload (`buildD6AIPromptSpec` in `src/tutorEngine.js`):**
   - **System Prompt:**
     ```text
     You are an empathetic Class 7-10 Science Adaptive Tutor for 'Acids, Bases and Indicators' (Card: P4, T4, L5, C4).
     Learner persona: Aarav (age 13, repeating the unit after failing once, high test anxiety, 10-minute session).
     Rules:
     1. Never use harsh words ('Failed', 'Wrong'). Use warm, conversational Indian classroom examples (haldi/turmeric, gudhal/china rose, lemon, soap, baking soda, ant bite).
     2. Strictly verify chemical accuracy: Turmeric is YELLOW in acid and REDDISH-BROWN in base; Phenolphthalein is COLOURLESS in acid and PINK in base; China Rose is MAGENTA in acid and GREEN in base.
     3. Output valid JSON matching the schema: { title, format, difficulty, lo, prompt, hints[3], modelAnswer, targetMisconception }.
     ```
   - **User Context JSON Payload:**
     ```json
     {
       "rollNo": "24b3925",
       "learnerProfile": "foundation",
       "sessionElapsedSeconds": 185,
       "lastTaskId": "q1_mcq_turmeric",
       "lastFormat": "mcq",
       "learnerWasCorrect": false,
       "detectedMisconception": "M1",
       "hintsUsed": 1,
       "attemptsOnCurrent": 1,
       "requiredAdaptiveOutcome": "ALTERNATIVE_EXPLANATION",
       "requestedNextDifficulty": 1
     }
     ```
3. **Expected Output Structure:**
   - A structured JSON task object containing `id`, `title`, `lo`, `bloom`, `difficulty`, `format`, `targetMisconception`, `prompt`, format-specific options/rubric, `hints` (array of 3 progressive hints), `modelAnswer`, `altExplanationCard`, and `prerequisiteLabTask`.
4. **Verification & Guardrail Checks Before Learner Sees Output (`validateAIOutput` in `src/tutorEngine.js`):**
   - **Schema Completeness Check:** Verifies non-empty `id`, `prompt`, `modelAnswer`, and exactly 3 progressive hints (`hints.length === 3`).
   - **Chemistry Truth Guardrail:** Verifies that generated answer keys never hallucinate Misconception `M1` (e.g., blocks any item claiming turmeric turns red in acid or phenolphthalein turns pink in acid).
   - **L5 Affective Filter Check:** Regex guardrail (`!/fail|stupid|wrong answer!/i`) blocks punitive phrasing that would heighten anxiety for a repeat learner.
5. **Fallback When AI Fails, Times Out, or Runs Offline:**
   - `generateAdaptiveQuestion()` in `src/tutorEngine.js` includes a synchronous, deterministic **Parameterised Chemistry Template Engine** (`DYNAMIC_GENERATOR_TEMPLATES`) that pairs verified acid/base substances (*Tamarind Water / Tartaric acid*, *Sour Curd / Lactic acid*, *Lime Water / Calcium hydroxide*, *Window Cleaner / Ammonium hydroxide*) with verified indicator rules from `INDICATORS` and `evaluateExplanation()`'s 3-pillar keyword/misconception rubric. This guarantees 100% uptime, zero API latency during a 10-minute session (`C4`), and zero risk of unverified chemical facts.

---

## D7 — Pedagogical Rationale

### 1. How the Design Supports Learning, Feedback & Scaffolding
- **Cognitive Load Reduction (Sweller) + Rubric T6 Problem-Solving Tool:** Repeat learners (`L5`) often freeze because holding 4 indicators × 3 media = 12 colour outcomes in working memory exceeds capacity under test anxiety. Embedding the **Interactive Indicator Dropper & Colour Bench (`T6`)** directly on Screen 2 and inside a collapsible drawer on Screen 3 externalises rote memory into visual manipulation, letting Aarav test liquids drop-by-drop and build mental models through observation.
- **Graduated Scaffolding in the Zone of Proximal Development (Vygotsky):** Every task provides a **3-step Progressive Hint Ladder** (Hint 1: everyday kitchen memory cue $\rightarrow$ Hint 2: chemical rule $\rightarrow$ Hint 3: direct lab test pointer) and a **Sentence Starter scaffold** for open explanations, preventing blank-page paralysis.
- **Conversational Engagement & Visual Highlighting (Mayer & Rubric P5):** Concept cards and prompts use first-person plural conversational phrasing (*"Let us test together..."*) and boxed visual takeaways with real colour swatches alongside text labels.

### 2. Explicit Answer to the P4 Design Challenge
> **Design Challenge:** *How does the tutor decide whether the learner needs a harder question, an alternative explanation or prerequisite instruction? State the decision rule and show each of the three outcomes.*

Implemented in `decideAdaptiveOutcome(state, evalResult, options)` in `src/tutorEngine.js`, the tutor combines **Learner Profile** (Diagnostic check), **Performance** (accuracy + `M1`/`M2` misconception tag), and **Interaction Behaviour** (attempt count, hints used, and low-confidence requests — satisfying all 3 dimensions of Rubric `P13_CP`):
1. **Decision Rule for Outcome 1 (`HARDER_QUESTION`):**
   - **Condition:** `evalResult.isCorrect === true && state.attemptsOnCurrent === 1 && state.hintsUsedOnCurrent === 0`
   - **Action Shown in App:** Increments difficulty (`1 -> 2 -> 3`) and shifts up the Bloom taxonomy across formats (Format 1 `mcq` $\rightarrow$ Format 2 `predictor` $\rightarrow$ Format 3 `explanation`).
2. **Decision Rule for Outcome 2 (`ALTERNATIVE_EXPLANATION`):**
   - **Condition:** `(state.attemptsOnCurrent === 1 && !evalResult.isCorrect) || evalResult.misconceptionTag in ["M1", "M2"] || (evalResult.isCorrect && state.hintsUsedOnCurrent >= 1)`
   - **Action Shown in App:** Keeps difficulty constant, renders an **Alternative Visual Explanation & Misconception Contrast Card** (e.g., comparing Litmus vs Turmeric using a soap-on-curry-stain analogy for `M1`, or the Acid-Base Seesaw analogy for `M2`), and generates a parallel question on a fresh substance to verify transfer.
3. **Decision Rule for Outcome 3 (`PREREQUISITE_INSTRUCTION`):**
   - **Condition:** `(state.attemptsOnCurrent >= 2 && !evalResult.isCorrect) || options.lowConfidenceRequested === true`
   - **Action Shown in App:** Steps difficulty back (`difficulty - 1`), opens the **Guided Prerequisite Micro-Lab** inside the tutor where Aarav clicks a button to drop the exact indicator into the sample beaker and observe the colour transition first-hand, and then serves a foundational stepping-stone question (`gen_prereq_1`).

### 3. How Learner Context (`L5`) and Constraint (`C4`) Shaped the Design
- **`L5` (Anxious Repeat Learner):** Eliminated punitive red error screens, countdown buzzers, and raw fail percentages. Replaced them with a **"🛟 I feel stuck — show Prerequisite Micro-Lab"** self-regulation button, coach-toned diagnostics (*"Pause and take a breath — you just met Trap M1!"*), and visible mastery growth bars.
- **`C4` (10-Minute Sessions with Stop & Resume):** Divided the entire learning arc into a paced **10-minute micro-session** (2 min diagnostic $\rightarrow$ 2 min concept/lab $\rightarrow$ 5 min adaptive tutor $\rightarrow$ 1 min mastery review). Every click serialises `learnerState` to `localStorage["et617_24b3925_state"]`, allowing instant pause and one-click resumption on Screen 1.

---

## D8 — Evaluation Plan

### 1. Assessing Achievement of Each Learning Outcome (D1)
| Learning Outcome | Assessment Tasks & Formats in App | Rubric / Scoring Criterion |
| :--- | :--- | :--- |
| **LO1: Classify** solutions using indicators (Understand) | `q1_mcq_turmeric`, `q2_mcq_phenolphthalein`, and generated `gen_prereq_*` tasks (Format 1: Scenario MCQ + Classification step of Format 2) | **1.0 pt:** Accurately identifies acid/base/neutral nature without triggering `M1`. **0.0 pt:** Selects `M1` distractor. |
| **LO2: Predict** multi-indicator colour changes (Apply) | `q3_predictor_chinahibiscus`, `q4_predictor_magnesia`, and generated `gen_alt_*` tasks (Format 2: Interactive Multi-Indicator Predictor) | **3-part partial credit (`0.0`, `0.33`, `0.67`, `1.0`):** (a) Substance category (`+0.33`), (b) Indicator 1 colour (`+0.33`), (c) Indicator 2 colour (`+0.33`). |
| **LO3: Explain & Diagnose** real-life acid-base mechanisms (Analyse/Evaluate) | `q5_explain_antbite`, `q6_explain_currystain`, and generated `gen_harder_*` tasks (Format 3: Open Explanation Evaluator) | **3-pillar rubric (`0.0` to `1.0`):** (1) Names correct substance (`baking soda` / `soap`), (2) States chemical role (`base` / `indicator`), (3) Explains mechanism (`neutralises formic acid` / `lemon neutralises soap`). Triggers `M2`/`M1` remediation if reversed. |

### 2. Log Data Collected Automatically (`learnerState.history` in `localStorage`)
For every attempt, the app records:
- `timestamp`, `taskId`, `format` (`mcq` | `predictor` | `explanation`), and target `lo` (`LO1` | `LO2` | `LO3`)
- `isCorrect` (boolean) and `misconceptionTag` (`"M1"` | `"M2"` | `null`)
- `hintsUsed` (`0–3`), `attempts` on current item, and `outcomeTriggered` (`HARDER_QUESTION` | `ALTERNATIVE_EXPLANATION` | `PREREQUISITE_INSTRUCTION`)
- `sessionElapsedSeconds` (verifying completion within the `600s` / 10-minute `C4` bound) and pause/resume events.

### 3. Success Criteria (What Counts as Success in a 10-Minute Trial with 20 Class 8 Repeat Learners)
1. **Outcome Mastery:** $\ge 80\%$ of learners reach $\ge 75\%$ mastery across `LO1`, `LO2`, and `LO3` within a single 10-minute session (`sessionElapsedSeconds <= 600`).
2. **Misconception Resolution (`P2`):** Among learners who trigger `M1` or `M2` on their first attempt and receive `ALTERNATIVE_EXPLANATION` or `PREREQUISITE_INSTRUCTION`, $\ge 85\%$ answer the subsequent parallel generated question (`gen_alt_*` / `gen_prereq_*`) correctly on the first try.
3. **Self-Efficacy & Completion (`L5` & `C4`):** $\ge 90\%$ session completion rate (including across pause-and-resume boundaries) and an average post-session confidence shift of $\ge +1$ level on the 3-point confidence check.

---

## AI-Use Log and Reflection

### Chronological AI Usage Log
1. **Session Setup & Environment Check (17:12–17:25 IST):** Used Antigravity AI assistant in VS Code to verify Node.js (`v26.13.1`), npm (`11.20.0`), Git identity (`tanvimundra`), and PowerShell execution policy in `C:\et617_exam`.
2. **Stage 0 & Stage 1 Problem Intake & `DESIGN.md` Generation (18:20–18:26 IST):** Provided the official exam paper and personal card (`Roll No: 24b3925`, `P4`, `P4-T4`, `L5`, `C4`). Reviewed and confirmed the persona (Aarav, Class 8 repeat learner), the two target misconceptions (`M1` Indicator Rule Overgeneralisation and `M2` Neutralisation Direction Error), the three Bloom learning outcomes (`LO1`–`LO3`), and the 3-branch P4 Adaptive Decision Rule. Committed `DESIGN.md` at 18:26 IST (ahead of the 0:30 checkpoint).
3. **Stage 2–5 Application Architecture & Implementation (18:27–18:48 IST):** Confirmed the 5-screen architecture (`index.html`, `styles.css`, `src/content.js`, `src/tutorEngine.js`, `src/app.js`), implemented the T6 Interactive Indicator Dropper Bench, the 3 question formats, the P4 Adaptive Decision Engine, and the C4 10-minute session timer with `localStorage` stop-and-resume. Deployed live on Vercel and GitHub Pages before the 1:00 checkpoint.
4. **Stage 6–7 Report & Viva Preparation (18:58–19:10 IST):** Structured the 8-part deliverable report (`REPORT.md` and printable `report.html`) and viva walkthrough guide (`docs/VIVA.md`).

### Reflection on Human Judgement vs AI Assistance
- **What I Directed & Verified:** I selected the card parameters (`24b3925`, `P4`, `P4-T4`, `L5`, `C4`), chose the two specific NCERT Class 7–10 chemistry misconceptions (`M1` applying Litmus rules to Turmeric/Phenolphthalein, and `M2` applying acidic lemon juice to an acidic ant sting), and specified the 3-branch decision rule so that every adaptive transition is transparent and testable.
- **Why We Used a Dual-Mode Deterministic + AI Guardrail Engine:** For an anxious repeat learner (`L5`) in a strict 10-minute session (`C4`), a hallucinated indicator colour or a 10-second API timeout would undermine both trust and learning. By pairing the D6 structured prompt/validator specification with a verified parameterised chemistry generator in `src/tutorEngine.js`, the tutor achieves 100% chemical accuracy and instant responsiveness while demonstrating full adaptive routing across all three outcomes.
