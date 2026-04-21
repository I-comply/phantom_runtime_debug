# Phantom Debug Runtime

Autonomous debugging runtime that analyzes, traces, and repairs code issues via WebSocket.

## Setup

```bash
npm install
```

## Run

| Command | Description |
|---|---|
| `npm run dev` | Start WebSocket server on `:8080` |
| `npm run worker` | Run standalone batch analysis |
| `npm test` | Execute test suite |

## WebSocket API

**Connect:** `ws://localhost:8080`

**Send:**
```json
{ "code": "let a = undefinedVar" }
```

**Receive:**
```json
{
  "sessionId": "uuid",
  "result": {
    "id": 1700000000000,
    "startedAt": "2024-01-01T00:00:00.000Z",
    "analysis": {
      "issues": [
        { "id": "undefined_var", "message": "Possible undefined variable reference", "severity": "warning" }
      ],
      "code": "let a = undefinedVar"
    },
    "traces": [...],
    "fix": [
      {
        "issueId": "undefined_var",
        "message": "Possible undefined variable reference",
        "severity": "warning",
        "suggestion": "Declare variable before use or add a guard: `if (typeof x !== \"undefined\")`.",
        "affectedLines": [{ "lineNumber": 1, "content": "let a = undefinedVar" }]
      }
    ],
    "logs": [...]
  }
}
```

## Detected Issues

| ID | Description |
|---|---|
| `undefined_var` | Reference to `undefined` |
| `null_access` | `null.property` access |
| `implicit_global` | Variable assigned without declaration keyword |
| `eval_usage` | `eval()` call |
| `empty_catch` | Empty catch block |
| `missing_code` | No `code` field in payload |
| `empty_code` | `code` is an empty string |
| `invalid_code` | `code` is not a string |

## Architecture

```
analyze → detect issues via pattern matching
trace   → map issues to line numbers
repair  → generate fix suggestions
```

## Extension Points

- **LLM hooks:** Pass `analysis.code` and issues to OpenAI/Claude inside `repair.js` for semantic suggestions
- **Persistence:** Log `context.logs` to Supabase or a database after each `runPhantom` call
- **Frontend:** Connect a Next.js dashboard to the WebSocket endpoint

## Deploy to GitHub

```bash
git init
git add .
git commit -m "init phantom runtime"
git branch -M main
git remote add origin https://github.com/YOURNAME/phantom-debug-runtime.git
git push -u origin main
```
