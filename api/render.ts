import { VercelRequest, VercelResponse } from '@vercel/node';
import { validateRenderRequest } from '../src/utils/validation';
import { sanitizeHtmlContent, sanitizeCss, validateSvgContent } from '../src/utils/sanitize';
import { escapeSvgAttribute } from '../src/utils/encoding';
import { SvgBuilder, createCodeBlockSvg } from '../src/renderers/svg';
import {
  renderStatCard,
  renderBadge,
  renderProgressBar,
  renderChart,
  renderTable,
  renderDashboard,
} from '../src/renderers/components';
import { parseHtml, wrapHtmlWithCss } from '../src/parsers/html';
import { parseMarkdown } from '../src/parsers/markdown';
import { highlightCode, getLanguageInfo } from '../src/parsers/code';
import { validateMermaidSyntax, sanitizeMermaidContent, estimateMermaidSize } from '../src/parsers/mermaid';
import { ZodError } from 'zod';

const MAX_CONTENT_LENGTH = 50000;

function createErrorSvg(message: string, details?: string): string {
  const errorMessage = escapeSvgAttribute(message);
  const errorDetails = details ? escapeSvgAttribute(details) : '';

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="200" viewBox="0 0 800 200">
  <rect width="800" height="200" fill="#fff5f5" stroke="#dc3545" stroke-width="2"/>
  <text x="20" y="40" font-family="sans-serif" font-size="18" font-weight="bold" fill="#dc3545">
    ❌ Error
  </text>
  <text x="20" y="70" font-family="monospace" font-size="13" fill="#333" word-spacing="5">
    ${errorMessage}
  </text>
  ${errorDetails ? `<text x="20" y="100" font-family="monospace" font-size="11" fill="#666">${errorDetails}</text>` : ''}
</svg>`;
}

function handleHtmlRender(request: any, res: VercelResponse): void {
  try {
    const parsed = parseHtml(request.content, request.css);
    const wrapped = wrapHtmlWithCss(parsed.html, parsed.css);
    const builder = new SvgBuilder(request.width, request.height, request.theme);
    const svg = builder.buildSvg(wrapped, request.title || 'HTML Preview');

    res.setHeader('Content-Type', 'image/svg+xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600, immutable');
    res.send(svg);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to render HTML';
    res.send(createErrorSvg('HTML Rendering Error', message));
  }
}

function handleMarkdownRender(request: any, res: VercelResponse): void {
  try {
    const html = parseMarkdown(request.content);
    const builder = new SvgBuilder(request.width, request.height, request.theme);
    const svg = builder.buildSvg(html, request.title || 'Markdown Preview');

    res.setHeader('Content-Type', 'image/svg+xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600, immutable');
    res.send(svg);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to render Markdown';
    res.send(createErrorSvg('Markdown Rendering Error', message));
  }
}

function handleCodeRender(request: any, res: VercelResponse): void {
  try {
    const language = request.language || 'plaintext';
    const highlighted = highlightCode(request.content, language);
    const langInfo = getLanguageInfo(language);

    const svg = createCodeBlockSvg(
      request.content,
      langInfo.displayName,
      request.width,
      request.height,
      request.theme
    );

    res.setHeader('Content-Type', 'image/svg+xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600, immutable');
    res.send(svg);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to render code';
    res.send(createErrorSvg('Code Rendering Error', message));
  }
}

function handleMermaidRender(request: any, res: VercelResponse): void {
  try {
    const sanitized = sanitizeMermaidContent(request.content);
    const validation = validateMermaidSyntax(sanitized);

    if (!validation.valid) {
      res.send(createErrorSvg('Invalid Mermaid Syntax', validation.error || 'Unknown error'));
      return;
    }

    const sizing = estimateMermaidSize(sanitized);

    // For now, return a placeholder SVG indicating Mermaid diagram type
    // In production, you'd use mermaid library to render to SVG
    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${Math.min(request.width, sizing.estimatedWidth)}" height="${Math.min(request.height, sizing.estimatedHeight)}" viewBox="0 0 ${sizing.estimatedWidth} ${sizing.estimatedHeight}">
  <rect width="${sizing.estimatedWidth}" height="${sizing.estimatedHeight}" fill="#f8f9fa" stroke="#e0e0e0" stroke-width="2"/>
  <text x="${sizing.estimatedWidth / 2}" y="30" font-family="sans-serif" font-size="16" font-weight="bold" text-anchor="middle" fill="#333">
    Mermaid Diagram
  </text>
  <text x="${sizing.estimatedWidth / 2}" y="60" font-family="sans-serif" font-size="14" text-anchor="middle" fill="#666">
    Type: ${escapeSvgAttribute(validation.type)}
  </text>
  <text x="${sizing.estimatedWidth / 2}" y="90" font-family="sans-serif" font-size="12" text-anchor="middle" fill="#999">
    Complexity: ${validation.content.split('\n').length} lines
  </text>
  <rect x="10" y="110" width="${sizing.estimatedWidth - 20}" height="${sizing.estimatedHeight - 130}" fill="#fff" stroke="#d0d0d0" stroke-width="1" rx="4"/>
  <text x="${sizing.estimatedWidth / 2}" y="${sizing.estimatedHeight / 2}" font-family="monospace" font-size="11" text-anchor="middle" fill="#888" dominant-baseline="middle">
    Preview: Mermaid render requires client-side rendering
  </text>
</svg>`;

    res.setHeader('Content-Type', 'image/svg+xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600, immutable');
    res.send(svg);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to render Mermaid';
    res.send(createErrorSvg('Mermaid Rendering Error', message));
  }
}

