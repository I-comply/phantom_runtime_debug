import { runPhantom } from './phantom.js';

const samples = [
  { code: 'const a = undefinedVar + 1' },
  { code: 'let x = null.property' },
  { code: 'eval("alert(1)")' },
  { code: '' },
  { code: null }
];

(async () => {
  for (const sample of samples) {
    try {
      const result = await runPhantom(sample);
      console.log(JSON.stringify(result, null, 2));
    } catch (err) {
      console.error(`[ERROR] ${err.message}`);
    }
    console.log('---');
  }
})();
