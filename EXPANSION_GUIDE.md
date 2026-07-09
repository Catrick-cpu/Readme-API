# Expansion Guide

Step-by-step guide to adding new renderers to the API.

## Quick Start: Add a Renderer in 5 Minutes

### Example: Create a "Statistics Tracker" Renderer

#### Step 1: Create the Renderer File

```typescript
// src/renderers/trackingRenderer.ts

import {BaseRenderer, RenderInput, RenderOutput} from '../core/rendererInterface';
import {SVGBuilder} from '../core/svgBuilder';

export class StatsTrackerRenderer extends BaseRenderer {
  readonly name = 'stats-tracker';
  readonly displayName = 'Stats Tracker';
  readonly description = 'Track and visualize statistics over time';
  readonly category = 'data';
  readonly aliases = ['tracker', 'metrics'];

  async render(input: RenderInput): Promise<RenderOutput> {
    try {
      const data = typeof input.content === 'string' ? JSON.parse(input.content) : input.content;
      const builder = new SVGBuilder(input.width || 900, input.height || 500, input.theme || 'light');
      const theme = builder.getTheme();

      // Your rendering logic
      const svg = this.createTrackerSvg(data, builder);

      return {
        svg,
        width: builder.getWidth(),
        height: builder.getHeight(),
        type: 'stats-tracker',
      };
    } catch (err) {
      const builder = new SVGBuilder(input.width || 900, input.height || 500, input.theme || 'light');
      return {
        svg: builder.createError('Tracker Error', 'Invalid data format'),
        width: builder.getWidth(),
        height: builder.getHeight(),
        type: 'stats-tracker',
      };
    }
  }

  private createTrackerSvg(data: any, builder: SVGBuilder): string {
    // Your SVG generation
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${builder.getWidth()}" height="${builder.getHeight()}">
  <!-- Your SVG content -->
</svg>`;
  }

  getExample() {
    return {
      input: {
        content: JSON.stringify([
          {metric: 'Users', value: 1000},
          {metric: 'Revenue', value: 50000},
          {metric: 'Engagement', value: 85},
        ]),
        title: 'Q4 Metrics',
      },
      description: 'Display key metrics with tracking',
    };
  }
}
```

#### Step 2: Register in API

```typescript
// api/render-v2.ts

import {StatsTrackerRenderer} from '../src/renderers/trackingRenderer';

function initializeRenderers() {
  // ... existing renderers ...
  registry.register(new StatsTrackerRenderer());
}
```

#### Step 3: Test

```bash
npm run dev
# Visit: http://localhost:3000/api/render?type=stats-tracker&content=%7B...%7D
```

**Done!** The renderer is now available.

---

## Common Renderer Patterns

### Pattern 1: Simple Text Formatter

For renderers that format text (markdown, code, etc.):

```typescript
export class MyFormatterRenderer extends BaseRenderer {
  readonly name = 'my-formatter';
  readonly category = 'documentation';

  async render(input: RenderInput): Promise<RenderOutput> {
    // 1. Parse/format the content
    const formatted = this.formatContent(input.content);

    // 2. Create SVG container
    const builder = new SVGBuilder(input.width || 800, input.height || 600, input.theme || 'light');
    const svg = builder.buildContainer(formatted, input.title);

    // 3. Return output
    return {
      svg,
      width: builder.getWidth(),
      height: builder.getHeight(),
      type: this.name,
    };
  }

  private formatContent(content: string): string {
    // Your formatting logic
    return `<div>${content}</div>`;
  }
}
```

**Examples:** `MarkdownRenderer`, `ChangelogRenderer`

### Pattern 2: JSON Data Visualizer

For renderers that consume JSON:

```typescript
export class MyDataRenderer extends BaseRenderer {
  readonly name = 'my-data';
  readonly category = 'data';

  validate(input: RenderInput) {
    const base = super.validate(input);
    if (!base.valid) return base;

    try {
      JSON.parse(input.content);
      return {valid: true};
    } catch {
      return {valid: false, error: 'Invalid JSON'};
    }
  }

  async render(input: RenderInput): Promise<RenderOutput> {
    try {
      const data = JSON.parse(input.content);
      const builder = new SVGBuilder(input.width || 800, input.height || 600, input.theme || 'light');

      // Visualize data
      const svg = this.visualize(data, builder);

      return {svg, width: builder.getWidth(), height: builder.getHeight(), type: this.name};
    } catch (err) {
      const builder = new SVGBuilder(input.width || 800, input.height || 600, input.theme || 'light');
      return {
        svg: builder.createError('Data Error', 'Failed to process'),
        width: builder.getWidth(),
        height: builder.getHeight(),
        type: this.name,
      };
    }
  }

  private visualize(data: any, builder: SVGBuilder): string {
    // Your visualization
    return `<svg>...</svg>`;
  }
}
```

**Examples:** `BarChartRenderer`, `TableRenderer`, `StatsRenderer`

### Pattern 3: Language-Specific Renderer

For code/syntax-based renderers:

```typescript
export class MyLanguageRenderer extends BaseRenderer {
  readonly name = 'mylang';
  readonly category = 'code';

