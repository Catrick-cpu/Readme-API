# Renderer Catalog

Complete guide to all available renderers in the GitHub README Preview API.

## Overview

The API supports **15+ specialized renderers** across 5 categories, with a plugin architecture for easy expansion.

**Access via:**
```
GET /api/render?type=<renderer>&content=<data>
```

**List all renderers:**
```
GET /api/render?list=true
GET /api/render?catalog=true
```

---

## 📚 Documentation Renderers

### markdown | md

Render Markdown documents as SVG.

**Parameters:**
- `content` - Markdown text
- `title` - Optional page title
- `theme` - `light` or `dark`

**Example:**
```markdown
![Markdown](https://api.example.com/api/render?type=markdown&content=%23%20Hello%0AThis%20is%20**bold**)
```

**Supports:**
- Headings (h1-h6)
- Bold, italic, strikethrough
- Lists (ordered & unordered)
- Links
- Code blocks
- Tables
- Blockquotes

---

### changelog | releases

Render changelogs and version history.

**Format:** Markdown with `## version` sections

**Example:**
```
## v2.0.0
- New features
- Bug fixes

## v1.9.0
- Beta version
```

**Parameters:**
- `content` - Changelog text
- `title` - Optional title (default: "Changelog")

---

### readme-section | readme | doc-section

Render a section from a README with formatting.

**Example:**
```
## Installation
```bash
npm install
```

Run with `npm start`
```

**Identical to:** `markdown` renderer

---

## 💻 Code Renderers

### code | source | snippet

Render syntax-highlighted code blocks.

**Parameters:**
- `content` - Source code
- `language` - Programming language (see below)
- `title` - Optional section title
- `theme` - `light` or `dark`

**Supported Languages:**
```
python, javascript, typescript, java, cpp, c, rust,
go, ruby, php, bash, sql, kotlin, swift, csharp,
html, css, jsx, tsx, vue, dockerfile, makefile,
groovy, scala, clojure, elixir, erlang, haskell
```

**Example:**
```
?type=code&language=python&content=print%28%22Hello%22%29
```

---

### json

Render and format JSON data.

**Auto-formats** JSON with proper indentation.

**Example:**
```
?type=json&content=%7B%22name%22%3A%22Alice%22%2C%22age%22%3A30%7D
```

---

### yaml | yml

Render YAML configuration files.

**Example:**
```
?type=yaml&content=name%3A%20MyApp%0Aversion%3A%201.0.0
```

---

### terminal | log | output | bash-output

Render terminal output and logs (dark theme always).

**Features:**
- Green text on black background (authentic terminal look)
- Line-by-line display
- Perfect for build logs, CI output

**Example:**
```
?type=terminal&content=%24%20npm%20install%0Aadded%20150%20packages
```

---

### diff | patch

Render file diffs with color coding.

**Features:**
- Green for additions (+)
- Red for deletions (-)
- Blue for headers (@@)

**Format:**
```
--- a/file.js
+++ b/file.js
@@ -1,3 +1,4 @@
 const x = 1;
-const y = 2;
+const y = 3;
```

**Example:**
```
?type=diff&content=---%20a%2Ffile.js...
```

---

## 📊 Data Renderers

### csv

Render CSV data as a formatted table.

**Auto-parses** CSV with quoted strings support.

**Example:**
```
?type=csv&content=Name%2CAge%2CCity%0AAlice%2C30%2CNYC%0ABob%2C25%2CLA
```

---

### table

Render structured table data from JSON.

**Input Format:**
```json
{
  "headers": ["Column 1", "Column 2"],
  "rows": [
    ["Value 1", "Value 2"],
    ["Value 3", "Value 4"]
  ]
}
```

**Example:**
```
?type=table&content=%7B%22headers%22%3A%5B%22Name%22%5D%2C%22rows%22%3A%5B%5B%22Alice%22%5D%5D%7D
```

---

### bar-chart | bar | chart

Render bar charts from data.

**Input Format:**
```json
[
  {"label": "Jan", "value": 100},
  {"label": "Feb", "value": 150},
  {"label": "Mar", "value": 120}
]
```

**Colors:** Automatically cycle through theme colors

**Example:**
```
?type=bar-chart&content=%5B%7B%22label%22%3A%22Jan%22%2C%22value%22%3A100%7D%5D
```

---

### progress | progress-bar

Render progress indicators.

**Input Format:**
```json
{
  "value": 75,
  "max": 100,
  "label": "Build",
  "color": "#0366d6"
}
```

**Parameters:**
- `value` - Current progress
- `max` - Maximum value
- `label` - Optional label
- `color` - Optional color

---

### stats | stat | statistic

Render statistics cards.

**Input Format:**
```json
{
  "label": "Users Online",
  "value": "1,234",
  "color": "#0366d6"
}
```

**Perfect for:**
- Dashboard metrics
- Key statistics
- Live counters

---

## 📈 Diagram Renderers

### mermaid

Render Mermaid diagrams (flowcharts, sequences, Gantt, etc.).

**Supported Types:**
- `graph` / `flowchart` - Flowcharts
- `sequenceDiagram` - Sequence diagrams
- `classDiagram` - Class diagrams
- `stateDiagram` - State machines
- `gantt` - Gantt charts
- `pie` - Pie charts
- `gitGraph` - Git history

**Note:** Returns placeholder (client needs mermaid.js for full rendering)

**Example:**
```
?type=mermaid&content=graph%20TD%0AA%5BStart%5D%20--%3E%20B%5BEnd%5D
```

---

### timeline | history

