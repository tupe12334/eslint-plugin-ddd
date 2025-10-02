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
        // File without logic (only constants)
        {
          code: 'export const PI = 3.14;',
          filename: '/project/src/constants.js',
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

  it('should validate spec files have corresponding implementation files', () => {
    vi.mocked(existsSync).mockReturnValue(false);

    ruleTester.run('require-spec-file (spec validation)', rule, {
      valid: [],
      invalid: [
        // Spec file without implementation file
        {
          code: 'describe("User", () => {});',
          filename: '/project/src/user.spec.js',
          errors: [
            {
              messageId: 'missingImplementationFile',
              data: {
                specFile: 'user.spec.js',
                implFile: 'user.js',
              },
            },
          ],
        },
        // TypeScript spec file without implementation
        {
          code: 'describe("Product", () => {});',
          filename: '/project/src/product.spec.ts',
          errors: [
            {
              messageId: 'missingImplementationFile',
              data: {
                specFile: 'product.spec.ts',
                implFile: 'product.ts',
              },
            },
          ],
        },
      ],
    });
  });

  it('should disallow index.spec.* files', () => {
    vi.mocked(existsSync).mockReturnValue(true);

    ruleTester.run('require-spec-file (no index.spec)', rule, {
      valid: [],
      invalid: [
        {
          code: 'describe("Index", () => {});',
          filename: '/project/src/index.spec.js',
          errors: [
            {
              messageId: 'indexSpecNotAllowed',
            },
          ],
        },
        {
          code: 'describe("Index", () => {});',
          filename: '/project/src/index.spec.ts',
          errors: [
            {
              messageId: 'indexSpecNotAllowed',
            },
          ],
        },
        {
          code: 'test("Index", () => {});',
          filename: '/project/src/index.test.js',
          errors: [
            {
              messageId: 'indexSpecNotAllowed',
            },
          ],
        },
      ],
    });
  });

  it('should allow spec files when implementation exists', () => {
    vi.mocked(existsSync).mockReturnValue(true);

    ruleTester.run('require-spec-file (spec with impl)', rule, {
      valid: [
        {
          code: 'describe("User", () => {});',
          filename: '/project/src/user.spec.js',
        },
        {
          code: 'describe("Product", () => {});',
          filename: '/project/src/product.spec.ts',
        },
      ],
      invalid: [],
    });
  });

  it('should allow implementation files when spec exists', () => {
    vi.mocked(existsSync).mockReturnValue(true);

    ruleTester.run('require-spec-file (impl with spec)', rule, {
      valid: [
        {
          code: 'export function add(a, b) { return a + b; }',
          filename: '/project/src/math.js',
        },
        {
          code: 'export class UserService { getUser() { return {}; } }',
          filename: '/project/src/user-service.ts',
        },
      ],
      invalid: [],
    });
  });
});
