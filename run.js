import { runPhantom } from '../src/phantom.js';

const cases = [
  {
    label: 'empty code string',
    input: { code: '' },
    expect: (res) => res.fix.some((f) => f.issueId === 'empty_code')
  },
  {
    label: 'undefined variable',
    input: { code: 'let x = undefinedVar' },
    expect: (res) => res.fix.some((f) => f.issueId === 'undefined_var')
  },
  {
    label: 'null access',
    input: { code: 'let y = null.foo' },
    expect: (res) => res.fix.some((f) => f.issueId === 'null_access')
  },
  {
    label: 'eval usage',
    input: { code: 'eval("1+1")' },
    expect: (res) => res.fix.some((f) => f.issueId === 'eval_usage')
  },
  {
    label: 'clean code — no issues',
    input: { code: 'const a = 1 + 2;' },
    expect: (res) => res.fix.length === 0
  },
  {
    label: 'missing code field',
    input: {},
    expect: (res) => res.fix.some((f) => f.issueId === 'missing_code')
  },
  {
    label: 'null input throws',
    input: null,
    expectThrow: true
  }
];

let passed = 0;
let failed = 0;

for (const tc of cases) {
  try {
    if (tc.expectThrow) {
      try {
        await runPhantom(tc.input);
        console.error(`FAIL [${tc.label}]: expected throw, got no error`);
        failed++;
      } catch {
        console.log(`PASS [${tc.label}]`);
        passed++;
      }
    } else {
      const res = await runPhantom(tc.input);
      const ok = tc.expect(res);
      if (ok) {
        console.log(`PASS [${tc.label}]`);
        passed++;
      } else {
        console.error(`FAIL [${tc.label}]`);
        console.error('  result:', JSON.stringify(res.fix, null, 2));
        failed++;
      }
    }
  } catch (err) {
    console.error(`ERROR [${tc.label}]: ${err.message}`);
    failed++;
  }
}

console.log(`\n${passed} passed / ${failed} failed`);
if (failed > 0) process.exit(1);
