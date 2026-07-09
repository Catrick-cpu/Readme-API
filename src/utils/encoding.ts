export function encodeQueryParam(value: string): string {
  return encodeURIComponent(value);
}

export function decodeQueryParam(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export function escapeHtml(text: string): string {
  const map: {[key: string]: string} = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return text.replace(/[&<>"']/g, (char) => map[char] || char);
}

export function escapeSvgAttribute(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function base64Encode(text: string): string {
  return Buffer.from(text, 'utf-8').toString('base64');
}

export function base64Decode(encoded: string): string {
  try {
    return Buffer.from(encoded, 'base64').toString('utf-8');
  } catch {
    return encoded;
  }
}

export function colorToRgb(color: string): [number, number, number] | null {
  // Handle hex colors
  if (color.startsWith('#')) {
    const hex = color.substring(1);
    if (hex.length === 6) {
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      return [r, g, b];
    }
  }
  return null;
}

export function parseColor(color: string): string {
  // Validate and normalize color values
  const validColors = /^(#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}|rgb\(\d+,\d+,\d+\)|rgba\(\d+,\d+,\d+,[0-9.]+\))$/;
  return validColors.test(color) ? color : '#000000';
}
