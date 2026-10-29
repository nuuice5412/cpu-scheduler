# CPU Scheduling Simulator (AT = 0)

An interactive, responsive CPU-scheduling simulator built with vanilla HTML/CSS/JS and soft **Claymorphism** aesthetics. FCFS, SJF and Round Robin run on the numbers you enter and are visualised with a proportional Gantt timeline, a full metrics table and step-by-step formula breakdowns — under the uniform arrival-time condition **(AT = 0)**.

🔗 **Live demo:** <https://nuuice5412.github.io/cpu-scheduler/>

---

## 📸 Screenshots

| Light theme — FCFS | Dark theme — Round Robin (13 slices) |
| :---: | :---: |
| ![Simulator in light mode showing FCFS results](docs/screenshot-light.png) | ![Simulator in dark mode showing Round Robin results](docs/screenshot-dark.png) |

---

## ✨ Key Features

### Scheduling algorithms

1. **FCFS (First-Come, First-Served)** — non-preemptive, executes strictly in input order.
2. **SJF (Shortest Job First)** — non-preemptive, shortest burst first, FCFS order as the tie-breaker for equal bursts.
3. **Round Robin (RR)** — preemptive, cyclic slices of the configured time quantum. Context-switch overhead is assumed to be **0 ms**.

### Results

- **Gantt timeline** — the bar is a CSS grid whose columns are `BT fr` units, so every block edge lines up exactly with its timestamp. With more than 8 slices the chart switches to a compact mode (smaller radius, slice durations hidden) and the axis thins out its labels instead of overlapping them.
- **Metrics table** — Arrival Time (always 0), Burst Time, Start Time, Completion Time, Turnaround Time, Waiting Time and status for every process.
- **Summary cards** — Average Waiting Time and Average Turnaround Time with the full arithmetic, e.g. `(0 + 6 + 14 + 21) / 4 = 10.25 ms`, plus the total makespan.
- **Algorithm comparison** — FCFS, SJF and Round Robin are all computed from the same input and shown side by side (AWT, ATAT and makespan); the lowest AWT is highlighted and the algorithm currently on screen is marked.
- **AVG WT footer** — the table ends with an average-waiting-time row, so the requested `AVG WT` value is part of the table itself.
- **CSV export** — the **Export CSV** button sits directly under the results table (below the `AVG WT` row) and opens a small menu: export **FCFS**, **SJF** or **Round Robin** on its own, or all three in one file (three detail tables plus the comparison summary). Files are UTF-8 with a BOM, so Thai text stays readable in Excel.

### Input & controls

