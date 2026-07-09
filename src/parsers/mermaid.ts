export interface MermaidDiagram {
  valid: boolean;
  type: string;
  content: string;
  error?: string;
}

export function validateMermaidSyntax(content: string): MermaidDiagram {
  const trimmed = content.trim();

  // Check if empty
  if (!trimmed) {
    return {
      valid: false,
      type: 'unknown',
      content: trimmed,
      error: 'Mermaid content cannot be empty',
    };
  }

  // Detect diagram type
  let type = 'unknown';

  if (trimmed.startsWith('graph')) {
    type = 'flowchart';
  } else if (trimmed.startsWith('sequenceDiagram')) {
    type = 'sequence';
  } else if (trimmed.startsWith('classDiagram')) {
    type = 'class';
  } else if (trimmed.startsWith('stateDiagram')) {
    type = 'state';
  } else if (trimmed.startsWith('gantt')) {
    type = 'gantt';
  } else if (trimmed.startsWith('pie')) {
    type = 'pie';
  } else if (trimmed.startsWith('flowchart')) {
    type = 'flowchart';
  } else if (trimmed.startsWith('gitGraph')) {
    type = 'git';
  } else {
    return {
      valid: false,
      type: 'unknown',
      content: trimmed,
      error: 'Unknown Mermaid diagram type. Supported: graph, flowchart, sequenceDiagram, classDiagram, stateDiagram, gantt, pie',
    };
  }

  // Basic syntax validation
  const hasErrors = validateMermaidContent(trimmed);
  if (hasErrors) {
    return {
      valid: false,
      type,
      content: trimmed,
      error: 'Invalid Mermaid syntax detected',
    };
  }

  return {
    valid: true,
    type,
    content: trimmed,
  };
}

function validateMermaidContent(content: string): boolean {
  // Check for common syntax errors
  const lines = content.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip empty lines and comments
    if (!trimmed || trimmed.startsWith('%%')) {
      continue;
    }

    // Basic bracket matching
    const openBrackets = (trimmed.match(/\[/g) || []).length;
    const closeBrackets = (trimmed.match(/\]/g) || []).length;

    if (openBrackets !== closeBrackets) {
      return true; // Has errors
    }

    const openParens = (trimmed.match(/\(/g) || []).length;
    const closeParens = (trimmed.match(/\)/g) || []).length;

    if (openParens !== closeParens) {
      return true; // Has errors
    }
  }

  return false; // No obvious errors
}

export function getMermaidExample(type: string): string {
  const examples: {[key: string]: string} = {
    flowchart: `graph TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> B`,

    sequence: `sequenceDiagram
    participant User
    participant API
    User->>API: Request Data
    API-->>User: Return Data`,

    class: `classDiagram
    class Animal {
      +name
      +age
      +speak()
    }`,

    state: `stateDiagram-v2
    [*] --> Idle
    Idle --> Active: trigger
    Active --> Idle: reset`,

    gantt: `gantt
    title Project Timeline
    section Tasks
    Task A :a1, 0, 30d
    Task B :a2, 30d, 20d`,

    pie: `pie title Browser Usage
    "Chrome": 45
    "Firefox": 20
    "Safari": 18`,

    git: `gitGraph
    commit id: "init"
    commit id: "feature"
    branch develop
    commit id: "dev work"`,
  };

  return examples[type] || examples.flowchart;
}

export function sanitizeMermaidContent(content: string): string {
  // Remove potentially dangerous content
  let sanitized = content;

  // Block javascript
  sanitized = sanitized.replace(/javascript:/gi, '');

  // Block script tags (though mermaid doesn't support them, be safe)
  sanitized = sanitized.replace(/<script[^>]*>.*?<\/script>/gi, '');

  // Limit content length
  if (sanitized.length > 50000) {
    sanitized = sanitized.substring(0, 50000);
  }

  return sanitized;
}

export function estimateMermaidSize(content: string): {
  type: string;
  complexity: number;
  estimatedWidth: number;
  estimatedHeight: number;
} {
  const lines = content.split('\n').filter(l => l.trim());
  const nodeCount = (content.match(/\[.*?\]|\(.*?\)|{.*?}/g) || []).length;
  const edgeCount = (content.match(/-->/g) || []).length;

  let type = 'unknown';
  let complexity = nodeCount + edgeCount;

  if (content.startsWith('graph')) type = 'flowchart';
  else if (content.startsWith('sequenceDiagram')) type = 'sequence';
  else if (content.startsWith('classDiagram')) type = 'class';
  else if (content.startsWith('gantt')) type = 'gantt';

  return {
    type,
    complexity,
    estimatedWidth: Math.min(1200, Math.max(400, complexity * 80)),
    estimatedHeight: Math.min(3000, Math.max(300, nodeCount * 60)),
  };
}
