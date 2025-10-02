import { RuleTester } from 'eslint';
import { describe, beforeEach, vi } from 'vitest';
import { existsSync } from 'fs';
import rule from './require-spec-file.js';

vi.mock('fs');

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
});

describe('require-spec-file', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  ruleTester.run('require-spec-file', rule, {
    valid: [
      // JavaScript files with spec files
      {
        code: 'const x = 1;',
        filename: '/project/src/user.js',
        options: [],
        only: false,
        setup: () => {
          vi.mocked(existsSync).mockReturnValue(true);
        },
      },
      // TypeScript files with spec files
      {
        code: 'const x = 1;',
        filename: '/project/src/user.ts',
        options: [],
        only: false,
        setup: () => {
          vi.mocked(existsSync).mockReturnValue(true);
        },
      },
      // Spec files themselves should be excluded
      {
        code: 'const x = 1;',
        filename: '/project/src/user.spec.js',
        options: [],
        only: false,
      },
      {
        code: 'const x = 1;',
        filename: '/project/src/user.spec.ts',
        options: [],
        only: false,
      },
      // Index files should be excluded
      {
        code: 'const x = 1;',
        filename: '/project/src/index.js',
        options: [],
        only: false,
      },
      {
        code: 'const x = 1;',
        filename: '/project/src/index.ts',
        options: [],
        only: false,
      },
      // TypeScript declaration files should be excluded
      {
        code: 'export type User = { id: string };',
        filename: '/project/src/types.d.ts',
        options: [],
        only: false,
      },
    ],

    invalid: [
      // JavaScript file without spec
      {
        code: 'const x = 1;',
        filename: '/project/src/user.js',
        options: [],
        errors: [
          {
            messageId: 'missingSpecFile',
            data: {
              specFile: 'user.spec.js',
            },
          },
        ],
        only: false,
        setup: () => {
          vi.mocked(existsSync).mockReturnValue(false);
        },
      },
      // TypeScript file without spec
      {
        code: 'const x = 1;',
        filename: '/project/src/user.ts',
        options: [],
        errors: [
          {
            messageId: 'missingSpecFile',
            data: {
              specFile: 'user.spec.ts',
            },
          },
        ],
        only: false,
        setup: () => {
          vi.mocked(existsSync).mockReturnValue(false);
        },
      },
      // JavaScript service without spec
      {
        code: 'export class UserService {}',
        filename: '/project/src/services/user-service.js',
        options: [],
        errors: [
          {
            messageId: 'missingSpecFile',
            data: {
              specFile: 'user-service.spec.js',
            },
          },
        ],
        only: false,
        setup: () => {
          vi.mocked(existsSync).mockReturnValue(false);
        },
      },
      // TypeScript service without spec
      {
        code: 'export class ProductRepository {}',
        filename: '/project/src/repositories/product-repository.ts',
        options: [],
        errors: [
          {
            messageId: 'missingSpecFile',
            data: {
              specFile: 'product-repository.spec.ts',
            },
          },
        ],
        only: false,
        setup: () => {
          vi.mocked(existsSync).mockReturnValue(false);
        },
      },
    ],
  });
});