  validate(input: RenderInput) {
    const base = super.validate(input);
    if (!base.valid) return base;

    if (!this.isValidLanguage(input.language)) {
      return {valid: false, error: 'Unsupported language'};
    }

    return {valid: true};
  }

  async render(input: RenderInput): Promise<RenderOutput> {
    const language = input.language || 'plaintext';
    const highlighted = this.highlight(input.content, language);
    const builder = new SVGBuilder(input.width || 900, input.height || 600, input.theme || 'light');

    const svg = this.createCodeSvg(highlighted, language, builder);

    return {
      svg,
      width: builder.getWidth(),
      height: builder.getHeight(),
      type: this.name,
    };
  }

  private isValidLanguage(lang?: string): boolean {
    const supported = ['python', 'javascript', 'typescript'];
    return !lang || supported.includes(lang.toLowerCase());
  }

  private highlight(code: string, language: string): string {
    // Your highlighting logic
    return code;
  }

  private createCodeSvg(highlighted: string, language: string, builder: SVGBuilder): string {
    // Generate SVG with code
    return `<svg>...</svg>`;
  }
}
```

**Examples:** `CodeRenderer`, `DiffRenderer`, `TerminalRenderer`

---

## Advanced Features

### Custom SVG Elements

Use `SVGBuilder` methods:

```typescript
async render(input: RenderInput): Promise<RenderOutput> {
  const builder = new SVGBuilder(input.width || 800, input.height || 600, input.theme || 'light');
  const theme = builder.getTheme();

  // Use existing methods
  const statCard = builder.createStatCard('Users', '1,234', theme.accent);
  const progressBar = builder.createBar('Progress', 75, theme.accent);
  const errorMsg = builder.createError('Title', 'Message');
  const table = builder.createTable(['Col1', 'Col2'], [['A', 'B']]);

  // Combine multiple elements
  return {svg: statCard, width: 300, height: 120, type: this.name};
}
```

### Theme-Aware Colors

Access theme colors:

```typescript
async render(input: RenderInput): Promise<RenderOutput> {
  const builder = new SVGBuilder(input.width || 800, input.height || 600, input.theme || 'light');
  const theme = builder.getTheme();

  // Use theme colors
  const bg = theme.bg;          // Background
  const text = theme.text;      // Text color
  const accent = theme.accent;  // Primary color
  const border = theme.border;  // Border color
  const error = theme.error;    // Error color
  const success = theme.success; // Success color

  // Your SVG using these colors
  const svg = `<svg>
    <rect fill="${bg}" stroke="${border}"/>
    <text fill="${text}">Text</text>
  </svg>`;

  return {svg, width: builder.getWidth(), height: builder.getHeight(), type: this.name};
}
```

### Size Normalization

Always use these methods:

```typescript
const width = this.normalizeWidth(input.width);  // Clamps to 300-1200
const height = this.normalizeHeight(input.height); // Clamps to 200-3000
```

### Aliases for Convenience

Provide multiple names:

```typescript
export class MyRenderer extends BaseRenderer {
  readonly name = 'primary-name';
  readonly aliases = ['alias1', 'alias2', 'shorthand'];
}

// Users can now call:
// ?type=primary-name
// ?type=alias1
// ?type=shorthand
```

---

## Testing Your Renderer

### Unit Test Example

```typescript
import {MyRenderer} from './myRenderer';

describe('MyRenderer', () => {
  let renderer: MyRenderer;

  beforeEach(() => {
    renderer = new MyRenderer();
  });

  describe('validation', () => {
    it('should accept valid input', () => {
      const validation = renderer.validate({content: 'valid'});
      expect(validation.valid).toBe(true);
    });

    it('should reject empty input', () => {
      const validation = renderer.validate({content: ''});
      expect(validation.valid).toBe(false);
      expect(validation.error).toContain('empty');
    });

    it('should reject oversized input', () => {
      const validation = renderer.validate({content: 'x'.repeat(51000)});
      expect(validation.valid).toBe(false);
    });
  });

  describe('rendering', () => {
    it('should return valid SVG', async () => {
      const output = await renderer.render({content: 'test'});
      expect(output.svg).toContain('<svg');
      expect(output.svg).toContain('</svg>');
      expect(output.type).toBe(renderer.name);
    });

    it('should handle errors gracefully', async () => {
      const output = await renderer.render({content: 'invalid{json'});
      expect(output.svg).toContain('Error');
    });
  });

  describe('metadata', () => {
    it('should provide example', () => {
      const example = renderer.getExample();
      expect(example.input).toBeDefined();
      expect(example.description).toBeDefined();
    });
  });
});
```

### Manual Testing

```bash
# Start dev server
npm run dev

# Test your renderer
curl "http://localhost:3000/api/render?type=my-renderer&content=test"

