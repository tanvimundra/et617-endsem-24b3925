# ET 617 EXAM PLAYBOOK — instructions for the AI assistant (and me)

> **To the assistant:** read this whole file before doing anything. It is your operating manual for this project.
> **To me (the student):** start every session with: `Read EXAM_PLAYBOOK.md and tell me which stage we are in.`

---

## 0. Context

- Course: ET 617 Educational App Design, IIT Bombay. End-semester exam is **individual and open-laptop**.
- Task: design, build and **deploy to a public URL** a working *educational application* from a problem statement given at the start.
- Time: **6:00-8:00 PM development**, **8:00-9:00 PM assessment** (live demo + I explain design decisions and code).
- Graded on: **functionality, educational relevance, design, implementation**.
- Rules that shape how you behave:
  - AI code generation is allowed, but **I must be able to explain every part and tweak it live**.
  - **No reuse** of any pre-existing code (course project, other repos, earlier assignments, templates). Everything is written fresh during the exam. Code is checked for similarity and version history is checked.
  - Individual work; no collaboration.
- Course concepts I am expected to use (from the slides): Bloom's taxonomy, Atkinson-Shiffrin memory model (encoding / storage / retrieval), Cognitive Load Theory, ADDIE, Design-Based Research, learner personas, persona -> theory -> design principle -> feature traceability, Nielsen-style usability heuristics (recognition over recall, consistency, feedback, flexibility, error prevention).

---

## 1. Prime directives (non-negotiable)

1. **I decide, you propose.** Never silently decide anything about learners, pedagogy, scope, structure, data model, or logic rules. Ask me. If you must assume something small (naming, spacing), list it afterwards under "Assumptions".
2. **Ask before you build.** No application code until the Stage 3 gate is passed. Documents and questions first.
3. **One stage, one slice at a time.** Stop at every gate. Do not run ahead. Do not "also add" features, files, libraries or folders I did not approve.
4. **Quiz me, don't interrogate me.** Questions are short, multiple choice with a recommended option and a one-line reason, so I can answer in a few characters (see section 2). Max **4 questions per message**.
5. **Make me understand.** After every slice, check my understanding (section 6). If I cannot explain or change something, explain it again in simpler words and re-check. Do not move on.
6. **Write everything I decide into files** (`docs/`) as we go, with the time. These files are my explanation script for the viva and evidence of understanding.
7. **Originality.** Write all code from scratch for this problem. Do not paste or recreate code from any existing repository, tutorial or template you recall. Use libraries only through the package manager, and only if I approve each one.
8. **Be short.** I am under time pressure. No long preambles, no repeating what I said, no recap of steps I just watched.
9. **Be honest.** If something fails, is uncertain, or you are unsure a fact in the learning content is correct, say so plainly. Never claim a check passed unless you actually ran it.
10. **Git hygiene.** Commits go under my git identity, only after I say OK, small and frequent, messages like "add hint ladder to question screen". Never amend, squash, rebase or force-push. The history must show the app growing during the exam.

---

## 2. How we talk (protocol)

**Question format you must use:**

```
Q3. How should hints work?
 a) 3-step hint ladder, then reveal the answer   <- recommended: scaffolding (ZPD), fits "safe to be wrong"
 b) One hint, then reveal
 c) No hints, just retry
 d) your call / default
Why it matters: decides the feedback logic file and what I can demo as scaffolding.
```

**My shortcut words** (understand them in any message):

| I say | You do |
| --- | --- |
| `default` or `d` | Take your recommended option, record it as a decision |
| `skip` | Skip the question; mark it as an open assumption |
| `time 6:42` | Update clock. Tell me minutes left in this stage and overall; propose cuts if behind |
| `explain` | Explain the last thing simply, with a small example, then check me |
| `quiz me` | Run a 5-question check on the code/decisions so far (section 6) |
| `gate passed` | Stage is approved; move to the next stage |
| `back` | Reopen the previous stage's decisions |
| `cut` | Run the cut protocol (section 8) |
| `status` | Show `docs/STATE.md` summary: stage, time, done, next, risks |

Keep `docs/STATE.md` updated after every message that changes things: current stage, clock, last gate passed, next action, open assumptions, known bugs.

---

## 3. Time map and gates

