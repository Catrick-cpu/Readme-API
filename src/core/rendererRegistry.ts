import {Renderer, RenderInput, RenderOutput} from './rendererInterface';

/**
 * Global renderer registry
 * Manages all available renderers
 */
export class RendererRegistry {
  private static instance: RendererRegistry;
  private renderers: Map<string, Renderer> = new Map();
  private categories: Map<string, string[]> = new Map();

  private constructor() {}

  static getInstance(): RendererRegistry {
    if (!RendererRegistry.instance) {
      RendererRegistry.instance = new RendererRegistry();
    }
    return RendererRegistry.instance;
  }

  /**
   * Register a renderer
   */
  register(renderer: Renderer): void {
    this.renderers.set(renderer.name, renderer);

    // Register aliases
    renderer.aliases.forEach(alias => {
      this.renderers.set(alias, renderer);
    });

    // Track by category
    if (!this.categories.has(renderer.category)) {
      this.categories.set(renderer.category, []);
    }
    const categoryList = this.categories.get(renderer.category)!;
    if (!categoryList.includes(renderer.name)) {
      categoryList.push(renderer.name);
    }
  }

  /**
   * Get a renderer by name
   */
  getRenderer(name: string): Renderer | undefined {
    return this.renderers.get(name.toLowerCase());
  }

  /**
   * Get all renderer names
   */
  getRendererNames(): string[] {
    const names = new Set<string>();
    this.renderers.forEach((renderer, key) => {
      if (key === renderer.name) {
        names.add(key);
      }
    });
    return Array.from(names).sort();
  }

  /**
   * Get renderers by category
   */
  getRenderersByCategory(category: string): Renderer[] {
    const names = this.categories.get(category) || [];
    return names
      .map(name => this.renderers.get(name))
      .filter((r): r is Renderer => r !== undefined);
  }

  /**
   * Get all categories
   */
  getCategories(): string[] {
    return Array.from(this.categories.keys()).sort();
  }

  /**
   * Render with automatic renderer detection
   */
  async render(type: string, input: RenderInput): Promise<RenderOutput> {
    const renderer = this.getRenderer(type);
    if (!renderer) {
      throw new Error(`Unknown renderer: ${type}`);
    }

    const validation = renderer.validate(input);
    if (!validation.valid) {
      throw new Error(`Validation error: ${validation.error}`);
    }

    return await renderer.render(input);
  }

  /**
   * Get metadata for all renderers
   */
  getMetadata() {
    const metadata: {[category: string]: any[]} = {};

    this.categories.forEach((names, category) => {
      metadata[category] = names
        .map(name => this.renderers.get(name))
        .filter((r): r is Renderer => r !== undefined)
        .map(renderer => ({
          name: renderer.name,
          displayName: renderer.displayName,
          description: renderer.description,
          aliases: renderer.aliases,
        }));
    });

    return metadata;
  }

  /**
   * Clear all renderers (for testing)
   */
  clear(): void {
    this.renderers.clear();
    this.categories.clear();
  }
}

// Export singleton instance
export const registry = RendererRegistry.getInstance();