# Test with JSON data
curl "http://localhost:3000/api/render?type=my-renderer&content=%7B%22key%22%3A%22value%22%7D"
```

---

## Checklist: Before Adding to Production

- [ ] Renderer implements `Renderer` interface
- [ ] `name` is unique (check existing renderers)
- [ ] `category` is set correctly
- [ ] `validate()` rejects invalid input
- [ ] `render()` catches errors gracefully
- [ ] `getExample()` demonstrates usage
- [ ] SVG is well-formed and escaped
- [ ] Themes (light/dark) are supported
- [ ] Width/height are normalized
- [ ] Works on Vercel (no fs, no long async)
- [ ] Performance is acceptable (<2s)
- [ ] Tests pass
- [ ] Registered in `api/render-v2.ts`

---

## Renderer Ideas to Implement

### Documentation
- [ ] API documentation generator
- [ ] Architecture diagram builder
- [ ] Quick reference card
- [ ] FAQ/QA formatter

### Code
- [ ] SQL formatter
- [ ] XML/HTML pretty-printer
- [ ] Shell script highlighter
- [ ] Regex visualizer

### Data
- [ ] Heatmap renderer
- [ ] Timeline with progress
- [ ] Dependency graph
- [ ] Sankey diagram

### Design
- [ ] Color palette generator
- [ ] Typography showcase
- [ ] Design system component
- [ ] Spacing guide

### Creative
- [ ] ASCII art renderer
- [ ] QR code generator
- [ ] Badge generator
- [ ] Certificate template

---

## Real-World Example: SQL Renderer

Complete, production-ready example:

```typescript
// src/renderers/sqlRenderer.ts
import {BaseRenderer, RenderInput, RenderOutput} from '../core/rendererInterface';
import {SVGBuilder} from '../core/svgBuilder';

export class SQLRenderer extends BaseRenderer {
  readonly name = 'sql';
  readonly displayName = 'SQL Query';
  readonly description = 'Render formatted SQL queries';
  readonly category = 'code';
  readonly aliases = ['query', 'database'];

  async render(input: RenderInput): Promise<RenderOutput> {
    const formatted = this.formatSQL(input.content);
    const builder = new SVGBuilder(input.width || 900, input.height || 600, input.theme || 'light');
    const theme = builder.getTheme();

    const lines = formatted.split('\n');
    const lineHeight = 18;
    const totalHeight = Math.max(input.height || 600, lines.length * lineHeight + 50);

    let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${builder.getWidth()}" height="${totalHeight}">
  <rect width="${builder.getWidth()}" height="${totalHeight}" fill="${theme.codeBg}"/>
  <rect x="0" y="0" width="${builder.getWidth()}" height="35" fill="${theme.border}" opacity="0.3"/>

  <text x="10" y="23" style="font-weight: bold; font-size: 13px;" fill="${theme.text}">
    SQL Query
  </text>

  <line x1="0" y1="35" x2="${builder.getWidth()}" y2="35" stroke="${theme.border}" stroke-width="1"/>`;

    lines.forEach((line, idx) => {
      const y = 40 + idx * lineHeight + 12;
      const color = this.getLineColor(line, theme);

      svg += `
  <text x="10" y="${y}" class="mono" fill="${color}" style="font-family: monospace; font-size: 12px;">
    ${escapeXml(line)}
  </text>`;
    });

    svg += '\n</svg>';

    return {
      svg,
      width: builder.getWidth(),
      height: Math.min(totalHeight, 3000),
      type: 'sql',
    };
  }

  private formatSQL(sql: string): string {
    return sql
      .replace(/\bSELECT\b/gi, 'SELECT')
      .replace(/\bFROM\b/gi, 'FROM')
      .replace(/\bWHERE\b/gi, 'WHERE')
      .replace(/\bJOIN\b/gi, 'JOIN')
      .replace(/\bON\b/gi, 'ON');
  }

  private getLineColor(line: string, theme: any): string {
    if (line.trim().match(/^(SELECT|FROM|WHERE|JOIN|ON)/)) {
      return theme.accent;
    }
    if (line.trim().startsWith('--')) {
      return theme.text + '99';
    }
    return theme.text;
  }

  getExample() {
    return {
      input: {
        content: `SELECT u.id, u.name, COUNT(o.id) as orders
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.active = 1
GROUP BY u.id`,
        title: 'User Orders Query',
      },
      description: 'SQL query with color-coded keywords',
    };
  }
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
```

Register it:

```typescript
// api/render-v2.ts
import {SQLRenderer} from '../src/renderers/sqlRenderer';

function initializeRenderers() {
  // ...
  registry.register(new SQLRenderer());
}
```

---

## Need Help?

- Read `ARCHITECTURE.md` for design principles
- Check existing renderers for patterns
- Review `RENDERER_CATALOG.md` for examples
- See `SECURITY.md` for safety guidelines

---

Happy extending! 🚀
