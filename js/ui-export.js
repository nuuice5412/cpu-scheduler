/* ==========================================================================
   ui-export.js
   ส่งออก CSV + เมนูเลือกอัลกอริทึม
   แยกออกจาก index.html — โหลดด้วย <script src> ตามลำดับใน index.html
   ========================================================================== */

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
