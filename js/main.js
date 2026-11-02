/* ==========================================================================
   main.js
   เริ่มต้นระบบ: ธีม ภาษา และผูกปุ่มทั้งหมด
   แยกออกจาก index.html — โหลดด้วย <script src> ตามลำดับใน index.html
   ========================================================================== */

      document.addEventListener('DOMContentLoaded', () => {
        // Initialize Theme from localStorage or OS preference
        let savedTheme = 'light';
        try {
          savedTheme = localStorage.getItem('simulator-theme') ||
            (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        } catch (e) {}
        if (savedTheme !== 'dark') savedTheme = 'light';
        setTheme(savedTheme);

        // 2-State Liquid Glass Theme Switcher Listeners
        document.querySelectorAll('.theme-radio').forEach(radio => {
          radio.addEventListener('change', () => {
            if (radio.checked) setTheme(radio.value);
          });
        });

        // Initialize Language from localStorage
        let savedLang = 'th';
        try {
          savedLang = localStorage.getItem('simulator-lang') || 'th';
        } catch (e) {}

        const toggle = document.getElementById('lang-toggle');
        if (toggle) {
          toggle.checked = (savedLang === 'en');
          toggle.addEventListener('change', (e) => {
            updateLanguage(e.target.checked ? 'en' : 'th');
          });
        }

        const labelTh = document.getElementById('lang-label-th');
        if (labelTh) {
          const selectTh = () => {
            if (toggle) toggle.checked = false;
            updateLanguage('th');
          };
          labelTh.addEventListener('click', selectTh);
          labelTh.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              selectTh();
            }
          });
        }

        const labelEn = document.getElementById('lang-label-en');
        if (labelEn) {
          const selectEn = () => {
            if (toggle) toggle.checked = true;
            updateLanguage('en');
          };
          labelEn.addEventListener('click', selectEn);
          labelEn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              selectEn();
            }
          });
        }

        // สร้างช่องกรอกก่อน แล้ว updateLanguage() จะ validate + คำนวณ + ลงสีภาษาครั้งเดียว
        initBurstInputs();
        updateLanguage(savedLang);

        // Liquid Glass Capsule Switcher Glider
        const tabs = document.querySelectorAll('.capsule-tab');
        const capsuleGlider = document.querySelector('.capsule-glider');

        function updateCapsuleGlider(instant = false) {
          const activeTab = document.querySelector('.capsule-tab.active');
          if (activeTab && capsuleGlider) {
            if (instant) {
              capsuleGlider.style.transition = 'none';
            }
            capsuleGlider.style.transform = `translate(${activeTab.offsetLeft}px, ${activeTab.offsetTop}px)`;
            capsuleGlider.style.width = `${activeTab.offsetWidth}px`;
            capsuleGlider.style.height = `${activeTab.offsetHeight}px`;
            capsuleGlider.classList.add('ready');
            if (instant) {
              void capsuleGlider.offsetHeight;
              capsuleGlider.style.transition = '';
            }
          }
        }

        const panel = document.getElementById('panel-content');
        const tablist = document.getElementById('algo-tablist');
        const tabList = Array.prototype.slice.call(tabs);

        /**
         * เปิดใช้งานแท็บอัลกอริทึม: validate ก่อน — ถ้าข้อมูลไม่ถูกต้องจะไม่สลับแท็บ
         * (กันอาการ "แท็บขึ้น SJF แต่ตารางยังเป็นผลของ FCFS")
         * @param {Element} tabEl แท็บที่ต้องการเปิด
         * @param {boolean} shouldRender true = คำนวณผลลัพธ์ใหม่ด้วย engine
         * @returns {boolean} true เมื่อสลับแท็บสำเร็จ
         */
        function activateTab(tabEl, shouldRender) {
          if (!tabEl) return false;

          if (shouldRender) {
            const check = validateSchedulingInputs();
            if (!check.isValid) {
              showValidationError(check, check.input);
              return false;
            }
            hideValidationError();
          }

          tabList.forEach(t => {
            const isActive = t === tabEl;
            t.classList.toggle('active', isActive);
            t.setAttribute('aria-selected', isActive ? 'true' : 'false');
            t.tabIndex = isActive ? 0 : -1;
          });
          if (panel) panel.setAttribute('aria-labelledby', tabEl.id);
          updateCapsuleGlider(false);

          if (shouldRender) {
            renderResultsFor(tabEl.getAttribute('data-algorithm') || 'fcfs');
          }
          return true;
        }

        tabList.forEach(tab => {
          tab.addEventListener('click', () => {
            activateTab(tab, true);
          });
        });

        // คีย์บอร์ดตาม APG tab pattern: ลูกศรซ้าย/ขวา, Home, End
        if (tablist) {
          tablist.addEventListener('keydown', (e) => {
            if (['ArrowRight', 'ArrowLeft', 'Home', 'End'].indexOf(e.key) === -1) return;
            const current = tabList.indexOf(document.activeElement);
            if (current === -1) return;
            e.preventDefault();
            let next = current;
            if (e.key === 'ArrowRight') next = (current + 1) % tabList.length;
            if (e.key === 'ArrowLeft') next = (current - 1 + tabList.length) % tabList.length;
            if (e.key === 'Home') next = 0;
            if (e.key === 'End') next = tabList.length - 1;
            if (activateTab(tabList[next], true)) {
              tabList[next].focus();
            } else {
              // สลับไม่ได้ (ข้อมูลไม่ถูกต้อง) → คืนโฟกัสให้แท็บที่ active เพื่อไม่ให้ focus/active หลุดกัน
              const activeTab = document.querySelector('.capsule-tab.active');
              if (activeTab) activeTab.focus();
            }
          });
        }

        // Initialize Liquid Glider Position
        updateCapsuleGlider(true);
        window.addEventListener('resize', () => updateCapsuleGlider(true));
        if (document.fonts && document.fonts.ready) {
          document.fonts.ready.then(() => updateCapsuleGlider(true));
        }

        // Animated Counter & Micro-Interactions
        function animateCounter(element, direction = 'up') {
          if (!element) return;
          const isUp = direction === 'up';
          if (typeof element.animate === 'function') {
            element.animate([
              {
                transform: isUp ? 'translateY(16px) scale(0.82)' : 'translateY(-16px) scale(0.82)',
                opacity: 0,
                filter: 'blur(2.5px)'
              },
              {
                transform: isUp ? 'translateY(-2.5px) scale(1.06)' : 'translateY(2.5px) scale(1.06)',
                opacity: 1,
                filter: 'blur(0)',
                offset: 0.65
              },
              {
                transform: 'translateY(0) scale(1)',
                opacity: 1
              }
            ], {
              duration: 320,
              easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
            });
          } else {
            const cls = isUp ? 'counter-anim-up' : 'counter-anim-down';
            element.classList.remove('counter-anim-up', 'counter-anim-down');
            void element.offsetWidth;
            element.classList.add(cls);
            setTimeout(() => element.classList.remove(cls), 350);
          }
        }

        function triggerCapsulePulse(capsuleEl, type = 'inc') {
          if (!capsuleEl) return;
          const cls = type === 'inc' ? 'stepper-capsule-pulse-inc' : 'stepper-capsule-pulse-dec';
          capsuleEl.classList.remove('stepper-capsule-pulse-inc', 'stepper-capsule-pulse-dec');
          void capsuleEl.offsetWidth;
          capsuleEl.classList.add(cls);
          setTimeout(() => capsuleEl.classList.remove(cls), 420);
        }

        // 3D Stepper Controls & Synchronization
        const numProcInput = document.getElementById('num-processes');
        const tqInput = document.getElementById('time-quantum');
        const wrapProc = document.getElementById('wrap-num-processes');
        const wrapTq = document.getElementById('wrap-time-quantum');
        const btnProcDec = document.getElementById('btn-proc-dec');
        const btnProcInc = document.getElementById('btn-proc-inc');
        const btnTqDec = document.getElementById('btn-tq-dec');
        const btnTqInc = document.getElementById('btn-tq-inc');

        function updateStepperButtons() {
          if (numProcInput && btnProcDec && btnProcInc) {
            const val = parseInt(numProcInput.value, 10);
            btnProcDec.disabled = (val <= 1);
            btnProcInc.disabled = (val >= 10);
          }

          if (tqInput && btnTqDec && btnTqInc) {
            const val = parseInt(tqInput.value, 10);
            btnTqDec.disabled = (val <= 1);
            btnTqInc.disabled = (val >= 20);
          }
        }

        if (btnProcDec && numProcInput) {
          attachHoldRepeat(btnProcDec, (isRapid) => {
            let val = parseInt(numProcInput.value, 10) || 4;
            if (val > 1) {
              val = val - 1;
              numProcInput.value = val;
              if (!isRapid) animateCounter(numProcInput, 'down');
              triggerCapsulePulse(wrapProc, 'dec');
              renderBurstInputs(val);
              updateStepperButtons();
            }
          }, (didRepeat) => {
            if (didRepeat) animateCounter(numProcInput, 'down');
          });
        }

        if (btnProcInc && numProcInput) {
          attachHoldRepeat(btnProcInc, (isRapid) => {
            let val = parseInt(numProcInput.value, 10) || 4;
            if (val < 10) {
              val = val + 1;
              numProcInput.value = val;
              if (!isRapid) animateCounter(numProcInput, 'up');
              triggerCapsulePulse(wrapProc, 'inc');
              renderBurstInputs(val);
              updateStepperButtons();
            }
          }, (didRepeat) => {
            if (didRepeat) animateCounter(numProcInput, 'up');
          });
        }

        if (btnTqDec && tqInput) {
          attachHoldRepeat(btnTqDec, (isRapid) => {
            let val = parseInt(tqInput.value, 10) || 2;
            if (val > 1) {
              tqInput.value = val - 1;
              if (!isRapid) animateCounter(tqInput, 'down');
              triggerCapsulePulse(wrapTq, 'dec');
              updateStepperButtons();
            }
          }, (didRepeat) => {
            if (didRepeat) animateCounter(tqInput, 'down');
          });
        }

        if (btnTqInc && tqInput) {
          attachHoldRepeat(btnTqInc, (isRapid) => {
            let val = parseInt(tqInput.value, 10) || 2;
            if (val < 20) {
              tqInput.value = val + 1;
              if (!isRapid) animateCounter(tqInput, 'up');
              triggerCapsulePulse(wrapTq, 'inc');
              updateStepperButtons();
            }
          }, (didRepeat) => {
            if (didRepeat) animateCounter(tqInput, 'up');
          });
        }

        if (numProcInput) {
          numProcInput.addEventListener('input', () => {
            const val = parseInt(numProcInput.value, 10);
            if (!isNaN(val) && val >= 1 && val <= 10) {
              renderBurstInputs(val);
            }
            if (typeof numProcInput.animate === 'function') {
              numProcInput.animate([
                { transform: 'scale(1)' },
                { transform: 'scale(1.12)', offset: 0.5 },
                { transform: 'scale(1)' }
              ], { duration: 180, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' });
            }
            updateStepperButtons();
          });
        }

        if (tqInput) {
          tqInput.addEventListener('input', () => {
            if (typeof tqInput.animate === 'function') {
              tqInput.animate([
                { transform: 'scale(1)' },
                { transform: 'scale(1.12)', offset: 0.5 },
                { transform: 'scale(1)' }
              ], { duration: 180, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' });
            }
            updateStepperButtons();
          });
        }

        // Delegated input listener for Burst Times container
        const burstWrap = document.getElementById('burst-inputs-container');
        if (burstWrap) {
          burstWrap.addEventListener('input', (e) => {
            if (e.target && e.target.classList.contains('burst-number-input')) {
              if (typeof e.target.animate === 'function') {
                e.target.animate([
                  { transform: 'scale(1)' },
                  { transform: 'scale(1.12)', offset: 0.5 },
                  { transform: 'scale(1)' }
                ], { duration: 180, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' });
              }
            }
          });
        }

        document.querySelectorAll('.stepper-val-wrap').forEach(wrap => {
          wrap.addEventListener('click', (e) => {
            const inp = wrap.querySelector('.stepper-input');
            if (inp && e.target !== inp) inp.focus();
          });
        });

        updateStepperButtons();

        // Alert Close Button
        const closeAlertBtn = document.getElementById('btn-close-alert');
        if (closeAlertBtn) {
          closeAlertBtn.addEventListener('click', hideValidationError);
        }

        // คำนวณผลลัพธ์: ผูกกับ submit ของฟอร์ม → กดปุ่มหรือกด Enter ในช่องกรอกก็ทำงาน
        const simForm = document.getElementById('simulator-form');

        function handleCalculate() {
          const result = validateSchedulingInputs();
          if (!result.isValid) {
            showValidationError(result, result.input);
            return;
          }
          hideValidationError();

          // Run active algorithm if app.js is hooked
          const activeTab = document.querySelector('.capsule-tab.active');
          const algoKey = activeTab ? activeTab.getAttribute('data-algorithm') : 'fcfs';
          renderResultsFor(algoKey);

          // Smooth glide down to Simulation Results (Zone 2)
          const resultsSection = document.getElementById('results-section');
          if (resultsSection) {
            resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }

        if (simForm) {
          simForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleCalculate();
          });
        }

        // ทำเครื่องหมาย "ผลลัพธ์เก่า" เมื่อผู้ใช้เปลี่ยนค่า
        //   - input: พิมพ์ตัวเลขในช่องใด ๆ ของฟอร์ม
        //   - click: กดปุ่ม stepper (+/−) หรือปุ่มสุ่มค่า BT (ปุ่มที่ถูก disable จะไม่ยิง click)
        if (simForm) {
          simForm.addEventListener('input', markResultsStale);
          simForm.addEventListener('click', (e) => {
            if (e.target.closest && e.target.closest('.stepper-btn, .bt-btn, #btn-randomize')) {
              markResultsStale();
            }
          });
        }

        // ปุ่มส่งออก CSV: เปิดเมนูให้เลือกอัลกอริทึมเดียว หรือรวมทั้งสาม
        const btnExport = document.getElementById('btn-export');
        const exportMenuEl = document.getElementById('export-menu');
        if (btnExport && exportMenuEl) {
          btnExport.addEventListener('click', (e) => {
            e.stopPropagation();
            setExportMenu(exportMenuEl.hidden, false);
          });

          exportMenuEl.addEventListener('click', (e) => {
            const item = e.target.closest('[data-export]');
            if (!item) return;
            exportResultsCsv(item.getAttribute('data-export'));
            setExportMenu(false, true);
          });

          document.addEventListener('click', (e) => {
            const wrap = document.getElementById('export-wrap');
            if (!exportMenuEl.hidden && wrap && !wrap.contains(e.target)) setExportMenu(false, false);
          });

          document.addEventListener('keydown', (e) => {
            if (exportMenuEl.hidden) return;
            if (e.key === 'Escape') {
              e.preventDefault();
              setExportMenu(false, true);
            } else if (e.key === 'ArrowDown') {
              e.preventDefault();
              moveExportFocus(1);
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              moveExportFocus(-1);
            } else if (e.key === 'Tab') {
              setExportMenu(false, false);
            }
          });
        }

        // Randomize BT Button with Cascade Slot Machine Roll
        const btnRand = document.getElementById('btn-randomize');
        if (btnRand) {
          btnRand.addEventListener('click', () => {
            hideValidationError();

            // Tactile rotation animation on dice icon
            const icon = btnRand.querySelector('svg');
            if (icon && typeof icon.animate === 'function') {
              icon.animate([
                { transform: 'rotate(0deg) scale(1)' },
                { transform: 'rotate(180deg) scale(1.22)', offset: 0.5 },
                { transform: 'rotate(360deg) scale(1)' }
              ], { duration: 420, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' });
            }

            const inputs = document.querySelectorAll('.burst-number-input');
            if (!inputs.length) return;

            btnRand.style.pointerEvents = 'none';
            setTimeout(() => { btnRand.style.pointerEvents = ''; }, inputs.length * 45 + 380);

            inputs.forEach((inp, idx) => {
              const targetVal = Math.floor(Math.random() * 12) + 2;
              const delay = idx * 45; // Staggered cascade from P1 to Pn

              setTimeout(() => {
                let ticks = 0;
                const maxTicks = 5;
                const tickInterval = setInterval(() => {
                  ticks++;
                  if (ticks < maxTicks) {
                    inp.value = Math.floor(Math.random() * 14) + 1;
                    if (typeof inp.animate === 'function') {
                      inp.animate([
                        { transform: 'translateY(-6px) scale(0.92)', opacity: 0.6, filter: 'blur(2px)' },
                        { transform: 'translateY(0) scale(1)', opacity: 1, filter: 'blur(0)' }
                      ], { duration: 60, easing: 'ease-out' });
                    }
                  } else {
                    clearInterval(tickInterval);
                    inp.value = targetVal;

                    // Final settling Spring Jelly Pop
                    if (typeof inp.animate === 'function') {
                      inp.animate([
                        { transform: 'translateY(12px) scale(0.82)', opacity: 0.4, filter: 'blur(1.5px)' },
                        { transform: 'translateY(-3.5px) scale(1.2)', opacity: 1, filter: 'blur(0)', offset: 0.6 },
                        { transform: 'translateY(0) scale(1)', opacity: 1 }
                      ], { duration: 320, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' });
                    }

                    const card = inp.closest('.burst-pill-card');
                    if (card) {
                      card.classList.remove('burst-card-pop');
                      void card.offsetWidth;
                      card.classList.add('burst-card-pop');
                      setTimeout(() => card.classList.remove('burst-card-pop'), 420);
                    }
                  }
                }, 50);
              }, delay);
            });
          });
        }

        // Reset Button with Animated Reset Transition
        const btnReset = document.getElementById('btn-reset');
        if (btnReset) {
          btnReset.addEventListener('click', () => {
            hideValidationError();
            if (numProcInput) {
              numProcInput.value = 4;
              animateCounter(numProcInput, 'down');
            }
            if (tqInput) {
              tqInput.value = 2;
              animateCounter(tqInput, 'down');
            }
            // forceDefaults = true → ล้างค่า BT เดิมกลับไปเป็นค่าเริ่มต้นจริง ๆ
            renderBurstInputs(4, true);
            // กลับไปแท็บ FCFS แล้วคำนวณผลจากค่าที่กรอกจริง (หลังรีเซ็ต)
            const fcfsTab = document.getElementById('tab-fcfs');
            activateTab(fcfsTab, false);
            renderResultsFor('fcfs');
            updateStepperButtons();
          });
        }

        // Hook ที่ app.js ใช้จริงเท่านั้น (ลด global ที่ไม่มีผู้เรียก)
        // animateCounter / updateCapsuleGlider ถูกเรียกจากฟังก์ชันระดับ IIFE จึงต้องอ้างผ่าน window
        window.animateCounter = animateCounter;
        window.updateCapsuleGlider = updateCapsuleGlider;
      });
