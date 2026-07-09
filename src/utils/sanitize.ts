import sanitizeHtml from 'sanitize-html';

const ALLOWED_TAGS = [
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'p', 'br', 'strong', 'em', 'b', 'i',
  'ul', 'ol', 'li', 'dl', 'dt', 'dd',
  'table', 'thead', 'tbody', 'tr', 'th', 'td',
  'blockquote', 'pre', 'code', 'span', 'div',
  'a', 'img', 'button', 'hr', 'section', 'article'
];

const ALLOWED_ATTRIBUTES: {[key: string]: string[]} = {
  'a': ['href', 'title', 'class'],
  'img': ['src', 'alt', 'width', 'height', 'class'],
  'div': ['class', 'id'],
  'span': ['class', 'id'],
  'p': ['class', 'id'],
  'h1': ['class', 'id'],
  'h2': ['class', 'id'],
  'h3': ['class', 'id'],
  'h4': ['class', 'id'],
  'h5': ['class', 'id'],
  'h6': ['class', 'id'],
  'code': ['class'],
  'pre': ['class'],
  'button': ['class', 'type'],
  '*': ['class', 'id'],
};

export function sanitizeHtmlContent(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: ALLOWED_ATTRIBUTES,
    allowedSchemes: ['http', 'https', 'mailto'],
    disallowedTagsMode: 'discard',
    onTagAttr: (tag, name, value) => {
      // Block event handlers
      if (name.startsWith('on')) {
        return false;
      }
      // Block javascript: protocol
      if (name === 'href' && value.startsWith('javascript:')) {
        return false;
      }
      return true;
    },
  });
}

export function sanitizeCss(css: string): string {
  // Remove dangerous CSS patterns
  const dangerous = [
    /javascript:/gi,
    /expression\s*\(/gi,
    /import\s+/gi,
    /@import/gi,
    /<script/gi,
    /behavior:/gi,
    /-moz-binding:/gi,
  ];

  let sanitized = css;
  dangerous.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '');
  });

  // Limit CSS to reasonable selectors
  if (sanitized.length > 10000) {
    sanitized = sanitized.substring(0, 10000);
  }

  return sanitized;
}

export function validateSvgContent(svg: string): string {
  // Prevent script injection through SVG
  const dangerous = [
    /<script/gi,
    /on\w+\s*=/gi, // onclick, onload, etc.
    /javascript:/gi,
  ];

  let sanitized = svg;
  dangerous.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '');
  });

  return sanitized;
}

export function sanitizeUrl(url: string): string {
  try {
    const parsed = new URL(url);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return '';
    }
    return url;
  } catch {
    return '';
  }
}