- **1–10 processes**, **Burst Time 1–50 ms**, **Time Quantum 1–20 ms** — limits are enforced by validation, not only by the `max` attribute.
- Stepper buttons with hold-to-repeat that stops automatically when the window loses focus.
- Slot-machine cascade animation when randomising burst times.
- Localised validation messages (TH/EN) for every rule, including the process-count / field-count mismatch.
- **Enter** anywhere in the form calculates (the calculate button is the form's submit button).

### Interface

- Thai / English toggle, persisted in `localStorage`.
- Light / dark theme with a liquid-glass slider, persisted in `localStorage` and defaulting to the OS preference.
- Responsive down to phone widths; the results table scrolls horizontally instead of squashing its columns.
- Print stylesheet: on-screen controls are hidden and the Gantt keeps its colours on paper.

---

## ♿ Accessibility

- **Tabs follow the WAI-ARIA APG pattern**: roving `tabindex`, arrow-key / Home / End navigation, `aria-selected`, and the tabpanel's `aria-labelledby` follows the active tab.
- An **`aria-live` region** announces AWT / ATAT / makespan after each recalculation.
- The Gantt exposes a **text description of the schedule** (first slices plus a slice count); the numeric axis is `aria-hidden` so screen readers are not read hundreds of numbers.
- **Focus feedback**: buttons and tabs show a ring only for keyboard users (`:focus-visible`), and focused number fields highlight their capsule.
- Every input and button has an accessible name, and a `<noscript>` notice explains that JavaScript is required.

---

## 📐 Formulas & Theoretical Background (AT = 0)

All processes enter the ready queue simultaneously at `t = 0`, so the metrics reduce to:

| Metric | Symbol | Definition | Formula (AT = 0) |
| :--- | :---: | :--- | :--- |
| **Burst Time** | $BT$ | CPU time the process needs to finish | user input (ms) |
| **Start Time** | $ST$ | First timestamp at which the process receives the CPU | first scheduled tick |
| **Completion Time** | $CT$ | Timestamp at which the process finishes | final execution tick |
| **Turnaround Time** | $TAT$ | Elapsed time from arrival to completion | $TAT = CT - AT = CT$ |
| **Waiting Time** | $WT$ | Total time spent waiting in the ready queue | $WT = TAT - BT$ |
| **Average Waiting Time** | $AWT$ | Mean waiting time over $N$ processes | $AWT = \frac{1}{N}\sum_{i=1}^{N} WT_i$ |
| **Average Turnaround Time** | $ATAT$ | Mean turnaround time over $N$ processes | $ATAT = \frac{1}{N}\sum_{i=1}^{N} TAT_i$ |

---

## 🧭 Behaviour notes

- Results are **always derived from the fields on screen** — there is no hard-coded sample data behind the UI.
- Switching **language** re-renders the current results in the new language without losing them.
- If the form is **invalid**, switching tabs or languages does **not** recompute: the previous results stay on screen and a message explains what to fix.
- **Reset** restores the default burst times (6, 8, 7, 3), process count 4 and quantum 2, then recalculates.

---

## 🧪 Sample test data

Use these cases to check the program (they are the same cases used in the report and the video).

| # | Input | Expected result |
| :---: | :--- | :--- |
| **1** | 4 processes, **BT = 6, 8, 7, 3**, **Q = 2** | FCFS **10.25 / 16.25 ms** · SJF **7.00 / 13.00 ms** · RR **13.75 / 19.75 ms** (AWT / ATAT) |
| **2** | Same process count, press **Randomise BT** | Every burst becomes an integer in 1–50 ms; all three algorithms return a complete table with no empty cells |
| **3** | Keep case 1, change **Q = 2 → 5** | RR becomes **14.75 / 20.75 ms** (WT = 13, 14, 17, 15 ms) — FCFS and SJF do not change |

Hand calculation for case 1 (FCFS), to compare against the screen:

```text
CT  = cumulative burst times           → 6, 14, 21, 24
TAT = CT − AT (AT = 0)                 → 6, 14, 21, 24
WT  = TAT − BT                         → 0,  6, 14, 21
AWT   = (0 + 6 + 14 + 21) / 4          = 10.25 ms
ATAT  = (6 + 14 + 21 + 24) / 4         = 16.25 ms
Makespan                               = 24 ms
```

---

## 📂 Project structure

```text
cpu-scheduler/
├── index.html            # markup, bilingual i18n dictionaries, UI interaction
├── styles.css            # claymorphism tokens, dark theme, responsive + print styles
├── app.js                # scheduling engine (FCFS, SJF, RR) + DOM rendering
├── docs/                 # screenshots used by this README
├── tests/
│   ├── engine.spec.js    # the 51 assertions, shared by both runners
│   ├── engine.test.js    # command-line runner (Node.js)
│   └── engine.test.html  # browser runner — opens like a normal page, no install
├── package.json          # only a `test` script — no dependencies to install
└── README.md
```

---

## 💻 Getting Started

No build tools, bundlers or package installation are required:

1. Clone or download this repository.
2. Open `index.html` directly in a modern browser.

Optional — if you prefer serving it over HTTP (for example to test the print stylesheet or keep `localStorage` per origin):

```bash
python -m http.server 8000
# then open http://localhost:8000
```

---

## ✅ Running the tests

The same **51 assertions** (defined once in `tests/engine.spec.js`) can be run two ways.

### Option 1 — In the browser (no installation needed)

Open **`tests/engine.test.html`** — double-click it, or drag it into any browser. The page runs the specs against the real engine and shows `ALL PASS (51)` in green.

### Option 2 — On the command line (requires Node.js)

```bash
# from the project root (the folder that contains index.html)
node tests/engine.test.js

# or from inside tests/
node engine.test.js

# or via npm — there are no dependencies, so no npm install is needed
npm test
```

> If PowerShell answers `The term 'node' is not recognized`, Node.js is not installed (or not on `PATH`). Install the LTS build from [nodejs.org](https://nodejs.org), open a **new** terminal and verify with `node -v`. Until then, Option 1 works without Node.

Expected output (51 assertions):

```text
FCFS — burst times 6, 8, 7, 3
  PASS  execution order
  PASS  AWT
  ...

Worst case allowed by the UI — 10 processes x 50 ms
  PASS  slice count
  PASS  makespan

----------------------------------------------
ALL PASS (51)
```

The script exits with **0** when everything passes and **1** on the first failure, so it can be wired into CI as-is.

---

## 🌐 Browser support

- Chrome / Edge **105+**, Safari **15.4+**, Firefox **121+** — the theme slider and the language highlight rely on CSS `:has()`.
- No polyfills are shipped; on older browsers the app still runs but those two decorative highlights do not follow the active state.

---

## ⚠️ Limitations

- Arrival time is fixed at **0** (there is no AT input by design).
- No I/O bursts, priorities or context-switch overhead.
- Practical ceiling of **10 processes × 50 ms** keeps the timeline readable; the validation enforces it.

---

## 🤖 AI usage

AI tools were used as assistants, not authors: every suggestion was read, tested and explained by the team before it was kept.

| Phase | Tool | Model | What it helped with |
| :---: | :--- | :--- | :--- |
| 1 | **Google Antigravity** | Gemini 3.7 Flash (High) | Drafting the UI shell — form layout, tab switcher, results table and the Claymorphism styling |
| 2 | **DeepSeek Harness** (AI coding agent) | `deepseek-flash` | Reviewing the UI/integration layer, fixing state bugs (language switch, reset, tab validation), making the Gantt proportional, and adding the automated tests |

Example prompts (abridged):

> "Help me design the UI for the CPU scheduling simulator and wire it to the calculation functions that already exist in `app.js`…"

> "Review the UI and its integration with `app.js`: which parts can make the table disagree with the numbers on screen?"

How the result was verified:

- **51 automated assertions** (`tests/engine.spec.js`), runnable in Node.js or in the browser.
- **Headless Chrome checks** for the language switch, input validation, ARIA attributes and the AT column.
- The **hand calculation** in *Sample test data* compared with the values on screen.

The scheduling formulas themselves (`calculateFCFS`, `calculateSJF`, `calculateRR`) were written by the member responsible for the algorithm engine — they were not generated by an AI tool.

---

## 👥 Members & responsibilities

| Role | Responsibility |
| :--- | :--- |
| **Algorithm engine** | `app.js` scheduling functions (FCFS, SJF non-preemptive, Round Robin), tie-breakers and the hand calculation |
| **User interface & integration** | UI design, data input and validation, results table and Gantt rendering, wiring the UI to the engine |
| **Testing & documentation** | Test-case design, result verification, this README, and the project videos |

> Roles are listed instead of personal names in the public repository; the submitted report lists the members.

---

## 🛠️ Technology stack & versions

- **HTML5 / CSS3 / vanilla JavaScript (ES6+)** — no framework, no build step, no runtime dependencies.
- **CSS features used**: custom properties, layered claymorphism shadows, CSS grid (Gantt), `:has()` (theme and language highlights), `prefers-color-scheme`, print media queries.
- **Google Chrome 153.0.8010.37** — browser used for development and testing.
- **Node.js 24.21.0** — optional, only to run the engine tests from the command line.
- **Google Antigravity** (model **Gemini 3.7 Flash (High)**) and **DeepSeek Harness** (model **`deepseek-flash`**) — AI assistants used during development (see *AI usage*).
