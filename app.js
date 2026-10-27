/**
 * CPU Scheduling Simulator — app.js
 *
 * ⚠️ ขอบเขตของไฟล์นี้ (อ่านก่อนแก้)
 *   1. Core Scheduling Algorithms — สูตรคำนวณ FCFS / SJF / RR  (บทบาทที่ 1)
 *   2. Result Formatting ......... แปลงผลเป็น rows / blocks / stamps + ค่าเฉลี่ย
 *   3. DOM Rendering ............. runSchedulingAlgorithm() + renderSimulationToUI()
 *   4. Exports ................... ผูกฟังก์ชันให้ index.html เรียกใช้ผ่าน window.*
 *
 * จุดเชื่อมกับ UI (ถ้าจะแก้การแสดงผล ให้เริ่มที่ 2 ฟังก์ชันนี้)
 *   - runSchedulingAlgorithm(algoKey)  ← อ่านค่าจาก DOM แล้วเรียก calculate*
 *   - renderSimulationToUI(result)     ← วาดการ์ดสรุป / Gantt / ตาราง 8 คอลัมน์
 *
 * อัลกอริทึม (AT = 0): FCFS, SJF (non-preemptive), Round Robin (ตาม Time Quantum)
 */

(function () {
  'use strict';

  /* ==========================================================================
     1. Core Scheduling Algorithms (Pure Calculation Functions)
     ========================================================================== */

  /**
   * First-Come, First-Served (FCFS) - Non-preemptive (AT = 0)
   * ทำงานเรียงตามลำดับคิว P1 -> P2 -> P3 -> ...
   * @param {Array<{id: string, numId: number, bt: number}>} processes
   * @returns {Object} ผลลัพธ์การคำนวณและข้อมูลสำหรับวาด Gantt Chart
   */
  function calculateFCFS(processes) {
    const queue = processes.map(p => ({ ...p }));
    let currentTime = 0;
    const blocks = [];
    const stamps = [0];
    const rows = [];

    queue.forEach(p => {
      const st = currentTime;
      const ct = st + p.bt;
      const tat = ct; // เนื่องจาก AT = 0 ดังนั้น TAT = CT - 0 = CT
      const wt = tat - p.bt; // WT = TAT - BT (หรือเท่ากับ ST)

      blocks.push({
        id: p.numId,
        name: p.id,
        dur: p.bt
      });

      currentTime = ct;
      stamps.push(currentTime);

      rows.push({
        id: p.numId,
        name: p.id,
        bt: p.bt,
        st: st,
        ct: ct,
        tat: tat,
        wt: wt
      });
    });

    return formatSimulationResult('fcfs', rows, blocks, stamps, currentTime);
  }

  /**
   * Shortest Job First (SJF) - Non-preemptive (AT = 0)
   * คัดเลือกโปรเซสที่มี Burst Time สั้นที่สุดขึ้นมาทำงานก่อน
   * กรณี Burst Time เท่ากัน จะตัดสินด้วยลำดับคิวเดิม (FCFS tie-breaker)
   * @param {Array<{id: string, numId: number, bt: number}>} processes
   * @returns {Object} ผลลัพธ์การคำนวณและข้อมูลสำหรับวาด Gantt Chart
   */
  function calculateSJF(processes) {
    // โคลนและเรียงลำดับตาม Burst Time (หากเท่ากันให้เรียงตาม numId เดิม)
    const sortedQueue = processes.map((p, index) => ({ ...p, originalIndex: index }))
      .sort((a, b) => {
        if (a.bt !== b.bt) return a.bt - b.bt;
        return a.originalIndex - b.originalIndex;
      });

    let currentTime = 0;
    const blocks = [];
    const stamps = [0];
    const rows = [];

    sortedQueue.forEach(p => {
      const st = currentTime;
      const ct = st + p.bt;
      const tat = ct; // AT = 0
      const wt = tat - p.bt;

      blocks.push({
        id: p.numId,
        name: p.id,
        dur: p.bt
      });

      currentTime = ct;
      stamps.push(currentTime);

      rows.push({
        id: p.numId,
        name: p.id,
        bt: p.bt,
        st: st,
        ct: ct,
        tat: tat,
        wt: wt
      });
    });

    // เรียง rows ในตารางตามหมายเลข Process (P1, P2, P3...) เพื่อให้อ่านง่ายในตาราง
    const sortedRows = [...rows].sort((a, b) => a.id - b.id);

    return formatSimulationResult('sjf', sortedRows, blocks, stamps, currentTime, sortedQueue.map(p => p.id));
  }

  /**
   * Round Robin (RR) - Preemptive (AT = 0)
   * สลับเวลาการทำงานตาม Time Quantum อย่างเท่าเทียม
   * พร้อมเก็บข้อมูลบล็อกช่วงเวลาสำหรับวาดกราฟ Gantt Chart
   * @param {Array<{id: string, numId: number, bt: number}>} processes
   * @param {number} timeQuantum
   * @returns {Object} ผลลัพธ์การคำนวณและข้อมูลสำหรับวาด Gantt Chart
   */
  function calculateRR(processes, timeQuantum) {
    const tq = Math.max(1, parseInt(timeQuantum, 10) || 2);
    
    // ที่เวลา AT = 0 ทุก Process พร้อมอยู่ใน Ready Queue ตั้งแต่เริ่ม
    const procState = processes.map(p => ({
      ...p,
      rem_bt: p.bt,
      st: -1,
      ct: 0,
      tat: 0,
      wt: 0
    }));

    const readyQueue = [...procState];
    const blocks = [];
    const stamps = [0];
    let currentTime = 0;

    while (readyQueue.length > 0) {
      const p = readyQueue.shift();

      // บันทึก Start Time ครั้งแรกที่ได้รับ CPU
      if (p.st === -1) {
        p.st = currentTime;
      }

      // เวลาที่จะรันในรอบนี้ (ไม่เกิน Time Quantum)
      const slice = Math.min(p.rem_bt, tq);
      currentTime += slice;
      p.rem_bt -= slice;

      // บันทึกบล็อก Gantt Chart
      blocks.push({
        id: p.numId,
        name: p.id,
        dur: slice
      });
      stamps.push(currentTime);

      // ถ้ายังไม่เสร็จ ให้วนกลับไปต่อท้าย Ready Queue
      if (p.rem_bt > 0) {
        readyQueue.push(p);
      } else {
        // ประมวลผลเสร็จสิ้น
        p.ct = currentTime;
        p.tat = p.ct; // AT = 0
        p.wt = p.tat - p.bt;
      }
    }

    // สร้าง rows เรียงตามลำดับ Process ID (P1, P2, P3...)
    const rows = procState.map(p => ({
      id: p.numId,
      name: p.id,
      bt: p.bt,
      st: p.st,
      ct: p.ct,
      tat: p.tat,
      wt: p.wt
    }));

    return formatSimulationResult('rr', rows, blocks, stamps, currentTime, null, tq);
  }

  /* ==========================================================================
     2. Result Formatting & Average Calculations
     ========================================================================== */

  /**
   * คำนวณค่า AWT, ATAT และจัดฟอร์แมตข้อมูลส่งคืน
   */
  function formatSimulationResult(algoKey, rows, blocks, stamps, makespan, execOrder = null, tq = 2) {
    const n = rows.length;
    const totalWt = rows.reduce((sum, r) => sum + r.wt, 0);
    const totalTat = rows.reduce((sum, r) => sum + r.tat, 0);

    const awt = n > 0 ? (totalWt / n).toFixed(2) : '0.00';
    const atat = n > 0 ? (totalTat / n).toFixed(2) : '0.00';

    const wtParts = rows.map(r => r.wt).join(' + ');
    const tatParts = rows.map(r => r.tat).join(' + ');

    const awtFormula = n > 0 ? `(${wtParts}) / ${n} = ${awt} ms` : '0.00 ms';
    const atatFormula = n > 0 ? `(${tatParts}) / ${n} = ${atat} ms` : '0.00 ms';

    // คำอธิบายอัลกอริทึม
    let descTh = '';
    let descEn = '';

    if (algoKey === 'fcfs') {
      const orderStr = rows.map(r => r.name).join(' &rarr; ');
      descTh = `<strong>First-Come, First-Served (FCFS):</strong> กระบวนการที่มาถึงก่อนจะได้รับการประมวลผลก่อนตามลำดับคิว โดยไม่ถูกแทรกกลางคัน (Non-preemptive) เมื่อทุกกระบวนการมาถึงพร้อมกันที่เวลา 0 (AT = 0) ลำดับการประมวลผลจะเป็น ${orderStr}`;
      descEn = `<strong>First-Come, First-Served (FCFS):</strong> The process that arrives first is executed first until completion without preemption. Since all processes arrive at time 0 (AT = 0), execution strictly follows the order ${orderStr}.`;
    } else if (algoKey === 'sjf') {
      const orderStr = execOrder ? execOrder.join(' &rarr; ') : blocks.map(b => b.name).join(' &rarr; ');
      descTh = `<strong>Shortest Job First (SJF - Non-Preemptive):</strong> อัลกอริทึมเลือกประมวลผลโปรเซสที่มี Burst Time สั้นที่สุดก่อน (${orderStr}) เพื่อลดเวลารอคอยเฉลี่ย (AWT) ให้เหลือน้อยที่สุด`;
      descEn = `<strong>Shortest Job First (SJF - Non-Preemptive):</strong> Prioritizes processes with the shortest burst time first (${orderStr}) to minimize average waiting time.`;
    } else if (algoKey === 'rr') {
      descTh = `<strong>Round Robin (RR):</strong> จัดสรรเวลาการทำงานตาม Time Quantum (Q = ${tq}) สลับสับเปลี่ยนคิวหมุนเวียนอย่างเท่าเทียมกันแบบ Preemptive`;
      descEn = `<strong>Round Robin (RR):</strong> Cyclic execution sharing CPU time equally using Time Quantum slices (Q = ${tq}) with preemption.`;
    }

    return {
      algoKey,
      awt,
      awtFormula,
      atat,
      atatFormula,
      makespan: `${makespan} ms`,
      totalMakespanNum: makespan,
      blocks,
      stamps,
      // AT = 0 สำหรับทุกโปรเซส (ข้อกำหนดของโจทย์) — ใส่ไว้เพื่อให้ตารางมีคอลัมน์ Arrival Time
      rows: rows.map(r => Object.assign({ at: 0 }, r)),
      descTh,
      descEn
    };
  }

  /* ==========================================================================
     3. DOM Rendering & UI Synchronization
     ========================================================================== */

  // ผลลัพธ์ล่าสุดที่คำนวณสำเร็จ (ใช้ re-render ด้วยภาษาใหม่โดยไม่ต้องคำนวณซ้ำ)
  let lastResult = null;

  /**
   * อ่านข้อมูลจากฟอร์มแล้วคืนรายการโปรเซส + Time Quantum
   * ใช้ร่วมกันระหว่างการคำนวณปกติและแถบเปรียบเทียบอัลกอริทึม
   * @returns {{processes: Array<{id: string, numId: number, bt: number}>, tq: number}}
   */
  function readSchedulingInputs() {
    const tqInput = document.getElementById('time-quantum');
    const tq = tqInput ? (parseInt(tqInput.value, 10) || 2) : 2;

    const processes = Array.from(document.querySelectorAll('.burst-number-input')).map((inp, idx) => {
      let bt = parseInt(inp.value, 10);
      if (isNaN(bt) || bt <= 0) bt = 1;
      const numId = idx + 1;
      return { id: `P${numId}`, numId: numId, bt: bt };
    });

    return { processes, tq };
  }

  /**
   * สรุปผลของทั้งสามอัลกอริทึมจากข้อมูลชุดเดียวกัน (สำหรับแถบเปรียบเทียบ)
   * @returns {Array<{key: string, awt: number, atat: number, makespan: number}>}
   */
  function summariseAlgorithms() {
    const { processes, tq } = readSchedulingInputs();
    if (!processes.length) return [];

    const summarise = (key, result) => ({
      key: key,
      awt: parseFloat(result.awt),
      atat: parseFloat(result.atat),
      makespan: result.totalMakespanNum
    });

    return [
      summarise('fcfs', calculateFCFS(processes)),
      summarise('sjf', calculateSJF(processes)),
      summarise('rr', calculateRR(processes, tq))
    ];
  }

  /**
   * คำนวณผลของอัลกอริทึมที่ระบุ จากค่าที่กรอกอยู่ในฟอร์มตอนนี้
   * ใช้โดยการส่งออก CSV (เลือกทีละอัลกอริทึมหรือรวมทั้งสาม)
   * @param {string} algoKey 'fcfs' | 'sjf' | 'rr'
   * @returns {Object|null}
   */
  function computeResultFor(algoKey) {
    const { processes, tq } = readSchedulingInputs();
    if (!processes.length) return null;
    if (algoKey === 'sjf') return calculateSJF(processes);
    if (algoKey === 'rr') return calculateRR(processes, tq);
    return calculateFCFS(processes);
  }

  /**
   * ดึงข้อมูล Input จากหน้าเว็บ ป้อนเข้าสู่อัลกอริทึม และแสดงผลบนหน้าจอ
   * @param {string} algoKey ('fcfs' | 'sjf' | 'rr')
   */
  function runSchedulingAlgorithm(algoKey) {
    // ลำดับความสำคัญ: อัลกอริทึมที่ส่งมา → แท็บที่ active อยู่ → FCFS
    const activeTab = document.querySelector('.capsule-tab.active');
    const selectedAlgo = algoKey
      || (activeTab ? activeTab.getAttribute('data-algorithm') : 'fcfs')
      || 'fcfs';

    // 1. ดึงข้อมูลจากหน้าเว็บ (โปรเซสที่ bt <= 0 จะถูกบังคับเป็น 1)
    const { processes, tq } = readSchedulingInputs();

    if (processes.length === 0) return;

    // 2. รันอัลกอริทึมที่เลือก
    let result = null;
    if (selectedAlgo === 'fcfs') {
      result = calculateFCFS(processes);
    } else if (selectedAlgo === 'sjf') {
      result = calculateSJF(processes);
    } else if (selectedAlgo === 'rr') {
      result = calculateRR(processes, tq);
    }

    if (!result) return;

    // 3. เก็บผลลัพธ์ล่าสุดไว้ แล้วเรนเดอร์ลง UI ของหน้าเว็บ
    lastResult = result;
    renderSimulationToUI(result);

    // ผลลัพธ์ใหม่แล้ว → เอาสถานะ "ผลลัพธ์เก่า" ออก (ถ้ามี)
    const panelContent = document.getElementById('panel-content');
    if (panelContent) panelContent.classList.remove('is-stale');
  }

  /**
   * เรนเดอร์ผลลัพธ์ล่าสุดซ้ำด้วยภาษาปัจจุบัน (ไม่คำนวณใหม่)
   * ใช้ตอนสลับภาษาระหว่างที่ข้อมูลในฟอร์มยังไม่ถูกต้อง
   */
  function rerenderLastResult() {
    if (lastResult) renderSimulationToUI(lastResult);
  }

  /**
   * อัปเดตข้อมูลผลลัพธ์ลงใน DOM
   */
  function renderSimulationToUI(result) {
    const currentLang = window.currentLanguage || 'th';

    // อัปเดตค่าสถิติ
    const awtEl = document.getElementById('avg-waiting-time');
    const atatEl = document.getElementById('avg-turnaround-time');
    const awtFormulaEl = document.getElementById('awt-formula');
    const atatFormulaEl = document.getElementById('atat-formula');
    const makespanEl = document.getElementById('total-makespan-val');
    const infoEl = document.getElementById('algo-info-text');

    if (awtEl) awtEl.textContent = result.awt;
    if (atatEl) atatEl.textContent = result.atat;

    // แถว AVG WT ท้ายตาราง (ข้อกำหนด: ตารางต้องมีค่าเฉลี่ยเวลารอคอย)
    const tableAvgEl = document.getElementById('table-avg-wt');
    if (tableAvgEl) tableAvgEl.textContent = result.awt;
    if (awtFormulaEl) awtFormulaEl.textContent = result.awtFormula;
    if (atatFormulaEl) atatFormulaEl.textContent = result.atatFormula;
    if (makespanEl) makespanEl.textContent = result.makespan;

    if (infoEl) {
      infoEl.innerHTML = currentLang === 'en' ? result.descEn : result.descTh;
    }

    // เรนเดอร์ Gantt Chart
    const gantt = document.getElementById('gantt-chart');
    const stampsContainer = document.getElementById('gantt-timestamps');
    if (gantt) {
      gantt.innerHTML = '';
      const totalMakespan = result.totalMakespanNum || 1;

      // ใช้ CSS Grid แบ่งคอลัมน์ตามสัดส่วนเวลาจริง (dur fr) แทน flex grow
      // → ขอบบล็อกตรงกับตำแหน่ง timestamp เป๊ะ เพราะไม่มี gap มาเจือปน
      gantt.style.gridTemplateColumns = result.blocks.map(b => `${Math.max(1, b.dur)}fr`).join(' ');
      gantt.classList.toggle('gantt-chart-bar--dense', result.blocks.length > 8);

      result.blocks.forEach(b => {
        const div = document.createElement('div');
        div.className = `gantt-block block-p${b.id}`;
        div.innerHTML = `
          <div class="gantt-block-label">
            <span class="gantt-proc-name">${b.name}</span>
            <span class="gantt-proc-dur">${b.dur} ms</span>
          </div>
        `;
        gantt.appendChild(div);
      });

      // คำอธิบายลำดับจริงให้ screen reader (ไม่ใช่แค่คำว่า "Gantt chart")
      // จำกัดจำนวนรายการ เพื่อไม่ให้ aria-label ยาวเกินไปในเคสสุดขั้ว (เช่น 990 ช่วง)
      const MAX_DESC_BLOCKS = 8;
      const shownBlocks = result.blocks.slice(0, MAX_DESC_BLOCKS).map(b => `${b.name} ${b.dur} ms`);
      const restCount = result.blocks.length - shownBlocks.length;
      const scheduleText = restCount > 0
        ? (currentLang === 'en'
          ? `${shownBlocks.join(', ')}, and ${restCount} more slices`
          : `${shownBlocks.join(', ')} และอีก ${restCount} ช่วง`)
        : shownBlocks.join(', ');
      gantt.setAttribute('aria-label', currentLang === 'en'
        ? `Gantt timeline, ${result.blocks.length} slices, total ${totalMakespan} ms: ${scheduleText}`
        : `แผนภูมิแกนต์ ${result.blocks.length} ช่วง รวม ${totalMakespan} ms: ${scheduleText}`);

      if (stampsContainer) {
        stampsContainer.innerHTML = '';
        // stamp ถี่เกินไป (เช่น RR หลายสไลซ์) ให้ข้ามบางตัวเพื่อไม่ให้ตัวเลขทับกัน
        const step = Math.max(1, Math.ceil(result.stamps.length / 12));
        result.stamps.forEach((t, idx) => {
          const isLast = idx === result.stamps.length - 1;
          if (!isLast && idx % step !== 0) return;
          const sp = document.createElement('span');
          sp.className = 'gantt-mark';
          sp.style.left = `${(t / totalMakespan) * 100}%`;
          sp.textContent = t;
          stampsContainer.appendChild(sp);
        });
      }
    }

    // เรนเดอร์ Table
    const tbody = document.getElementById('results-table-body');
    if (tbody) {
      tbody.innerHTML = '';
      const procLabelPrefix = (typeof window.simText === 'function' && window.simText('procLabelPrefix')) ||
        (currentLang === 'en' ? 'Process ' : 'กระบวนการ ');
      const statusLabel = (typeof window.simText === 'function' && window.simText('statusCompleted')) ||
        (currentLang === 'en' ? 'Completed' : 'เสร็จสิ้น');

      result.rows.forEach(r => {
        const tr = document.createElement('tr');
        const procLabel = `${procLabelPrefix}${r.id}`;
        tr.innerHTML = `
          <td>
            <div class="table-proc-cell">
              <span class="process-badge badge-p${r.id}">${r.name}</span>
              <span class="proc-cell-name">${procLabel}</span>
            </div>
          </td>
          <td>${r.at} <span class="unit-text">ms</span></td>
          <td><strong>${r.bt}</strong> <span class="unit-text">ms</span></td>
          <td>${r.st} <span class="unit-text">ms</span></td>
          <td><span class="ct-highlight">${r.ct}</span> <span class="unit-text">ms</span></td>
          <td><span class="tat-highlight">${r.tat}</span> <span class="unit-text">ms</span></td>
          <td><span class="wt-pill">${r.wt}</span> <span class="unit-text">ms</span></td>
          <td><span class="status-pill-completed">${statusLabel}</span></td>
        `;
        tbody.appendChild(tr);
      });
    }

    // ประกาศผลให้ screen reader ผ่าน aria-live (ไม่ขยับโฟกัส)
    const liveEl = document.getElementById('results-live');
    if (liveEl) {
      liveEl.textContent = currentLang === 'en'
        ? `Average waiting time ${result.awt} ms, average turnaround time ${result.atat} ms, total makespan ${result.makespan}.`
        : `เวลารอคอยเฉลี่ย ${result.awt} ms เวลาดำเนินการเฉลี่ย ${result.atat} ms เวลารวม ${result.makespan}`;
    }
  }

  // ส่งออกฟังก์ชันหลักสู่ Global Scope เพื่อให้ index.html เรียกใช้ได้
  window.calculateFCFS = calculateFCFS;
  window.calculateSJF = calculateSJF;
  window.calculateRR = calculateRR;
  window.runSchedulingAlgorithm = runSchedulingAlgorithm;
  window.rerenderLastResult = rerenderLastResult;
  window.summariseAlgorithms = summariseAlgorithms;
  window.computeResultFor = computeResultFor;
  window.getLastResult = () => lastResult;

  // หมายเหตุ: การคำนวณรอบแรกถูกสั่งจาก index.html (initBurstInputs → updateLanguage)
  // จึงไม่ต้องใช้ setTimeout รอ DOM แบบเดิมอีก และไม่เกิด race ระหว่างสองไฟล์
})();
