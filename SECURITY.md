# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x     | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability in **phantom_runtime_debug**, please report it responsibly by:

1. **Do NOT** open a public GitHub issue
2. **Email** security details to: [your-email@example.com](mailto:your-email@example.com)
3. Include:
   - Description of the vulnerability
   - Steps to reproduce (if applicable)
   - Potential impact
   - Suggested fix (if you have one)

### Response Timeline
- **Initial acknowledgment:** Within 48 hours
- **Assessment:** Within 1 week
- **Resolution/Patch:** Target 2-4 weeks depending on severity

### Severity Levels
- **Critical:** Immediate patch release
- **High:** Release in next planned update
- **Medium/Low:** Included in next regular release

### Scope

This project covers:
- ✓ Code injection vulnerabilities
- ✓ Authentication/authorization bypass
- ✓ Sensitive data exposure
- ✓ Denial of service

Out of scope:
- ✗ Social engineering attacks
- ✗ Physical security vulnerabilities
- ✗ Third-party dependency vulnerabilities (report to upstream maintainers)

## Security Best Practices

### For Users
- Keep dependencies updated: `npm audit fix`
- Use environment variables for configuration (never commit `.env`)
- Enable GitHub's secret scanning on your forks
- Review code before running untrusted scripts

### For Contributors
- Never commit secrets or credentials
- Use `.gitignore` to exclude sensitive files
- Run `npm audit` before submitting PRs
- Avoid `eval()` and dynamic code execution
- Validate all input payloads

## Security Tools

Enable these in your repository settings:
- ✓ GitHub Secret Scanning
- ✓ Dependabot (dependency updates)
- ✓ Code scanning with CodeQL

---

**Last updated:** 2026-09-26
