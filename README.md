# Phantom Debug Runtime

A lightweight JavaScript runtime that analyzes submitted code, traces detected issues, and returns repair suggestions over WebSocket.

> **Current status:** The repository is an early prototype. Before running it, resolve the module-layout mismatch described in [Known limitations](#known-limitations).

## Requirements

- Node.js 20 or newer
- npm

## Installation

```bash
npm install
```

## Running

The intended entry points are:

```bash
# WebSocket server
node index.js

# Batch examples
node worker.js

# Example checks
node run.js
```

The server listens on port `8080` by default. Override it with the `PORT` environment variable:

```bash
PORT=9000 node index.js
```

## WebSocket API

Connect to:

```text
ws://localhost:8080
```

Send a JSON object containing a `code` string:

```json
{ "code": "let a = undefinedVar" }
```

A successful response includes a session identifier, analysis results, source-line traces, repair suggestions, and runtime logs:

```json
{
  "sessionId": "uuid",
  "result": {
    "analysis": {
      "issues": [
        {
          "id": "undefined_var",
          "message": "Possible undefined variable reference",
          "severity": "warning"
        }
      ],
      "code": "let a = undefinedVar"
    },
    "traces": [],
    "fix": []
  }
}
```

Invalid JSON returns an error response. The service currently has no authentication, authorization, origin validation, rate limiting, or request-size limit, so do not expose it directly to an untrusted network.

## Detected Issues

| ID | Description |
|---|---|
| `undefined_var` | Reference to `undefined` or an identifier that appears undeclared |
| `null_access` | Property access on the literal `null` |
| `implicit_global` | Assignment without a declaration keyword |
| `eval_usage` | Use of `eval()` |
| `empty_catch` | Empty `catch` block |
| `missing_code` | Missing `code` field |
| `empty_code` | Empty `code` string |
| `invalid_code` | `code` is not a string |

Detection is heuristic and regex-based; results are advisory and may contain false positives or false negatives.

## Project Layout

```text
index.js    WebSocket server
worker.js   Standalone batch examples
run.js      Example checks
analyze.js  Pattern-based analysis implementation
trace.js    Issue-to-line mapping
repair.js   Repair suggestions
phantom.js  Pipeline orchestration
```

## Known Limitations

- `phantom.js` imports `./pipeline/analyze.js`, `./pipeline/trace.js`, and `./pipeline/repair.js`, while the current repository also contains the implementations at the repository root. Align these paths before running the server or examples.
- The npm scripts currently reference `src/` and `tests/`, which are not present in the repository. Use the direct commands above until the layout and test suite are corrected.
- The analyzer parses source using regular expressions rather than a JavaScript parser.
- Submitted source code is returned in responses and stored in in-memory logs; avoid sending secrets or personal data.
- The WebSocket server has no authentication or transport encryption by default. Put it behind TLS and an authenticated reverse proxy for production use.

## Security

Do not commit credentials, API keys, private keys, `.env` files, or sensitive source code. See [SECURITY.md](SECURITY.md) for reporting instructions and security guidance.

## Architecture

```text
analyze → detect issues
trace   → map issues to source lines
repair  → generate suggestions
```

## License

No license has been declared yet.
