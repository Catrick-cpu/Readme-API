import { escapeSvgAttribute } from '../utils/encoding';

export function renderStatCard(title: string, value: string, color: string, width: number, height: number): string {
  const padding = 15;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${color};stop-opacity:0.7" />
    </linearGradient>
  </defs>

  <rect width="${width}" height="${height}" fill="#ffffff" stroke="${color}" stroke-width="2" rx="8"/>
  <rect width="${width}" height="8" fill="url(#grad)" rx="8"/>

  <text x="${padding}" y="35" font-family="sans-serif" font-size="12" fill="#666666">
    ${escapeSvgAttribute(title)}
  </text>

  <text x="${padding}" y="70" font-family="sans-serif" font-size="28" font-weight="bold" fill="${color}">
    ${escapeSvgAttribute(value)}
  </text>
</svg>`;
}

export function renderBadge(text: string, color: string = '#28a745', width: number = 150, height: number = 30): string {
  const bgColor = color;
  const textColor = '#ffffff';
  const padding = 8;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="${bgColor}" rx="4"/>
  <text x="${width / 2}" y="${height / 2 + 5}"
    font-family="sans-serif" font-size="12" font-weight="bold" fill="${textColor}"
    text-anchor="middle" dominant-baseline="middle">
    ${escapeSvgAttribute(text)}
  </text>
</svg>`;
}

export function renderProgressBar(value: number, max: number, width: number = 300, height: number = 30, color: string = '#0366d6'): string {
  const percentage = Math.min(100, (value / max) * 100);
  const filledWidth = (width - 4) * (percentage / 100);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="#e0e0e0" rx="4"/>
  <rect width="${filledWidth + 2}" height="${height - 4}" x="2" y="2" fill="${color}" rx="3"/>
  <text x="${width / 2}" y="${height / 2 + 5}"
    font-family="sans-serif" font-size="12" font-weight="bold" fill="#333333"
    text-anchor="middle">
    ${percentage.toFixed(0)}%
  </text>
</svg>`;
}

export function renderChart(title: string, data: {label: string; value: number}[], width: number, height: number): string {
  if (data.length === 0) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="#f5f5f5"/>
  <text x="${width / 2}" y="${height / 2}" text-anchor="middle" fill="#999">No data</text>
</svg>`;
  }

  const maxValue = Math.max(...data.map(d => d.value));
  const chartWidth = width - 60;
  const chartHeight = height - 80;
  const barWidth = chartWidth / data.length;
  const padding = 20;

  let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="#ffffff" stroke="#e0e0e0" stroke-width="1"/>
  <text x="${padding}" y="25" font-family="sans-serif" font-size="14" font-weight="bold" fill="#333">
    ${escapeSvgAttribute(title)}
  </text>`;

  data.forEach((item, idx) => {
    const barHeight = (item.value / maxValue) * chartHeight;
    const x = padding + idx * barWidth + barWidth / 4;
    const y = height - padding - barHeight;
    const colors = ['#0366d6', '#28a745', '#ffc107', '#dc3545', '#6f42c1'];
    const color = colors[idx % colors.length];

    svg += `
  <rect x="${x}" y="${y}" width="${barWidth / 2}" height="${barHeight}" fill="${color}" rx="2"/>
  <text x="${x + barWidth / 4}" y="${height - padding + 15}"
    font-family="sans-serif" font-size="10" text-anchor="middle" fill="#666">
    ${escapeSvgAttribute(item.label.substring(0, 8))}
  </text>`;
  });

  svg += '\n</svg>';
  return svg;
}

export function renderTable(headers: string[], rows: string[][], width: number, height: number): string {
  const colWidth = (width - 40) / headers.length;
  const rowHeight = 30;
  const padding = 20;
  let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${Math.max(height, (rows.length + 1) * rowHeight + padding * 2)}" viewBox="0 0 ${width} ${Math.max(height, (rows.length + 1) * rowHeight + padding * 2)}">
  <rect width="${width}" height="${Math.max(height, (rows.length + 1) * rowHeight + padding * 2)}" fill="#ffffff" stroke="#e0e0e0" stroke-width="1"/>`;

  // Headers
  headers.forEach((header, idx) => {
    const x = padding + idx * colWidth;
    svg += `
  <rect x="${x}" y="${padding}" width="${colWidth}" height="${rowHeight}" fill="#f6f8fa" stroke="#e0e0e0" stroke-width="1"/>
  <text x="${x + 10}" y="${padding + rowHeight / 2 + 5}" font-family="sans-serif" font-size="12" font-weight="bold" fill="#333">
    ${escapeSvgAttribute(header.substring(0, 20))}
  </text>`;
  });

  // Rows
  rows.slice(0, 10).forEach((row, rowIdx) => {
    const y = padding + (rowIdx + 1) * rowHeight;
    row.forEach((cell, colIdx) => {
      const x = padding + colIdx * colWidth;
      const bgColor = rowIdx % 2 === 0 ? '#ffffff' : '#f9f9f9';
      svg += `
  <rect x="${x}" y="${y}" width="${colWidth}" height="${rowHeight}" fill="${bgColor}" stroke="#e0e0e0" stroke-width="1"/>
  <text x="${x + 10}" y="${y + rowHeight / 2 + 5}" font-family="sans-serif" font-size="11" fill="#666">
    ${escapeSvgAttribute(cell.substring(0, 20))}
  </text>`;
    });
  });

  svg += '\n</svg>';
  return svg;
}

export function renderDashboard(title: string, cards: {title: string; value: string; color: string}[], width: number, height: number): string {
  const cardWidth = (width - 60) / 3;
  const cardHeight = 100;
  const padding = 20;

  let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="#f5f5f5"/>
  <text x="${padding}" y="30" font-family="sans-serif" font-size="18" font-weight="bold" fill="#333">
    ${escapeSvgAttribute(title)}
  </text>`;

  cards.slice(0, 3).forEach((card, idx) => {
    const x = padding + idx * (cardWidth + padding);
    const y = 60;

    svg += `
  <rect x="${x}" y="${y}" width="${cardWidth}" height="${cardHeight}" fill="#ffffff" stroke="${card.color}" stroke-width="2" rx="4"/>
  <text x="${x + 10}" y="${y + 20}" font-family="sans-serif" font-size="11" fill="#999">
    ${escapeSvgAttribute(card.title.substring(0, 20))}
  </text>
  <text x="${x + 10}" y="${y + 55}" font-family="sans-serif" font-size="20" font-weight="bold" fill="${card.color}">
    ${escapeSvgAttribute(card.value.substring(0, 15))}
  </text>`;
  });

  svg += '\n</svg>';
  return svg;
}
