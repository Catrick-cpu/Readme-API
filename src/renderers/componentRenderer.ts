import {BaseRenderer, RenderInput, RenderOutput} from '../core/rendererInterface';
import {SVGBuilder} from '../core/svgBuilder';

/**
 * Badge renderer
 */
export class BadgeRenderer extends BaseRenderer {
  readonly name = 'badge';
  readonly displayName = 'Badge';
  readonly description = 'Render status badges and labels';
  readonly category = 'component';
  readonly aliases = ['label', 'tag'];

  async render(input: RenderInput): Promise<RenderOutput> {
    try {
      const data = typeof input.content === 'string' ? JSON.parse(input.content) : input.content;
      const text = data.text || data.label || 'Badge';
      const color = data.color || '#0366d6';

      const builder = new SVGBuilder(input.width || 150, input.height || 35, input.theme || 'light');
      const textWidth = text.length * 8 + 20;
      const width = Math.max(input.width || 150, textWidth);

      const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="35" viewBox="0 0 ${width} 35">
  <defs>
    <linearGradient id="badgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${color};stop-opacity:0.8" />
    </linearGradient>
  </defs>
  <rect width="${width}" height="35" fill="url(#badgeGrad)" rx="17.5"/>
  <text x="${width / 2}" y="22" text-anchor="middle" style="font-size: 13px; font-weight: bold; fill: white;">
    ${escapeXml(text)}
  </text>
</svg>`;

      return {
        svg,
        width,
        height: 35,
        type: 'badge',
      };
    } catch (err) {
      const builder = new SVGBuilder(input.width || 150, input.height || 35, input.theme || 'light');
      return {
        svg: builder.createError('Badge Error', 'Invalid data'),
        width: builder.getWidth(),
        height: builder.getHeight(),
        type: 'badge',
      };
    }
  }

  getExample() {
    return {
      input: {
        content: JSON.stringify({text: 'Active', color: '#28a745'}),
      },
      description: 'Green status badge',
    };
  }
}

/**
 * Button renderer
 */
export class ButtonRenderer extends BaseRenderer {
  readonly name = 'button';
  readonly displayName = 'Button';
  readonly description = 'Render UI buttons';
  readonly category = 'component';
  readonly aliases = [];

  async render(input: RenderInput): Promise<RenderOutput> {
    try {
      const data = typeof input.content === 'string' ? JSON.parse(input.content) : input.content;
      const text = data.text || data.label || 'Click Me';
      const color = data.color || '#0366d6';
      const type = data.type || 'primary'; // primary, secondary, danger, success

      const builder = new SVGBuilder(input.width || 180, input.height || 50, input.theme || 'light');

      const bgColor = type === 'secondary' ? 'transparent' : color;
      const textColor = type === 'secondary' ? color : 'white';
      const borderColor = type === 'secondary' ? color : 'none';
      const strokeWidth = type === 'secondary' ? '2' : '0';

      const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${builder.getWidth()}" height="${builder.getHeight()}" viewBox="0 0 ${builder.getWidth()} ${builder.getHeight()}">
  <defs>
    <linearGradient id="btnGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${color};stop-opacity:0.9" />
    </linearGradient>
  </defs>
  <rect x="10" y="10" width="${builder.getWidth() - 20}" height="${builder.getHeight() - 20}"
    fill="${bgColor}" stroke="${borderColor}" stroke-width="${strokeWidth}"
    ${type === 'secondary' ? '' : `fill="url(#btnGrad)"`} rx="6"/>
  <text x="${builder.getWidth() / 2}" y="${builder.getHeight() / 2 + 6}"
    text-anchor="middle" style="font-size: 14px; font-weight: bold; fill: ${textColor};">
    ${escapeXml(text)}
  </text>
</svg>`;

      return {
        svg,
        width: builder.getWidth(),
        height: builder.getHeight(),
        type: 'button',
      };
    } catch (err) {
      const builder = new SVGBuilder(input.width || 180, input.height || 50, input.theme || 'light');
      return {
        svg: builder.createError('Button Error', 'Invalid data'),
        width: builder.getWidth(),
        height: builder.getHeight(),
        type: 'button',
      };
    }
  }

