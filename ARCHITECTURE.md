# Architecture Guide

Deep dive into the plugin-based renderer architecture.

## System Design

### Core Concept

The API uses a **plugin registry pattern** where each content type is a "renderer" implementing a standard interface.

```
Request
  ↓
API Endpoint (api/render-v2.ts)
  ↓
Renderer Registry (core/rendererRegistry.ts)
  ↓
Specific Renderer (renderers/*)
  ↓
SVG Builder (core/svgBuilder.ts)
  ↓
SVG Response
```

### Key Components

#### 1. **Renderer Interface** (`src/core/rendererInterface.ts`)

All renderers implement this:

```typescript
interface Renderer {
  name: string;
  displayName: string;
  description: string;
  category: string;
  aliases: string[];

  render(input: RenderInput): Promise<RenderOutput>;
  validate(input: RenderInput): {valid: boolean; error?: string};
  getExample(): {input: RenderInput; description: string};
}
```

#### 2. **Base Renderer** (`src/core/rendererInterface.ts`)

Abstract class providing common functionality:

```typescript
abstract class BaseRenderer implements Renderer {
  abstract readonly name: string;
  abstract render(input: RenderInput): Promise<RenderOutput>;

  validate(input: RenderInput) {
    // Default validation: non-empty, size limits
  }

  protected normalizeWidth(width?: number): number {
    // Clamp to 300-1200px
  }
}
```

**Extend this** for new renderers to get validation for free.

#### 3. **Renderer Registry** (`src/core/rendererRegistry.ts`)

Singleton that manages all renderers:

```typescript
registry.register(renderer);        // Register new renderer
registry.getRenderer('markdown');   // Get by name
registry.getRenderer('md');         // Get by alias
registry.getRenderersByCategory('code');
registry.getMetadata();             // Get all as JSON
```

#### 4. **SVG Builder** (`src/core/svgBuilder.ts`)

Utility for consistent SVG output:

```typescript
const builder = new SVGBuilder(width, height, theme);

// Methods
builder.buildContainer(html, title);
builder.createStatCard(label, value, color);
builder.createBar(label, percentage, color);
builder.createTable(headers, rows);
builder.createError(title, message);
builder.getTheme(); // Current theme colors
```

---

## Directory Structure

```
src/
├── core/                           # Core system
│   ├── rendererInterface.ts       # Interface & BaseRenderer
│   ├── rendererRegistry.ts        # Renderer registry
│   └── svgBuilder.ts              # SVG generation utilities
│
├── renderers/                      # Individual renderers
│   ├── markdownRenderer.ts        # Markdown, Changelog, etc.
│   ├── codeRenderer.ts            # Code, JSON, YAML, Terminal, Diff
│   ├── dataRenderer.ts            # CSV, Table, Chart, Progress, Stats
│   ├── diagramRenderer.ts         # Mermaid, Timeline
│   └── componentRenderer.ts       # Badge, Button, Card, Divider
│
├── parsers/                        # Content parsing
│   ├── markdown.ts                # Markdown → HTML
│   ├── code.ts                    # Code highlighting
│   ├── html.ts                    # HTML sanitization
│   └── mermaid.ts                 # Mermaid validation
│
└── utils/                          # Utilities
    ├── validation.ts              # Zod schemas
    ├── sanitize.ts                # XSS prevention
    └── encoding.ts                # URL/XML encoding

api/
├── render.ts                       # Original endpoint (v1)
└── render-v2.ts                   # New plugin-based endpoint
```

---

## Data Flow

### Request Handling

```
1. API receives: GET /api/render?type=markdown&content=...

2. Query parsing:
   - type → renderer name
   - content → URL decode
   - Other params → pass through

3. Registry lookup:
   - registry.getRenderer('markdown')
   - Returns MarkdownRenderer instance

4. Validation:
   - renderer.validate(input)
   - Check empty, size, format

5. Rendering:
   - renderer.render(input)
   - SVG builder creates output

6. Response:
   - Set headers (Content-Type: image/svg+xml)
   - Set cache (max-age=3600, immutable)
   - Return SVG
```

