# AcidBase Coach — Adaptive Tutor (`et617-endsem-24b3925`)

**ET 617 End-Semester Examination (IIT Bombay)**

## Official Exam Card Disclosure
| Card Field | Code | Selection |
| :--- | :--- | :--- |
| **ID — Identity Token (Roll No.)** | `24b3925` | `24b3925` (`24B3925`) |
| **P — Problem Statement** | `P4` | Adaptive tutor with automatic question generation |
| **T — Topic** | `P4-T4` | Acids, bases and indicators (Class 7–10) |
| **L — Learner Context** | `L5` | Learner repeating the topic after failing it once, high anxiety and low self-efficacy |
| **C — Design Constraint** | `C4` | 10-minute sessions — One complete learning sequence fits in 10 minutes; stop and resume where left off |

---

## Features & Pedagogical Highlights
1. **5 Connected Screens (`D4`):**
   - **Screen 1 (`Welcome & Resume`):** C4 Stop-and-Resume banner (`localStorage`), 10-minute pacing guide, and 2-part Diagnostic Profile & Self-Efficacy Confidence Check (`P13_CP`).
   - **Screen 2 (`Concept & Dropper Lab`):** 3 conversational concept cards (`P5`) + interactive **Indicator Dropper & Colour Reference Bench (`T6` Problem-Solving Tool)** testing Litmus, Turmeric, China Rose, and Phenolphthalein across 8 household/lab liquids.
   - **Screen 3 (`Adaptive Tutor Workspace`):** Supports **3 question formats** (Scenario MCQ, Interactive Multi-Indicator Colour Predictor, Short Open-Text Explanation Evaluator), a **3-step Progressive Hint Ladder**, a **"Low Confidence / Show Prerequisite Micro-Lab"** button (`L5`), and the **P4 3-Outcome Adaptive Decision Engine**:
     - **Outcome 1 (`HARDER_QUESTION`):** Triggered on 1st-try correct with 0 hints $\rightarrow$ advances difficulty and Bloom format.
     - **Outcome 2 (`ALTERNATIVE_EXPLANATION`):** Triggered on 1st wrong try, hint usage, or Misconception `M1`/`M2` detection $\rightarrow$ displays an everyday kitchen visual analogy + misconception contrast card and generates a parallel question.
     - **Outcome 3 (`PREREQUISITE_INSTRUCTION`):** Triggered on 2+ wrong tries or low-confidence request $\rightarrow$ steps back to a guided hands-on Prerequisite Micro-Lab before retrying.
   - **Screen 4 (`Progress & D5 Scenarios`):** Mastery bars for LO1, LO2, LO3, misconception resolution counter (`M1` & `M2`), full interaction log (`D8`), and 1-click **D5 Contrasting Scenario Runners** (Scenario A: Correct Path vs Scenario B: Misconception Path).
   - **Screen 5 (`About & Card 24b3925`):** Official Exam Card, persistent identity token (`24b3925`), and live **D6 AI Prompt, Output Validator & Fallback Inspector**.

## How to Run Locally or Deploy
- **Zero-build static ES modules:** Open `index.html` via any static server (e.g. `npx serve .` or `python -m http.server 8080`) or deploy the root directory directly to **Render Static Sites** / **Vercel** / **GitHub Pages**.