  getExample() {
    return {
      input: {
        content: JSON.stringify({text: 'Get Started', color: '#0366d6', type: 'primary'}),
      },
      description: 'Primary action button',
    };
  }
}

/**
 * Card renderer
 */
export class CardRenderer extends BaseRenderer {
  readonly name = 'card';
  readonly displayName = 'Card';
  readonly description = 'Render content cards';
  readonly category = 'component';
  readonly aliases = ['panel'];

  async render(input: RenderInput): Promise<RenderOutput> {
    try {
      const data = typeof input.content === 'string' ? JSON.parse(input.content) : input.content;
      const title = data.title || data.heading || 'Card Title';
      const content = data.content || data.text || data.description || '';
      const color = data.color || '#0366d6';
      const icon = data.icon || '📌';

      const builder = new SVGBuilder(input.width || 300, input.height || 200, input.theme || 'light');
      const theme = builder.getTheme();

      const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${builder.getWidth()}" height="${builder.getHeight()}" viewBox="0 0 ${builder.getWidth()} ${builder.getHeight()}">
  <rect width="${builder.getWidth()}" height="${builder.getHeight()}" fill="${theme.bg}" stroke="${theme.border}" stroke-width="1" rx="8"/>
  <rect width="${builder.getWidth()}" height="8" fill="${color}" rx="8"/>

  <text x="20" y="35" style="font-size: 12px;" fill="${theme.text}">
    ${icon} ${escapeXml(title.substring(0, 30))}
  </text>
  <text x="20" y="70" style="font-size: 12px;" fill="${theme.text}">
    ${escapeXml(content.substring(0, 100))}
  </text>
</svg>`;

      return {
        svg,
        width: builder.getWidth(),
        height: builder.getHeight(),
        type: 'card',
      };
    } catch (err) {
      const builder = new SVGBuilder(input.width || 300, input.height || 200, input.theme || 'light');
      return {
        svg: builder.createError('Card Error', 'Invalid data'),
        width: builder.getWidth(),
        height: builder.getHeight(),
        type: 'card',
      };
    }
  }

  getExample() {
    return {
      input: {
        content: JSON.stringify({
          icon: '✨',
          title: 'Feature',
          content: 'This is a great new feature for your project',
          color: '#0366d6',
        }),
      },
      description: 'Feature card with icon and description',
    };
  }
}

/**
 * Divider/Separator renderer
 */
export class DividerRenderer extends BaseRenderer {
  readonly name = 'divider';
  readonly displayName = 'Divider';
  readonly description = 'Render section dividers';
  readonly category = 'component';
  readonly aliases = ['separator', 'line'];

  async render(input: RenderInput): Promise<RenderOutput> {
    try {
      const data = typeof input.content === 'string' ? JSON.parse(input.content) : input.content;
      const text = data.text || data.label || '';
      const color = data.color || '#e0e0e0';

      const builder = new SVGBuilder(input.width || 800, input.height || 40, input.theme || 'light');

      const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${builder.getWidth()}" height="${builder.getHeight()}" viewBox="0 0 ${builder.getWidth()} ${builder.getHeight()}">
  ${text ? `<text x="${builder.getWidth() / 2}" y="24" text-anchor="middle" style="font-size: 12px;" fill="${color}">${escapeXml(text)}</text>` : ''}
  <line x1="0" y1="${builder.getHeight() / 2}" x2="${builder.getWidth()}" y2="${builder.getHeight() / 2}" stroke="${color}" stroke-width="1"/>
</svg>`;

      return {
        svg,
        width: builder.getWidth(),
        height: builder.getHeight(),
        type: 'divider',
      };
    } catch {
      const builder = new SVGBuilder(input.width || 800, input.height || 40, input.theme || 'light');
      return {
        svg: builder.createError('Divider Error', 'Invalid data'),
        width: builder.getWidth(),
        height: builder.getHeight(),
        type: 'divider',
      };
    }
  }

  getExample() {
    return {
      input: {
        content: JSON.stringify({text: 'or', color: '#cccccc'}),
      },
      description: 'Horizontal divider with label',
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