### Renderer Lifecycle

```
class MyRenderer extends BaseRenderer {
  // 1. Define properties
  name = 'my-renderer'
  category = 'component'
  aliases = ['alias1']

  // 2. Implement validation (optional)
  validate(input) {
    // Custom validation logic
    return {valid: true}
  }

  // 3. Implement rendering
  async render(input) {
    const builder = new SVGBuilder(...)
    const svg = `<svg>...</svg>`
    return {svg, width, height, type}
  }

  // 4. Provide example
  getExample() {
    return {
      input: {...},
      description: "..."
    }
  }
}

// 5. Register in API
registry.register(new MyRenderer())
```

---

## Extension Points

### 1. Adding a Renderer

**Step 1:** Create renderer file

```typescript
// src/renderers/myRenderer.ts
import {BaseRenderer} from '../core/rendererInterface';

export class MyRenderer extends BaseRenderer {
  readonly name = 'my-renderer';
  readonly displayName = 'My Renderer';
  readonly description = 'Description';
  readonly category = 'component';

  async render(input) {
    // Render logic
  }

  getExample() { /* ... */ }
}
```

**Step 2:** Import and register

```typescript
// api/render-v2.ts
import {MyRenderer} from '../src/renderers/myRenderer';

function initializeRenderers() {
  // ... existing renderers ...
  registry.register(new MyRenderer());
}
```

**That's it!** No changes to core API needed.

### 2. Custom SVG Builder

Renderers can extend SVGBuilder:

```typescript
class CustomBuilder extends SVGBuilder {
  createCustomLayout() {
    // Your SVG logic
  }
}
```

### 3. Custom Validation

Override `validate()`:

```typescript
validate(input) {
  const base = super.validate(input);
  if (!base.valid) return base;

  // Custom checks
  if (!input.content.startsWith('---')) {
    return {valid: false, error: 'Must start with ---'};
  }

  return {valid: true};
}
```

### 4. Custom Themes

Create theme variations:

```typescript
// In SVGBuilder or custom builder
const themes = {
  github: { bg: '#fff', text: '#000', ... },
  slack: { bg: '#f8f8f8', text: '#1d1c1d', ... },
  terminal: { bg: '#000', text: '#0f0', ... },
};
```

---

## Category System

Renderers are organized by category:

| Category | Purpose | Example Renderers |
|----------|---------|-------------------|
| documentation | Text & docs | markdown, changelog, readme-section |
| code | Programming | code, json, yaml, terminal, diff |
| data | Data viz | csv, table, bar-chart, progress, stats |
| diagram | Diagrams | mermaid, timeline |
| component | UI elements | badge, button, card, divider |

**Query renderers by category:**

```typescript
registry.getRenderersByCategory('code')
// Returns: [CodeRenderer, JsonRenderer, YamlRenderer, TerminalRenderer, DiffRenderer]
```

---

## Input/Output Contracts

### RenderInput

```typescript
interface RenderInput {
  content: string;           // Main content (required)
  title?: string;            // Optional title
  width?: number;            // SVG width (300-1200)
  height?: number;           // SVG height (200-3000)
  theme?: 'light' | 'dark';  // Theme (default: light)
  language?: string;         // Language (for code)
  [key: string]: any;        // Custom params
}
```

### RenderOutput

```typescript
interface RenderOutput {
  svg: string;               // Generated SVG
  width: number;             // Actual width used
  height: number;            // Actual height used
  type: string;              // Renderer type
}
```

---

## Error Handling

### Validation Errors

```typescript
// In validate()
if (!input.content.match(/required-pattern/)) {
  return {valid: false, error: 'Content must match pattern'};
}
```

**Renders as:** Error SVG card with message

### Rendering Errors