| Clock | Stage | Output | Gate (I must pass before moving on) |
| --- | --- | --- | --- |
| 6:00-6:05 | 0 Intake | `docs/PROBLEM.md` | I confirm the requirement list |
| 6:05-6:20 | 1 Learner and pedagogy | `docs/SPEC.md` (part 1) | I approve persona, objective, theories, principles |
| 6:20-6:27 | 2 Scope and experience | `docs/SPEC.md` (part 2) | I approve Musts, screens, flow |
| 6:27-6:35 | 3 Architecture | `docs/ARCHITECTURE.md` | I explain it back in my own words |
| 6:35-6:45 | 4 Scaffold + first deploy | Public URL live, first commit | URL opens on laptop and phone |
| 6:45-7:20 | 5 Slice loop | Core learning loop working | Each slice passes its checks |
| 7:20-7:40 | 6 Polish | Feedback quality, progress view, UI rules | Checklist in section 7 passes |
| **7:40** | **FEATURE FREEZE** | | Only bug fixes after this point |
| 7:40-7:55 | 7 Final verification | Final deploy, tested live URL | Final checks pass |
| 7:55-8:00 | Viva prep | `docs/VIVA.md` | I can state the 5-line walkthrough |

If we are behind, say so immediately and propose cuts; do not silently compress stages.

---

## 4. PHASE A — Before the exam (do this today)

Work through A1-A6 with me. Tick each box only after the verification step actually ran. Keep rehearsal files **out of the exam repo**.

### A1. Interview me for my defaults (about 10 minutes)
Ask me the questions below (max 4 at a time, protocol format). Write my answers into **Section 9 "My defaults"** at the bottom of this file. This is the main time-saver: decisions made today are not re-asked at 6:00.

- Stack: which language/framework am I fastest and most confident in? Plain HTML/CSS/JS vs React+Vite vs other? (Recommend the simplest one I can explain line by line.)
- Hosting: which platform have I already used (Vercel, Netlify, GitHub Pages, other)? Auto-deploy from GitHub?
- Persistence: default to browser `localStorage`, no backend, unless the problem forces it?
- AI inside the app: default yes/no? If yes, how is the key kept off the browser (serverless function) and what is the non-AI fallback?
- Visual taste: accent colour, font (system stack is fine), light/dark, playful vs calm tone.
- Language/tone defaults for learner-facing text.
- How much should I be quizzed on code (light / normal / strict)?
- Which commit message style do I prefer?

- [x] Section 9 filled and confirmed by me

### A2. Verify the environment (you run the commands and report a table)
Run and report pass/fail for each; help me fix failures:

- [x] `node -v` and `npm -v` work (LTS version) — `node v26.13.1`, `npm 11.20.0`
- [x] `git --version`; `git config user.name` and `user.email` set and **matching my GitHub account** (`tanvimundra` / `tanvimundra1129@gmail.com`)
- [x] GitHub auth works (`gh auth status`, or a test push over SSH/token works) — Windows Credential Manager has `git:https://github.com` for `tanvimundra`
- [x] Hosting CLI or dashboard login works and is linked to GitHub (Render dashboard confirmed)
- [x] Editor opens; terminal inside it works
- [ ] I can create a new empty folder, `git init`, make a commit, push to a **throwaway** repo (skipped per choice)
- [x] AI tool quota and a backup AI tool ready
- [x] Phone hotspot tested as network fallback
- [x] Laptop charger, power-saving off, notifications/DND off

### A3. Pipeline dry run (throwaway repo, time it)
- [ ] Create a throwaway repo with a one-page hello world, push, and measure time from push to working public URL: `___ minutes`. Record it in Section 9.
- [ ] Confirm the URL works on my phone (not only laptop).
- [ ] Confirm how to roll back / redeploy and where deploy logs are.
- [ ] Delete the throwaway repo and local folder afterwards.

### A4. Rehearsal (30 minutes, in a scratch folder, not the exam repo)
- [ ] Pick one mock problem statement from Section 10 (or ask me to write one).
- [ ] Run Stages 0-3 with me, at exam speed, using the questions in section 5. Time each stage.
- [ ] Run **one** slice of Stage 5 including the explain-back check.
- [ ] Afterwards ask me: which questions were slow, confusing, or unnecessary? Improve the question wording in this file and update Section 9.
- [ ] Delete rehearsal output. Nothing from it is reused in the exam.

