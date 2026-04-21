import { analyze } from './pipeline/analyze.js';
import { trace } from './pipeline/trace.js';
import { repair } from './pipeline/repair.js';

export async function runPhantom(input) {
  if (!input || typeof input !== 'object') {
    throw new Error('Input must be a non-null object');
  }

  const context = {
    id: Date.now(),
    startedAt: new Date().toISOString(),
    logs: []
  };

  const analysis = await analyze(input, context);
  const traces = await trace(analysis, context);
  const fix = await repair(traces, context);

  return {
    id: context.id,
    startedAt: context.startedAt,
    analysis,
    traces,
    fix,
    logs: context.logs
  };
}
