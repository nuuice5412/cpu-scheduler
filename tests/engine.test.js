#!/usr/bin/env node
/**
 * Engine tests for app.js — command-line runner.
 *
 * Run from the project root:   node tests/engine.test.js
 * (or from this folder:        node engine.test.js)
 *
 * app.js only touches `window` when it loads, so a tiny stub is enough to load
 * it in Node. The assertions themselves live in engine.spec.js and are shared
 * with the browser runner (tests/engine.test.html).
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

const runEngineSpecs = require(path.join(__dirname, 'engine.spec.js'));

const results = runEngineSpecs({
  calculateFCFS: global.calculateFCFS,
  calculateSJF: global.calculateSJF,
  calculateRR: global.calculateRR
});

let passed = 0;
let failed = 0;
let currentSection = '';

results.forEach(function (r) {
  if (r.section !== currentSection) {
    currentSection = r.section;
    console.log('\n' + currentSection);
  }
  if (r.pass) {
    passed++;
    console.log('  PASS  ' + r.name);
  } else {
    failed++;
    console.log('  FAIL  ' + r.name);
    if (r.expected !== undefined) {
      console.log('        expected: ' + JSON.stringify(r.expected));
      console.log('        actual:   ' + JSON.stringify(r.actual));
    } else if (r.detail) {
      console.log('        ' + r.detail);
    }
  }
});

console.log('\n' + '-'.repeat(46));
if (failed === 0) {
  console.log('ALL PASS (' + passed + ')');
  process.exit(0);
}
console.log('FAILED ' + failed + ' of ' + (passed + failed));
process.exit(1);
