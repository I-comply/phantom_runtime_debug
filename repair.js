const FIXES = {
  missing_code: 'Provide a non-empty code string in the payload.',
  invalid_code: 'Ensure the code field is a string.',
  empty_code: 'Code payload is empty — nothing to analyze.',
  undefined_var: 'Declare variable before use or add a guard: `if (typeof x !== "undefined")`.',
  null_access: 'Add null check before property access: `if (obj !== null) { obj.prop }`.',
  implicit_global: 'Declare all variables with `let`, `const`, or `var` to avoid implicit globals.',
  eval_usage: 'Replace eval() with safer alternatives such as JSON.parse() or Function constructor.',
  empty_catch: 'Handle or log errors inside catch blocks: `catch (err) { console.error(err); }`.'
};

export async function repair(traces, ctx) {
  if (!Array.isArray(traces)) {
    ctx.logs.push({ stage: 'repair', error: 'Invalid traces input', timestamp: Date.now() });
    return [];
  }

  const fixes = traces.map((t) => {
    const suggestion = FIXES[t.issue?.id] || 'Manual review required.';
    return {
      issueId: t.issue?.id ?? 'unknown',
      message: t.issue?.message ?? '',
      severity: t.issue?.severity ?? 'info',
      suggestion,
      affectedLines: t.affectedLines ?? []
    };
  });

  ctx.logs.push({ stage: 'repair', fixCount: fixes.length, timestamp: Date.now() });

  return fixes;
}
