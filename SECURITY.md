# Security Documentation

Comprehensive security documentation for the GitHub README Preview API.

## Security Overview

This API is designed with security as a first-class concern. All user input is validated, sanitized, and processed safely to prevent common web vulnerabilities.

## Input Validation

### Request Validation (Zod)

Every request is validated against a strict schema:

```typescript
const RenderRequestSchema = z.object({
  type: z.enum(['html', 'markdown', 'code', 'mermaid', 'component']),
  content: z.string().max(50000),
  language: z.string().optional(),
  css: z.string().max(10000).optional(),
  title: z.string().max(500).optional(),
  theme: z.enum(['light', 'dark']).default('light'),
  width: z.number().int().min(300).max(1200).default(800),
  height: z.number().int().min(200).max(3000).default(600),
});
```

**Validations:**
- ✅ Type whitelist (enum)
- ✅ Content length limits (50KB max)
- ✅ CSS length limits (10KB max)
- ✅ Numeric range validation (width, height)
- ✅ Title length limits (500 chars)
- ✅ Theme whitelist

**Validation Errors:**
Invalid inputs return a 400-level error with details:
```json
{
  "error": "Validation Error",
  "message": "content: Content exceeds maximum length"
}
```

## HTML Sanitization

### Safe HTML Tags (Whitelist)

Only these tags are allowed:

```
h1, h2, h3, h4, h5, h6
p, br, strong, em, b, i
ul, ol, li, dl, dt, dd
table, thead, tbody, tr, th, td
blockquote, pre, code, span, div
a, img, button, hr, section, article
```

### Safe Attributes (Whitelist)

Only these attributes are allowed per tag:

```typescript
{
  'a': ['href', 'title', 'class'],
  'img': ['src', 'alt', 'width', 'height', 'class'],
  'div': ['class', 'id'],
  'span': ['class', 'id'],
  // ... (class/id allowed on most tags)
}
```

### Blocked Content

Automatically removed:
- ❌ `<script>` tags
- ❌ `<iframe>` tags
- ❌ `<object>` and `<embed>` tags
- ❌ Event handlers (`onclick`, `onload`, etc.)
- ❌ `javascript:` protocol URLs
- ❌ Data URLs in dangerous contexts

### Sanitization Example

```html
<!-- INPUT -->
<h1>Safe</h1>
<script>alert('XSS')</script>
<img src="x" onclick="alert('XSS')">

<!-- OUTPUT -->
<h1>Safe</h1>
<!-- script removed -->
<img src="x" alt=""/>
<!-- onclick attribute removed -->
```

## CSS Sanitization

### CSS Dangerous Patterns (Blocked)

```css
/* BLOCKED */
background: url('javascript:...');
behavior: url('...');
-moz-binding: url('...');
@import url('...');
expression(...);
```

### CSS Safety Checks

```typescript
const dangerous = [
  /javascript:/gi,
  /expression\s*\(/gi,
  /import\s+/gi,
  /@import/gi,
  /<script/gi,
  /behavior:/gi,
  /-moz-binding:/gi,
];
```

### CSS Length Limit

Maximum CSS: **10,000 characters**

## SVG Security

### SVG Injection Prevention

SVG content is validated to prevent injection:

```typescript
// Blocks
<script>alert('XSS')</script>
onclick="alert('XSS')"
javascript:alert('XSS')
```

### SVG Escaping

All user content in SVGs is properly escaped:

```typescript
function escapeSvgAttribute(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
```

## URL Validation

### URL Security

- ✅ Only HTTP/HTTPS protocols allowed
- ✅ JavaScript URLs blocked
- ✅ Data URLs restricted
- ✅ Proper URL parsing

```typescript
function sanitizeUrl(url: string): string {
  try {
    const parsed = new URL(url);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return '';
    }
    return url;
  } catch {
    return '';
  }
}
```

## Language Validation

### Supported Languages Only

Code highlighting supports only whitelisted languages:

```typescript
const supportedLanguages = new Set([
  'html', 'css', 'javascript', 'typescript',
  'python', 'c', 'cpp', 'rust', 'java',
  'json', 'yaml', 'bash', 'markdown',
  'sql', 'go', 'ruby', 'php',
]);
```

Unrecognized languages fallback to plaintext rendering.

## Mermaid Security

### Mermaid Validation

All Mermaid content is validated:

```typescript
function validateMermaidContent(content: string): boolean {
  // Check for:
  // - Unclosed brackets
  // - Malformed syntax
  // - Suspicious patterns
}
```

### Mermaid Dangerous Content

Blocks:
- ❌ JavaScript execution
- ❌ External script loading
- ❌ Event handlers

## Code Injection Prevention

### No Code Execution

- ✅ No JavaScript execution from HTML content
- ✅ No CSS @import execution
- ✅ No SVG script execution
- ✅ No file system access

### Syntax Highlighting Safety

Code is highlighted only for display:
- Text-based highlighting only
- No actual code execution
- No module loading
- No dynamic evaluation

## Rate Limiting (Future)

Currently no rate limiting. For production:

