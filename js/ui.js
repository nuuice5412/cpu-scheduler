/* ==========================================================================
   ui.js — ชั้นติดต่อผู้ใช้
   validation · การแสดงผล/เปรียบเทียบ · ส่งออก CSV · ช่องรับข้อมูล
   ========================================================================== */


/* --------------------------------------------------------------------------
   1) ตรวจสอบข้อมูลนำเข้า (validation)
   -------------------------------------------------------------------------- */

function clearInputErrors() {
        document.querySelectorAll('.input-field-error').forEach(el => el.classList.remove('input-field-error'));
      }

      function highlightError(element) {
        if (!element) return;
        const wrapper = element.closest('.inset-input-wrapper') || element.closest('.burst-pill-card') || element;
        wrapper.classList.add('input-field-error');
        element.focus();
      }

      function showValidationError(errorKeyOrMsg, offendingInput, param) {
        const lang = window.currentLanguage || 'th';
        const t = i18n[lang] || i18n.th;

        let key = null;
        let message = '';
        if (typeof errorKeyOrMsg === 'object' && errorKeyOrMsg !== null) {
          key = errorKeyOrMsg.key;
          param = errorKeyOrMsg.param || param || {};
          message = t[key] || errorKeyOrMsg.message || '';
          if (!offendingInput && errorKeyOrMsg.input) {
            offendingInput = errorKeyOrMsg.input;
          }
        } else if (t[errorKeyOrMsg]) {
          key = errorKeyOrMsg;
          message = t[key];
        } else {
          message = errorKeyOrMsg;
        }

        if (param) {
          Object.entries(param).forEach(([k, v]) => {
            message = message.replace(`{${k}}`, v);
          });
        }

        window.activeValidationError = { key, param, message, input: offendingInput };

        const alertEl = document.getElementById('validation-alert');
        const msgEl = document.getElementById('alert-message');
        if (msgEl) msgEl.textContent = message;
        if (alertEl) {
          alertEl.style.display = 'flex';
          // Trigger shake animation reflow
          alertEl.style.animation = 'none';
          void alertEl.offsetWidth;
          alertEl.style.animation = '';
        }
        if (offendingInput) {
          highlightError(offendingInput);
        }
      }

      function hideValidationError() {
        window.activeValidationError = null;
        const alertEl = document.getElementById('validation-alert');
        if (alertEl) alertEl.style.display = 'none';
        clearInputErrors();
      }

      function validateSchedulingInputs() {
        const lang = window.currentLanguage || 'th';
        const t = i18n[lang] || i18n.th;
        clearInputErrors();

        const numProcInput = document.getElementById('num-processes');
        const tqInput = document.getElementById('time-quantum');
        const burstContainer = document.getElementById('burst-inputs-container');

        // 1. ตรวจสอบการไม่กรอกจำนวนโปรเซส (Empty process count)
        const numProcVal = numProcInput ? numProcInput.value.trim() : '';
        if (numProcVal === '') {
          return { isValid: false, key: 'errEmptyProc', message: t.errEmptyProc, input: numProcInput };
        }

        // 2. ตรวจสอบจำนวนโปรเซสเป็น 0 หรือติดลบ หรือไม่ใช่จำนวนเต็ม (<= 0 or not integer)
        const numProc = Number(numProcVal);
        if (isNaN(numProc) || !Number.isInteger(numProc) || numProc <= 0) {
          return { isValid: false, key: 'errInvalidProc', message: t.errInvalidProc, input: numProcInput };
        }

        if (numProc > 10) {
          return { isValid: false, key: 'errMaxProc', message: t.errMaxProc, input: numProcInput };
        }

        // 3. ตรวจสอบ Time Quantum ไม่ใช่จำนวนเต็มบวก (<= 0 or not integer or empty)
        const tqVal = tqInput ? tqInput.value.trim() : '';
        if (tqVal === '') {
          return { isValid: false, key: 'errEmptyTq', message: t.errEmptyTq, input: tqInput };
        }
        const tq = Number(tqVal);
        if (isNaN(tq) || !Number.isInteger(tq) || tq <= 0) {
          return { isValid: false, key: 'errInvalidTq', message: t.errInvalidTq, input: tqInput };
        }
        // 3.1 Time Quantum ต้องไม่เกิน 20 ms (ให้ตรงกับ attribute max ของ input)
        if (tq > 20) {
          return { isValid: false, key: 'errMaxTq', message: t.errMaxTq, input: tqInput };
        }

        // 4 & 5. ตรวจสอบเวลาประมวลผล (Burst Time) ของแต่ละโปรเซส
        const burstInputs = burstContainer ? burstContainer.querySelectorAll('.burst-number-input') : [];
        if (burstInputs.length === 0) {
          return { isValid: false, key: 'errEmptyProc', message: t.errEmptyProc, input: numProcInput };
        }

        // 4.1 จำนวนช่องกรอกต้องตรงกับจำนวนโปรเซสที่ระบุ
        // (กันเคสที่เบราว์เซอร์ restore ค่า num-processes หลัง reload แต่ JS สร้างช่องไว้จำนวนอื่น)
        if (burstInputs.length !== numProc) {
          return {
            isValid: false,
            key: 'errProcMismatch',
            param: { count: burstInputs.length, num: numProc },
            message: t.errProcMismatch.replace('{count}', burstInputs.length).replace('{num}', numProc),
            input: numProcInput
          };
        }

        const validBurstTimes = [];
        for (let i = 0; i < burstInputs.length; i++) {
          const inp = burstInputs[i];
          const pName = `P${i + 1}`;
          const val = inp.value.trim();

          // 4. กรอกข้อมูลไม่ครบทุกโปรเซส (Empty field)
          if (val === '') {
            return {
              isValid: false,
              key: 'errEmptyBt',
              param: { p: pName },
              message: t.errEmptyBt.replace('{p}', pName),
              input: inp
            };
          }

          // 5. Burst Time ไม่ใช่จำนวนเต็มบวก (<= 0 or not integer or NaN)
          const bt = Number(val);
          if (isNaN(bt) || !Number.isInteger(bt) || bt <= 0) {
            return {
              isValid: false,
              key: 'errInvalidBt',
              param: { p: pName },
              message: t.errInvalidBt.replace('{p}', pName),
              input: inp
            };
          }

          // 5.1 Burst Time ต้องไม่เกิน 50 ms (ให้ตรงกับ attribute max และกันกราฟ Gantt ระเบิด)
          if (bt > 50) {
            return {
              isValid: false,
              key: 'errMaxBt',
              param: { p: pName },
              message: t.errMaxBt.replace('{p}', pName),
              input: inp
            };
          }

          validBurstTimes.push(bt);
        }

        return {
          isValid: true,
          data: {
            numProcesses: numProc,
            timeQuantum: tq,
            burstTimes: validBurstTimes
          }
        };
      }

      /* ==========================================================================
         Result Rendering (delegated to app.js)
         ========================================================================== */

      /**
       * วาดผลลัพธ์ของอัลกอริทึมที่เลือกด้วย engine จริงใน app.js เท่านั้น
       * ตัวเลขบนหน้าจอต้องคำนวณจากค่าที่ผู้ใช้กรอกเสมอ (ไม่มีข้อมูลตัวอย่าง hardcode แล้ว)
       * @param {string} algoKey 'fcfs' | 'sjf' | 'rr'
       */
      /**
       * ทำเครื่องหมายว่าผลลัพธ์บนจอ "เก่าแล้ว" (ผู้ใช้แก้ค่าแต่ยังไม่กดคำนวณ)
       * จะไปลดความเด่นของการ์ดสรุป/Gantt/ตาราง และเปลี่ยนจุดสีในคำอธิบายเป็นสีส้ม
       */
