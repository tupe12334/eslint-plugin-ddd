import { RuleTester } from '@typescript-eslint/rule-tester';
import { describe, beforeEach, vi } from 'vitest';
import * as fs from 'fs';
import rule from '../../src/rules/require-spec-file';

vi.mock('fs');

const ruleTester = new RuleTester({
  parser: '@typescript-eslint/parser',
});

describe('require-spec-file', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  ruleTester.run('require-spec-file', rule, {
    valid: [
      {
        code: 'const x = 1;',
        filename: '/project/src/user.ts',
        options: [],
        only: false,
        setup: () => {
          vi.mocked(fs.existsSync).mockReturnValue(true);
        },
      },
      {
        code: 'const x = 1;',
        filename: '/project/src/user.spec.ts',
        options: [],
        only: false,
      },
      {
        code: 'const x = 1;',
        filename: '/project/src/index.ts',
        options: [],
        only: false,
      },
      {
        code: 'const x = 1;',
        filename: '/project/src/types.ts',
        options: [],
        only: false,
      },
    ],

    invalid: [
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
          vi.mocked(fs.existsSync).mockReturnValue(false);
        },
      },
      {
        code: 'export class UserService {}',
        filename: '/project/src/services/user-service.ts',
        options: [],
        errors: [
          {
            messageId: 'missingSpecFile',
            data: {
              specFile: 'user-service.spec.ts',
            },
          },
        ],
        only: false,
        setup: () => {
          vi.mocked(fs.existsSync).mockReturnValue(false);
        },
      },
    ],
  });
});
