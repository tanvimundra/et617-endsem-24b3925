# ET 617 End-Semester Exam — Problem Statement & Intake (Stage 0)

**Time recorded:** 18:20 IST (18 Nov 2026)

## Exam Card & Identity
- **Identity Token (Roll No.):** `24b3925` (`24B3925`)
- **GitHub Repository:** `https://github.com/tanvimundra/et617-endsem-24b3925`
- **Problem (P4):** Adaptive tutor with automatic question generation (*Adaptive learning · Assessment · Generative AI*)
- **Topic (P4-T4):** Acids, bases and indicators (Class 7–10)
- **Learner Context (L5):** Learner repeating the topic after failing it once, high anxiety and low self-efficacy
- **Design Constraint (C4):** 10-minute sessions — One complete learning sequence fits in 10 minutes; the learner can stop and resume where they left off

---

## Verbatim Problem Statement (Card Combination)

### P4 – Adaptive tutor with automatic question generation
> Design a tutor for your card's topic that generates questions based on the learner's performance, misconceptions and previous responses. It must go beyond multiple-choice: support at least three question formats, evaluate learner explanations, diagnose misconceptions and adjust the difficulty or nature of the next task.
> **Design challenge:** How does the tutor decide whether the learner needs a harder question, an alternative explanation or prerequisite instruction? State the decision rule and show each of the three outcomes.

### Topic (P4-T4)
> Acids, bases and indicators (Cl. 7–10)

### Learner Context (L5)
> Learner repeating the topic after failing it once, high anxiety and low self-efficacy

### Design Constraint (C4)
> **10-minute sessions:** One complete learning sequence fits in 10 minutes; the learner can stop and resume where they left off

---

## Extracted Breakdown (Stage 0)

### 1. Explicit Requirements (Must-Haves from Exam Sheet)
1. **Identity rules:**
   - Show identity token (`24b3925` / `24B3925`) in the **footer of every screen** and on an **About screen**.
   - GitHub repo named `et617-endsem-24b3925` created after exam start.
   - Commit `DESIGN.md` (problem, outcomes, persona, content plan) by 0:30, and commit at least every 30 minutes.
   - Deployed to a live public URL (`et617-24b3925.vercel.app` or equivalent Render URL).
2. **P4 Adaptive Tutor Requirements:**
   - Generates/selects questions based on learner's **performance, misconceptions, and previous responses**.
   - Supports **at least 3 question formats** (going beyond MCQ — e.g. MCQ, Predict/Interactive Indicator Test or Classification, and Short Open Explanation).
   - **Evaluates learner explanations** and **diagnoses misconceptions** (specifically the 2 misconceptions from D2).
   - **Adjusts difficulty or nature of the next task** dynamically.
   - Explicitly demonstrates the **Design Challenge decision rule** with all **3 outcomes visible/triggerable**:
     1. **Harder question** (advance difficulty / Bloom level)
     2. **Alternative explanation** (same concept taught via visual/everyday analogy + targeted misconception remediation)
     3. **Prerequisite instruction** (step back to foundational concept before retrying)
3. **C4 Constraint (10-minute sessions):**
   - Complete learning sequence fits in **10 minutes** (visible session timer / pacing indicator).
   - **Stop and resume where they left off** (`localStorage` persistence of exact step, question history, timer, and adaptive state, with explicit "Pause & Save" / "Resume Session" controls).
4. **D3 / D4 / D5 Application & Content Deliverables:**
   - Concept explanation + **at least 5 tasks/questions** in at least 3 formats (satisfies both P4 >=3 formats and D3 >=2 formats).
   - **At least 5 connected screens or states** (e.g., 1. Welcome/Resume + Diagnostic Check, 2. Concept & Interactive Indicator Lab Bench, 3. Adaptive Tutor Practice, 4. Session Summary & Mastery Map, 5. About / Identity & Decision-Rule Inspector).
   - **Two contrasting learner scenarios (D5):** (a) Correct path -> advances to harder question; (b) Misconception path -> diagnoses misconception and triggers alternative explanation / prerequisite instruction.
5. **Rubric Alignment (Section 9 Criteria):**
   - **C3 Language comprehensibility:** Conversational, reassuring, simple sentences suited to an anxious Class 7–10 repeat learner.
   - **P2 Addressing alternate conceptions:** Let learner discover and resolve 2 specific acid-base/indicator misconceptions.
   - **P5 Cognitive engagement:** Conversational ("Let's test this together..."), visual cues/highlights (color swatches, boxed key ideas).
   - **P13_CP Adaptivity (at least 2 of 3, we will hit all 3):** (1) Initial diagnostic profile check, (2) Performance-based adaptation (wrong answers / misconception choice), (3) Interaction-based adaptation (hints requested, time/attempts).
   - **T6 Topic-specific problem-solving tool:** Interactive **Indicator Dropper & pH Colour Strip Reference Tool** built into the tutor so learners can test substances while solving problems.

### 2. Constraints
- **Learner (L5):** Class 8/9 repeat learner, high test anxiety, low self-efficacy ("I always mix up colour changes"). Needs non-punitive feedback, zero harsh red "FAILED" screens, small wins.
- **Session length (C4):** Strictly bounded 10-minute micro-session with instant pause/resume.
- **Time window:** 18:20–20:00 IST (100 minutes remaining until submission).

### 3. Ambiguities (To confirm in Stage 0 Gate)
1. Target grade focus within Cl. 7–10 (Class 7–8 natural/synthetic indicators: litmus, turmeric, china rose, phenolphthalein + neutralisation vs Class 10 pH scale/strong-weak acids).
2. The 2 primary misconceptions to target in D2/D3/D5.
3. AI question generation mode: live LLM endpoint with deterministic rule-based adaptive generator fallback (or client-side template/rule-based adaptive generator + optional API hook documented in D6).

---

## Traceability Matrix (Requirement -> Feature -> Screen)
| ID | Requirement | Feature (to be finalised in Stage 2) | Screen |
| :--- | :--- | :--- | :--- |
| R1 | Identity token `24b3925` in footer + About screen | Persistent footer badge + dedicated About screen | All screens + Screen 5 (`About`) |
| R2 | P4: >=3 question formats + explanation evaluation | (1) Scenario MCQ, (2) Interactive Indicator Prediction/Classification, (3) "Explain Why" short text evaluator | Screen 3 (`Adaptive Tutor`) |
| R3 | P4 Design Challenge: 3 adaptive routing outcomes | Explicit Adaptive Engine (`advance`, `alt_explanation`, `prerequisite`) + visible rule banner | Screen 3 (`Adaptive Tutor`) |
| R4 | P4-T4: Acids, bases & indicators + T6 problem-solving tool | Interactive Indicator Tester & Colour Reference Strip (Litmus, Turmeric, China Rose, Phenolphthalein) | Screen 2 (`Concept & Tool`) & Screen 3 |
| R5 | L5: Anxious repeat learner support | Calm coach tone, Hint Ladder, confidence check, "Safe to try" framing | All screens |
| R6 | C4: 10-minute session + stop & resume | 10-min visual pacing bar + Pause/Resume state in `localStorage` | Header + Screen 1 (`Welcome/Resume`) |
| R7 | P13_CP: Profile + Performance + Interaction adaptivity | 2-item Diagnostic warm-up + answer/misconception tracking + hint-count/attempt tracking | Screen 1, Screen 3, Screen 4 |
| R8 | D5: Two contrasting learner scenarios | One-click Demo Scenario Presets / Walkthrough helper + manual play | Screen 3 & Screen 4 |
