import { sanitizeHtmlContent, sanitizeCss } from '../utils/sanitize';

export interface ParsedHtml {
  html: string;
  css: string;
  hasImages: boolean;
}

export function parseHtml(html: string, customCss?: string): ParsedHtml {
  // Sanitize HTML content
  const sanitized = sanitizeHtmlContent(html);

  // Sanitize custom CSS
  const css = customCss ? sanitizeCss(customCss) : '';

  // Check for images
  const hasImages = /(<img|background-image|url\()/i.test(sanitized);

  return {
    html: sanitized,
    css,
    hasImages,
  };
}

export function wrapHtmlWithCss(html: string, css: string): string {
  const wrappedCss = css
    ? `<style>${css}</style>`
    : '';

  return `
    <div style="
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      padding: 16px;
    ">
      ${wrappedCss}
      ${html}
    </div>
  `;
}

export function estimateHtmlSize(html: string): number {
  return html.length;
}

export function validateHtmlStructure(html: string): boolean {
  // Basic validation - check for unclosed tags
  const openTags = (html.match(/<[^>]+>/g) || []).length;
  const closeTags = (html.match(/<\/[^>]+>/g) || []).length;

  // Allow some flexibility
  return Math.abs(openTags - closeTags) <= 2;
}

export function extractHtmlMetadata(html: string): {
  headingCount: number;
  paragraphCount: number;
  linkCount: number;
  imageCount: number;
} {
  return {
    headingCount: (html.match(/<h[1-6]/gi) || []).length,
    paragraphCount: (html.match(/<p[^>]*>/gi) || []).length,
    linkCount: (html.match(/<a[^>]*>/gi) || []).length,
    imageCount: (html.match(/<img[^>]*>/gi) || []).length,
  };
}

export function minifyHtml(html: string): string {
  return html
    .replace(/\n/g, '')
    .replace(/\s+/g, ' ')
    .replace(/>\s+</g, '><')
    .trim();
}

export function createBasicHtmlTemplate(content: string, title: string = 'Preview'): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${sanitizeHtmlContent(title)}</title>
  <style>
    body {
      margin: 0;
      padding: 16px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      background: #fff;
      color: #24292e;
    }
    h1, h2, h3 { color: #0366d6; }
    code { background: #f6f8fa; padding: 2px 6px; border-radius: 3px; }
  </style>
</head>
<body>
  ${content}
</body>
</html>
  `.trim();
}