/* --------------------------------------------------------------------------
   2) เชื่อมผลลัพธ์ + แถบเปรียบเทียบ + สถานะผลลัพธ์เก่า
   -------------------------------------------------------------------------- */

function markResultsStale() {
        const panel = document.getElementById('panel-content');
        if (panel) panel.classList.add('is-stale');
      }

      function renderResultsFor(algoKey) {
        if (typeof window.runSchedulingAlgorithm !== 'function') {
          console.warn('[CPU Simulator] app.js ยังไม่ถูกโหลด — ไม่สามารถคำนวณผลลัพธ์ได้');
          return;
        }
        window.runSchedulingAlgorithm(algoKey || 'fcfs');
        renderComparison();
      }

      // ผลสรุปของทั้งสามอัลกอริทึมชุดล่าสุด (ใช้วาดซ้ำเมื่อสลับภาษา)
      let lastComparison = null;

      /** ตรวจข้อมูลในฟอร์มแบบเร็ว ๆ ก่อนวาดแถบเปรียบเทียบ */
      function inputsLookValid() {
        const tqInput = document.getElementById('time-quantum');
        const tq = parseInt(tqInput ? tqInput.value : '', 10);
        if (!(tq >= 1 && tq <= 20)) return false;

        const fields = document.querySelectorAll('.burst-number-input');
        if (!fields.length || fields.length > 10) return false;

        return Array.from(fields).every((inp) => {
          const v = parseInt(inp.value, 10);
          return Number.isInteger(v) && v >= 1 && v <= 50;
        });
      }

      /**
       * วาดแถบเปรียบเทียบ: ให้ engine คำนวณทั้งสามอัลกอริทึมจากข้อมูลชุดเดียวกัน
       * ถ้าข้อมูลในฟอร์มยังไม่ถูกต้อง จะวาดซ้ำจากผลชุดล่าสุด (เพื่ออัปเดตภาษาเท่านั้น)
       */
      function renderComparison() {
        const grid = document.getElementById('compare-grid');
        if (!grid) return;

        if (inputsLookValid() && typeof window.summariseAlgorithms === 'function') {
          const fresh = window.summariseAlgorithms();
          if (fresh && fresh.length) lastComparison = fresh;
        }
        if (!lastComparison) return;

        const names = { fcfs: 'FCFS', sjf: 'SJF', rr: 'Round Robin' };
        const activeTab = document.querySelector('.capsule-tab.active');
        const activeKey = activeTab ? activeTab.getAttribute('data-algorithm') : 'fcfs';
        const best = lastComparison.reduce((a, b) => (b.awt < a.awt ? b : a), lastComparison[0]);

        grid.innerHTML = lastComparison.map((s) => {
          const classes = ['compare-card'];
          if (s.key === best.key) classes.push('is-best');
          if (s.key === activeKey) classes.push('is-active');

          let badge = '';
          if (s.key === best.key) {
            badge = `<span class="compare-badge">★ ${simText('compareBest', 'Lowest AWT')}</span>`;
          } else if (s.key === activeKey) {
            badge = `<span class="compare-badge compare-badge--muted">${simText('compareCurrent', 'Viewing now')}</span>`;
          }

          return `
            <div class="${classes.join(' ')}">
              <div class="compare-card-head">
                <span class="compare-name">${names[s.key] || s.key}</span>
                ${badge}
              </div>
              <dl class="compare-metrics">
                <div><dt>AWT</dt><dd>${s.awt.toFixed(2)} <span class="unit-text">ms</span></dd></div>
                <div><dt>ATAT</dt><dd>${s.atat.toFixed(2)} <span class="unit-text">ms</span></dd></div>
                <div><dt>Makespan</dt><dd>${s.makespan} <span class="unit-text">ms</span></dd></div>
              </dl>
            </div>`;
        }).join('');
      }

      /** ครอบค่าสำหรับ CSV (ใส่ quote เมื่อมี comma, quote หรือขึ้นบรรทัดใหม่) */
