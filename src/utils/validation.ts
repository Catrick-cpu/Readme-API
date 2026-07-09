import { z } from 'zod';

const MAX_CONTENT_LENGTH = 50000;
const MAX_CSS_LENGTH = 10000;

export const RenderRequestSchema = z.object({
  type: z.enum(['html', 'markdown', 'code', 'mermaid', 'component']),
  content: z.string().max(MAX_CONTENT_LENGTH, 'Content exceeds maximum length'),
  language: z.string().optional(),
  css: z.string().max(MAX_CSS_LENGTH, 'CSS exceeds maximum length').optional(),
  title: z.string().max(500).optional(),
  theme: z.enum(['light', 'dark']).default('light'),
  width: z.number().int().min(300).max(1200).default(800),
  height: z.number().int().min(200).max(3000).default(600),
});

export type RenderRequest = z.infer<typeof RenderRequestSchema>;

export function validateRenderRequest(data: unknown): RenderRequest {
  return RenderRequestSchema.parse(data);
}

export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

export function validateLanguage(language: string): boolean {
  const supportedLanguages = new Set([
    'html',
    'css',
    'javascript',
    'typescript',
    'python',
    'c',
    'cpp',
    'rust',
    'java',
    'json',
    'yaml',
    'bash',
    'markdown',
    'sql',
    'go',
    'ruby',
    'php',
  ]);
  return supportedLanguages.has(language.toLowerCase());
}

export function escapeSvgText(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
