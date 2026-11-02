/* ==========================================================================
   i18n.js — ระบบสองภาษา
   พจนานุกรม TH/EN + simText() + updateLanguage() (แปลทั้งหน้าจอ)
   ========================================================================== */

const i18n = {
        th: {
          docTitle: "โปรแกรมจำลองการจัดคิวซีพียู - FCFS, SJF & Round Robin",
          metaDesc: "โปรแกรมจำลองอัลกอริทึมการจัดตารางเวลาซีพียู FCFS, SJF และ Round Robin (AT = 0) สไตล์ Claymorphism ผิวสัมผัสสามมิติ",
          mainTitle: "โปรแกรมจำลองการจัดคิวซีพียู",
          mainSubtitle: "FCFS, SJF และ Round Robin",
          atPill: "(AT = 0)",
          langGroupAria: "เลือกภาษา (Language Selector)",
          langToggleTitle: "สลับภาษา / Switch Language (TH / EN)",
          langToggleAria: "สลับภาษา ไทย / English",
          inputHeading: "กำหนดค่าและเวลาประมวลผล",
          badgeStatusAt: "เวลามาถึง (AT) = 0",
          labelNumProcesses: "จำนวนกระบวนการ (Processes)",
          processUnit: "กระบวนการ",
          labelTqText: "ควอนตัมเวลา (Time Quantum Q)",
          labelHintRr: "สำหรับ Round Robin",
          placeholderTq: "เช่น 2",
          ariaTq: "ควอนตัมเวลาสำหรับ Round Robin",
          btnDecProcTitle: "ลดจำนวนกระบวนการ",
          btnIncProcTitle: "เพิ่มจำนวนกระบวนการ",
          btnDecTqTitle: "ลดควอนตัมเวลา",
          btnIncTqTitle: "เพิ่มควอนตัมเวลา",
          labelBurstTimes: "เวลาประมวลผล (Burst Times - BT) หน่วย ms",
          labelBurstNote: "คลิกที่กล่องเพื่อแก้ไขตัวเลข",
          ariaBurstGroup: "เวลาประมวลผลของแต่ละกระบวนการ",
          ariaBurstItem: "เวลาประมวลผล {p}",
          alertBadgeText: "ข้อผิดพลาด",
          btnCloseAlertTitle: "ปิดการแจ้งเตือน",
          btnCalculateText: "คำนวณผลลัพธ์",
          btnCalculateTitle: "คำนวณอัลกอริทึมการจัดคิว",
          btnRandomizeText: "สุ่มค่า BT",
          btnRandomizeTitle: "สุ่มค่าเวลาประมวลผล (BT)",
          btnResetText: "รีเซ็ต",
          btnResetTitle: "รีเซ็ตเป็นค่าเริ่มต้น",
          resultsHeading: "ผลลัพธ์การจำลองการทำงาน",
          switcherAria: "สลับอัลกอริทึมการจัดคิว",
          tabFcfsAria: "อัลกอริทึม First-Come, First-Served",
          tabSjfAria: "อัลกอริทึม Shortest Job First",
          tabRrAria: "อัลกอริทึม Round Robin",
          labelAwtTitle: "AVERAGE WAITING TIME",
          labelAwtSub: "(AWT - เวลารอคอยเฉลี่ย)",
          labelAtatTitle: "AVERAGE TURNAROUND",
          labelAtatSub: "TIME (ATAT - เวลาเสร็จสิ้นเฉลี่ย)",
          resultsHint: "ผลลัพธ์จากการคำนวณครั้งล่าสุด — เมื่อแก้ไขค่า กด “คำนวณผลลัพธ์” อีกครั้ง",
          compareTitle: "เปรียบเทียบอัลกอริทึม (ข้อมูลชุดเดียวกัน)",
          compareNote: "คำนวณจากข้อมูลชุดเดียวกับที่กรอก · AWT ต่ำสุด = ดีที่สุด",
          compareBest: "AWT ต่ำสุด",
          compareCurrent: "กำลังดูอยู่",
          tableAvgWt: "AVG WT (ค่าเฉลี่ยเวลารอคอย)",
          btnExportText: "ส่งออก CSV",
          btnExportTitle: "ดาวน์โหลดผลลัพธ์ล่าสุดเป็นไฟล์ CSV",
          exportHint: "แนบผลลัพธ์นี้ไปกับรายงานได้",
          exportOneLabel: "ส่งออกอัลกอริทึมเดียว",
          exportAllLabel: "ทั้งสามอัลกอริทึม",
          exportAllHint: "ไฟล์เดียว",
          exportMenuAria: "เลือกสิ่งที่จะส่งออก",
          labelGanttTitle: "แผนภูมิแกนต์แสดงลำดับเวลา (Gantt Timeline Visualization)",
          labelMakespanText: "Total Makespan (เวลารวม):",
          ganttChartAria: "แผนภูมิแกนต์แสดงลำดับการทำงานของซีพียู",
          labelTableTitle: "ตารางวิเคราะห์การทำงานอย่างละเอียด (Detailed Execution Metrics)",
          formulaHintText: "TAT = CT - AT = CT • WT = TAT - BT",
          resultsTableAria: "ตารางผลการคำนวณการจัดคิวของกระบวนการ",
          thProcess: "PROCESS (โปรเซส)",
          thAt: "ARRIVAL (AT)",
          thBt: "BURST TIME (BT)",
          thSt: "START TIME (ST)",
          thCt: "COMPLETION (CT)",
          thTat: "TURNAROUND (TAT)",
          thWt: "WAITING TIME (WT)",
          thStatus: "STATUS (สถานะ)",
          procLabelPrefix: "กระบวนการ ",
          statusCompleted: "เสร็จสมบูรณ์",
          glossarySummaryTitle: "สรุปคำศัพท์ & สูตรคำนวณ CPU Scheduling (คลิกเพื่อดู)",
          footerText: "ออกแบบด้วยสไตล์ soft Claymorphism aesthetics • โปรแกรมจำลองการจัดคิวซีพียู (AT = 0)",
          placeholderNumProc: "2 - 10",
          errEmptyProc: "กรุณาระบุจำนวนโปรเซส (Number of Processes)",
          errInvalidProc: "จำนวนโปรเซสต้องเป็นจำนวนเต็มบวกที่มากกว่า 0 (เช่น 2 - 10)",
          errMaxProc: "จำนวนโปรเซสสูงสุดไม่เกิน 10 กระบวนการ เพื่อความสมบูรณ์ของแผนภูมิแกนต์และตาราง",
          errEmptyTq: "กรุณาระบุควอนตัมเวลา (Time Quantum Q) สำหรับ Round Robin",
          errInvalidTq: "ควอนตัมเวลา (Time Quantum Q) ต้องเป็นจำนวนเต็มบวกที่มากกว่า 0",
          errEmptyBt: "กรุณากรอกข้อมูลให้ครบทุกโปรเซส (พบช่องว่างที่ {p})",
          errInvalidBt: "เวลาประมวลผล (Burst Time) ของ {p} ต้องเป็นจำนวนเต็มบวกที่มากกว่า 0",
          errMaxBt: "เวลาประมวลผล (Burst Time) ของ {p} ต้องไม่เกิน 50 ms",
          errMaxTq: "ควอนตัมเวลา (Time Quantum Q) ต้องไม่เกิน 20 ms",
          errProcMismatch: "จำนวนช่องกรอก Burst Time ({count} ช่อง) ไม่ตรงกับจำนวนโปรเซสที่ระบุ ({num}) กรุณากดปุ่มสุ่มหรือแก้จำนวนโปรเซสใหม่",
          glossary: [
            { term: "Burst Time (BT)", desc: "ระยะเวลาที่กระบวนการต้องใช้ซีพียูในการประมวลผลจนเสร็จสิ้น (หน่วย: ms)" },
            { term: "Arrival Time (AT = 0)", desc: "เวลาที่กระบวนการเข้าสู่ Ready Queue ในแบบจำลองนี้ทุกโปรเซสมาพร้อมกันที่เวลา 0" },
            { term: "Start Time (ST)", desc: "จุดเวลาแรกที่กระบวนการเริ่มได้รับซีพียูเข้าทำงาน" },
            { term: "Completion Time (CT)", desc: "จุดเวลาที่กระบวนการประมวลผลงานทั้งหมดเสร็จสมบูรณ์" },
            { term: "Waiting Time (WT)", desc: "เวลารอคอยรวมในคิว WT = CT - BT (เมื่อ AT = 0)" },
            { term: "Turnaround Time (TAT)", desc: "เวลารวมตั้งแต่เข้าคิวจนเสร็จสิ้น TAT = CT (เมื่อ AT = 0)" }
          ]
        },
        en: {
          docTitle: "CPU Scheduling Simulator - FCFS, SJF & Round Robin",
          metaDesc: "CPU Scheduling Simulator for FCFS, SJF, and Round Robin (AT = 0) with 3D tactile Claymorphism aesthetics.",
          mainTitle: "CPU Scheduling Simulator",
          mainSubtitle: "FCFS, SJF and Round Robin",
          atPill: "(AT = 0)",
          langGroupAria: "Language Selector",
          langToggleTitle: "Switch Language (TH / EN)",
          langToggleAria: "Switch Language Thai / English",
          inputHeading: "Configuration & Burst Times",
          badgeStatusAt: "Arrival Time (AT) = 0",
          labelNumProcesses: "Number of Processes",
          processUnit: "Processes",
          placeholderNumProc: "2 - 10",
          labelTqText: "Time Quantum (Q)",
          labelHintRr: "For Round Robin",
          placeholderTq: "e.g. 2",
          ariaTq: "Time Quantum for Round Robin",
          btnDecProcTitle: "Decrease number of processes",
          btnIncProcTitle: "Increase number of processes",
          btnDecTqTitle: "Decrease time quantum",
          btnIncTqTitle: "Increase time quantum",
          labelBurstTimes: "Burst Times (BT) in ms",
          labelBurstNote: "Click inside box to edit values",
          ariaBurstGroup: "Burst times for each process",
          ariaBurstItem: "Burst time for {p}",
          alertBadgeText: "Validation Error",
          btnCloseAlertTitle: "Close notification",
          btnCalculateText: "Calculate",
          btnCalculateTitle: "Calculate CPU Scheduling Results",
          btnRandomizeText: "Randomize BT",
          btnRandomizeTitle: "Randomize Burst Times (BT)",
          btnResetText: "Reset",
          btnResetTitle: "Reset to Default Values",
          resultsHeading: "Simulation Results",
          switcherAria: "Select CPU Scheduling Algorithm",
          tabFcfsAria: "First-Come, First-Served Algorithm",
          tabSjfAria: "Shortest Job First Algorithm",
          tabRrAria: "Round Robin Algorithm",
          labelAwtTitle: "AVERAGE WAITING TIME",
          labelAwtSub: "(AWT)",
          labelAtatTitle: "AVERAGE TURNAROUND",
          labelAtatSub: "TIME (ATAT)",
          resultsHint: "Results from the last calculation — press “Calculate” again after editing any value.",
          compareTitle: "Algorithm comparison (same input)",
          compareNote: "Computed from the same input above · lowest AWT is best",
          compareBest: "Lowest AWT",
          compareCurrent: "Viewing now",
          tableAvgWt: "AVG WT (average waiting time)",
          btnExportText: "Export CSV",
          btnExportTitle: "Download the latest results as a CSV file",
          exportHint: "Attach these results to your report",
          exportOneLabel: "Export one algorithm",
          exportAllLabel: "All three algorithms",
          exportAllHint: "single file",
          exportMenuAria: "Choose what to export",
          labelGanttTitle: "Gantt Timeline Visualization",
          labelMakespanText: "Total Makespan:",
          ganttChartAria: "Gantt timeline chart displaying CPU execution sequence",
          labelTableTitle: "Detailed Execution Metrics",
          formulaHintText: "TAT = CT - AT = CT • WT = TAT - BT",
          resultsTableAria: "Detailed metrics table for CPU processes",
          thProcess: "PROCESS",
          thAt: "ARRIVAL (AT)",
          thBt: "BURST TIME (BT)",
          thSt: "START TIME (ST)",
          thCt: "COMPLETION TIME (CT)",
          thTat: "TURNAROUND TIME (TAT)",
          thWt: "WAITING TIME (WT)",
          thStatus: "STATUS",
          procLabelPrefix: "Process ",
          statusCompleted: "Completed",
          glossarySummaryTitle: "Glossary & Formulas (Click to expand)",
          footerText: "Crafted with soft Claymorphism aesthetics • Instantaneous CPU Scheduling Simulator (AT = 0)",
          errEmptyProc: "Please enter the number of processes.",
          errInvalidProc: "Number of processes must be a positive integer greater than 0 (e.g. 2 - 10).",
          errMaxProc: "Maximum allowed number of processes is 10 for optimal chart rendering.",
          errEmptyTq: "Please enter the Time Quantum (Q) for Round Robin.",
          errInvalidTq: "Time Quantum (Q) must be a positive integer greater than 0.",
          errEmptyBt: "Please fill in Burst Time for all processes (missing at {p}).",
          errInvalidBt: "Burst Time for {p} must be a positive integer greater than 0.",
          errMaxBt: "Burst Time for {p} must not exceed 50 ms.",
          errMaxTq: "Time Quantum (Q) must not exceed 20 ms.",
          errProcMismatch: "Burst Time fields ({count}) do not match the number of processes ({num}). Please adjust the process count.",
          glossary: [
            { term: "Burst Time (BT)", desc: "The total duration of CPU execution required by a process to finish (unit: ms)." },
            { term: "Arrival Time (AT = 0)", desc: "The timestamp a process enters the ready queue. In this simulator, all processes arrive at t = 0." },
            { term: "Start Time (ST)", desc: "The very first timestamp when the CPU starts executing the process." },
            { term: "Completion Time (CT)", desc: "The timestamp at which the process finishes its entire execution." },
            { term: "Waiting Time (WT)", desc: "Total duration spent waiting in the ready queue. WT = CT - BT (when AT = 0)." },
            { term: "Turnaround Time (TAT)", desc: "Total elapsed time from arrival to completion: TAT = CT (when AT = 0)." }
          ]
        }
      };

      /**
       * ดึงข้อความแปลตามภาษาปัจจุบัน (ใช้ร่วมกันระหว่าง index.html และ app.js)
       * @param {string} key คีย์ใน i18n
       * @param {string} [fallback] ข้อความสำรองเมื่อไม่พบคีย์
       */
      function simText(key, fallback) {
        const dict = i18n[window.currentLanguage] || i18n.th;
        return (dict && dict[key]) || fallback || '';
      }

      // ให้ app.js ใช้ข้อความชุดเดียวกัน (ต้องพร้อมก่อนการเรนเดอร์ครั้งแรก)
      window.simText = simText;