### Recommended Implementation

```typescript
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(100, "1h"),
  analytics: true,
});

export default async function handler(req, res) {
  const { success, limit } = await ratelimit.limit("api_render");
  
  if (!success) {
    return res.status(429).json({ error: "Rate limited" });
  }
  // ... handle request
}
```

### Rate Limits

Suggested tier:
- Free: 100 requests/hour
- Pro: 1,000 requests/hour
- Enterprise: Custom

## CORS & Headers

### CORS Configuration

```typescript
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
```

**Allowed:**
- ✅ GET requests only
- ✅ Cross-origin access
- ✅ Standard headers

**Blocked:**
- ❌ POST/PUT/DELETE
- ❌ Cookie-based auth
- ❌ Custom authentication headers

### Cache Headers

```
Cache-Control: public, max-age=3600, immutable
Content-Type: image/svg+xml; charset=utf-8
```

## Content Security

### Content Length Limits

- **HTML/Markdown/Code:** 50,000 bytes
- **CSS:** 10,000 bytes
- **Titles:** 500 characters
- **Overall request:** Vercel default (6MB)

### Size Calculation

```typescript
function estimateSize(content: string): number {
  return new TextEncoder().encode(content).length;
}
```

## Error Handling

### Safe Error Messages

- ✅ Validation errors shown
- ✅ Rendering errors shown
- ✅ No stack traces exposed
- ✅ No internal paths revealed

```typescript
// Bad (exposes internals)
throw new Error(`Failed at /home/user/api/render.ts:123`);

// Good (generic error)
return createErrorSvg('Rendering Error', 'Invalid HTML content');
```

## Dependency Security

### Secure Dependencies

- **marked:** Battle-tested Markdown parser
- **highlight.js:** Standard syntax highlighting
- **sanitize-html:** Purpose-built XSS prevention
- **zod:** Runtime schema validation
- **mermaid:** Official diagram library

### Dependency Updates

```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Update securely
npm update
```

### Supply Chain Security

- ✅ Lock file tracked in Git
- ✅ Pinned versions in package.json
- ✅ Regular security audits
- ✅ No "any" version constraints

## Data Privacy

### No Data Storage

- ✅ Stateless API
- ✅ No content logged
- ✅ No database queries
- ✅ No file system storage

### Request Logging

By default, Vercel logs:
- Request method and URL
- Response status
- Response time

**Not logged:**
- Request content
- User content
- Query parameters (optional via settings)

### Data In Transit

- ✅ HTTPS only
- ✅ TLS 1.3+
- ✅ No insecure protocols

## Compliance

### Standards Met

- ✅ OWASP Top 10 (XSS, Injection prevention)
- ✅ CWE Top 25 (Input validation)
- ✅ Secure by default

### Certifications

Vercel provides:
- ✅ SOC 2 Type II
- ✅ GDPR compliant
- ✅ HIPAA compatible
- ✅ ISO 27001

## Security Checklist

Before production deployment:

```
[ ] Update all dependencies: npm audit fix
[ ] Review vercel.json configuration
[ ] Test with malicious inputs
[ ] Monitor logs for errors
[ ] Set up CORS if needed
[ ] Configure rate limiting
[ ] Add custom domain with HTTPS
[ ] Set up monitoring/alerts
[ ] Document security policies
[ ] Review allowed content types
```

## Reporting Security Issues

**Do not open public issues for security vulnerabilities.**

1. Email: security@example.com (replace with your email)
2. Include:
   - Vulnerability description
   - Affected component
   - Proof of concept
   - Suggested fix (if available)

3. Allow 48 hours for response

## Security Testing

### Manual Testing

```bash
# Test XSS prevention
curl "http://localhost:3000/api/render?type=html&content=%3Cscript%3Ealert%28%27XSS%27%29%3C%2Fscript%3E"

# Test code injection
curl "http://localhost:3000/api/render?type=code&content=javascript%3Aalert%28%27XSS%27%29"

# Test SVG injection
curl "http://localhost:3000/api/render?type=html&content=%3Csvg%20onload%3Dalert%28%27XSS%27%29%3E"
```

### Automated Testing

```bash
# Run security audit
npm audit

# Check for vulnerabilities
npm audit --audit-level=moderate

# Fix issues
npm audit fix --force
```

## Security Resources

- [OWASP Security Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)
- [CWE Top 25](https://cwe.mitre.org/top25/)
- [MDN Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)
- [Vercel Security](https://vercel.com/trust/security)

## Version History

- **v1.0.0** - Initial release with HTML, Markdown, Code, Mermaid support
  - ✅ Full input validation
  - ✅ HTML sanitization
  - ✅ CSS sanitization
  - ✅ XSS prevention
  - ✅ SVG safety

## Future Security Enhancements

- [ ] API key authentication
- [ ] Rate limiting per API key
- [ ] Request signing
- [ ] Webhook delivery validation
- [ ] Enhanced logging/monitoring
- [ ] DDoS protection
- [ ] WAF rules

---

Security is a continuous process. Report issues responsibly and update regularly.
