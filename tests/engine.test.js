#!/usr/bin/env node
/**
 * Engine tests for app.js — FCFS / SJF / Round Robin (AT = 0)
 *
 * Run:  node tests/engine.test.js
 *
 * No dependencies and no browser required: app.js only touches `window` when it
 * loads (to expose the pure calculation functions), so a tiny stub is enough.
 */
'use strict';

const path = require('path');

global.window = globalThis;
global.document = {
  addEventListener() {},
  querySelectorAll() { return []; },
  getElementById() { return null; },
  querySelector() { return null; }
};

require(path.join(__dirname, '..', 'app.js'));

if (
  typeof calculateFCFS !== 'function' ||
  typeof calculateSJF !== 'function' ||
  typeof calculateRR !== 'function'
) {
  console.error('FAILED: could not load calculateFCFS / calculateSJF / calculateRR from app.js');
  process.exit(1);
}

let passed = 0;
let failed = 0;

function section(title) {
  console.log('\n' + title);
}

function check(name, actual, expected) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (ok) {
    passed++;
    console.log('  PASS  ' + name);
  } else {
    failed++;
    console.log('  FAIL  ' + name);
    console.log('        expected: ' + JSON.stringify(expected));
    console.log('        actual:   ' + JSON.stringify(actual));
  }
}

function ok(name, condition, detail) {
  if (condition) {
    passed++;
    console.log('  PASS  ' + name);
  } else {
    failed++;
    console.log('  FAIL  ' + name + (detail ? '  (' + detail + ')' : ''));
  }
}

/** Build the process array shape the engine expects. */
function proc(burstTimes) {
  return burstTimes.map(function (bt, i) {
    return { id: 'P' + (i + 1), numId: i + 1, bt: bt };
  });
}

/* ------------------------------------------------------------------ */
/* FCFS                                                               */
/* ------------------------------------------------------------------ */
section('FCFS — burst times 6, 8, 7, 3');
const fcfs = calculateFCFS(proc([6, 8, 7, 3]));
check('execution order', fcfs.blocks.map(b => b.name), ['P1', 'P2', 'P3', 'P4']);
check('start times', fcfs.rows.map(r => r.st), [0, 6, 14, 21]);
check('completion times', fcfs.rows.map(r => r.ct), [6, 14, 21, 24]);
check('waiting times', fcfs.rows.map(r => r.wt), [0, 6, 14, 21]);
check('AWT', fcfs.awt, '10.25');
check('ATAT', fcfs.atat, '16.25');
check('makespan', fcfs.makespan, '24 ms');
check('timeline stamps', fcfs.stamps, [0, 6, 14, 21, 24]);
check('AWT formula string', fcfs.awtFormula, '(0 + 6 + 14 + 21) / 4 = 10.25 ms');

/* ------------------------------------------------------------------ */
/* SJF                                                                */
/* ------------------------------------------------------------------ */
section('SJF — burst times 6, 8, 7, 3');
const sjf = calculateSJF(proc([6, 8, 7, 3]));
check('shortest job first', sjf.blocks.map(b => b.name), ['P4', 'P1', 'P3', 'P2']);
check('AWT', sjf.awt, '7.00');
check('ATAT', sjf.atat, '13.00');
check('table still sorted by process id', sjf.rows.map(r => r.id), [1, 2, 3, 4]);

section('SJF — tie-break');
const tie = calculateSJF(proc([4, 4, 2]));
check('equal burst times keep arrival order', tie.blocks.map(b => b.name), ['P3', 'P1', 'P2']);

/* ------------------------------------------------------------------ */
/* Round Robin                                                        */
/* ------------------------------------------------------------------ */
section('Round Robin — Q = 2, burst times 6, 8, 7, 3');
const rr = calculateRR(proc([6, 8, 7, 3]), 2);
check('AWT', rr.awt, '13.75');
check('ATAT', rr.atat, '19.75');
check('makespan', rr.makespan, '24 ms');
check('slice count', rr.blocks.length, 13);
check('timeline stamp count', rr.stamps.length, 14);

section('Round Robin — Q = 2, burst times 5, 3');
const rr53 = calculateRR(proc([5, 3]), 2);
check('start times', rr53.rows.map(r => r.st), [0, 2]);
check('completion times', rr53.rows.map(r => r.ct), [8, 7]);

section('Round Robin — time quantum edge cases');
check('Q >= longest burst behaves like FCFS', calculateRR(proc([6, 8, 7, 3]), 99).awt, fcfs.awt);
check('Q = 1 slices every millisecond', calculateRR(proc([5, 3]), 1).blocks.length, 8);
check('single process AWT is 0', calculateRR(proc([5]), 2).awt, '0.00');

/* ------------------------------------------------------------------ */
/* Invariants                                                         */
/* ------------------------------------------------------------------ */
section('Invariants — every result');
[fcfs, sjf, rr, rr53].forEach(function (result) {
  const label = result.algoKey.toUpperCase();
  const totalDur = result.blocks.reduce(function (sum, b) { return sum + b.dur; }, 0);

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

/* ------------------------------------------------------------------ */
/* Large / worst-case input                                           */
/* ------------------------------------------------------------------ */
section('Worst case allowed by the UI — 10 processes x 50 ms');
const many = calculateRR(proc(Array(10).fill(50)), 1);
check('slice count', many.blocks.length, 500);
check('makespan', many.makespan, '500 ms');
ok('no NaN in AWT / ATAT', /^\d+\.\d{2}$/.test(many.awt) && /^\d+\.\d{2}$/.test(many.atat),
  many.awt + ' / ' + many.atat);

/* ------------------------------------------------------------------ */
/* Summary                                                            */
/* ------------------------------------------------------------------ */
console.log('\n' + '-'.repeat(46));
if (failed === 0) {
  console.log('ALL PASS (' + passed + ')');
  process.exit(0);
} else {
  console.log('FAILED ' + failed + ' of ' + (passed + failed));
  process.exit(1);
}