/* --------------------------------------------------------------------------
   3) ส่งออก CSV + เมนูเลือกอัลกอริทึม
   -------------------------------------------------------------------------- */

function csvCell(value) {
        const text = String(value == null ? '' : value);
        return /[",\r\n]/.test(text) ? '"' + text.replace(/"/g, '""') + '"' : text;
      }

      /** สร้างบล็อก CSV ของอัลกอริทึมหนึ่งตัว (หัวข้อ + ตารางรายละเอียด + AVG WT) */
      function buildAlgorithmBlock(result, algoName) {
        const lines = [];
        const addRow = (cells) => lines.push(cells.map(csvCell).join(','));

        addRow(['Algorithm', algoName]);
        addRow(['AWT (ms)', result.awt, 'ATAT (ms)', result.atat, 'Makespan (ms)', result.totalMakespanNum]);
        addRow(['Process', 'Arrival Time (AT)', 'Burst Time (BT)', 'Start Time (ST)',
          'Completion Time (CT)', 'Turnaround Time (TAT)', 'Waiting Time (WT)']);
        result.rows.forEach((r) => addRow([r.name, r.at, r.bt, r.st, r.ct, r.tat, r.wt]));
        addRow(['AVG WT', '', '', '', '', '', result.awt]);
        return lines;
      }

      /**
       * สร้างเนื้อหา CSV ตามสิ่งที่ผู้ใช้เลือก
       * @param {'fcfs'|'sjf'|'rr'|'all'} scope อัลกอริทึมเดียว หรือ 'all' = ทั้งสาม
       */
      function buildResultCsv(scope) {
        if (typeof window.computeResultFor !== 'function') return '';

        const algoNames = { fcfs: 'FCFS', sjf: 'SJF', rr: 'Round Robin' };
        const keys = scope === 'all' ? ['fcfs', 'sjf', 'rr'] : [scope || 'fcfs'];
        const results = keys
          .map((key) => ({ key: key, result: window.computeResultFor(key) }))
          .filter((entry) => entry.result);
        if (!results.length) return '';

        const lines = [];
        const addRow = (cells) => lines.push(cells.map(csvCell).join(','));

        addRow(['CPU Scheduling Simulator (AT = 0)']);
        addRow(['Exported', new Date().toISOString().slice(0, 16).replace('T', ' ')]);
        addRow(['Contents', results.length > 1 ? 'All three algorithms (same input)' : (algoNames[keys[0]] || keys[0])]);

        results.forEach((entry) => {
          lines.push('');
          if (results.length > 1) addRow(['=== ' + (algoNames[entry.key] || entry.key) + ' ===']);
          buildAlgorithmBlock(entry.result, algoNames[entry.key] || entry.key).forEach((line) => lines.push(line));
        });

        if (results.length > 1) {
          lines.push('');
          addRow(['Comparison (same input)']);
          addRow(['Algorithm', 'AWT (ms)', 'ATAT (ms)', 'Makespan (ms)']);
          results.forEach((entry) => addRow([
            algoNames[entry.key] || entry.key,
            entry.result.awt,
            entry.result.atat,
            entry.result.totalMakespanNum
          ]));
        }

        return lines.join('\r\n');
      }

      /** ดาวน์โหลด CSV ตามสิ่งที่เลือก (เติม BOM เพื่อให้ Excel อ่านภาษาไทยถูกต้อง) */
      function exportResultsCsv(scope) {
        const csv = buildResultCsv(scope);
        if (!csv) return;

        const label = scope === 'all' ? 'all-3-algorithms' : (scope || 'fcfs');
        const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'cpu-scheduling-' + label + '-' + new Date().toISOString().slice(0, 10) + '.csv';
        document.body.appendChild(link);
        link.click();
        link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }

      /* ── เมนูส่งออก: เลือกอัลกอริทึมเดียว หรือรวมทั้งสาม ────────────────── */

      const EXPORT_NAMES = { fcfs: 'FCFS', sjf: 'SJF', rr: 'Round Robin' };

      /** สร้างรายการในเมนูตามภาษาปัจจุบัน + ไฮไลต์อัลกอริทึมที่กำลังดูอยู่ */
      function buildExportMenu() {
        const menu = document.getElementById('export-menu');
        if (!menu) return;

        const activeTab = document.querySelector('.capsule-tab.active');
        const activeKey = activeTab ? activeTab.getAttribute('data-algorithm') : 'fcfs';
        const viewing = simText('compareCurrent', 'Viewing now');

        const single = ['fcfs', 'sjf', 'rr'].map((key) => {
          const isActive = key === activeKey;
          return `
            <button type="button" class="export-item${isActive ? ' is-active' : ''}" role="menuitem" data-export="${key}">
              <span class="export-item-name">${EXPORT_NAMES[key]}</span>
              ${isActive ? `<span class="export-item-hint">${viewing}</span>` : ''}
            </button>`;
        }).join('');

        menu.innerHTML = `
          <div class="export-menu-label">${simText('exportOneLabel', 'อัลกอริทึมเดียว')}</div>
          ${single}
          <div class="export-menu-sep" role="separator"></div>
          <button type="button" class="export-item export-item--all" role="menuitem" data-export="all">
            <span class="export-item-name">${simText('exportAllLabel', 'ทั้งสามอัลกอริทึม')}</span>
            <span class="export-item-hint">${simText('exportAllHint', 'ไฟล์เดียว')}</span>
          </button>`;
      }

      /** เปิด/ปิดเมนู (คืนโฟกัสกลับปุ่มเมื่อปิดด้วย Escape) */
      function setExportMenu(open, restoreFocus) {
        const menu = document.getElementById('export-menu');
        const btn = document.getElementById('btn-export');
        if (!menu || !btn) return;

        if (open) buildExportMenu();
        menu.hidden = !open;
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');

        if (open) {
          const first = menu.querySelector('.export-item');
          if (first) first.focus();
        } else if (restoreFocus) {
          btn.focus();
        }
      }

      /** เลื่อนโฟกัสระหว่างรายการในเมนูด้วยลูกศรขึ้น/ลง */
      function moveExportFocus(delta) {
        const menu = document.getElementById('export-menu');
        if (!menu || menu.hidden) return;
        const items = Array.from(menu.querySelectorAll('.export-item'));
        if (!items.length) return;
        const current = items.indexOf(document.activeElement);
        items[(current + delta + items.length) % items.length].focus();
      }

      // ปุ่มกดค้าง: เก็บเฉพาะ "ตัวหยุด" ที่ active อยู่ตัวเดียว
      // → ใช้ listener ระดับ window ชุดเดียว ไม่ผูก listener ใหม่ทุกครั้งที่สร้างปุ่ม (กัน listener leak)
/* --------------------------------------------------------------------------
   4) ช่อง Burst Time + ปุ่มกดค้าง
   -------------------------------------------------------------------------- */

let activeHoldStop = null;
      window.addEventListener('blur', () => {
        if (activeHoldStop) activeHoldStop();
      });
      document.addEventListener('visibilitychange', () => {
        if (document.hidden && activeHoldStop) activeHoldStop();
      });

      function attachHoldRepeat(btn, onStep, onStop) {
        if (!btn) return;
        let timer = null;
        let interval = null;
        let isHolding = false;
        let didRepeat = false;

        const start = (e) => {
          if (e.type === 'mousedown' && e.button !== 0) return;
          if (btn.disabled) return;
          e.preventDefault();
          isHolding = true;
          didRepeat = false;
          activeHoldStop = stop;

          onStep(false);

          clearTimeout(timer);
          clearInterval(interval);

          timer = setTimeout(() => {
            if (!isHolding || btn.disabled) return;
            didRepeat = true;
            interval = setInterval(() => {
              if (!isHolding || btn.disabled) {
                clearInterval(interval);
                return;
              }
              onStep(true);
            }, 65);
          }, 320);
        };

        const stop = () => {
          if (activeHoldStop === stop) activeHoldStop = null;
          if (!isHolding) return;
          isHolding = false;
          clearTimeout(timer);
          clearInterval(interval);
          if (typeof onStop === 'function') {
            onStop(didRepeat);
          }
        };

        btn.addEventListener('mousedown', start);
        btn.addEventListener('touchstart', start, { passive: false });
        btn.addEventListener('mouseup', stop);
        btn.addEventListener('mouseleave', stop);
        btn.addEventListener('touchend', stop);
        btn.addEventListener('touchcancel', stop);
      }

      // ค่าเริ่มต้นของ Burst Time ต่อโปรเซส (ใช้ทั้งตอนสร้างครั้งแรกและตอนกดรีเซ็ต)
      const DEFAULT_BURST_TIMES = [6, 8, 7, 3, 5, 4, 9, 2, 6, 8];

      /**
       * สร้างช่องกรอก Burst Time ใหม่ตามจำนวนโปรเซส
       * @param {number} count จำนวนโปรเซสที่ต้องการ
       * @param {boolean} forceDefaults true = ทิ้งค่าเดิมทั้งหมดแล้วกลับไปใช้ค่าเริ่มต้นจริง ๆ
       *        (ใช้กับปุ่มรีเซ็ต) / false = คงค่าที่ผู้ใช้กรอกไว้เท่าที่มีอยู่
       */
      function renderBurstInputs(count, forceDefaults = false) {
        const burstWrap = document.getElementById('burst-inputs-container');
        if (!burstWrap) return;
        const currentInputs = burstWrap.querySelectorAll('.burst-number-input');
        const existingValues = [];
        currentInputs.forEach(inp => existingValues.push(inp.value));

        const currentLang = window.currentLanguage || 'th';
        const t = i18n[currentLang] || i18n.th;

        burstWrap.innerHTML = '';
        for (let i = 1; i <= count; i++) {
          const hasPreservedValue = !forceDefaults &&
            existingValues[i - 1] !== undefined && existingValues[i - 1] !== '';
          const defaultVal = hasPreservedValue
            ? existingValues[i - 1]
            : (DEFAULT_BURST_TIMES[i - 1] || (Math.floor(Math.random() * 8) + 2));

          const card = document.createElement('div');
          card.className = 'burst-pill-card burst-card-enter';
          card.style.animationDelay = `${(i - 1) * 35}ms`;
          const itemAria = (t.ariaBurstItem || 'Burst time for {p}').replace('{p}', `P${i}`);
          const decTitle = currentLang === 'en' ? `Decrease BT for P${i} (Hold to repeat)` : `ลดเวลาประมวลผล P${i} (กดค้างได้)`;
          const incTitle = currentLang === 'en' ? `Increase BT for P${i} (Hold to repeat)` : `เพิ่มเวลาประมวลผล P${i} (กดค้างได้)`;

          card.innerHTML = `
            <span class="process-badge badge-p${i}">P${i}</span>
            <div class="bt-stepper-wrap">
              <button type="button" class="bt-btn bt-btn-dec" aria-label="${decTitle}" title="${decTitle}">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              </button>
              <input type="number" class="burst-number-input" min="1" max="50" aria-label="${itemAria}">
              <button type="button" class="bt-btn bt-btn-inc" aria-label="${incTitle}" title="${incTitle}">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              </button>
            </div>
          `;
          burstWrap.appendChild(card);

          // Wire hold-to-repeat on BT buttons
          const inp = card.querySelector('.burst-number-input');
          const btnDec = card.querySelector('.bt-btn-dec');
          const btnInc = card.querySelector('.bt-btn-inc');

          // ใส่ค่าเริ่มต้นผ่าน property (ไม่ interpolate ลง innerHTML → กันค่าแปลกปลอมหลุดเป็น HTML)
          if (inp) {
            const safeVal = String(defaultVal).replace(/[^0-9]/g, '');
            inp.value = safeVal !== '' ? safeVal : '1';
          }

          if (btnDec && inp) {
            attachHoldRepeat(btnDec, (isRapid) => {
              let val = parseInt(inp.value, 10);
              if (isNaN(val) || val <= 1) val = 1;
              if (val > 1) {
                inp.value = val - 1;
                if (!isRapid) {
                  if (typeof animateCounter === 'function') animateCounter(inp, 'down');
                } else if (typeof inp.animate === 'function') {
                  inp.animate([
                    { transform: 'translateY(-2px)' },
                    { transform: 'translateY(0)' }
                  ], { duration: 60 });
                }
              }
            }, (didRepeat) => {
              if (didRepeat && typeof animateCounter === 'function') {
                animateCounter(inp, 'down');
              }
            });
          }

          if (btnInc && inp) {
            attachHoldRepeat(btnInc, (isRapid) => {
              let val = parseInt(inp.value, 10);
              if (isNaN(val) || val < 1) val = 1;
              if (val < 50) {
                inp.value = val + 1;
                if (!isRapid) {
                  if (typeof animateCounter === 'function') animateCounter(inp, 'up');
                } else if (typeof inp.animate === 'function') {
                  inp.animate([
                    { transform: 'translateY(2px)' },
                    { transform: 'translateY(0)' }
                  ], { duration: 60 });
                }
              }
            }, (didRepeat) => {
              if (didRepeat && typeof animateCounter === 'function') {
                animateCounter(inp, 'up');
              }
            });
          }
        }
      }

      function initBurstInputs() {
        renderBurstInputs(4);
      }
