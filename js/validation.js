/* ==========================================================================
   validation.js
   ตรวจข้อมูลนำเข้า + แสดง/ซ่อนข้อความเตือน
   แยกออกจาก index.html — โหลดด้วย <script src> ตามลำดับใน index.html
   ========================================================================== */

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
