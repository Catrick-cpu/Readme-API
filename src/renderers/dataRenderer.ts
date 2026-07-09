import {BaseRenderer, RenderInput, RenderOutput} from '../core/rendererInterface';
import {SVGBuilder} from '../core/svgBuilder';

/**
 * CSV renderer - convert CSV to table
 */
export class CSVRenderer extends BaseRenderer {
  readonly name = 'csv';
  readonly displayName = 'CSV Data';
  readonly description = 'Render CSV data as a table';
  readonly category = 'data';
  readonly aliases = [];

  private parseCSV(csv: string): {headers: string[]; rows: string[][]} {
    const lines = csv.split('\n').filter(l => l.trim());
    if (lines.length === 0) return {headers: [], rows: []};

    const headers = this.parseLine(lines[0]);
    const rows = lines.slice(1).map(line => this.parseLine(line));

    return {headers, rows};
  }

  private parseLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }

    result.push(current.trim());
    return result;
  }

  async render(input: RenderInput): Promise<RenderOutput> {
    const {headers, rows} = this.parseCSV(input.content);

    if (headers.length === 0) {
      const builder = new SVGBuilder(input.width || 800, input.height || 600, input.theme || 'light');
      return {
        svg: builder.createError('CSV Error', 'No data found'),
        width: builder.getWidth(),
        height: builder.getHeight(),
        type: 'csv',
      };
    }

    const builder = new SVGBuilder(input.width || 900, input.height || 600, input.theme || 'light');
    const svg = builder.createTable(headers, rows, 15);

    return {
      svg,
      width: builder.getWidth(),
      height: builder.getHeight(),
      type: 'csv',
    };
  }

  getExample() {
    return {
      input: {
        content: 'Name,Age,City\nAlice,30,NYC\nBob,25,LA\nCarol,35,Chicago',
        title: 'User Data',
      },
      description: 'CSV data rendered as table',
    };
  }
}

/**
 * Table renderer - render structured table data
 */
export class TableRenderer extends BaseRenderer {
  readonly name = 'table';
  readonly displayName = 'Table';
  readonly description = 'Render table data';
  readonly category = 'data';
  readonly aliases = [];

  validate(input: RenderInput) {
    const base = super.validate(input);
    if (!base.valid) return base;

    try {
      JSON.parse(input.content);
      return {valid: true};
    } catch {
      return {valid: false, error: 'Invalid JSON table data'};
    }
  }

  async render(input: RenderInput): Promise<RenderOutput> {
    try {
      const data = JSON.parse(input.content);

      if (!data.headers || !Array.isArray(data.headers) || !data.rows || !Array.isArray(data.rows)) {
        throw new Error('Expected {headers: [...], rows: [...]}');
      }

      const builder = new SVGBuilder(input.width || 900, input.height || 600, input.theme || 'light');
      const svg = builder.createTable(
        data.headers.map(String),
        data.rows.map((row: any[]) => row.map(String)),
        input.maxRows || 15
      );

      return {
        svg,
        width: builder.getWidth(),
        height: builder.getHeight(),
        type: 'table',
      };
    } catch (err) {
      const builder = new SVGBuilder(input.width || 800, input.height || 600, input.theme || 'light');
      return {
        svg: builder.createError('Table Error', err instanceof Error ? err.message : 'Invalid data'),
        width: builder.getWidth(),
        height: builder.getHeight(),
        type: 'table',
      };
    }
  }

  getExample() {
    return {
      input: {
        content: JSON.stringify({
          headers: ['Name', 'Score', 'Grade'],
          rows: [
            ['Alice', '95', 'A'],
            ['Bob', '87', 'B'],
            ['Carol', '92', 'A'],
          ],
        }),
        title: 'Results',
      },
      description: 'Table with headers and rows',
    };
  }
}

/**
 * Bar chart renderer
 */
export class BarChartRenderer extends BaseRenderer {
  readonly name = 'bar-chart';
  readonly displayName = 'Bar Chart';
  readonly description = 'Render bar chart from data';
  readonly category = 'data';
  readonly aliases = ['bar', 'chart'];

  validate(input: RenderInput) {
    const base = super.validate(input);
    if (!base.valid) return base;

    try {
      JSON.parse(input.content);
      return {valid: true};
    } catch {
      return {valid: false, error: 'Invalid JSON chart data'};
    }
  }

