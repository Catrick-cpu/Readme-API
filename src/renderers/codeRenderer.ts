import {BaseRenderer, RenderInput, RenderOutput} from '../core/rendererInterface';
import {SVGBuilder} from '../core/svgBuilder';
import {highlightCode, getLanguageInfo, validateLanguage} from '../parsers/code';

/**
 * Code renderer - syntax highlighted code blocks
 */
export class CodeRenderer extends BaseRenderer {
  readonly name = 'code';
  readonly displayName = 'Code Block';
  readonly description = 'Render syntax-highlighted code blocks';
  readonly category = 'code';
  readonly aliases = ['source', 'snippet'];

  validate(input: RenderInput) {
    const base = super.validate(input);
    if (!base.valid) return base;

    if (input.language && !validateLanguage(input.language)) {
      return {valid: false, error: `Unsupported language: ${input.language}`};
    }

    return {valid: true};
  }

  async render(input: RenderInput): Promise<RenderOutput> {
    const language = input.language || 'plaintext';
    const highlighted = highlightCode(input.content, language);
    const langInfo = getLanguageInfo(language);

    const builder = new SVGBuilder(
      input.width || 900,
      input.height || 600,
      input.theme || 'light'
    );

    const lines = input.content.split('\n');
    const lineNumWidth = 40;
    const lineHeight = 18;
    const totalHeight = Math.max(input.height || 600, lines.length * lineHeight + 60);

    let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${builder.getWidth()}" height="${totalHeight}" viewBox="0 0 ${builder.getWidth()} ${totalHeight}">
  <rect width="${builder.getWidth()}" height="${totalHeight}" fill="${builder.getTheme().bg}"/>
  <rect x="0" y="0" width="${builder.getWidth()}" height="35" fill="${builder.getTheme().border}" opacity="0.3"/>

  <text x="10" y="23" class="small" style="font-weight: bold;" fill="${builder.getTheme().text}">
    ${langInfo.displayName}
  </text>

  <line x1="0" y1="35" x2="${builder.getWidth()}" y2="35" stroke="${builder.getTheme().border}" stroke-width="1"/>`;

    // Add line numbers and code
    lines.forEach((line, idx) => {
      const y = 40 + idx * lineHeight + 14;
      svg += `
  <text x="5" y="${y}" class="tiny mono" fill="${builder.getTheme().text}" opacity="0.6">
    ${(idx + 1).toString().padStart(3, ' ')}
  </text>
  <text x="${lineNumWidth}" y="${y}" class="tiny mono" fill="${builder.getTheme().text}">
    ${escapeXml(line || ' ')}
  </text>`;
    });

    svg += '\n</svg>';
    return {
      svg,
      width: builder.getWidth(),
      height: Math.min(totalHeight, 3000),
      type: 'code',
    };
  }

  getExample() {
    return {
      input: {
        language: 'python',
        content: 'def hello():\n    print("Hello, World!")\n\nhello()',
        title: 'Python Example',
      },
      description: 'Syntax highlighted Python code',
    };
  }
}

/**
 * JSON renderer
 */
export class JsonRenderer extends BaseRenderer {
  readonly name = 'json';
  readonly displayName = 'JSON';
  readonly description = 'Render JSON data with formatting';
  readonly category = 'code';
  readonly aliases = [];

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
      const parsed = JSON.parse(input.content);
      const formatted = JSON.stringify(parsed, null, 2);

      const renderer = new CodeRenderer();
      return await renderer.render({
        ...input,
        content: formatted,
        language: 'json',
        title: input.title || 'JSON Data',
      });
    } catch (err) {
      const builder = new SVGBuilder(input.width || 800, input.height || 600, input.theme || 'light');
      return {
        svg: builder.createError('JSON Error', 'Invalid JSON format'),
        width: builder.getWidth(),
        height: builder.getHeight(),
        type: 'json',
      };
    }
  }

  getExample() {
    return {
      input: {
        content: '{"name":"Alice","age":30,"city":"NYC"}',
        title: 'User Data',
      },
      description: 'Formatted JSON object',
    };
  }
}

/**
 * YAML renderer
 */
export class YamlRenderer extends BaseRenderer {
  readonly name = 'yaml';
  readonly displayName = 'YAML';
  readonly description = 'Render YAML configuration';
  readonly category = 'code';
  readonly aliases = ['yml'];

  async render(input: RenderInput): Promise<RenderOutput> {
    const renderer = new CodeRenderer();
    return await renderer.render({
      ...input,
      language: 'yaml',
      title: input.title || 'YAML Configuration',
    });
  }

  getExample() {
    return {
      input: {
        content: 'name: MyApp\nversion: 1.0.0\nauthor: Alice',
        title: 'Config File',
      },
      description: 'YAML configuration file',
    };
  }
}

/**
 * Terminal/Log output renderer
 */
export class TerminalRenderer extends BaseRenderer {
  readonly name = 'terminal';
  readonly displayName = 'Terminal Output';
  readonly description = 'Render terminal or log output';
  readonly category = 'code';
  readonly aliases = ['log', 'output', 'bash-output'];

  async render(input: RenderInput): Promise<RenderOutput> {
    const builder = new SVGBuilder(
      input.width || 900,
      input.height || 600,
      'dark' // Always use dark theme for terminal
    );

    const lines = input.content.split('\n');
    const lineHeight = 18;
    const totalHeight = Math.max(input.height || 600, lines.length * lineHeight + 50);

    let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${builder.getWidth()}" height="${totalHeight}" viewBox="0 0 ${builder.getWidth()} ${totalHeight}">
  <rect width="${builder.getWidth()}" height="${totalHeight}" fill="#000000"/>
  <rect x="0" y="0" width="${builder.getWidth()}" height="30" fill="#333333"/>

  <text x="10" y="20" class="small" style="font-weight: bold;" fill="#00ff00">
    Terminal Output
  </text>

  <line x1="0" y1="30" x2="${builder.getWidth()}" y2="30" stroke="#444444" stroke-width="1"/>`;

    lines.forEach((line, idx) => {
      const y = 35 + idx * lineHeight + 12;
      svg += `
  <text x="10" y="${y}" class="tiny mono" fill="#00ff00" font-family="'Monaco', 'Courier New', monospace">
    ${escapeXml(line || ' ')}
  </text>`;
    });

    svg += '\n</svg>';
    return {
      svg,
      width: builder.getWidth(),
      height: Math.min(totalHeight, 3000),
      type: 'terminal',
    };
  }

