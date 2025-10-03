import { RuleTester } from 'eslint';
import { describe, it, beforeEach, vi } from 'vitest';
import { existsSync } from 'fs';
import rule from './require-storybook-file.js';

vi.mock('fs');

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
});

describe('require-storybook-file', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should require Storybook files for JSX components', () => {
    vi.mocked(existsSync).mockReturnValue(false);

    ruleTester.run('require-storybook-file', rule, {
      valid: [
        // Non-JSX/TSX files should be ignored
        {
          code: 'export const Button = {};',
          filename: '/project/src/Button.js',
        },
      ],
      invalid: [
        {
          code: 'export const Button = () => <button>Click</button>;',
          filename: '/project/src/Button.jsx',
          errors: [
            {
              messageId: 'missingStorybookFile',
              data: {
                storybookFile: 'Button.stories.jsx',
              },
            },
          ],
        },
      ],
    });
  });

  it('should require Storybook files for TSX components', () => {
    vi.mocked(existsSync).mockReturnValue(false);

    ruleTester.run('require-storybook-file (TSX)', rule, {
      valid: [],
      invalid: [
        {
          code: 'export const Card = () => <div>Card</div>;',
          filename: '/project/src/Card.tsx',
          errors: [
            {
              messageId: 'missingStorybookFile',
              data: {
                storybookFile: 'Card.stories.tsx',
              },
            },
          ],
        },
      ],
    });
  });

  it('should not report error when Storybook file exists', () => {
    vi.mocked(existsSync).mockReturnValue(true);

    ruleTester.run('require-storybook-file (has storybook)', rule, {
      valid: [
        {
          code: 'export const Button = () => <button>Click</button>;',
          filename: '/project/src/Button.jsx',
        },
        {
          code: 'export const Card = () => <div>Card</div>;',
          filename: '/project/src/Card.tsx',
        },
      ],
      invalid: [],
    });
  });

  it('should exclude index files', () => {
    vi.mocked(existsSync).mockReturnValue(false);

    ruleTester.run('require-storybook-file (index)', rule, {
      valid: [
        {
          code: 'export * from "./Button";',
          filename: '/project/src/index.jsx',
        },
        {
          code: 'export * from "./Card";',
          filename: '/project/src/index.tsx',
        },
      ],
      invalid: [],
    });
  });

  it('should exclude Storybook files themselves', () => {
    vi.mocked(existsSync).mockReturnValue(false);

    ruleTester.run('require-storybook-file (storybook files)', rule, {
      valid: [
        {
          code: 'export default { title: "Button" };',
          filename: '/project/src/Button.stories.jsx',
        },
        {
          code: 'export default { title: "Card" };',
          filename: '/project/src/Card.stories.tsx',
        },
      ],
      invalid: [],
    });
  });

  it('should exclude spec/test files', () => {
    vi.mocked(existsSync).mockReturnValue(false);

    ruleTester.run('require-storybook-file (spec/test)', rule, {
      valid: [
        {
          code: 'describe("Button", () => {});',
          filename: '/project/src/Button.spec.jsx',
        },
        {
          code: 'test("renders", () => {});',
          filename: '/project/src/Card.test.tsx',
        },
      ],
      invalid: [],
    });
  });

  it('should respect custom exclude patterns', () => {
    vi.mocked(existsSync).mockReturnValue(false);

    ruleTester.run('require-storybook-file (custom exclude)', rule, {
      valid: [
        {
          code: 'export const Internal = () => <div>Internal</div>;',
          filename: '/project/src/internal/Component.jsx',
          options: [{ excludePatterns: ['**/internal/**'] }],
        },
      ],
      invalid: [],
    });
  });
});