  async render(input: RenderInput): Promise<RenderOutput> {
    try {
      const data = JSON.parse(input.content);

      if (!Array.isArray(data) && !data.data) {
        throw new Error('Expected array or {data: [...]}');
      }

      const items = Array.isArray(data) ? data : data.data;
      const title = input.title || data.title || 'Chart';

      if (!items.length) {
        const builder = new SVGBuilder(input.width || 800, input.height || 600, input.theme || 'light');
        return {
          svg: builder.createError('Chart Error', 'No data provided'),
          width: builder.getWidth(),
          height: builder.getHeight(),
          type: 'bar-chart',
        };
      }

      const builder = new SVGBuilder(input.width || 900, input.height || 600, input.theme || 'light');
      const maxValue = Math.max(...items.map((item: any) => item.value || 0));
      const theme = builder.getTheme();

      const barWidth = (builder.getWidth() - 40) / items.length;
      const chartHeight = builder.getHeight() - 100;

      let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${builder.getWidth()}" height="${builder.getHeight()}" viewBox="0 0 ${builder.getWidth()} ${builder.getHeight()}">
  <rect width="${builder.getWidth()}" height="${builder.getHeight()}" fill="${theme.bg}"/>
  <rect x="0" y="0" width="${builder.getWidth()}" height="40" fill="${theme.border}" opacity="0.2"/>

  <text x="20" y="26" class="header" fill="${theme.text}">
    ${escapeXml(title)}
  </text>`;

      items.forEach((item: any, idx: number) => {
        const label = item.label || item.name || `Item ${idx + 1}`;
        const value = Number(item.value) || 0;
        const percentage = (value / maxValue) * 100;

        const x = 20 + idx * barWidth;
        const barHeight = (chartHeight * percentage) / 100;
        const y = builder.getHeight() - 50 - barHeight;

        const colors = [theme.accent, theme.accent2, theme.success, theme.warning, theme.error];
        const color = colors[idx % colors.length];

        svg += `
  <!-- Bar ${idx + 1} -->
  <rect x="${x + 5}" y="${y}" width="${barWidth - 10}" height="${barHeight}" fill="${color}" opacity="0.8"/>
  <text x="${x + barWidth / 2}" y="${builder.getHeight() - 30}" text-anchor="middle" class="tiny" fill="${theme.text}">
    ${escapeXml(label.substring(0, 10))}
  </text>
  <text x="${x + barWidth / 2}" y="${y - 5}" text-anchor="middle" class="tiny" fill="${theme.text}">
    ${value}
  </text>`;
      });

      svg += '\n</svg>';
      return {
        svg,
        width: builder.getWidth(),
        height: builder.getHeight(),
        type: 'bar-chart',
      };
    } catch (err) {
      const builder = new SVGBuilder(input.width || 800, input.height || 600, input.theme || 'light');
      return {
        svg: builder.createError('Chart Error', err instanceof Error ? err.message : 'Invalid data'),
        width: builder.getWidth(),
        height: builder.getHeight(),
        type: 'bar-chart',
      };
    }
  }

  getExample() {
    return {
      input: {
        content: JSON.stringify([
          {label: 'Jan', value: 100},
          {label: 'Feb', value: 150},
          {label: 'Mar', value: 120},
          {label: 'Apr', value: 180},
        ]),
        title: 'Monthly Sales',
      },
      description: 'Bar chart with monthly data',
    };
  }
}

/**
 * Progress renderer
 */
export class ProgressRenderer extends BaseRenderer {
  readonly name = 'progress';
  readonly displayName = 'Progress Bar';
  readonly description = 'Render progress indicators';
  readonly category = 'data';
  readonly aliases = ['progress-bar'];

  async render(input: RenderInput): Promise<RenderOutput> {
    try {
      const data = typeof input.content === 'string' ? JSON.parse(input.content) : input.content;
      const value = Number(data.value) || 0;
      const max = Number(data.max) || 100;
      const label = data.label || input.title || 'Progress';
      const color = data.color || '#0366d6';

      const builder = new SVGBuilder(input.width || 600, input.height || 60, input.theme || 'light');
      const svg = builder.createBar(label, (value / max) * 100, color);

      return {
        svg,
        width: builder.getWidth(),
        height: builder.getHeight(),
        type: 'progress',
      };
    } catch (err) {
      const builder = new SVGBuilder(input.width || 600, input.height || 60, input.theme || 'light');
      return {
        svg: builder.createError('Progress Error', 'Invalid data'),
        width: builder.getWidth(),
        height: builder.getHeight(),
        type: 'progress',
      };
    }
  }

  getExample() {
    return {
      input: {
        content: JSON.stringify({value: 75, max: 100, label: 'Build'}),
        title: 'Build Progress',
      },
      description: 'Progress bar showing 75% completion',
    };
  }
}

/**
 * Statistics card renderer
 */
export class StatsRenderer extends BaseRenderer {
  readonly name = 'stats';
  readonly displayName = 'Statistics';
  readonly description = 'Render statistics cards';
  readonly category = 'data';
  readonly aliases = ['stat', 'statistic'];

  async render(input: RenderInput): Promise<RenderOutput> {
    try {
      const data = typeof input.content === 'string' ? JSON.parse(input.content) : input.content;

      const builder = new SVGBuilder(input.width || 300, input.height || 120, input.theme || 'light');

      const label = data.label || data.name || 'Metric';
      const value = data.value || '0';
      const color = data.color || builder.getTheme().accent;

      const svg = builder.createStatCard(label, String(value), color);

      return {
        svg,
        width: builder.getWidth(),
        height: builder.getHeight(),
        type: 'stats',
      };
    } catch (err) {
      const builder = new SVGBuilder(input.width || 300, input.height || 120, input.theme || 'light');
      return {
        svg: builder.createError('Stats Error', 'Invalid data'),
        width: builder.getWidth(),
        height: builder.getHeight(),
        type: 'stats',
      };
    }
  }

  getExample() {
    return {
      input: {
        content: JSON.stringify({label: 'Users Online', value: '1,234', color: '#0366d6'}),
      },
      description: 'Statistics card with metric',
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