  getExample() {
    return {
      input: {
        content: '$ npm install\nadded 150 packages\n$ npm start\nServer running on port 3000',
        title: 'Build Output',
      },
      description: 'Terminal output log',
    };
  }
}

/**
 * Diff renderer
 */
export class DiffRenderer extends BaseRenderer {
  readonly name = 'diff';
  readonly displayName = 'Diff';
  readonly description = 'Render file diffs with syntax highlighting';
  readonly category = 'code';
  readonly aliases = ['patch'];

  async render(input: RenderInput): Promise<RenderOutput> {
    const builder = new SVGBuilder(input.width || 900, input.height || 600, input.theme || 'light');
    const theme = builder.getTheme();

    const lines = input.content.split('\n');
    const lineHeight = 16;
    const totalHeight = Math.max(input.height || 600, lines.length * lineHeight + 50);

    let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${builder.getWidth()}" height="${totalHeight}" viewBox="0 0 ${builder.getWidth()} ${totalHeight}">
  <rect width="${builder.getWidth()}" height="${totalHeight}" fill="${theme.bg}"/>
  <rect x="0" y="0" width="${builder.getWidth()}" height="30" fill="${theme.border}" opacity="0.3"/>

  <text x="10" y="20" class="small" style="font-weight: bold;" fill="${theme.text}">
    Diff Preview
  </text>

  <line x1="0" y1="30" x2="${builder.getWidth()}" y2="30" stroke="${theme.border}" stroke-width="1"/>`;

    lines.forEach((line, idx) => {
      const y = 35 + idx * lineHeight + 12;
      let color = theme.text;
      let bgColor = theme.bg;

      if (line.startsWith('+')) {
        color = theme.success;
        bgColor = theme.success;
      } else if (line.startsWith('-')) {
        color = theme.error;
        bgColor = theme.error;
      } else if (line.startsWith('@@')) {
        color = theme.accent;
      }

      svg += `
  <rect x="0" y="${y - 12}" width="${builder.getWidth()}" height="${lineHeight}" fill="${bgColor}" opacity="${line.startsWith('+') || line.startsWith('-') ? 0.15 : 0}"/>
  <text x="10" y="${y}" class="tiny mono" fill="${color}">
    ${escapeXml(line)}
  </text>`;
    });

    svg += '\n</svg>';
    return {
      svg,
      width: builder.getWidth(),
      height: Math.min(totalHeight, 3000),
      type: 'diff',
    };
  }

  getExample() {
    return {
      input: {
        content: '--- a/file.js\n+++ b/file.js\n@@@ -1,3 +1,4 @@\n const x = 1;\n-const y = 2;\n+const y = 3;',
        title: 'Code Changes',
      },
      description: 'File diff with additions and removals',
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
