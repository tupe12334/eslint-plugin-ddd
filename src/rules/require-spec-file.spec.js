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
      {
        code: 'const x = 1;',
        filename: '/project/src/user.js',
        options: [],
        only: false,
        setup: () => {
          vi.mocked(existsSync).mockReturnValue(true);
        },
      },
      {
        code: 'const x = 1;',
        filename: '/project/src/user.spec.js',
        options: [],
        only: false,
      },
      {
        code: 'const x = 1;',
        filename: '/project/src/index.js',
        options: [],
        only: false,
      },
    ],

    invalid: [
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
    ],
  });
});
