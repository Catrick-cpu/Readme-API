import {VercelRequest, VercelResponse} from '@vercel/node';
import {registry} from '../src/core/rendererRegistry';
import {RenderInput} from '../src/core/rendererInterface';

// Import all renderers
import {MarkdownRenderer, ChangelogRenderer, ReadmeSectionRenderer} from '../src/renderers/markdownRenderer';
import {CodeRenderer, JsonRenderer, YamlRenderer, TerminalRenderer, DiffRenderer} from '../src/renderers/codeRenderer';
import {CSVRenderer, TableRenderer, BarChartRenderer, ProgressRenderer, StatsRenderer} from '../src/renderers/dataRenderer';
import {MermaidRenderer, TimelineRenderer} from '../src/renderers/diagramRenderer';
import {BadgeRenderer, ButtonRenderer, CardRenderer, DividerRenderer} from '../src/renderers/componentRenderer';

// Register all renderers (done once on first request)
let initialized = false;

function initializeRenderers() {
  if (initialized) return;

  // Documentation renderers
  registry.register(new MarkdownRenderer());
  registry.register(new ChangelogRenderer());
  registry.register(new ReadmeSectionRenderer());

  // Code renderers
  registry.register(new CodeRenderer());
  registry.register(new JsonRenderer());
  registry.register(new YamlRenderer());
  registry.register(new TerminalRenderer());
  registry.register(new DiffRenderer());

  // Data renderers
  registry.register(new CSVRenderer());
  registry.register(new TableRenderer());
  registry.register(new BarChartRenderer());
  registry.register(new ProgressRenderer());
  registry.register(new StatsRenderer());

  // Diagram renderers
  registry.register(new MermaidRenderer());
  registry.register(new TimelineRenderer());

  // Component renderers
  registry.register(new BadgeRenderer());
  registry.register(new ButtonRenderer());
  registry.register(new CardRenderer());
  registry.register(new DividerRenderer());

  initialized = true;
}

function createErrorSvg(message: string, details?: string, width: number = 800, height: number = 200): string {
  const errorMessage = escapeXml(message);
  const errorDetails = details ? escapeXml(details) : '';

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="#fff5f5" stroke="#dc3545" stroke-width="2"/>
  <text x="20" y="40" font-family="sans-serif" font-size="18" font-weight="bold" fill="#dc3545">
    ❌ Error
  </text>
  <text x="20" y="70" font-family="monospace" font-size="13" fill="#333">
    ${errorMessage}
  </text>
  ${errorDetails ? `<text x="20" y="100" font-family="monospace" font-size="11" fill="#666">${errorDetails}</text>` : ''}
</svg>`;
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Initialize renderers on first request
  initializeRenderers();

  // Only accept GET requests
  if (req.method !== 'GET') {
    res.status(405).send(createErrorSvg('Method Not Allowed', 'Only GET requests are supported'));
    return;
  }

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS (CORS preflight)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const query = req.query;

    // Check for catalog request
    if (query.catalog === 'true' || query.catalog === '1') {
      const metadata = registry.getMetadata();
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(metadata, null, 2));
      return;
    }

    // Check for list request
    if (query.list === 'true' || query.list === '1') {
      const categories = registry.getCategories();
      const result: {[key: string]: any} = {};

      categories.forEach(category => {
        result[category] = registry.getRenderersByCategory(category).map(r => ({
          name: r.name,
          displayName: r.displayName,
          aliases: r.aliases,
        }));
      });

      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(result, null, 2));
      return;
    }

    // Regular render request
    const type = query.type ? String(query.type) : null;
    const content = query.content ? decodeURIComponent(String(query.content)) : '';

    if (!type) {
      res.send(createErrorSvg('Missing Parameter', 'Required: type'));
      return;
    }

    if (!content) {
      res.send(createErrorSvg('Missing Parameter', 'Required: content'));
      return;
    }

    // Get renderer
    const renderer = registry.getRenderer(type);
    if (!renderer) {
      const available = registry.getRendererNames().join(', ');
      res.send(createErrorSvg('Unknown Renderer', `Type '${type}' not found. Available: ${available}`));
      return;
    }

    // Build input
    const input: RenderInput = {
      content,
      title: query.title ? decodeURIComponent(String(query.title)) : undefined,
      width: query.width ? parseInt(String(query.width), 10) : undefined,
      height: query.height ? parseInt(String(query.height), 10) : undefined,
      theme: (query.theme === 'dark' ? 'dark' : 'light') as 'light' | 'dark',
      language: query.language ? String(query.language) : undefined,
      // Pass through any other params
      ...Object.fromEntries(
        Object.entries(query).filter(([key]) => !['type', 'content', 'title', 'width', 'height', 'theme', 'language'].includes(key))
      ),
    };

    // Validate
    const validation = renderer.validate(input);
    if (!validation.valid) {
      res.send(createErrorSvg('Validation Error', validation.error));
      return;
    }

    // Render
    const output = await renderer.render(input);

    res.setHeader('Content-Type', 'image/svg+xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600, immutable');
    res.send(output.svg);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.send(createErrorSvg('Rendering Error', message));
  }
}