```typescript
// In render()
try {
  // Rendering logic
} catch (err) {
  const builder = new SVGBuilder(...);
  return {
    svg: builder.createError('Rendering Error', err.message),
    width: builder.getWidth(),
    height: builder.getHeight(),
    type: 'error',
  };
}
```

**Result:** User sees error message in SVG, not a crash

---

## Performance Considerations

### Caching Strategy

```
Request → Check if SVG cached
           ↓
         Generate SVG (if new)
           ↓
         Cache with:
         - Cache-Control: public, max-age=3600, immutable
         - Vercel edge caching enabled
```

Same URL always = same SVG = cached from edge

### Scalability

- **Stateless:** No database needed
- **Serverless:** Auto-scales with Vercel
- **Lightweight:** ~2MB with deps
- **Fast:** 30-150ms typical response

---

## Security Architecture

### Input Validation Layer

```typescript
// Every request validated before rendering
validate(input): {valid, error?}
  ├─ Empty check
  ├─ Size check (50KB max)
  ├─ Format check
  └─ Custom validation
```

### Sanitization Layer

```typescript
// Content sanitized by renderer
parseMarkdown(md)  // HTML tag whitelist
highlightCode(code) // Language whitelist
sanitizeHtml(html)  // XSS prevention
```

### Output Safety Layer

```typescript
// All output escaped before SVG
escapeXml(text)     // <>&"' → entities
escapeSvgAttribute() // SVG-specific escaping
```

---

## Testing

### Unit Testing Example

```typescript
describe('MyRenderer', () => {
  it('should render valid input', async () => {
    const renderer = new MyRenderer();
    const input = {content: 'test'};

    const validation = renderer.validate(input);
    expect(validation.valid).toBe(true);

    const output = await renderer.render(input);
    expect(output.svg).toContain('<svg');
    expect(output.type).toBe('my-renderer');
  });

  it('should reject invalid input', () => {
    const renderer = new MyRenderer();
    const validation = renderer.validate({content: ''});
    expect(validation.valid).toBe(false);
  });
});
```

---

## Deployment

### Vercel Configuration

```json
{
  "version": 2,
  "runtime": "nodejs20.x",
  "functions": {
    "api/**/*.ts": {
      "maxDuration": 30,
      "memory": 1024
    }
  }
}
```

### Environment Variables

```env
MAX_CONTENT_LENGTH=50000
MAX_SVG_WIDTH=1200
MAX_SVG_HEIGHT=3000
```

---

## Future Extensions

### Planned Renderers

- LaTeX/Math formulas
- Circuit diagrams
- Architecture diagrams
- SQL visualizations
- ASCII art generator
- Pixel art renderer

### Possible Enhancements

- Custom color themes per renderer
- Interactive SVG elements
- Animation support
- PDF export
- Client-side mermaid rendering
- Custom fonts

---

## Troubleshooting

### Renderer Not Registered

```
Error: Unknown renderer: my-type
```

**Fix:** Make sure `registry.register(new MyRenderer())` is called in `initializeRenderers()`

### Validation Failing

```
Error: Invalid input
```

**Check:**
1. Is content provided?
2. Is content under 50KB?
3. Does it match expected format?

### SVG Not Rendering

```
Nothing displayed in GitHub
```

**Check:**
1. SVG has opening `<?xml>` tag
2. SVG has proper `<svg>` element
3. No scripts or event handlers
4. All text is escaped

---

## Design Principles

1. **Separation of Concerns**
   - Renderers handle their specific type
   - Registry manages lifecycle
   - SVGBuilder handles output format

2. **Extensibility**
   - Add renderers without changing core
   - Custom validation per renderer
   - Theme system for consistent look

3. **Security**
   - Input validation always first
   - Content sanitized by type
   - Output safely escaped

4. **Performance**
   - Stateless design
   - Edge caching enabled
   - Fast response times

5. **Developer Experience**
   - Clear interface to implement
   - Base class provides common logic
   - Examples for every renderer
   - Comprehensive documentation

---

This architecture makes it easy to add new renderers while maintaining security, performance, and consistency across the entire API.
