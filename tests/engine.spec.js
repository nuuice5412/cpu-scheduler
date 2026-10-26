/**
 * Shared engine specification — used by both runners:
 *   tests/engine.test.js    (Node, command line)
 *   tests/engine.test.html  (browser, no installation required)
 *
 * Returns an array of { section, name, pass, actual?, expected?, detail? }.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.runEngineSpecs = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  /** Build the process array shape the engine expects. */
  function proc(burstTimes) {
    return burstTimes.map(function (bt, i) {
      return { id: 'P' + (i + 1), numId: i + 1, bt: bt };
    });
  }

  return function runEngineSpecs(api) {
    var results = [];
    var section = '';

    function group(title) {
      section = title;
    }

    function check(name, actual, expected) {
      results.push({
        section: section,
        name: name,
        pass: JSON.stringify(actual) === JSON.stringify(expected),
        actual: actual,
        expected: expected
      });
    }

    function ok(name, condition, detail) {
      results.push({
        section: section,
        name: name,
        pass: !!condition,
        detail: detail
      });
    }

    if (
      !api ||
      typeof api.calculateFCFS !== 'function' ||
      typeof api.calculateSJF !== 'function' ||
      typeof api.calculateRR !== 'function'
    ) {
      results.push({
        section: 'Setup',
        name: 'engine functions are available',
        pass: false,
        detail: 'calculateFCFS / calculateSJF / calculateRR were not found'
      });
      return results;
    }

    /* ---------------------------------------------------------------- */
    /* FCFS                                                             */
    /* ---------------------------------------------------------------- */
    group('FCFS — burst times 6, 8, 7, 3');
    var fcfs = api.calculateFCFS(proc([6, 8, 7, 3]));
    check('execution order', fcfs.blocks.map(function (b) { return b.name; }), ['P1', 'P2', 'P3', 'P4']);
    check('start times', fcfs.rows.map(function (r) { return r.st; }), [0, 6, 14, 21]);
    check('completion times', fcfs.rows.map(function (r) { return r.ct; }), [6, 14, 21, 24]);
    check('waiting times', fcfs.rows.map(function (r) { return r.wt; }), [0, 6, 14, 21]);
    check('AWT', fcfs.awt, '10.25');
    check('ATAT', fcfs.atat, '16.25');
    check('makespan', fcfs.makespan, '24 ms');
    check('timeline stamps', fcfs.stamps, [0, 6, 14, 21, 24]);
    check('AWT formula string', fcfs.awtFormula, '(0 + 6 + 14 + 21) / 4 = 10.25 ms');

    /* ---------------------------------------------------------------- */
    /* SJF                                                              */
    /* ---------------------------------------------------------------- */
    group('SJF — burst times 6, 8, 7, 3');
    var sjf = api.calculateSJF(proc([6, 8, 7, 3]));
    check('shortest job first', sjf.blocks.map(function (b) { return b.name; }), ['P4', 'P1', 'P3', 'P2']);
    check('AWT', sjf.awt, '7.00');
    check('ATAT', sjf.atat, '13.00');
    check('table still sorted by process id', sjf.rows.map(function (r) { return r.id; }), [1, 2, 3, 4]);

    group('SJF — tie-break');
    var tie = api.calculateSJF(proc([4, 4, 2]));
    check('equal burst times keep arrival order', tie.blocks.map(function (b) { return b.name; }), ['P3', 'P1', 'P2']);

    /* ---------------------------------------------------------------- */
    /* Round Robin                                                      */
    /* ---------------------------------------------------------------- */
    group('Round Robin — Q = 2, burst times 6, 8, 7, 3');
    var rr = api.calculateRR(proc([6, 8, 7, 3]), 2);
    check('AWT', rr.awt, '13.75');
    check('ATAT', rr.atat, '19.75');
    check('makespan', rr.makespan, '24 ms');
    check('slice count', rr.blocks.length, 13);
    check('timeline stamp count', rr.stamps.length, 14);

    group('Round Robin — Q = 2, burst times 5, 3');
    var rr53 = api.calculateRR(proc([5, 3]), 2);
    check('start times', rr53.rows.map(function (r) { return r.st; }), [0, 2]);
    check('completion times', rr53.rows.map(function (r) { return r.ct; }), [8, 7]);

    group('Round Robin — time quantum edge cases');
    check('Q >= longest burst behaves like FCFS', api.calculateRR(proc([6, 8, 7, 3]), 99).awt, fcfs.awt);
    check('Q = 1 slices every millisecond', api.calculateRR(proc([5, 3]), 1).blocks.length, 8);
    check('single process AWT is 0', api.calculateRR(proc([5]), 2).awt, '0.00');

    /* ---------------------------------------------------------------- */
    /* Invariants                                                       */
    /* ---------------------------------------------------------------- */
    group('Invariants — every result');
    [fcfs, sjf, rr, rr53].forEach(function (result) {
      var label = result.algoKey.toUpperCase();
      var totalDur = result.blocks.reduce(function (sum, b) { return sum + b.dur; }, 0);

      ok(label + ': sum of slices equals makespan', totalDur === result.totalMakespanNum,
        totalDur + ' vs ' + result.totalMakespanNum);
      ok(label + ': stamps start at 0 and end at makespan',
        result.stamps[0] === 0 && result.stamps[result.stamps.length - 1] === result.totalMakespanNum);
      ok(label + ': stamps are strictly increasing',
        result.stamps.every(function (t, i, arr) { return i === 0 || t > arr[i - 1]; }));
      ok(label + ': AWT / ATAT formatted with 2 decimals',
        /^\d+\.\d{2}$/.test(result.awt) && /^\d+\.\d{2}$/.test(result.atat),
        result.awt + ' / ' + result.atat);
      ok(label + ': every row satisfies TAT = CT, WT = TAT - BT (AT = 0)',
        result.rows.every(function (r) { return r.tat === r.ct && r.wt === r.tat - r.bt; }));
      ok(label + ': every row satisfies CT >= ST + BT',
        result.rows.every(function (r) { return r.ct >= r.st + r.bt; }));
    });

    /* ---------------------------------------------------------------- */
    /* Worst case allowed by the UI                                     */
    /* ---------------------------------------------------------------- */
    group('Worst case allowed by the UI — 10 processes x 50 ms');
    var many = api.calculateRR(proc(Array(10).fill(50)), 1);
    check('slice count', many.blocks.length, 500);
    check('makespan', many.makespan, '500 ms');
    ok('no NaN in AWT / ATAT',
      /^\d+\.\d{2}$/.test(many.awt) && /^\d+\.\d{2}$/.test(many.atat),
      many.awt + ' / ' + many.atat);

    return results;
  };
});
