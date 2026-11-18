# DESIGN.md — Adaptive Acid-Base & Indicator Coach (`et617-endsem-24b3925`)

## Identity Card
| Field | Code | Selection |
| :--- | :--- | :--- |
| **Roll Number (Identity Token)** | `24b3925` | `24b3925` (`24B3925`) |
| **Problem Statement (P)** | `P4` | Adaptive tutor with automatic question generation |
| **Topic (T)** | `P4-T4` | Acids, bases and indicators (Class 7–10) |
| **Learner Context (L)** | `L5` | Learner repeating the topic after failing it once, high anxiety and low self-efficacy |
| **Design Constraint (C)** | `C4` | 10-minute sessions — One complete learning sequence fits in 10 minutes; the learner can stop and resume where they left off |
| **GitHub Repository** | — | `https://github.com/tanvimundra/et617-endsem-24b3925` |

---

## D1. Educational Problem, Learning Outcomes & Context of Use

### Educational Problem (4 Sentences)
Middle-school students learning **Acids, Bases, and Indicators (Class 7–10)** frequently resort to rote memorisation of indicator colour-change tables without connecting them to chemical behaviour or everyday substances. For a repeat learner who has already failed the unit once (**L5**), a single forgotten colour rule triggers test anxiety, cognitive overload, and avoidance ("I just can't remember which indicator turns red or pink"). Standard static quizzes worsen this anxiety by marking answers "Wrong" without diagnosing *which* misconception caused the error or adjusting the difficulty. **AcidBase Coach** solves this through an **Adaptive Tutor (P4)** structured into calm, resumable **10-minute micro-sessions (C4)** that diagnoses specific misconceptions across multiple question formats and dynamically routes the learner to prerequisite lab exploration, everyday visual analogies, or harder application challenges.

### Three Measurable Learning Outcomes (Bloom's Taxonomy)
1. **LO1 — Classify (Understand):** Given indicator test observations (Litmus, Turmeric, China Rose, or Phenolphthalein), the learner will accurately **classify** everyday household and lab solutions as acidic, basic, or neutral.
2. **LO2 — Predict (Apply):** Given an untested everyday substance (e.g., lemon juice, soap solution, baking soda, vinegar) and a chosen indicator, the learner will **predict** the exact colour change using the interactive indicator reference bench.
3. **LO3 — Explain & Justify (Analyse / Evaluate):** Given a real-world chemical scenario (such as a curry stain turning reddish-brown with soap or relieving an acidic ant bite), the learner will **explain** the underlying acid-base indicator or neutralisation mechanism in their own words and **diagnose** why common misconceptions fail.

### Context of Use
- **Where & When:** At home in the evening during short, focused **10-minute study blocks (C4)** before a school re-test.
- **Device:** Personal or shared Android smartphone (360 px mobile-first viewport) or laptop browser, with automatic local state persistence (`localStorage`) so the learner can pause at any second and resume seamlessly.

---

## D2. Learner Persona (`L5` Seed Expanded)

- **Name & Age:** **Aarav**, 13 years old, Class 8 student.
- **Academic Background & Context (`L5`):** Aarav scored 4/15 on his first school Science unit test on *Acids, Bases and Salts* and has to take a re-test this week. He experiences high test anxiety when he sees dense chemical tables or timed countdowns that penalise mistakes, and his self-efficacy in Chemistry is currently very low.
- **Prior Knowledge of Prerequisites:**
  - Knows familiar kitchen examples by taste/touch (lemon and curd are sour; soap is slippery).
  - Understands the basic idea that "indicators change colour to test substances," and remembers that **blue litmus turns red in acid**, but confuses all other indicators.
- **Two Specific Target Misconceptions (`M1` and `M2`):**
  - **Misconception 1 (`M1` — Indicator Rule Overgeneralisation):** Aarav assumes *every* indicator follows the Litmus rule ("Acid = Red/Pink, Base = Blue/Yellow"). Specifically, he thinks **Turmeric turns red in acids** (when in reality turmeric stays yellow in acids and turns **reddish-brown in bases** like soap) and thinks **Phenolphthalein turns pink in acids** (when it is colourless in acids and turns **pink in bases**).
  - **Misconception 2 (`M2` — Neutralisation Direction / "Like Cures Like" Error):** When solving real-world neutralisation problems (e.g., an acidic ant sting with formic acid, or stomach acidity), Aarav assumes applying another strong household acid like lemon juice or vinegar will "wash away or cancel" the burn, rather than using a **mild base** (baking soda / calamine / milk of magnesia) to neutralise the acid into salt and water.