Render timeline with events.

**Input Format:**
```json
[
  {"date": "2024-01-01", "title": "Project Started"},
  {"date": "2024-06-01", "title": "Beta Release"},
  {"date": "2024-12-01", "title": "v1.0 Launch"}
]
```

**Features:**
- Chronological layout
- Vertical timeline with events
- Date and title for each event

---

## 🎨 Component Renderers

### badge | label | tag

Render status badges and labels.

**Input Format:**
```json
{
  "text": "Active",
  "color": "#28a745"
}
```

**Color Suggestions:**
- Success: `#28a745` (green)
- Error: `#dc3545` (red)
- Warning: `#ffc107` (yellow)
- Info: `#0366d6` (blue)

**Common Uses:**
- Status indicators
- Version labels
- Feature tags

---

### button

Render UI buttons.

**Input Format:**
```json
{
  "text": "Get Started",
  "color": "#0366d6",
  "type": "primary"
}
```

**Types:**
- `primary` - Filled button with gradient
- `secondary` - Outlined button
- `danger` - Red button
- `success` - Green button

---

### card | panel

Render content cards.

**Input Format:**
```json
{
  "icon": "✨",
  "title": "Feature Name",
  "content": "Feature description",
  "color": "#0366d6"
}
```

**Features:**
- Icon support
- Title and content
- Color-coded accent bar
- Border and shadow

---

### divider | separator | line

Render section dividers.

**Input Format:**
```json
{
  "text": "or",
  "color": "#cccccc"
}
```

**Usage:**
- Section separators
- Step dividers
- Visual breaks

---

## 🔌 Plugin Architecture

### Add a New Renderer

Create a new file in `src/renderers/`:

```typescript
import {BaseRenderer, RenderInput, RenderOutput} from '../core/rendererInterface';
import {SVGBuilder} from '../core/svgBuilder';

export class MyRenderer extends BaseRenderer {
  readonly name = 'my-renderer';
  readonly displayName = 'My Renderer';
  readonly description = 'What this renders';
  readonly category = 'component';
  readonly aliases = ['alias1', 'alias2'];

  async render(input: RenderInput): Promise<RenderOutput> {
    const builder = new SVGBuilder(
      input.width || 800,
      input.height || 600,
      input.theme || 'light'
    );

    // Your rendering logic here
    const svg = `<svg>...</svg>`;

    return {
      svg,
      width: builder.getWidth(),
      height: builder.getHeight(),
      type: 'my-renderer',
    };
  }

  getExample() {
    return {
      input: {content: 'example'},
      description: 'Example description',
    };
  }
}
```

### Register in API

In `api/render-v2.ts`, add:

```typescript
import {MyRenderer} from '../src/renderers/myRenderer';

function initializeRenderers() {
  // ...
  registry.register(new MyRenderer());
}
```

**That's it!** No other changes needed.

---

## 🎨 Theme System

All renderers support two themes:

### light
- White background (`#ffffff`)
- Dark text (`#24292e`)
- GitHub-style colors
- Best for README embedding

### dark
- Dark background (`#1e1e1e`)
- Light text (`#e0e0e0`)
- High contrast
- Better for dark mode

**Set via:** `?theme=dark`

---

## 📋 Common Parameters

All renderers support:

| Parameter | Type | Default | Max |
|-----------|------|---------|-----|
| `type` | string | - | - |
| `content` | string | - | 50KB |
| `title` | string | - | 500 chars |
| `width` | number | 800 | 1200 |
| `height` | number | 600 | 3000 |
| `theme` | string | light | - |

---

## 🔍 Query Examples

### List all renderers
```
GET /api/render?list=true
```

Returns:
```json
{
  "documentation": [
    {"name": "markdown", "displayName": "Markdown", ...}
  ],
  "code": [...],
  "data": [...],
  "diagram": [...],
  "component": [...]
}
```

### Get renderer metadata
```
GET /api/render?catalog=true
```

Returns detailed info for all renderers.

### Render content
```
GET /api/render?type=markdown&content=%23%20Hello&theme=dark
```

---

## 🚀 Usage Examples

### In GitHub README

```markdown
# My Project

## Architecture

![Diagram](https://api.example.com/api/render?type=mermaid&content=graph%20TD%0A...)

## Installation

![Steps](https://api.example.com/api/render?type=markdown&content=%23%23%20Install%0A...)

## Status

![Badge](https://api.example.com/api/render?type=badge&content=%7B%22text%22%3A%22Active%22%7D)

## Performance

![Chart](https://api.example.com/api/render?type=bar-chart&content=%5B...)

## Code Example

![Code](https://api.example.com/api/render?type=code&language=python&content=...)
```

---

## 📊 Renderer Statistics

- **Total Renderers:** 15+
- **Categories:** 5
- **Languages Supported:** 25+
- **Extensible:** Yes (plugin architecture)
- **SVG Output:** All
- **GitHub Compatible:** Yes

---

## 🎯 Quick Reference

| Need | Renderer |
|------|----------|
| Documentation | `markdown`, `changelog`, `readme-section` |
| Code | `code`, `json`, `yaml`, `terminal`, `diff` |
| Data | `csv`, `table`, `bar-chart`, `progress`, `stats` |
| Diagrams | `mermaid`, `timeline` |
| UI | `badge`, `button`, `card`, `divider` |

---

## 🔗 Related

- [API Reference](./API_REFERENCE.md)
- [Examples](./EXAMPLES.md)
- [README](./README.md)

---

Built for developers who want beautiful previews. 🎨
