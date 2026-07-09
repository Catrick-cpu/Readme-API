import { escapeSvgAttribute } from '../utils/encoding';

export interface SvgElement {
  tag: string;
  attributes: Record<string, string | number>;
  content?: string;
  children?: SvgElement[];
}

export class SvgBuilder {
  private width: number;
  private height: number;
  private theme: 'light' | 'dark';

  constructor(width: number, height: number, theme: 'light' | 'dark' = 'light') {
    this.width = Math.min(width, 1200);
    this.height = Math.min(height, 3000);
    this.theme = theme;
  }

  private getThemeColors() {
    return this.theme === 'dark'
      ? {
          bg: '#1e1e1e',
          text: '#e0e0e0',
          border: '#404040',
          accent: '#58a6ff',
          codeBg: '#0d1117',
        }
      : {
          bg: '#ffffff',
          text: '#24292e',
          border: '#e1e4e8',
          accent: '#0366d6',
          codeBg: '#f6f8fa',
        };
  }

  buildSvg(content: string, title?: string): string {
    const colors = this.getThemeColors();
    const padding = 20;
    const titleHeight = title ? 40 : 0;
    const contentHeight = this.height - titleHeight - padding * 2;

    let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${this.width}" height="${this.height}" viewBox="0 0 ${this.width} ${this.height}">
  <!-- Background -->
  <rect width="${this.width}" height="${this.height}" fill="${colors.bg}"/>

  <!-- Border -->
  <rect x="0" y="0" width="${this.width}" height="${this.height}" fill="none" stroke="${colors.border}" stroke-width="1"/>`;

    if (title) {
      svg += `
  <!-- Title -->
  <rect x="0" y="0" width="${this.width}" height="${titleHeight}" fill="${colors.border}" opacity="0.3"/>
  <text x="${padding}" y="${titleHeight / 2 + 6}" font-family="monospace" font-size="14" font-weight="bold" fill="${colors.text}">
    ${escapeSvgAttribute(title)}
  </text>`;
    }

    svg += `
  <!-- Content -->
  <foreignObject x="${padding}" y="${padding + titleHeight}" width="${this.width - padding * 2}" height="${contentHeight}">
    <div xmlns="http://www.w3.org/1999/xhtml" style="
      width: 100%;
      height: 100%;
      overflow: auto;
      padding: 10px;
      color: ${colors.text};
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 13px;
      line-height: 1.6;
    ">
      ${content}
    </div>
  </foreignObject>
</svg>`;

    return svg;
  }

  static createRect(x: number, y: number, width: number, height: number, fill: string, stroke?: string): SvgElement {
    const attrs: Record<string, string | number> = { x, y, width, height, fill };
    if (stroke) attrs.stroke = stroke;
    return { tag: 'rect', attributes: attrs };
  }

  static createText(x: number, y: number, text: string, fontSize: number = 12, fill: string = '#000'): SvgElement {
    return {
      tag: 'text',
      attributes: { x, y, 'font-size': fontSize, fill },
      content: escapeSvgAttribute(text),
    };
  }

  static createLine(x1: number, y1: number, x2: number, y2: number, stroke: string = '#000', strokeWidth: number = 1): SvgElement {
    return {
      tag: 'line',
      attributes: { x1, y1, x2, y2, stroke, 'stroke-width': strokeWidth },
    };
  }

  static createCircle(cx: number, cy: number, r: number, fill: string): SvgElement {
    return {
      tag: 'circle',
      attributes: { cx, cy, r, fill },
    };
  }

  static createPath(d: string, fill: string = 'none', stroke: string = '#000'): SvgElement {
    return {
      tag: 'path',
      attributes: { d, fill, stroke },
    };
  }

  static renderElement(el: SvgElement, indent: number = 2): string {
    const indentStr = ' '.repeat(indent);
    const attrs = Object.entries(el.attributes)
      .map(([key, value]) => `${key}="${escapeSvgAttribute(String(value))}"`)
      .join(' ');

    if (el.children && el.children.length > 0) {
      const childContent = el.children
        .map(child => SvgBuilder.renderElement(child, indent + 2))
        .join('\n');
      return `${indentStr}<${el.tag} ${attrs}>\n${childContent}\n${indentStr}</${el.tag}>`;
    }

    if (el.content) {
      return `${indentStr}<${el.tag} ${attrs}>${el.content}</${el.tag}>`;
    }

    return `${indentStr}<${el.tag} ${attrs}/>`;
  }
}

export function createCodeBlockSvg(code: string, language: string, width: number, height: number, theme: 'light' | 'dark'): string {
  const colors = theme === 'dark'
    ? { bg: '#0d1117', text: '#e0e0e0', border: '#404040' }
    : { bg: '#f6f8fa', text: '#24292e', border: '#e1e4e8' };

  const lines = code.split('\n');
  const lineHeight = 20;
  const padding = 15;
  const totalHeight = Math.max(height, lines.length * lineHeight + padding * 2);

  let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${totalHeight}" viewBox="0 0 ${width} ${totalHeight}">
  <rect width="${width}" height="${totalHeight}" fill="${colors.bg}"/>
  <rect x="0" y="0" width="${width}" height="30" fill="${colors.border}" opacity="0.3"/>
  <text x="10" y="20" font-family="monospace" font-size="12" fill="${colors.text}">${escapeSvgAttribute(language)}</text>`;

  lines.forEach((line, idx) => {
    const y = 40 + idx * lineHeight;
    svg += `\n  <text x="${padding}" y="${y}" font-family="monospace" font-size="12" fill="${colors.text}">${escapeSvgAttribute(line || ' ')}</text>`;
  });

  svg += '\n</svg>';
  return svg;
}
