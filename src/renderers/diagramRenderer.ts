import {BaseRenderer, RenderInput, RenderOutput} from '../core/rendererInterface';
import {SVGBuilder} from '../core/svgBuilder';
import {validateMermaidSyntax, estimateMermaidSize, getMermaidExample} from '../parsers/mermaid';

/**
 * Mermaid diagram renderer
 */
export class MermaidRenderer extends BaseRenderer {
  readonly name = 'mermaid';
  readonly displayName = 'Mermaid Diagram';
  readonly description = 'Render Mermaid diagrams (flowcharts, sequences, etc.)';
  readonly category = 'diagram';
  readonly aliases = [];

  validate(input: RenderInput) {
    const base = super.validate(input);
    if (!base.valid) return base;

    const validation = validateMermaidSyntax(input.content);
    if (!validation.valid) {
      return {valid: false, error: validation.error};
    }

    return {valid: true};
  }

  async render(input: RenderInput): Promise<RenderOutput> {
    const validation = validateMermaidSyntax(input.content);

    if (!validation.valid) {
      const builder = new SVGBuilder(input.width || 800, input.height || 600, input.theme || 'light');
      return {
        svg: builder.createError('Mermaid Error', validation.error || 'Invalid syntax'),
        width: builder.getWidth(),
        height: builder.getHeight(),
        type: 'mermaid',
      };
    }

    const sizing = estimateMermaidSize(input.content);
    const builder = new SVGBuilder(
      Math.min(input.width || 800, sizing.estimatedWidth),
      Math.min(input.height || 600, sizing.estimatedHeight),
      input.theme || 'light'
    );

    const theme = builder.getTheme();

    // Create a placeholder for Mermaid (client needs mermaid.js to render)
    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${builder.getWidth()}" height="${builder.getHeight()}" viewBox="0 0 ${builder.getWidth()} ${builder.getHeight()}">
  <rect width="${builder.getWidth()}" height="${builder.getHeight()}" fill="${theme.bg}"/>
  <rect x="0" y="0" width="${builder.getWidth()}" height="${builder.getHeight()}" fill="none" stroke="${theme.border}" stroke-width="2"/>

  <text x="${builder.getWidth() / 2}" y="40" text-anchor="middle" style="font-size: 16px; font-weight: bold;" fill="${theme.text}">
    Mermaid Diagram Preview
  </text>
  <text x="${builder.getWidth() / 2}" y="75" text-anchor="middle" style="font-size: 12px;" fill="${theme.text}">
    Type: ${validation.type}
  </text>
  <text x="${builder.getWidth() / 2}" y="100" text-anchor="middle" style="font-size: 10px;" fill="${theme.text}">
    ${input.content.split('\n').length} lines
  </text>

  <rect x="20" y="130" width="${builder.getWidth() - 40}" height="${builder.getHeight() - 160}" fill="${theme.codeBg}" stroke="${theme.border}" stroke-width="1" rx="4"/>
  <text x="${builder.getWidth() / 2}" y="${builder.getHeight() / 2}" text-anchor="middle" style="font-size: 12px;" fill="${theme.text}" opacity="0.7">
    Note: Requires client-side mermaid.js rendering
  </text>
</svg>`;

    return {
      svg,
      width: builder.getWidth(),
      height: builder.getHeight(),
      type: 'mermaid',
    };
  }

  getExample() {
    return {
      input: {
        content: getMermaidExample('flowchart'),
        title: 'Flowchart Example',
      },
      description: 'Mermaid flowchart diagram',
    };
  }
}

/**
 * Timeline renderer
 */
export class TimelineRenderer extends BaseRenderer {
  readonly name = 'timeline';
  readonly displayName = 'Timeline';
  readonly description = 'Render timeline with events';
  readonly category = 'diagram';
  readonly aliases = ['history'];

  async render(input: RenderInput): Promise<RenderOutput> {
    try {
      const data = typeof input.content === 'string' ? JSON.parse(input.content) : input.content;
      const events = Array.isArray(data) ? data : data.events || [];

      if (!events.length) {
        const builder = new SVGBuilder(input.width || 800, input.height || 600, input.theme || 'light');
        return {
          svg: builder.createError('Timeline Error', 'No events provided'),
          width: builder.getWidth(),
          height: builder.getHeight(),
          type: 'timeline',
        };
      }

      const builder = new SVGBuilder(input.width || 800, input.height || 600, input.theme || 'light');
      const theme = builder.getTheme();

      const eventHeight = 60;
      const totalHeight = Math.max(input.height || 600, events.length * eventHeight + 80);

      let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${builder.getWidth()}" height="${totalHeight}" viewBox="0 0 ${builder.getWidth()} ${totalHeight}">
  <rect width="${builder.getWidth()}" height="${totalHeight}" fill="${theme.bg}"/>
  <rect x="0" y="0" width="${builder.getWidth()}" height="${totalHeight}" fill="none" stroke="${theme.border}" stroke-width="1"/>

  <text x="20" y="30" style="font-size: 16px; font-weight: bold;" fill="${theme.text}">
    ${escapeXml(input.title || 'Timeline')}
  </text>

  <!-- Timeline line -->
  <line x1="30" y1="60" x2="30" y2="${totalHeight - 20}" stroke="${theme.accent}" stroke-width="2"/>`;

      events.forEach((event: any, idx: number) => {
        const y = 60 + idx * eventHeight;
        const date = event.date || event.time || '';
        const title = event.title || event.name || '';
        const description = event.description || '';

        svg += `
  <!-- Event ${idx + 1} -->
  <circle cx="30" cy="${y + 15}" r="6" fill="${theme.accent}"/>
  <rect x="50" y="${y}" width="${builder.getWidth() - 70}" height="${eventHeight - 5}" fill="${theme.codeBg}" stroke="${theme.border}" stroke-width="1" rx="4"/>
  <text x="60" y="${y + 18}" style="font-size: 12px; font-weight: bold;" fill="${theme.text}">
    ${escapeXml(title.substring(0, 40))}
  </text>
  <text x="60" y="${y + 35}" style="font-size: 10px;" fill="${theme.text}" opacity="0.7">
    ${escapeXml(date.substring(0, 20))}
  </text>`;
      });

      svg += '\n</svg>';
      return {
        svg,
        width: builder.getWidth(),
        height: Math.min(totalHeight, 3000),
        type: 'timeline',
      };
    } catch (err) {
      const builder = new SVGBuilder(input.width || 800, input.height || 600, input.theme || 'light');
      return {
        svg: builder.createError('Timeline Error', 'Invalid data format'),
        width: builder.getWidth(),
        height: builder.getHeight(),
        type: 'timeline',
      };
    }
  }

  getExample() {
    return {
      input: {
        content: JSON.stringify([
          {date: '2024-01-01', title: 'Project Started'},
          {date: '2024-06-01', title: 'Beta Release'},
          {date: '2024-12-01', title: 'v1.0 Launch'},
        ]),
        title: 'Project Milestones',
      },
      description: 'Timeline with project milestones',
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
