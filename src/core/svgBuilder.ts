import {escapeSvgAttribute} from '../utils/encoding';

/**
 * Theme configuration
 */
export interface ThemeConfig {
  bg: string;
  text: string;
  border: string;
  accent: string;
  accent2: string;
  codeBg: string;
  error: string;
  success: string;
  warning: string;
}

/**
 * SVG Builder for consistent rendering across all renderers
 */
export class SVGBuilder {
  private width: number;
  private height: number;
  private theme: ThemeConfig;

  constructor(width: number, height: number, themeType: 'light' | 'dark' = 'light') {
    this.width = Math.min(Math.max(width, 300), 1200);
    this.height = Math.min(Math.max(height, 200), 3000);
    this.theme = themeType === 'dark' ? this.getDarkTheme() : this.getLightTheme();
  }

  private getLightTheme(): ThemeConfig {
    return {
      bg: '#ffffff',
      text: '#24292e',
      border: '#e1e4e8',
      accent: '#0366d6',
      accent2: '#6f42c1',
      codeBg: '#f6f8fa',
      error: '#dc3545',
      success: '#28a745',
      warning: '#ffc107',
    };
  }

  private getDarkTheme(): ThemeConfig {
    return {
      bg: '#1e1e1e',
      text: '#e0e0e0',
      border: '#404040',
      accent: '#58a6ff',
      accent2: '#b392f0',
      codeBg: '#0d1117',
      error: '#f85149',
      success: '#3fb950',
      warning: '#d29922',
    };
  }

  /**
   * Build basic SVG container
   */
  buildContainer(content: string, title?: string): string {
    const padding = 20;
    const titleHeight = title ? 50 : 0;
    const contentHeight = this.height - titleHeight - padding * 2;

    let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${this.width}" height="${this.height}" viewBox="0 0 ${this.width} ${this.height}">
  <defs>
    <style>
      text { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
      .mono { font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace; }
      .header { font-size: 14px; font-weight: bold; }
      .small { font-size: 12px; }
      .tiny { font-size: 10px; }
    </style>
  </defs>

  <!-- Background -->
  <rect width="${this.width}" height="${this.height}" fill="${this.theme.bg}"/>

  <!-- Border -->
  <rect x="0" y="0" width="${this.width}" height="${this.height}" fill="none" stroke="${this.theme.border}" stroke-width="1"/>`;

    if (title) {
      svg += `
  <!-- Title Bar -->
  <rect x="0" y="0" width="${this.width}" height="${titleHeight}" fill="${this.theme.border}" opacity="0.2"/>
  <text x="${padding}" y="${titleHeight / 2 + 6}" class="header" fill="${this.theme.text}">
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
      color: ${this.theme.text};
      font-size: 13px;
      line-height: 1.6;
    ">
      ${content}
    </div>
  </foreignObject>
</svg>`;

    return svg;
  }

  /**
   * Build SVG with grid layout
   */
  buildGrid(items: {x: number; y: number; width: number; height: number; content: string}[]): string {
    let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${this.width}" height="${this.height}" viewBox="0 0 ${this.width} ${this.height}">
  <rect width="${this.width}" height="${this.height}" fill="${this.theme.bg}"/>`;

    items.forEach(item => {
      svg += `
  <g transform="translate(${item.x}, ${item.y})">
    <rect width="${item.width}" height="${item.height}" fill="${this.theme.codeBg}" stroke="${this.theme.border}" stroke-width="1"/>
    <foreignObject width="${item.width - 2}" height="${item.height - 2}" x="1" y="1">
      <div xmlns="http://www.w3.org/1999/xhtml" style="font-size: 11px; padding: 5px; overflow: hidden;">
        ${item.content}
      </div>
    </foreignObject>
  </g>`;
    });

    svg += '\n</svg>';
    return svg;
  }

  /**
   * Create a stat card
   */
  createStatCard(label: string, value: string, color: string = this.theme.accent): string {
    const padding = 15;
    const height = 100;

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${this.width}" height="${height}" viewBox="0 0 ${this.width} ${height}">
  <rect width="${this.width}" height="${height}" fill="${this.theme.bg}"/>
  <rect width="${this.width}" height="6" fill="${color}"/>
  <rect x="0" y="0" width="${this.width}" height="${height}" fill="none" stroke="${this.theme.border}" stroke-width="1"/>

  <text x="${padding}" y="30" class="small" fill="${this.theme.text}">
    ${escapeSvgAttribute(label)}
  </text>
  <text x="${padding}" y="70" style="font-size: 24px; font-weight: bold;" fill="${color}">
    ${escapeSvgAttribute(value)}
  </text>
</svg>`;
  }

  /**
   * Create a simple bar
   */
  createBar(label: string, percentage: number, color: string = this.theme.accent): string {
    const height = 30;
    const barWidth = (this.width - 40) * (percentage / 100);

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${this.width}" height="${height}" viewBox="0 0 ${this.width} ${height}">
  <rect width="${this.width}" height="${height}" fill="${this.theme.bg}" stroke="${this.theme.border}" stroke-width="1"/>
  <rect x="2" y="2" width="${barWidth}" height="${height - 4}" fill="${color}" rx="2"/>
  <text x="10" y="20" class="small" fill="${this.theme.text}">
    ${escapeSvgAttribute(label)} ${Math.round(percentage)}%
  </text>
</svg>`;
  }

  /**
   * Create an error card
   */
  createError(title: string, message: string): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${this.width}" height="${this.height}" viewBox="0 0 ${this.width} ${this.height}">
  <rect width="${this.width}" height="${this.height}" fill="${this.theme.bg}"/>
  <rect x="0" y="0" width="${this.width}" height="${this.height}" fill="none" stroke="${this.theme.error}" stroke-width="2"/>

  <text x="20" y="40" class="header" fill="${this.theme.error}">
    ❌ ${escapeSvgAttribute(title)}
  </text>
  <text x="20" y="70" style="font-size: 12px;" fill="${this.theme.text}">
    ${escapeSvgAttribute(message)}
  </text>
</svg>`;
  }

  /**
   * Create a loading card
   */
  createLoading(message: string = 'Rendering...'): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${this.width}" height="${this.height}" viewBox="0 0 ${this.width} ${this.height}">
  <rect width="${this.width}" height="${this.height}" fill="${this.theme.bg}"/>
  <rect x="0" y="0" width="${this.width}" height="${this.height}" fill="none" stroke="${this.theme.border}" stroke-width="1"/>

  <text x="${this.width / 2}" y="${this.height / 2}" text-anchor="middle" style="font-size: 16px;" fill="${this.theme.text}">
    ${escapeSvgAttribute(message)}
  </text>
</svg>`;
  }

