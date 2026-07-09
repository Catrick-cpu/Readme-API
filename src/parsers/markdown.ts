import { marked } from 'marked';
import { sanitizeHtmlContent } from '../utils/sanitize';

export function parseMarkdown(markdown: string): string {
  // Configure marked for security
  marked.setOptions({
    breaks: true,
    gfm: true,
  });

  // Parse markdown to HTML
  const html = marked(markdown) as string;

  // Sanitize the resulting HTML
  return sanitizeHtmlContent(html);
}

export function markdownToPlainText(markdown: string): string {
  return markdown
    .replace(/#+\s+/g, '') // headings
    .replace(/\*\*([^*]+)\*\*/g, '$1') // bold
    .replace(/\*([^*]+)\*/g, '$1') // italic
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // links
    .replace(/^[-*+]\s+/gm, '') // lists
    .replace(/^>\s+/gm, '') // blockquotes
    .replace(/`([^`]+)`/g, '$1') // code
    .replace(/\n\n+/g, '\n') // multiple newlines
    .trim();
}

export function extractMarkdownHeadings(markdown: string): string[] {
  const headings: string[] = [];
  const lines = markdown.split('\n');

  lines.forEach(line => {
    const match = line.match(/^#+\s+(.+)$/);
    if (match) {
      headings.push(match[1]);
    }
  });

  return headings;
}

export function highlightMarkdownSyntax(markdown: string): string {
  // Add minimal syntax highlighting for markdown in SVG
  let highlighted = markdown;

  // Bold
  highlighted = highlighted.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

  // Italic
  highlighted = highlighted.replace(/\*([^*]+)\*/g, '<em>$1</em>');

  // Code
  highlighted = highlighted.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Links
  highlighted = highlighted.replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2">$1</a>');

  return highlighted;
}
