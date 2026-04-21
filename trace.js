export async function trace(analysis, ctx) {
  const traces = [];

  if (!analysis || !Array.isArray(analysis.issues)) {
    ctx.logs.push({ stage: 'trace', error: 'Invalid analysis input', timestamp: Date.now() });
    return traces;
  }

  const lines = analysis.code ? analysis.code.split('\n') : [];

  for (const issue of analysis.issues) {
    const affectedLines = [];

    if (analysis.code) {
      lines.forEach((line, idx) => {
        if (
          (issue.id === 'undefined_var' && /\bundefined\b/.test(line)) ||
          (issue.id === 'null_access' && /null\s*\.\s*\w+/.test(line)) ||
          (issue.id === 'eval_usage' && /\beval\s*\(/.test(line)) ||
          (issue.id === 'empty_catch' && /catch\s*\([^)]*\)\s*\{/.test(line))
        ) {
          affectedLines.push({ lineNumber: idx + 1, content: line.trim() });
        }
      });
    }

    traces.push({
      issue,
      path: 'runtime-execution-path',
      affectedLines,
      timestamp: Date.now()
    });
  }

  ctx.logs.push({ stage: 'trace', traceCount: traces.length, timestamp: Date.now() });

  return traces;
}
