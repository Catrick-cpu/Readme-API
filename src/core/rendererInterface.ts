/**
 * Core renderer interface
 * All renderers must implement this interface
 */

export interface RenderInput {
  content: string;
  title?: string;
  width?: number;
  height?: number;
  theme?: 'light' | 'dark';
  language?: string;
  [key: string]: any;
}

export interface RenderOutput {
  svg: string;
  width: number;
  height: number;
  type: string;
}

export interface Renderer {
  /**
   * Unique identifier for this renderer
   */
  readonly name: string;

  /**
   * Display name for documentation
   */
  readonly displayName: string;

  /**
   * Description of what this renderer does
   */
  readonly description: string;

  /**
   * Category (documentation, code, diagram, etc.)
   */
  readonly category: string;

  /**
   * Aliases for this renderer (e.g., 'js' for javascript)
   */
  readonly aliases: string[];

  /**
   * Render the input and return SVG
   */
  render(input: RenderInput): Promise<RenderOutput>;

  /**
   * Validate input before rendering
   */
  validate(input: RenderInput): {valid: boolean; error?: string};

  /**
   * Get example usage
   */
  getExample(): {input: RenderInput; description: string};
}

export abstract class BaseRenderer implements Renderer {
  abstract readonly name: string;
  abstract readonly displayName: string;
  abstract readonly description: string;
  abstract readonly category: string;
  readonly aliases: string[] = [];

  abstract render(input: RenderInput): Promise<RenderOutput>;

  validate(input: RenderInput): {valid: boolean; error?: string} {
    if (!input.content || input.content.length === 0) {
      return {valid: false, error: 'Content cannot be empty'};
    }
    if (input.content.length > 50000) {
      return {valid: false, error: 'Content exceeds maximum length'};
    }
    return {valid: true};
  }

  abstract getExample(): {input: RenderInput; description: string};

  protected normalizeWidth(width?: number): number {
    const w = width || 800;
    return Math.min(Math.max(w, 300), 1200);
  }

  protected normalizeHeight(height?: number): number {
    const h = height || 600;
    return Math.min(Math.max(h, 200), 3000);
  }
}
