/* ==========================================================================
   ui-language.js
   updateLanguage(): แปลข้อความทั้งหน้าจอ (2 ภาษา)
   แยกออกจาก index.html — โหลดด้วย <script src> ตามลำดับใน index.html
   ========================================================================== */

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
