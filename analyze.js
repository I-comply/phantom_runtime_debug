const PATTERNS = [
  {
    id: 'undefined_var',
    test: (code) => {
      if (/\bundefined\b/.test(code)) return true;

      const declared = new Set();
      const declPattern = /(?:let|const|var|function)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g;
      let match;
      while ((match = declPattern.exec(code)) !== null) declared.add(match[1]);

      const usedPattern = /(?:=\s*|return\s+|\+\s*|\-\s*|\*\s*|\/\s*|\(\s*)([a-z_$][a-zA-Z0-9_$]{2,})(?!\s*[\(:=])/g;
      while ((match = usedPattern.exec(code)) !== null) {
        const id = match[1];
        const builtins = new Set([
          'true', 'false', 'null', 'undefined', 'NaN', 'Infinity', 'Math', 'JSON', 'console',
          'Object', 'Array', 'String', 'Number', 'Boolean', 'parseInt', 'parseFloat', 'isNaN',
          'typeof', 'Date', 'RegExp', 'Promise', 'Set', 'Map', 'WeakMap', 'WeakSet', 'Error',
          'encodeURIComponent', 'decodeURIComponent'
        ]);
        if (!declared.has(id) && !builtins.has(id)) return true;
      }
      return false;
    },
    message: 'Possible undefined variable reference'
  },
  {
    id: 'null_access',
    test: (code) => /null\s*\.\s*\w+/.test(code),
    message: 'Possible null property access'
  },
  {
    id: 'implicit_global',
    test: (code) => /(?<![a-zA-Z0-9_$])(var|let|const)\s+/.test(code) === false && /\b[a-z_$][a-zA-Z0-9_$]*\s*=/.test(code),
    message: 'Possible implicit global variable assignment'
  },
  {
    id: 'eval_usage',
    test: (code) => /\beval\s*\(/.test(code),
    message: 'eval() usage detected — security risk'
  },
  {
    id: 'empty_catch',
    test: (code) => /catch\s*\([^)]*\)\s*\{\s*\}/.test(code),
    message: 'Empty catch block swallows errors'
  }
];

export async function analyze(input, ctx) {
  const issues = [];

  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    issues.push({ id: 'invalid_code', message: 'code must be a string', severity: 'error' });
    ctx.logs.push({ stage: 'analyze', issues, timestamp: Date.now() });
    return { issues, code: null };
  }

  if (!Object.prototype.hasOwnProperty.call(input, 'code')) {
    issues.push({ id: 'missing_code', message: 'Missing code payload', severity: 'error' });
    ctx.logs.push({ stage: 'analyze', issues, timestamp: Date.now() });
    return { issues, code: null };
  }

  if (typeof input.code !== 'string') {
    issues.push({ id: 'invalid_code', message: 'code must be a string', severity: 'error' });
    ctx.logs.push({ stage: 'analyze', issues, timestamp: Date.now() });
    return { issues, code: null };
  }

  if (input.code.trim() === '') {
    issues.push({ id: 'empty_code', message: 'Empty code payload', severity: 'warning' });
  }

  for (const pattern of PATTERNS) {
    if (pattern.test(input.code)) {
      issues.push({ id: pattern.id, message: pattern.message, severity: 'warning' });
    }
  }

  ctx.logs.push({ stage: 'analyze', issueCount: issues.length, timestamp: Date.now() });

  return { issues, code: input.code };
}
