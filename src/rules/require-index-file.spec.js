import { RuleTester } from 'eslint';
import { describe, it, beforeEach, vi } from 'vitest';
import { readdirSync, existsSync, statSync } from 'fs';
import rule from './require-index-file.js';

vi.mock('fs');

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
});

describe('require-index-file', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should require index file for directories with multiple files', () => {
    // Mock directory with multiple files but no index
    vi.mocked(readdirSync).mockReturnValue(['user.js', 'product.js']);
    vi.mocked(statSync).mockReturnValue({ isFile: () => true });
    vi.mocked(existsSync).mockImplementation((path) => {
      // Directory exists, but no index files
      if (path.includes('index.js') || path.includes('index.ts')) {
        return false;
      }
      return true;
    });

    ruleTester.run('require-index-file', rule, {
      valid: [],
      invalid: [
        {
          code: 'export const user = {};',
          filename: '/project/src/domain/user.js',
          errors: [
            {
              messageId: 'missingIndexFile',
              data: {
                directory: 'domain',
              },
            },
          ],
        },
      ],
    });
  });

  it('should not require index when index file exists', () => {
    vi.mocked(readdirSync).mockReturnValue(['user.js', 'product.js', 'index.js']);
    vi.mocked(statSync).mockReturnValue({ isFile: () => true });
    vi.mocked(existsSync).mockReturnValue(true);

    ruleTester.run('require-index-file (has index)', rule, {
      valid: [
        {
          code: 'export const user = {};',
          filename: '/project/src/domain/user.js',
        },
      ],
      invalid: [],
    });
  });

  it('should not require index for single file directories', () => {
    vi.mocked(readdirSync).mockReturnValue(['user.js']);
    vi.mocked(statSync).mockReturnValue({ isFile: () => true });
    vi.mocked(existsSync).mockReturnValue(true);

    ruleTester.run('require-index-file (single file)', rule, {
      valid: [
        {
          code: 'export const user = {};',
          filename: '/project/src/domain/user.js',
        },
      ],
      invalid: [],
    });
  });

  it('should not count spec files toward file count', () => {
    vi.mocked(readdirSync).mockReturnValue(['user.js', 'user.spec.js']);
    vi.mocked(statSync).mockReturnValue({ isFile: () => true });
    vi.mocked(existsSync).mockImplementation((path) => {
      if (path.includes('index.js') || path.includes('index.ts')) {
        return false;
      }
      return true;
    });

    ruleTester.run('require-index-file (with spec)', rule, {
      valid: [
        {
          code: 'export const user = {};',
          filename: '/project/src/domain/user.js',
        },
      ],
      invalid: [],
    });
  });

  it('should respect exclude patterns', () => {
    vi.mocked(readdirSync).mockReturnValue(['user.js', 'product.js']);
    vi.mocked(statSync).mockReturnValue({ isFile: () => true });
    vi.mocked(existsSync).mockImplementation((path) => {
      if (path.includes('index.js') || path.includes('index.ts')) {
        return false;
      }
      return true;
    });

    ruleTester.run('require-index-file (excluded)', rule, {
      valid: [
        {
          code: 'export const user = {};',
          filename: '/project/src/examples/user.js',
        },
      ],
      invalid: [],
    });
  });

  it('should respect minFiles option', () => {
    vi.mocked(readdirSync).mockReturnValue(['user.js', 'product.js']);
    vi.mocked(statSync).mockReturnValue({ isFile: () => true });
    vi.mocked(existsSync).mockImplementation((path) => {
      if (path.includes('index.js') || path.includes('index.ts')) {
        return false;
      }
      return true;
    });

    ruleTester.run('require-index-file (minFiles)', rule, {
      valid: [
        {
          code: 'export const user = {};',
          filename: '/project/src/domain/user.js',
          options: [{ minFiles: 3 }],
        },
      ],
      invalid: [],
    });
  });
});