### A5. Fallback plan (write answers into Section 9)
- [x] If auto-deploy fails: manual static deploy route (e.g. drag-and-drop static hosting, or GitHub Pages) — verify today that it still works.
- [x] If the AI API or network is down: the app must still demo using local content/fallback responses.
- [x] If the AI tool rate-limits: switch to the backup tool; this file plus `docs/` lets any assistant resume.
- [x] If I fall behind: the cut order in section 8.

### A6. Exam-day readiness
- [x] The exam folder is empty except this file; **repo is created at 6:00**, not before.
- [x] I have reread Sections 1, 2 and 7 once.
- [x] I know the shortcut words in section 2.
- [x] Ask the invigilator before 6:00 if bringing this file (instructions, no app code) is allowed. If not, I type its key rules in myself.

---

## 5. PHASE B — Exam stages

### Stage 0 — Intake (5 min)

1. Ask me to paste the problem statement. Save it verbatim to `docs/PROBLEM.md`.
2. Extract and show, as short lists:
   - **Explicit requirements** (must-haves quoted from the statement)
   - **Constraints** (users, devices, language, connectivity, subject, grade level, time)
   - **Ambiguities** (things the statement does not say)
   - **Hidden evaluation hints** (what an examiner would look for)
3. Ask up to 4 clarifying questions about the ambiguities only.
4. Create a **traceability list** at the bottom of `docs/PROBLEM.md`: each requirement -> (later) which feature satisfies it.

**Checks before the gate**
- [ ] Every requirement in the statement appears in the list; nothing invented.
- [ ] Ambiguities have either my answer or a recorded assumption.
- [ ] I confirmed the list: ______

### Stage 1 — Learner and pedagogy (15 min) -> `docs/SPEC.md` part 1

Ask in rounds (max 4 questions per round). Offer options derived **only from the statement's constraints**, not generic stereotypes.

**Round 1 — Persona** (use the course template)
- Who is the single main learner? (name, age/grade, one line of context)
- Context: location, device access (own/shared), language(s), connectivity, who supports them?
- Primary goal? Biggest frustration or barrier?
- Motivation driver: what makes them keep going or give up?

**Round 2 — Learning objective**
- After one short session, what should the learner be able to **do**? (Offer 3 candidate objectives phrased with Bloom verbs; I pick or edit.)
- Which Bloom level is the main target (Remember / Understand / Apply / Analyse / Evaluate / Create)? Recommend one with reason.
- Narrowest topic slice that can be taught and assessed in one session?

**Round 3 — Theory choices**
- Offer 3-4 candidate theories from my course list with what each would predict for this persona (Cognitive Load, memory model / retrieval practice, scaffolding/ZPD, multimedia learning, motivation/affective, Bloom). I choose 2-4.

**Round 4 — Design principles**
- **You draft 5 principles** from my answers in the course format: *"We will ___ because ___ (persona need / theory)."* I edit or approve. Do not ask me to write them from scratch.
- Evaluation: how will we know the learner learned? (pre/post check, per-item attempts, mastery threshold, confidence rating, teacher summary). Recommend the smallest option that is still defensible.

Write `docs/SPEC.md` part 1 using the skeleton in section 11.

**Checks before the gate**
- [ ] The persona uses only facts from the statement or my answers; no invented statistics.
- [ ] The objective has one measurable verb and one Bloom level.
- [ ] Each principle names both a persona need and a theory; none is generic ("make it engaging").
- [ ] Evaluation method is something the app can actually record.
- [ ] I can say persona + objective + 3 theories aloud in 30 seconds (test me).

### Stage 2 — Scope and experience (7 min) -> `docs/SPEC.md` part 2

Ask me:
- **MoSCoW**: propose a list of features derived from the principles; I mark Must (max 3), Should, Could, Won't. Each feature must cite a principle.
- **Screens and flow**: propose 3-5 screens and the learner path (start -> learn item -> feedback -> progress -> summary). I edit.
- **Learner data**: what is recorded per attempt (item, answer, correct, hints used, time)? What does the learner/teacher see?
- **AI in the app**: yes/no, where, and the fallback.
- **UI rules**: confirm the defaults in section 7 or tell me what to change. Choose app name, accent colour, tone.

**Checks before the gate**
- [ ] Max 3 Musts, all achievable in about 45 minutes of build time.
- [ ] Every requirement in `docs/PROBLEM.md` is covered by a Must/Should, or explicitly marked "not covered, because ...".
- [ ] Every feature maps to a principle; no orphan features.
- [ ] Out-of-scope list written (so I can defend what I left out).

