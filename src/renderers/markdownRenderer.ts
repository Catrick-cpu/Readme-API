import {BaseRenderer, RenderInput, RenderOutput} from '../core/rendererInterface';
import {SVGBuilder} from '../core/svgBuilder';
import {parseMarkdown} from '../parsers/markdown';

/**
 * Markdown renderer - converts Markdown to SVG
 */
export class MarkdownRenderer extends BaseRenderer {
  readonly name = 'markdown';
  readonly displayName = 'Markdown';
  readonly description = 'Render Markdown documents as SVG previews';
  readonly category = 'documentation';
  readonly aliases = ['md'];

  async render(input: RenderInput): Promise<RenderOutput> {
    const html = parseMarkdown(input.content);
    const builder = new SVGBuilder(
      input.width || 800,
      input.height || 600,
      input.theme || 'light'
    );

    const svg = builder.buildContainer(html, input.title || 'Markdown Preview');

    return {
      svg,
      width: builder.getWidth(),
      height: builder.getHeight(),
      type: 'markdown',
    };
  }

  getExample() {
    return {
      input: {
        content: '# Getting Started\n\nThis is **bold** text.\n\n- Item 1\n- Item 2',
        title: 'Documentation',
      },
      description: 'Renders Markdown with headings, bold, lists',
    };
  }
}

/**
 * Changelog renderer
 */
export class ChangelogRenderer extends BaseRenderer {
  readonly name = 'changelog';
  readonly displayName = 'Changelog';
  readonly description = 'Render changelog and version history';
  readonly category = 'documentation';
  readonly aliases = ['releases', 'history'];

  async render(input: RenderInput): Promise<RenderOutput> {
    const builder = new SVGBuilder(
      input.width || 900,
      input.height || 700,
      input.theme || 'light'
    );

    // Simple changelog formatting
    const lines = input.content.split('\n');
    const html = lines
      .map(line => {
        if (line.startsWith('## ')) return `<strong style="color: ${builder.getTheme().accent};">${line.substring(3)}</strong><br/>`;
        if (line.startsWith('- ')) return `• ${line.substring(2)}<br/>`;
        if (line.trim()) return `${line}<br/>`;
        return '';
      })
      .join('');

    const svg = builder.buildContainer(html, input.title || 'Changelog');

    return {
      svg,
      width: builder.getWidth(),
      height: builder.getHeight(),
      type: 'changelog',
    };
  }

  getExample() {
    return {
      input: {
        content: '## v1.0.0\n- Initial release\n- Added features\n\n## v0.9.0\n- Beta release',
        title: 'Release History',
      },
      description: 'Changelog with version sections and features',
    };
  }
}

/**
 * README section renderer
 */
export class ReadmeSectionRenderer extends BaseRenderer {
  readonly name = 'readme-section';
  readonly displayName = 'README Section';
  readonly description = 'Render a README section with formatting';
  readonly category = 'documentation';
  readonly aliases = ['readme', 'doc-section'];

  async render(input: RenderInput): Promise<RenderOutput> {
    const builder = new SVGBuilder(
      input.width || 800,
      input.height || 600,
      input.theme || 'light'
    );

    const html = parseMarkdown(input.content);
    const svg = builder.buildContainer(html, input.title || 'README Section');

    return {
      svg,
      width: builder.getWidth(),
      height: builder.getHeight(),
      type: 'readme-section',
    };
  }

  getExample() {
    return {
      input: {
        content:
          '## Installation\n\n```bash\nnpm install\n```\n\nThen run with `npm start`',
        title: 'Installation Guide',
      },
      description: 'README section with code and instructions',
    };
  }
}