/* --------------------------------------------------------------------------
   updateLanguage(): แปลข้อความทุกจุดบนหน้าจอ
   -------------------------------------------------------------------------- */

function updateLanguage(lang) {
        const t = i18n[lang] || i18n.th;
        window.currentLanguage = lang;
        document.documentElement.lang = lang;
        try { localStorage.setItem('simulator-lang', lang); } catch (e) {}

        const textMap = {
          'main-title': t.mainTitle,
          'main-subtitle': t.mainSubtitle,
          'at-pill': t.atPill,
          'input-heading': t.inputHeading,
          'badge-status-at': t.badgeStatusAt,
          'label-num-processes': t.labelNumProcesses,
          'unit-num-processes': t.processUnit,
          'label-tq-text': t.labelTqText,
          'label-hint-rr': t.labelHintRr,
          'label-burst-times': t.labelBurstTimes,
          'label-burst-note': t.labelBurstNote,
          'btn-calculate-text': t.btnCalculateText,
          'btn-randomize-text': t.btnRandomizeText,
          'btn-reset-text': t.btnResetText,
          'results-heading': t.resultsHeading,
          'label-awt-title': t.labelAwtTitle,
          'label-awt-sub': t.labelAwtSub,
          'label-atat-title': t.labelAtatTitle,
          'label-atat-sub': t.labelAtatSub,
          'results-hint': t.resultsHint,
          'compare-title': t.compareTitle,
          'compare-note': t.compareNote,
          'table-avg-label': t.tableAvgWt,
          'btn-export-text': t.btnExportText,
          'export-hint': t.exportHint,
          'label-gantt-title': t.labelGanttTitle,
          'label-makespan-text': t.labelMakespanText,
          'label-table-title': t.labelTableTitle,
          'formula-hint-text': t.formulaHintText,
          'th-process': t.thProcess,
          'th-at': t.thAt,
          'th-bt': t.thBt,
          'th-st': t.thSt,
          'th-ct': t.thCt,
          'th-tat': t.thTat,
          'th-wt': t.thWt,
          'th-status': t.thStatus,
          'glossary-summary-title': t.glossarySummaryTitle,
          'footer-text': t.footerText,
          'alert-badge-text': t.alertBadgeText
        };

        Object.entries(textMap).forEach(([id, val]) => {
          const el = document.getElementById(id);
          if (el) el.textContent = val;
        });

        document.title = t.docTitle;
        const metaDescEl = document.getElementById('doc-meta-desc');
        if (metaDescEl) metaDescEl.setAttribute('content', t.metaDesc);

        // Synchronize ARIA & Titles
        const themeSwitcher = document.querySelector('.liquid-theme-switcher');
        if (themeSwitcher) {
          themeSwitcher.setAttribute('aria-label', lang === 'en' ? 'Choose Theme' : 'เลือกธีม / Choose Theme');
          const optLight = themeSwitcher.querySelector('.theme-option:nth-of-type(1)');
          const optDark = themeSwitcher.querySelector('.theme-option:nth-of-type(2)');
          if (optLight) optLight.title = lang === 'en' ? 'Light Mode' : 'โหมดสว่าง (Light)';
          if (optDark) optDark.title = lang === 'en' ? 'Dark Mode' : 'โหมดมืด (Dark)';
        }

        const langGroup = document.querySelector('.lang-toggle-group');
        if (langGroup) langGroup.setAttribute('aria-label', t.langGroupAria);

        const langWrap = document.querySelector('.clay-toggle-wrap');
        if (langWrap) langWrap.title = t.langToggleTitle;

        const langInput = document.getElementById('lang-toggle');
        if (langInput) {
          langInput.setAttribute('aria-label', t.langToggleAria);
          if (langInput.checked !== (lang === 'en')) {
            langInput.checked = (lang === 'en');
          }
        }

        const numProcInp = document.getElementById('num-processes');
        if (numProcInp) {
          numProcInp.setAttribute('aria-label', t.labelNumProcesses);
          numProcInp.placeholder = t.placeholderNumProc;
        }

        const tqInp = document.getElementById('time-quantum');
        if (tqInp) {
          tqInp.setAttribute('aria-label', t.ariaTq);
          tqInp.placeholder = t.placeholderTq;
        }

        const btnProcDec = document.getElementById('btn-proc-dec');
        if (btnProcDec) {
          btnProcDec.title = t.btnDecProcTitle;
          btnProcDec.setAttribute('aria-label', t.btnDecProcTitle);
        }
        const btnProcInc = document.getElementById('btn-proc-inc');
        if (btnProcInc) {
          btnProcInc.title = t.btnIncProcTitle;
          btnProcInc.setAttribute('aria-label', t.btnIncProcTitle);
        }
        const btnTqDec = document.getElementById('btn-tq-dec');
        if (btnTqDec) {
          btnTqDec.title = t.btnDecTqTitle;
          btnTqDec.setAttribute('aria-label', t.btnDecTqTitle);
        }
        const btnTqInc = document.getElementById('btn-tq-inc');
        if (btnTqInc) {
          btnTqInc.title = t.btnIncTqTitle;
          btnTqInc.setAttribute('aria-label', t.btnIncTqTitle);
        }

        const btnExportEl = document.getElementById('btn-export');
        if (btnExportEl) {
          btnExportEl.title = t.btnExportTitle;
          btnExportEl.setAttribute('aria-label', t.btnExportTitle);
        }

        const burstContainer = document.getElementById('burst-inputs-container');
        if (burstContainer) burstContainer.setAttribute('aria-label', t.ariaBurstGroup);

        document.querySelectorAll('.burst-number-input').forEach((inp, idx) => {
          inp.setAttribute('aria-label', t.ariaBurstItem.replace('{p}', `P${idx + 1}`));
        });

        document.querySelectorAll('.burst-pill-card').forEach((card, idx) => {
          const p = idx + 1;
          const dec = card.querySelector('.bt-btn-dec');
          const inc = card.querySelector('.bt-btn-inc');
          const decTitle = lang === 'en' ? `Decrease BT for P${p} (Hold to repeat)` : `ลดเวลาประมวลผล P${p} (กดค้างได้)`;
          const incTitle = lang === 'en' ? `Increase BT for P${p} (Hold to repeat)` : `เพิ่มเวลาประมวลผล P${p} (กดค้างได้)`;
          if (dec) { dec.title = decTitle; dec.setAttribute('aria-label', decTitle); }
          if (inc) { inc.title = incTitle; inc.setAttribute('aria-label', incTitle); }
        });

        const btnCloseAlert = document.getElementById('btn-close-alert');
        if (btnCloseAlert) {
          btnCloseAlert.title = t.btnCloseAlertTitle;
          btnCloseAlert.setAttribute('aria-label', t.btnCloseAlertTitle);
        }

        const btnCalc = document.getElementById('btn-calculate');
        if (btnCalc) btnCalc.title = t.btnCalculateTitle;

        const btnRand = document.getElementById('btn-randomize');
        if (btnRand) btnRand.title = t.btnRandomizeTitle;

        const btnReset = document.getElementById('btn-reset');
        if (btnReset) btnReset.title = t.btnResetTitle;

        const tabSwitcher = document.querySelector('.clay-capsule-switcher');
        if (tabSwitcher) tabSwitcher.setAttribute('aria-label', t.switcherAria);

        const tabFcfs = document.getElementById('tab-fcfs');
        if (tabFcfs) tabFcfs.setAttribute('aria-label', t.tabFcfsAria);

        const tabSjf = document.getElementById('tab-sjf');
        if (tabSjf) tabSjf.setAttribute('aria-label', t.tabSjfAria);

        const tabRr = document.getElementById('tab-rr');
        if (tabRr) tabRr.setAttribute('aria-label', t.tabRrAria);

        const gantt = document.getElementById('gantt-chart');
        if (gantt) gantt.setAttribute('aria-label', t.ganttChartAria);

        const resTable = document.getElementById('results-table');
        if (resTable) resTable.setAttribute('aria-label', t.resultsTableAria);

        // Re-translate active error message in real time if visible
        if (window.activeValidationError) {
          const alertEl = document.getElementById('validation-alert');
          if (alertEl && alertEl.style.display !== 'none') {
            let msg = t[window.activeValidationError.key] || window.activeValidationError.message;
            if (window.activeValidationError.param) {
              Object.entries(window.activeValidationError.param).forEach(([k, v]) => {
                msg = msg.replace(`{${k}}`, v);
              });
            }
            const msgEl = document.getElementById('alert-message');
            if (msgEl) msgEl.textContent = msg;
          }
        }

        // อัปเดตคำอธิบายอัลกอริทึม + ตารางผลลัพธ์ให้เป็นภาษาที่เลือก
        // ต้อง validate ก่อน ไม่งั้นการสลับภาษาจะคำนวณผลใหม่จากค่าที่ถูกบังคับ
        // (BT ที่ว่าง -> 1, TQ ที่ผิด -> 2) โดยที่ผู้ใช้ไม่รู้ตัว
        const activeTab = document.querySelector('.capsule-tab.active');
        const currentAlgoKey = activeTab ? activeTab.getAttribute('data-algorithm') : 'fcfs';
        const inputCheck = validateSchedulingInputs();

        if (!inputCheck.isValid) {
          // ข้อมูลไม่ครบ: คงผลเดิมไว้ แต่ render ซ้ำด้วยภาษาใหม่ เพื่อให้ label ในตารางตรงกับ UI
          if (typeof window.rerenderLastResult === 'function') {
            window.rerenderLastResult();
          }
          showValidationError(inputCheck, inputCheck.input);
        } else {
          hideValidationError();
          renderResultsFor(currentAlgoKey);
        }

        // Glossary Items
        const glossaryGrid = document.getElementById('glossary-grid');
        if (glossaryGrid) {
          glossaryGrid.innerHTML = '';
          t.glossary.forEach(g => {
            const div = document.createElement('div');
            div.className = 'glossary-item';
            div.innerHTML = `<span class="glossary-term">${g.term}</span><span class="glossary-desc">${g.desc}</span>`;
            glossaryGrid.appendChild(div);
          });
        }

        if (typeof updateCapsuleGlider === 'function') {
          updateCapsuleGlider(false);
        }

        // แถบเปรียบเทียบ: อัปเดตภาษาของป้ายด้วย (ถ้าข้อมูลยังไม่ถูกต้องจะใช้ผลชุดเดิม)
        renderComparison();
      }

      /* ==========================================================================
         Validation & Error UI Management
         ========================================================================== */