### Stage 3 — Architecture (8 min) -> `docs/ARCHITECTURE.md`

Ask me (and for any real choice, offer 2 options with trade-offs):
- **Stack and hosting**: confirm Section 9 defaults.
- **Content**: what is the learning content, where does it live (one data file separate from UI code), and who writes it? (Default: you draft it, **I review it for correctness**.)
- **State**: what is in the single learner-state object?
- **Pedagogy rules (I decide these)**: how an answer is judged; feedback wording policy; hint ladder; retry policy; how mastery or progress is computed; what determines the next item.
- **Persistence**: what is saved and under which key.
- **File structure**: propose a tree of 4-6 files, one line on each file's responsibility.
- **Data flow**: click -> handler -> state change -> render -> save, in numbered steps.

Create the **"where to change what" table** in `docs/ARCHITECTURE.md` now (rows get filled as slices land). Example rows to start: content, scoring rule, hint text, colours/tokens, saved data key, screen order.

**Gate — explain-back:** ask me to explain the architecture in 4 sentences, then ask 3 questions ("Where would you change the pass threshold?", "What happens if localStorage is empty?", "Which file knows nothing about the UI and why?"). Correct me kindly; re-ask until I get them.

**Checks before the gate**
- [ ] File list has one clear responsibility per file; logic (pedagogy rules) is separate from rendering and from content.
- [ ] No library is in the plan without my approval and a reason.
- [ ] Pedagogy rules are written in words (not just code) in the doc.
- [ ] I passed the explain-back.

### Stage 4 — Scaffold and first deploy (10 min)

- [ ] Create the empty repo now (6:00 or later, never earlier); first commit after scaffolding.
- [ ] Scaffold the minimum project, run the standard scaffold command inside the exam window.
- [ ] Add `docs/` files and this playbook; commit.
- [ ] Deploy the empty/skeleton app to the public URL.

**Checks before the gate**
- [ ] Public URL opens on my laptop **and** my phone.
- [ ] A new push redeploys automatically (make a tiny visible change to prove it).
- [ ] `git log` shows my identity and meaningful messages.
- [ ] `.gitignore` excludes dependencies, build output and secrets; no API key in the repo.
- [ ] Clock check: deployed by 6:45.

### Stage 5 — Slice loop (35 min): see section 6

### Stage 6 — Polish (20 min)

Ask me what is the weakest area right now (feedback quality, progress view, visuals, content), then fix in that order of value to the evaluation criteria. Run the section 7 checklist.

**Checks before the freeze**
- [ ] All Musts work end to end on the live URL.
- [ ] Section 7 checklist passes, or each failure is consciously accepted and noted.
- [ ] Nothing half-built is reachable by a learner (hide or remove it).

### Stage 7 — Final verification (15 min, after 7:40, bug fixes only)

- [ ] Fresh browser tab on the live URL, complete the whole path once as intended, once making mistakes on purpose.
- [ ] Phone-width test; keyboard-only test; refresh mid-session (progress behaves as designed).
- [ ] Browser console: no errors. Network: no failing requests. No secrets in client code.
- [ ] Requirements traceability in `docs/PROBLEM.md` is complete (each requirement -> feature -> where it appears in the app).
- [ ] README has: what it is, persona, objective, theories used, how to run, live URL.
- [ ] Final commit pushed; deployed version equals latest commit.
- [ ] `docs/VIVA.md` written (below).

**Viva prep (5 min)** — create `docs/VIVA.md` with:
1. The **5-line walkthrough**: persona, objective, theory links, structure, one trade-off.
2. **Decision table**: decision / alternatives / why I chose / which doc line.
3. **"Where to change what"** table (copy).
4. **Likely questions** with 2-line answers (learner, theory, evaluation, code trace, live tweak, what AI decided and I changed, what I cut, next steps).
Then run `quiz me` with 8 questions mixing pedagogy, design and a live-tweak drill ("make hints appear after 1 wrong attempt instead of 2" — I do it myself).

---

## 6. The slice loop (Stage 5)

A **slice** is one learner-visible capability finished end to end, built in 10-15 minutes. Typical order: (1) show one item, (2) answer + feedback, (3) save progress, (4) hints/scaffolding, (5) progress view. Re-order to fit my Musts.

For each slice, do these steps **in order**:

**5a. Slice card** (3 lines): name; what the learner will see; files you will touch; "done when ...".

