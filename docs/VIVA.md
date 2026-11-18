# Viva & Live Change Request Guide (`docs/VIVA.md`)

**Roll No. / Identity Token:** `24b3925` (`24B3925`)
**Card:** `P4` Adaptive Tutor · `P4-T4` Acids, bases & indicators (Cl. 7–10) · `L5` Anxious repeat learner · `C4` 10-minute sessions

---

## 1. Your 5-Line Viva Walkthrough Script (60 Seconds)
1. **Persona & Problem (`L5` + `P4-T4`):** "I built **AcidBase Coach** for **Aarav**, a 13-year-old Class 8 repeat learner (`L5`) who failed his first unit test on Acids, Bases & Indicators because he panics trying to memorise 12 indicator colour rules."
2. **Two Misconceptions (`D2`):** "The tutor specifically targets two misconceptions: **`M1` (Indicator Overgeneralisation)** — thinking Turmeric turns red in acid or Phenolphthalein turns pink in acid like Litmus — and **`M2` (Neutralisation Direction Error)** — thinking you treat an acidic ant bite with acidic lemon juice instead of basic baking soda."
3. **C4 Constraint & T6 Tool:** "To fit `C4`, the entire flow is paced for **10 minutes** with a live timer, `Pause & Save`, and automatic `localStorage` resumption (`et617_24b3925_state`). To reduce cognitive load, Screen 2 and Screen 3 embed an **Interactive Indicator Dropper Tool (`T6`)** where Aarav can test 8 liquids with 4 indicators."
4. **P4 Adaptive Tutor & 3 Formats:** "Screen 3 supports **3 question formats** — Scenario MCQ, Interactive Multi-Indicator Colour Predictor, and a Short Open-Text Explanation Evaluator."
5. **P4 Design Challenge (3 Outcomes):** "After every answer, `decideAdaptiveOutcome()` in `src/tutorEngine.js` routes Aarav to **Outcome 1: Harder Question** (1st-try correct, 0 hints), **Outcome 2: Alternative Visual Explanation + Parallel Generated Task** (1st wrong try or `M1`/`M2` detected), or **Outcome 3: Prerequisite Micro-Lab Instruction** (2+ wrong tries or clicking 'I feel stuck')."

---

## 2. How to Demo the Contrasting Paths Live in 15 Seconds (Part 1 of Viva)
- Go to **Screen 3 (`3. Adaptive Tutor (P4)`)** (or use the bottom bar on Screen 1 / Screen 3):
  1. **Show Correct Path (Scenario A):** Click the green button **`Scenario A: 1st-Try Correct → Outcome 1 (Harder Question)`**. Point to the green feedback panel and the **P4 Decision Rule Banner** showing `Rule 1 -> Outcome 1: Advance to Harder Question & Higher Format`.
  2. **Show Misconception Path (Scenario B):** Click the amber button **`Scenario B: Misconception M1 → Outcome 2 (Alternative Explanation)`**. Point to the red pill `Diagnosed Misconception M1`, the **Curry-Stain Visual Analogy Card**, and click **`🔄 Generate Parallel Practice Task`** to show a dynamically generated question (`gen_alt_1`).
  3. **Show Outcome 3 (Prerequisite Micro-Lab):** Click **`🛟 I feel stuck — show Prerequisite Micro-Lab (Outcome 3)`** to show `Rule 3 -> Outcome 3: Prerequisite Micro-Lab Instruction` where Aarav drops Turmeric into Soap Water hands-on!

---

## 3. "Where to Change What" — Live Change Request Cheat-Sheet (Part 2 of Viva)

> **IMPORTANT RULE FROM EXAM SHEET (Section 7):**
> *"Submitted app and repo frozen; viva changes go on a separate `viva` branch"*
> Before making any code edit during the 8:00–9:00 PM viva, run:
> `git checkout -b viva`

| Likely Live Change Request from Examiner | Exact File & Line / Function | How to Make the Change in 20 Seconds |
| :--- | :--- | :--- |
| **1. "Change the C4 session timer from 10 minutes to 5 minutes (or 15 minutes)"** | `src/app.js` line 23 (`SESSION_LIMIT_SECONDS = 600`) | Change `600` to `300` (for 5 mins) or `900` (for 15 mins) and update `/ 10:00` label in `updateHeaderTimerOnly()`. |
| **2. "Change the P4 Decision Rule so Prerequisite Instruction triggers after 1 wrong attempt (or 3 wrong attempts) instead of 2"** | `src/tutorEngine.js` inside `decideAdaptiveOutcome()` (`!evalResult.isCorrect && attempts >= 2`) | Change `attempts >= 2` to `attempts >= 1` (or `attempts >= 3`). |
| **3. "Change the P4 Decision Rule so using 1 hint still allows advancing to a Harder Question"** | `src/tutorEngine.js` inside `decideAdaptiveOutcome()` (`evalResult.isCorrect && attempts === 1 && hintsUsed === 0`) | Change `hintsUsed === 0` to `hintsUsed <= 1`. |
| **4. "Add a new everyday substance (e.g., Orange Juice or Toothpaste) to the Indicator Dropper Lab Tool"** | `src/content.js` inside `SUBSTANCES` array | Add `{ id: "toothpaste", name: "Toothpaste Solution", category: "base", chemicalName: "Calcium carbonate / mild base", everydayContext: "Cleans acidic plaque on teeth", whyNote: "Basic paste that neutralises mouth acids." }`. |
| **5. "Add a 3rd misconception (M3) or change feedback text"** | `src/content.js` inside `MISCONCEPTIONS` & `QUESTION_BANK` | Edit `MISCONCEPTIONS` object or any question's `feedback` / `misconceptionFeedback` string. |
| **6. "Show where learner explanations are evaluated"** | `src/tutorEngine.js` function `evaluateExplanation(task, rawText)` | Open `src/tutorEngine.js` around line 102 — show how it checks `misconceptionM2Triggers` first and then grades the 3 conceptual pillars (`requiredChoiceKeywords`, `requiredConceptKeywords`, `requiredMechanismKeywords`). |

---

## 4. Likely Examiner "Why" Questions & 2-Line Answers (Part 3 of Viva)

1. **Q: "Why did you include an Interactive Indicator Dropper Tool inside an Adaptive Tutor (P4)?"**
   - **A:** "Our learner Aarav (`L5`) has high test anxiety from failing the unit once and freezes when trying to recall 12 indicator colour rules from memory. By embedding the Dropper Tool (`T6`), we apply **Cognitive Load Theory** — offloading rote lookup so he can test substances visually and focus his working memory on understanding *why* the colour changes."
2. **Q: "How does your app satisfy the C4 10-minute session constraint beyond just showing a timer?"**
   - **A:** "First, the pedagogical sequence is chunked into 4 micro-steps totaling 10 minutes (2-min warm-up, 2-min concept/dropper, 5-min adaptive practice, 1-min summary). Second, every single click serialises `learnerState` to `localStorage['et617_24b3925_state']`, so clicking Pause or closing the tab lets Aarav resume at the exact question, attempt count, and timer second."
3. **Q: "What happens if an AI API call fails or hallucinates a wrong indicator colour?"**
   - **A:** "In `src/tutorEngine.js`, `validateAIOutput()` checks both the JSON schema and chemical truth (blocking any claim that turmeric turns red in acid), and our fallback engine `generateAdaptiveQuestion()` synchronously generates verified tasks from `DYNAMIC_GENERATOR_TEMPLATES` so the learner never experiences broken or inaccurate content."
