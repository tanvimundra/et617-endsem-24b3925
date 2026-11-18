# Specification — Part 1 (Stage 1: Learner & Pedagogy)

**Recorded:** 18:25 IST (18 Nov 2026)
**Card:** `24b3925` | `P4` Adaptive Tutor | `P4-T4` Acids, bases & indicators (Cl. 7–10) | `L5` Anxious repeat learner | `C4` 10-minute sessions

## 1. Learner Persona (`L5`)
- **Name / Age:** Aarav, 13 years old (Class 8).
- **Context:** Failed his first school unit test on Acids, Bases & Indicators; studies at home in the evening in short **10-minute blocks (`C4`)** on a shared Android phone or laptop.
- **Goal:** Understand indicator colour changes and neutralisation well enough to pass his re-test without panicking.
- **Barrier / Frustration:** High anxiety and low self-efficacy; confuses the colour rules across Litmus, Turmeric, China Rose, and Phenolphthalein.
- **Misconceptions:**
  - **M1 (Indicator Overgeneralisation):** Believes all indicators turn red/pink in acids and blue/yellow in bases (confuses Turmeric and Phenolphthalein).
  - **M2 (Neutralisation Direction Error):** Believes an acidic sting/indigestion can be treated with another acid (lemon/vinegar) instead of a mild base (baking soda/antacid).
- **Motivation Driver:** Non-judgmental coaching, visual interactive testing before guessing, and visible progress within a 10-minute session that saves automatically.

## 2. Learning Objectives (Bloom's Taxonomy)
- **LO1 (Understand — Classify):** Classify household and lab solutions as acidic, basic, or neutral from indicator observations.
- **LO2 (Apply — Predict):** Predict the colour change of Litmus, Turmeric, China Rose, and Phenolphthalein in unseen solutions.
- **LO3 (Analyse/Evaluate — Explain):** Explain why a real-life indicator change or neutralisation remedy works and why common misconceptions fail.

## 3. Theories Used
1. **Cognitive Load Theory (Sweller):** Offload 4-indicator memorisation via an interactive Indicator Dropper & Colour Strip tool (`T6`) and chunk sessions into 10-minute steps (`C4`).
2. **Scaffolding & ZPD (Vygotsky):** 3-step Hint Ladder + 3-branch Adaptive Decision Engine (`HARDER_QUESTION`, `ALTERNATIVE_EXPLANATION`, `PREREQUISITE_INSTRUCTION`).
3. **Self-Efficacy (Bandura) & Affective Filter:** Warm coach-like feedback that normalises mistakes as learning signals and lets Aarav pause/resume anytime (`C4`).
4. **Retrieval Practice & Elaborative Interrogation:** Multi-format practice (MCQ -> Interactive Prediction -> Short Explanation).

## 4. Design Principles
1. **DP1 (Cognitive Load + T6 Tool):** We will embed an interactive Indicator Dropper & Colour Reference Bench alongside concept cards because anxious learners need to see and test colour transitions rather than memorise abstract tables.
2. **DP2 (ZPD + P4 Decision Rule):** We will route every response to either a **Harder Question**, an **Alternative Visual Explanation**, or **Prerequisite Micro-Lab Instruction** based on accuracy, misconceptions (`M1`/`M2`), and hint usage because adaptive scaffolding prevents both boredom and helplessness.
3. **DP3 (Misconception Resolution — P2):** We will diagnose `M1` and `M2` explicitly in both structured choices and free-text explanations and show side-by-side misconception contrasts because learners must see *why* their intuitive rule failed.
4. **DP4 (Self-Efficacy + L5):** We will use a calm, coach-like tone, allow retries after hints, and provide a "Low Confidence / Show Prerequisite" button because reducing fear of failure keeps an anxious repeat learner engaged.
5. **DP5 (10-Minute Pacing & Resume — C4):** We will structure the complete learning journey into a 10-minute paced sequence with instant `localStorage` auto-save and a "Pause & Resume Later" control because bounded sessions fit Aarav's attention and lower overwhelm.

## 5. Evaluation of Learning
- **In-app tracking:** Diagnostic baseline (2 items) -> per-item attempt count, hints used, misconception tags triggered (`M1`/`M2`), adaptive route taken, and explanation rubric score -> Mastery progress across LO1, LO2, LO3.