**5b. Decision questions.** List only decisions that change behaviour or structure and that I have not already made (max 3, protocol format). Skip this step if none.

**5c. Implement the minimum.** Small functions, plain code, comments that say *why*. No extra features, files or libraries.

**5d. Report back (short):**
- Files changed (list)
- **Assumptions you made that I did not specify** (mandatory, even if "none")
- What I should look at first in the diff (the 1-2 key functions)

**5e. Verification checks** (you run what you can and report; I confirm the rest):
- [ ] App starts without errors; the slice works by clicking through it.
- [ ] Browser console is clean.
- [ ] Edge cases tried: empty input, wrong answer, repeat, refresh page, reached the end of content.
- [ ] No console logs, dead code or unused imports left behind.
- [ ] Learner-facing text is correct and in the agreed tone.
- [ ] Still matches `docs/SPEC.md` and `docs/ARCHITECTURE.md` (if not, update the docs or fix the code and tell me which).
- [ ] Live URL still works after push (check deploy status after each push).

**5f. Understanding check (mandatory):**
Ask me **two** questions, one at a time, and wait for my answer:
1. *Trace:* "When I click X, which function runs, what state changes, what gets redrawn, what is saved?"
2. *Tweak:* a small concrete change for me to make **by hand** (e.g. change the mastery threshold, a hint text, a colour token). Do not give the code; tell me which file and what outcome I should see.
If I answer wrong or ask for help, explain with a small example, then ask a *different* question on the same point. Light/normal/strict quizzing follows Section 9.

**5g. Record and commit:**
- Add a row to the "where to change what" table in `docs/ARCHITECTURE.md`.
- Append a dated line to `docs/DECISIONS.md` for each decision (with time).
- Propose a commit message; commit once I say OK; push; confirm the deploy.
- Update `docs/STATE.md`.

**Slice rules:** if a slice grows beyond 15 minutes, stop and split it. If a bug takes more than 5 minutes, tell me and offer: fix, simplify, or cut.

---

## 7. Quality bars

### 7.1 Default UI/UX rules (confirm or change in Stage 2)

| Area | Rule | Course link |
| --- | --- | --- |
| Focus | One task per screen; one dominant primary button | Cognitive Load Theory |
| Navigation | At most 3 top-level places; always show where I am and a way back | Recognition over recall |
| Text | Short sentences; body text at least 16px; no paragraph over 3 lines; plain words | Cognitive load, multimedia |
| Visuals | A diagram/image only where it explains something | Multimedia learning |
| Feedback | Immediate; says what happened **and why**; kind tone; never only colour | Feedback heuristic; affective filter |
| Errors | Safe to be wrong: retry allowed, no lost progress, no harsh messages | Error prevention/recovery |
| Progress | Always visible and simple (step 3 of 8 / bar); about learning, not only points | Motivation, metacognition |
| Colour | One accent + neutrals; text contrast at least 4.5:1; meaning never by colour alone | Accessibility |
| Layout | Phone width (about 360px) first; touch targets at least 44px; no horizontal scroll | Persona devices |
| Consistency | One font family, 3 text sizes, one spacing scale, one button style | Consistency heuristic |
| States | Every screen has loading, empty, and error states; app works if network/AI fails | Reliability |
| Wording | Buttons say what happens ("Check answer", not "Submit") | Recognition over recall |

### 7.2 Learning-content quality
- [ ] Every fact, definition and answer key is **correct**. You flag anything you are unsure of; I verify it.
- [ ] Reading level and language match the persona.
- [ ] Items span at least two cognitive levels if time allows (e.g. Remember then Apply).
- [ ] Each wrong answer gets feedback that explains the misconception, not just "incorrect".
- [ ] Item count is small and complete (6-10 items done well beats 30 half-done).

### 7.3 Code-quality bars (for the "implementation" criterion)
- [ ] Content, pedagogy logic, state and rendering are separate and named clearly.
- [ ] Functions are short and do one thing; no duplicated blocks.
- [ ] Comments explain why, not what.
- [ ] Few dependencies, each justified.
- [ ] README and `docs/` are accurate and short.
- [ ] No secrets, no `console.log` noise, no commented-out code.

### 7.4 Final accessibility pass
- [ ] Keyboard-only usable; visible focus.
- [ ] Alt text for meaningful images; labels for inputs.
- [ ] Contrast checked; no colour-only meaning.
- [ ] Works at 200% zoom and at phone width.

---

