/* ==========================================================================
   ui-render.js
   เชื่อมผลลัพธ์ + แถบเปรียบเทียบ + สถานะผลลัพธ์เก่า
   แยกออกจาก index.html — โหลดด้วย <script src> ตามลำดับใน index.html
   ========================================================================== */

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
