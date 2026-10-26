# CPU Scheduling Simulator (AT = 0)

An interactive, responsive web-based simulator for CPU scheduling algorithms designed with soft **Claymorphism** 3D aesthetics. It features real-time dynamic Gantt chart visualization, comprehensive metric calculations, and step-by-step mathematical formulas under the uniform arrival time condition **(Arrival Time: $AT = 0$)**.

---

## 🚀 Key Features

- **3 Core Operating System Scheduling Algorithms:**
  1. **FCFS (First-Come, First-Served):** Non-preemptive scheduling executing processes strictly in arrival order.
  2. **SJF (Shortest Job First - Non-Preemptive):** Prioritizes processes with the shortest burst time first to minimize average waiting time, using FCFS tie-breaking for identical burst times.
  3. **Round Robin (RR - Preemptive):** Cyclic time-sliced CPU allocation based on configurable Time Quantum ($Q$), accurately capturing preemption intervals and context switches.
- **Dynamic Gantt Chart Timeline:** Proportional execution duration blocks with exact timestamps for visual schedule tracing.
- **Detailed Metrics Table:** Real-time calculation of process metrics:
  - Burst Time ($BT$)
  - Start Time ($ST$)
  - Completion Time ($CT$)
  - Turnaround Time ($TAT$)
  - Waiting Time ($WT$)
- **Automated Summary Statistics & Formulas:**
  - Average Waiting Time ($AWT$) with full formula breakdown: e.g. `(0 + 6 + 14 + 21) / 4 = 10.25 ms`
  - Average Turnaround Time ($ATAT$) with formula breakdown: e.g. `(6 + 14 + 21 + 24) / 4 = 16.25 ms`
  - Total Makespan
- **Tactile User Controls:**
  - Dynamic process count configuration (supports 1 to 10 processes)
  - Stepper buttons with hold-to-repeat acceleration
  - Slot-machine cascade animation for randomizing Burst Times
  - Form validation with error alerts
- **Dual Language & Theme Support:**
  - Instant toggle between Thai (TH) and English (EN)
  - Smooth light and dark mode switching with liquid glass transition

---

## 📐 Formulas & Theoretical Background ($AT = 0$)

In this simulator, all processes enter the ready queue simultaneously at timestamp $t = 0$ ($AT = 0$). The metrics are governed by the following formulas:

| Metric | Symbol | Definition | Formula ($AT = 0$) |
| :--- | :---: | :--- | :--- |
| **Burst Time** | $BT$ | Total CPU time required by the process to complete execution | User input (ms) |
| **Start Time** | $ST$ | The earliest timestamp when the process first receives CPU execution | First scheduled tick |
| **Completion Time** | $CT$ | The timestamp at which the process finishes its entire execution | Final execution tick |
| **Turnaround Time** | $TAT$ | Elapsed time from arrival to full completion | $TAT = CT - AT = CT$ |
| **Waiting Time** | $WT$ | Total duration the process spends waiting in the ready queue | $WT = TAT - BT$ |
| **Average Waiting Time** | $AWT$ | Mean waiting time across all $N$ processes | $AWT = \frac{1}{N} \sum_{i=1}^{N} WT_i$ |
| **Average Turnaround Time** | $ATAT$ | Mean turnaround time across all $N$ processes | $ATAT = \frac{1}{N} \sum_{i=1}^{N} TAT_i$ |

---

## 📂 Project Architecture

```text
cpu-scheduler/
├── index.html        # UI structure, claymorphism components, and bilingual i18n dictionaries
├── styles.css        # Responsive layout, claymorphism styling tokens, and theme definitions
├── app.js            # Core scheduling engine (FCFS, SJF, RR) and dynamic DOM rendering
└── README.md         # Project documentation and theoretical reference
```

---

## 🛠️ Technology Stack

- **HTML5:** Semantic architecture, accessible forms, ARIA attributes
- **CSS3:** Custom properties (CSS variables), Claymorphism layered shadows, CSS animations
- **JavaScript (Vanilla ES6+):** Modular algorithms, zero external dependencies, reactive DOM synchronization

---

## 💻 Getting Started

No build tools, bundlers, or package installations are required:
1. Clone or download this repository.
2. Open `index.html` directly in any modern web browser (Google Chrome, Microsoft Edge, Mozilla Firefox, Safari).