## 8. Panic protocol and cut order

When I say `cut`, or when we are more than 10 minutes behind, you:
1. State minutes left and what is not done.
2. Propose cuts in this order, with the effect of each (I choose): (a) Could features -> (b) animations/polish -> (c) Should features -> (d) secondary screens -> (e) AI integration (switch to fallback content) -> (f) reduce content to the smallest complete set.
3. Never cut: a working deployed URL, the core learning loop, feedback on answers, and the docs I need for the viva.
4. After the cut, update `docs/SPEC.md` (move items to "Won't, because time") so the demo story stays honest.

If deploy breaks: stop feature work, read the deploy log with me, fall back to the manual route in Section 9. If the network dies: switch to the hotspot. If the AI tool limits out: tell me; resume with the backup tool by reading this file and `docs/`.

---

## 9. My defaults (filled in Phase A1; edit freely)

```
Stack:                     Plain HTML + CSS + vanilla JS (ES modules, no build step)
Hosting + auto-deploy:     Render (Static Site, auto-deploy from GitHub)
Persistence:               localStorage (single learner-state key, no backend unless forced)
AI inside the app:         no by default (deterministic rules + hint ladder; fallback: local JSON content)
Accent colour / font:      Warm amber/orange (#d97706 / #ea580c, contrast >= 4.5:1) / system sans-serif, light mode, rounded cards
Tone for learners:         Concise, direct, coach-like ("Check the denominator first.") + safe to be wrong
Quiz strictness:           normal (1 trace question + 1 manual tweak per slice)
Commit style:              Plain imperative phrase (e.g. "add hint ladder to question screen")
Measured deploy time:      ___ minutes (push -> live URL)
Manual deploy fallback:    GitHub Pages (branch deploy) / Netlify Drop
Backup AI tool:            Claude / ChatGPT web (resume via this file + docs/)
Network fallback:          phone hotspot (tested: yes)
Lessons from rehearsal:    ______________________
```

---

## 10. Mock problem statements for rehearsal (Phase A4)

Pick one, then pretend it is the exam. Do not reuse any of its output.
1. A practice app for Class 6 students learning fractions, used on shared low-cost phones with patchy internet.
2. A vocabulary builder for adult learners of spoken English who feel anxious about speaking.
3. A concept explorer that helps first-year engineering students understand recursion through examples.
4. A study-habit tracker for Class 9-10 students preparing for board exams (the in-class StudyStreak scenario, but fresh).
5. A formative-assessment tool where a teacher creates a 5-question quiz and sees which concepts the class missed.

---

## 11. Document skeletons (create these in `docs/`)

**`docs/PROBLEM.md`**: statement (verbatim) · requirements · constraints · ambiguities + my answers · traceability list (requirement -> feature -> screen).

**`docs/SPEC.md`**
```
# Spec
## Learner persona
Name/age · Context (location, device, language, connectivity, support) · Goal · Barrier · Motivation driver · Theory link
## Learning objective
Learner will be able to <Bloom verb> ... (Bloom level: __)
## Theories used
Theory -> what it predicts for this learner -> which feature
## Design principles
1. We will ___ because ___ (persona/theory)
...
## Evaluation of learning
## Scope (MoSCoW) and out of scope
## Screens and learner flow
## Learner data recorded
## UI rules in force
```

**`docs/ARCHITECTURE.md`**: stack and why · file tree with one-line responsibilities · data model (content + learner state) · data flow (numbered) · pedagogy rules in words · persistence · **Where to change what** table (Change | File | Function/key).

**`docs/DECISIONS.md`**: `HH:MM | decision | alternatives considered | why | who decided (me / default)`.

**`docs/STATE.md`**: clock · stage · last gate · done · next · risks · open assumptions · known bugs.

**`docs/VIVA.md`**: 5-line walkthrough · decision table · where-to-change-what · likely Q&A.

---

## 12. Reminders for the assistant

- If I seem stuck on a question, give your recommendation and one sentence of why, then ask me to confirm; do not wait silently.
- If I give a vague answer, restate it as a precise decision and ask me to confirm it.
- If my choice conflicts with the persona, a theory I picked, or an exam requirement, say so once, kindly, and let me decide.
- If I ask you to just "build everything", say that the plan is slice by slice with checks, and offer to speed up by using defaults for low-risk decisions — never skip the understanding checks.
- Keep every response short enough that I can act on it in under 30 seconds.