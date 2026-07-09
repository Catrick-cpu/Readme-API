import hljs from 'highlight.js';
import { validateLanguage } from '../utils/validation';

export interface HighlightedCode {
  html: string;
  language: string;
  lineCount: number;
}

export function highlightCode(code: string, language: string = 'plaintext'): HighlightedCode {
  const normalized = language.toLowerCase();

  // Validate language
  if (!validateLanguage(normalized)) {
    // Fall back to plaintext
    const lines = code.split('\n');
    return {
      html: escapeHtml(code),
      language: 'plaintext',
      lineCount: lines.length,
    };
  }

  try {
    // Try to highlight with the specified language
    const highlighted = hljs.highlight(code, {
      language: normalized,
      ignoreIllegals: true,
    });

    const lines = code.split('\n');
    return {
      html: highlighted.value,
      language: normalized,
      lineCount: lines.length,
    };
  } catch {
    // If highlighting fails, escape and return plain
    const lines = code.split('\n');
    return {
      html: escapeHtml(code),
      language: 'plaintext',
      lineCount: lines.length,
    };
  }
}

export function formatCodeForDisplay(code: string, lineNumbers: boolean = true): string {
  const lines = code.split('\n');
  let formatted = '';

  lines.forEach((line, idx) => {
    if (lineNumbers) {
      const lineNum = idx + 1;
      formatted += `${lineNum.toString().padStart(4, ' ')} | ${line}\n`;
    } else {
      formatted += line + '\n';
    }
  });

  return formatted;
}

export function extractCodeMetadata(code: string): {
  lineCount: number;
  charCount: number;
  hasComments: boolean;
  hasStrings: boolean;
} {
  const lines = code.split('\n');
  const charCount = code.length;
  const hasComments = /\/\/|\/\*|\*\/|#/.test(code);
  const hasStrings = /["'`]/.test(code);

  return {
    lineCount: lines.length,
    charCount,
    hasComments,
    hasStrings,
  };
}

function escapeHtml(text: string): string {
  const map: {[key: string]: string} = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return text.replace(/[&<>"']/g, (char) => map[char] || char);
}

export function getLanguageInfo(language: string): {
  displayName: string;
  extension: string;
  mime: string;
} {
  const map: {[key: string]: {displayName: string; extension: string; mime: string}} = {
    html: { displayName: 'HTML', extension: '.html', mime: 'text/html' },
    css: { displayName: 'CSS', extension: '.css', mime: 'text/css' },
    javascript: { displayName: 'JavaScript', extension: '.js', mime: 'application/javascript' },
    typescript: { displayName: 'TypeScript', extension: '.ts', mime: 'text/typescript' },
    python: { displayName: 'Python', extension: '.py', mime: 'text/x-python' },
    java: { displayName: 'Java', extension: '.java', mime: 'text/x-java' },
    cpp: { displayName: 'C++', extension: '.cpp', mime: 'text/x-c++src' },
    c: { displayName: 'C', extension: '.c', mime: 'text/x-csrc' },
    rust: { displayName: 'Rust', extension: '.rs', mime: 'text/x-rust' },
    json: { displayName: 'JSON', extension: '.json', mime: 'application/json' },
    yaml: { displayName: 'YAML', extension: '.yaml', mime: 'text/yaml' },
    bash: { displayName: 'Bash', extension: '.sh', mime: 'text/x-shellscript' },
    markdown: { displayName: 'Markdown', extension: '.md', mime: 'text/markdown' },
  };

  return map[language.toLowerCase()] || { displayName: 'Plain Text', extension: '.txt', mime: 'text/plain' };
}

export function validateCodeInput(code: string, maxLength: number = 50000): {valid: boolean; error?: string} {
  if (!code || code.length === 0) {
    return { valid: false, error: 'Code cannot be empty' };
  }

  if (code.length > maxLength) {
    return { valid: false, error: `Code exceeds maximum length of ${maxLength} characters` };
  }

  return { valid: true };
}