  /**
   * Create a table
   */
  createTable(headers: string[], rows: string[][], maxRows: number = 10): string {
    const colCount = headers.length;
    const colWidth = (this.width - 20) / colCount;
    const rowHeight = 30;
    const headerHeight = 35;
    const totalHeight = Math.min(this.height, headerHeight + (Math.min(rows.length, maxRows) + 1) * rowHeight + 20);

    let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${this.width}" height="${totalHeight}" viewBox="0 0 ${this.width} ${totalHeight}">
  <rect width="${this.width}" height="${totalHeight}" fill="${this.theme.bg}"/>`;

    // Headers
    headers.forEach((header, idx) => {
      const x = 10 + idx * colWidth;
      svg += `
  <rect x="${x}" y="10" width="${colWidth}" height="${headerHeight}" fill="${this.theme.codeBg}" stroke="${this.theme.border}" stroke-width="1"/>
  <text x="${x + 8}" y="${10 + headerHeight / 2 + 5}" class="small" style="font-weight: bold;" fill="${this.theme.text}">
    ${escapeSvgAttribute(header.substring(0, 20))}
  </text>`;
    });

    // Rows
    rows.slice(0, maxRows).forEach((row, ridx) => {
      const y = 10 + headerHeight + ridx * rowHeight;
      const bgColor = ridx % 2 === 0 ? this.theme.bg : this.theme.codeBg;

      row.forEach((cell, cidx) => {
        const x = 10 + cidx * colWidth;
        svg += `
  <rect x="${x}" y="${y}" width="${colWidth}" height="${rowHeight}" fill="${bgColor}" stroke="${this.theme.border}" stroke-width="1"/>
  <text x="${x + 8}" y="${y + rowHeight / 2 + 5}" class="tiny" fill="${this.theme.text}">
    ${escapeSvgAttribute(cell.substring(0, 25))}
  </text>`;
      });
    });

    svg += '\n</svg>';
    return svg;
  }

  getTheme(): ThemeConfig {
    return this.theme;
  }

  getWidth(): number {
    return this.width;
  }

  getHeight(): number {
    return this.height;
  }
}
