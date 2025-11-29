import { RuleTester } from 'eslint';
import { describe, it, beforeEach, vi } from 'vitest';
import { existsSync, readdirSync, statSync } from 'fs';
import rule from './require-visual-snapshot.js';

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

describe('require-visual-snapshot', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should require spec file for JSX components', () => {
    vi.mocked(existsSync).mockReturnValue(false);

    ruleTester.run('require-visual-snapshot', rule, {
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
              messageId: 'missingSpecFile',
              data: {
                specFile: 'Button.spec.jsx',
              },
            },
          ],
        },
      ],
    });
  });

  it('should require snapshot folder when spec exists', () => {
    vi.mocked(existsSync).mockImplementation(path => {
      // Spec file exists, but snapshot folder doesn't
      if (path.includes('.spec.')) return true;
      if (path.includes('-snapshots')) return false;
      return false;
    });

    ruleTester.run('require-visual-snapshot (missing folder)', rule, {
      valid: [],
      invalid: [
        {
          code: 'export const Button = () => <button>Click</button>;',
          filename: '/project/src/Button.jsx',
          errors: [
            {
              messageId: 'missingSnapshotFolder',
              data: {
                snapshotFolder: 'Button.spec-snapshots',
              },
            },
          ],
        },
      ],
    });
  });

  it('should require PNG files in snapshot folder', () => {
    vi.mocked(existsSync).mockReturnValue(true);
    vi.mocked(statSync).mockReturnValue({ isDirectory: () => true });
    vi.mocked(readdirSync).mockReturnValue(['readme.txt']); // No PNG files

    ruleTester.run('require-visual-snapshot (no PNG)', rule, {
      valid: [],
      invalid: [
        {
          code: 'export const Card = () => <div>Card</div>;',
          filename: '/project/src/Card.jsx',
          errors: [
            {
              messageId: 'missingPngFiles',
              data: {
                snapshotFolder: 'Card.spec-snapshots',
              },
            },
          ],
        },
      ],
    });
  });

  it('should pass when all requirements are met', () => {
    vi.mocked(existsSync).mockReturnValue(true);
    vi.mocked(statSync).mockReturnValue({ isDirectory: () => true });
    vi.mocked(readdirSync).mockReturnValue([
      'snapshot.png',
      'other-snapshot.PNG',
    ]);

    ruleTester.run('require-visual-snapshot (valid)', rule, {
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

    ruleTester.run('require-visual-snapshot (index)', rule, {
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

  it('should exclude spec files themselves', () => {
    vi.mocked(existsSync).mockReturnValue(false);

    ruleTester.run('require-visual-snapshot (spec files)', rule, {
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

  it('should handle TSX files', () => {
    vi.mocked(existsSync).mockReturnValue(false);

    ruleTester.run('require-visual-snapshot (TSX)', rule, {
      valid: [],
      invalid: [
        {
          code: 'export const Alert = () => <div>Alert</div>;',
          filename: '/project/src/Alert.tsx',
          errors: [
            {
              messageId: 'missingSpecFile',
              data: {
                specFile: 'Alert.spec.tsx',
              },
            },
          ],
        },
      ],
    });
  });

  it('should respect custom exclude patterns', () => {
    vi.mocked(existsSync).mockReturnValue(false);

    ruleTester.run('require-visual-snapshot (custom exclude)', rule, {
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

  it('should detect PNG files case-insensitively', () => {
    vi.mocked(existsSync).mockReturnValue(true);
    vi.mocked(statSync).mockReturnValue({ isDirectory: () => true });
    vi.mocked(readdirSync).mockReturnValue(['Snapshot.PNG', 'test.Png']);

    ruleTester.run('require-visual-snapshot (case-insensitive PNG)', rule, {
      valid: [
        {
          code: 'export const Button = () => <button>Click</button>;',
          filename: '/project/src/Button.jsx',
        },
      ],
      invalid: [],
    });
  });
});