- **Device, Time & Language:** Uses a family Android phone or laptop at home in **10-minute blocks (`C4`)**; reads clear, conversational Indian English with familiar household examples (*haldi/turmeric*, *gudhal/china rose*, lemon, soap, baking soda).
- **Motivation Driver:** Responds strongly to **safe-to-try experimentation**, **immediate non-judgmental coaching**, and visible micro-progress (mastering 1 indicator at a time with the option to pause and resume without losing work).

---

## Pedagogical Theories & Design Principles

| Theory | What it predicts for Aarav (`L5`) | Design Principle ("We will ___ because ___") |
| :--- | :--- | :--- |
| **Cognitive Load Theory (Sweller)** | Memorising 4 indicators × 3 media = 12 colour transitions at once overwhelms working memory, especially under anxiety. | **DP1:** We will provide an always-accessible **Interactive Indicator Dropper & Colour Strip Tool (`T6`)** and limit each screen to one task because offloading rote lookup reduces extraneous cognitive load for an anxious learner. |
| **Vygotsky's ZPD & Scaffolding** | Jumping straight to open-ended explanations causes freeze-up; unassisted failure lowers self-efficacy further. | **DP2:** We will provide a **3-step progressive Hint Ladder** and a **3-branch Adaptive Decision Engine** because graduated scaffolding keeps tasks inside Aarav's Zone of Proximal Development. |
| **Self-Efficacy Theory (Bandura) & Affective Filter** | Harsh error messages or losing progress when interrupted triggers avoidance in repeat learners (`L5`). | **DP3:** We will use **coach-like, misconception-aware feedback** ("Let's check what haldi does with soap...") and **10-minute pause-and-resume checkpoints (`C4`)** because mastery experiences in short, controllable sessions rebuild self-efficacy. |
| **Retrieval Practice & Elaborative Interrogation** | Passive reading of notes creates an illusion of competence; explaining *why* locks encoding into long-term memory. | **DP4:** We will move learners across **3 question formats** (Scenario MCQ -> Interactive Indicator Prediction/Classification -> Short Explanation Evaluation) because varied retrieval and self-explanation deepen conceptual encoding. |

---

## P4 Design Challenge — Adaptive Decision Rule (3 Outcomes)

The tutor evaluates every learner response using **three signals** (satisfying Rubric `P13_CP` across Profile, Performance, and Interaction):
1. **Diagnostic Profile (`profileLevel`):** Set by a 2-question warm-up check at the start of the session (`foundation` vs `standard`).
2. **Performance & Misconception Diagnosis (`isCorrect`, `misconceptionTag`):** Checks whether the learner answered correctly or triggered `M1` (Indicator Overgeneralisation) or `M2` (Neutralisation Direction Error).
3. **Interaction Behaviour (`attempts`, `hintsUsed`, `confidence`):** Tracks number of attempts on the current concept, hints opened, and whether the learner clicked *"I'm not sure / Need basics"*.

### Explicit Decision Rule
```text
IF (isCorrect == true AND attempts == 1 AND hintsUsed == 0):
    OUTCOME = "HARDER_QUESTION" (Advance difficulty & shift format: Format 1 MCQ -> Format 2 Interactive Prediction -> Format 3 Explain-Why)

ELSE IF (attempts == 1 AND isCorrect == false) OR (misconceptionTag in ["M1", "M2"]) OR (isCorrect == true AND hintsUsed >= 1):
    OUTCOME = "ALTERNATIVE_EXPLANATION" (Hold difficulty; show a targeted Visual Everyday Analogy + Misconception Contrast Card for M1/M2, then generate a parallel question on the same concept)

ELSE IF (attempts >= 2 AND isCorrect == false) OR (learnerClickedLowConfidence == true):
    OUTCOME = "PREREQUISITE_INSTRUCTION" (Step back to a guided Prerequisite Micro-Lab where the learner tests the indicator drop-by-drop on known acid/base samples before attempting a foundational check)
```

---

## D3. Educational Content Plan (Concept + 3 Formats + Model Feedback)

### Core Concept Summary (Conversational + Visual Cues)
- **Acids** taste sour and release $\text{H}^+$ ions in water (e.g., lemon juice, vinegar, curd, ant sting formic acid).
- **Bases** feel soapy/bitter and release $\text{OH}^-$ ions in water (e.g., soap water, baking soda solution, lime water, milk of magnesia).
- **Indicators** are special dyes that change colour differently in acids vs bases:
  1. **Litmus (Lichen):** Acid $\rightarrow$ **Red** | Base $\rightarrow$ **Blue** | Neutral $\rightarrow$ **Purple**
  2. **Turmeric (*Haldi*):** Acid/Neutral $\rightarrow$ **Stays Yellow** | Base $\rightarrow$ **Reddish-Brown**
  3. **China Rose (*Gudhal*):** Acid $\rightarrow$ **Dark Pink (Magenta)** | Base $\rightarrow$ **Green**
  4. **Phenolphthalein:** Acid/Neutral $\rightarrow$ **Colourless** | Base $\rightarrow$ **Pink**