function handleComponentRender(request: any, res: VercelResponse): void {
  try {
    const { component, data } = request;

    let svg = '';

    switch (component) {
      case 'stat-card':
        svg = renderStatCard(
          data.title || 'Statistic',
          data.value || '0',
          data.color || '#0366d6',
          request.width,
          request.height
        );
        break;

      case 'badge':
        svg = renderBadge(
          data.text || 'Badge',
          data.color || '#28a745',
          request.width,
          request.height
        );
        break;

      case 'progress':
        svg = renderProgressBar(
          data.value || 0,
          data.max || 100,
          request.width,
          request.height,
          data.color || '#0366d6'
        );
        break;

      case 'chart':
        svg = renderChart(
          data.title || 'Chart',
          data.data || [],
          request.width,
          request.height
        );
        break;

      case 'table':
        svg = renderTable(
          data.headers || [],
          data.rows || [],
          request.width,
          request.height
        );
        break;

      case 'dashboard':
        svg = renderDashboard(
          data.title || 'Dashboard',
          data.cards || [],
          request.width,
          request.height
        );
        break;

      default:
        res.send(createErrorSvg('Unknown component', `Component '${component}' not found`));
        return;
    }

    res.setHeader('Content-Type', 'image/svg+xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600, immutable');
    res.send(svg);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to render component';
    res.send(createErrorSvg('Component Rendering Error', message));
  }
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Only accept GET requests
  if (req.method !== 'GET') {
    res.status(405).send(createErrorSvg('Method Not Allowed', 'Only GET requests are supported'));
    return;
  }

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  try {
    // Parse query parameters
    const query = req.query;
    const params = {
      type: query.type || 'html',
      content: query.content ? decodeURIComponent(String(query.content)) : '',
      language: query.language ? String(query.language) : undefined,
      css: query.css ? decodeURIComponent(String(query.css)) : undefined,
      title: query.title ? decodeURIComponent(String(query.title)) : undefined,
      theme: (query.theme || 'light') as 'light' | 'dark',
      width: parseInt(String(query.width || '800'), 10),
      height: parseInt(String(query.height || '600'), 10),
      component: query.component ? String(query.component) : undefined,
      data: query.data ? JSON.parse(decodeURIComponent(String(query.data))) : {},
    };

    // Validate request
    const validationResult = validateRenderRequest(params);

    // Route to appropriate handler
    switch (validationResult.type) {
      case 'html':
        handleHtmlRender(validationResult, res);
        break;

      case 'markdown':
        handleMarkdownRender(validationResult, res);
        break;

      case 'code':
        handleCodeRender(validationResult, res);
        break;

      case 'mermaid':
        handleMermaidRender(validationResult, res);
        break;

      case 'component':
        handleComponentRender(validationResult, res);
        break;

      default:
        res.send(createErrorSvg('Unknown Type', `Type '${validationResult.type}' is not supported`));
    }
  } catch (err) {
    if (err instanceof ZodError) {
      const firstError = err.errors[0];
      res.send(createErrorSvg('Validation Error', `${firstError.path.join('.')}: ${firstError.message}`));
    } else if (err instanceof Error) {
      res.send(createErrorSvg('Processing Error', err.message));
    } else {
      res.send(createErrorSvg('Unknown Error', 'An unexpected error occurred'));
    }
  }
}
