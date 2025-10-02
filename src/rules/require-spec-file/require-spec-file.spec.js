import { RuleTester } from 'eslint';
import { describe, it, beforeEach, vi } from 'vitest';
import { existsSync } from 'fs';
import rule from './index.js';

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

  it('should require spec files for files with logic', () => {
    // Mock fs to return false (spec file doesn't exist)
    vi.mocked(existsSync).mockReturnValue(false);

    ruleTester.run('require-spec-file', rule, {
      valid: [
        // File with logic but spec exists
        {
          code: 'export function add(a, b) { return a + b; }',
          filename: '/project/src/math.js',
        },
        // File without logic (only constants)
        {
          code: 'export const PI = 3.14;',
          filename: '/project/src/constants.js',
        },
        // Spec file itself
        {
          code: 'describe("test", () => {});',
          filename: '/project/src/user.spec.js',
        },
        // Index file
        {
          code: 'export * from "./user.js";',
          filename: '/project/src/index.js',
        },
      ],

      invalid: [
        // File with function logic but no spec
        {
          code: 'export function multiply(a, b) { return a * b; }',
          filename: '/project/src/calculator.js',
          errors: [
            {
              messageId: 'missingSpecFile',
              data: {
                specFile: 'calculator.spec.js',
              },
            },
          ],
        },
        // File with class logic but no spec
        {
          code: 'export class UserService { getUser() { return {}; } }',
          filename: '/project/src/user-service.js',
          errors: [
            {
              messageId: 'missingSpecFile',
              data: {
                specFile: 'user-service.spec.js',
              },
            },
          ],
        },
      ],
    });
  });

  it('should handle TypeScript files', () => {
    vi.mocked(existsSync).mockReturnValue(false);

    ruleTester.run('require-spec-file (TypeScript)', rule, {
      valid: [
        // Type-only file
        {
          code: 'export interface User { id: string; }',
          filename: '/project/src/types.ts',
        },
      ],

      invalid: [
        // File with function logic but no spec
        {
          code: 'export function greet(name: string) { return `Hello ${name}`; }',
          filename: '/project/src/greeter.ts',
          errors: [
            {
              messageId: 'missingSpecFile',
              data: {
                specFile: 'greeter.spec.ts',
              },
            },
          ],
        },
      ],
    });
  });
});