- **Neutralisation:** $\text{Acid} + \text{Base} \rightarrow \text{Salt} + \text{Water} + \text{Heat}$. To calm an acidic problem, we add a mild base (and vice versa).

### Planned Question Bank & Adaptive Generator Templates (3 Formats, >=6 Tasks)
1. **Task 1 [Format 1 — Diagnostic Scenario MCQ | LO1 | Targets `M1`]:**
   - *Prompt:* Aarav drops **turmeric paste** onto a stain of **lemon juice** (an acid) and then washes a second turmeric spot with **soap water** (a base). What colours will he observe?
   - *Model Answer:* Yellow in lemon juice (acid); Reddish-brown in soap water (base).
   - *M1 Distractor:* "Red in lemon juice and yellow/blue in soap water."
   - *Feedback for M1:* "Careful! You applied the Litmus rule ('acid = red') to turmeric. Unlike litmus, *haldi* stays **yellow** in acids like lemon juice and turns **reddish-brown only in bases** like soap!"
2. **Task 2 [Format 1 — Scenario MCQ | LO1 | Targets `M1`]:**
   - *Prompt:* A colourless liquid in Beaker X turns **phenolphthalein bright pink**. When tested with **red litmus paper**, what will happen?
   - *Model Answer:* Red litmus turns blue (because phenolphthalein turns pink only in a base).
   - *M1 Distractor:* "Blue litmus turns red because pink/red means acid."
3. **Task 3 [Format 2 — Interactive Multi-Indicator Prediction Matrix | LO2 | Targets `M1`]:**
   - *Prompt:* Select the exact colour changes when **China Rose (Gudhal)** indicator and **Turmeric** are added to **Vinegar** vs **Baking Soda Solution** using the interactive colour selector.
   - *Model Answer:* Vinegar (Acid) $\rightarrow$ China Rose turns **Dark Pink (Magenta)**, Turmeric stays **Yellow**. Baking Soda (Base) $\rightarrow$ China Rose turns **Green**, Turmeric turns **Reddish-Brown**.
4. **Task 4 [Format 2 — Mystery Bottle Lab Classification | LO1 & LO2]:**
   - *Prompt:* Use the built-in **Indicator Dropper Tool** to test Mystery Bottle B (stays yellow with turmeric, turns China Rose magenta, stays colourless in phenolphthalein) and classify both its chemical nature and a matching household example.
5. **Task 5 [Format 3 — Short Explanation Evaluator | LO3 | Targets `M2`]:**
   - *Prompt:* An ant bites your hand and injects **formic acid**, causing a burning sensation. Your friend suggests rubbing **lemon juice** on it, while your grandmother suggests rubbing moist **baking soda**. Which remedy works and *why* (in 1–2 sentences)?
   - *Evaluation Rubric (Keyword + Semantic Concept Matcher + AI/Rule Evaluator):* Checks for (1) choosing **baking soda**, (2) identifying baking soda as a **base** (and ant bite/lemon juice as **acid**), and (3) explaining **neutralisation** (base cancels acid to form harmless salt/water).
   - *Feedback for M2:* "Hold on! Both ant sting (formic acid) and lemon juice (citric acid) are **acids**. Adding acid to acid increases irritation! You need a **mild base** like **baking soda** to **neutralise** the formic acid."
6. **Task 6 [Format 3 — Harder Synthesis / Explanation Challenge | LO2 & LO3 | Targets `M1` + `M2`]:**
   - *Prompt:* A white shirt has a yellow curry (*turmeric*) stain. Explain why the stain turns **reddish-brown** when rubbed with soap, and why squeezing **lemon juice** over that reddish-brown spot turns it **yellow** again.
   - *Model Answer:* Soap is basic, which turns the turmeric indicator reddish-brown. Lemon juice is acidic, which neutralises the base on the cloth and restores turmeric's yellow colour in neutral/acidic media.
7. **Dynamic Template Generator:** Can generate fresh parameterised variants on demand (swapping substances across `{Lemon Juice, Vinegar, Curd, Tamarind, HCl}` $\times$ `{Soap Water, Baking Soda, Milk of Magnesia, Lime Water, Window Cleaner}` $\times$ `{Litmus, Turmeric, China Rose, Phenolphthalein}`) tailored to whichever misconception (`M1` or `M2`) or outcome branch (`HARDER_QUESTION`, `ALTERNATIVE_EXPLANATION`, `PREREQUISITE_INSTRUCTION`) is active.
