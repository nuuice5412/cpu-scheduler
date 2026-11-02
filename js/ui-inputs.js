/* ==========================================================================
   ui-inputs.js
   สร้างช่อง Burst Time + ปุ่มกดค้างเร่งความเร็ว
   แยกออกจาก index.html — โหลดด้วย <script src> ตามลำดับใน index.html
   ========================================================================== */

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
