import { RuleTester } from 'eslint';
import { describe, it } from 'vitest';
import rule from './index.js';

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
});

describe('no-logic-in-index', () => {
  it('should allow re-exports in index files', () => {
    ruleTester.run('no-logic-in-index', rule, {
      valid: [
        {
          code: 'export * from "./user";',
          filename: '/project/src/index.js',
        },
        {
          code: 'export { User } from "./user";',
          filename: '/project/src/index.js',
        },
        {
          code: 'export { User as UserModel } from "./user";',
          filename: '/project/src/index.ts',
        },
        {
          code: `export * from "./user";
export * from "./product";`,
          filename: '/project/src/domain/index.js',
        },
      ],
      invalid: [],
    });
  });

  it('should allow simple constant exports in index files', () => {
    ruleTester.run('no-logic-in-index (constants)', rule, {
      valid: [
        {
          code: 'export const API_URL = "https://api.example.com";',
          filename: '/project/src/index.js',
        },
        {
          code: 'export const MAX_RETRIES = 3;',
          filename: '/project/src/config/index.ts',
        },
      ],
      invalid: [],
    });
  });

  it('should disallow functions with logic in index files', () => {
    ruleTester.run('no-logic-in-index (functions)', rule, {
      valid: [],
      invalid: [
        {
          code: 'export function add(a, b) { return a + b; }',
          filename: '/project/src/index.js',
          errors: [
            {
              messageId: 'logicInIndexFile',
              data: {
                nodeType: 'FunctionDeclaration',
              },
            },
          ],
        },
        {
          code: 'function helper() { return true; }',
          filename: '/project/src/utils/index.ts',
          errors: [
            {
              messageId: 'logicInIndexFile',
              data: {
                nodeType: 'FunctionDeclaration',
              },
            },
          ],
        },
      ],
    });
  });

  it('should disallow classes with methods in index files', () => {
    ruleTester.run('no-logic-in-index (classes)', rule, {
      valid: [],
      invalid: [
        {
          code: 'export class User { getName() { return this.name; } }',
          filename: '/project/src/index.js',
          errors: [
            {
              messageId: 'logicInIndexFile',
              data: {
                nodeType: 'ClassDeclaration',
              },
            },
          ],
        },
      ],
    });
  });

  it('should disallow arrow functions with logic in index files', () => {
    ruleTester.run('no-logic-in-index (arrow functions)', rule, {
      valid: [],
      invalid: [
        {
          code: 'export const add = (a, b) => { return a + b; };',
          filename: '/project/src/index.js',
          errors: [
            {
              messageId: 'logicInIndexFile',
              data: {
                nodeType: 'ArrowFunctionExpression',
              },
            },
          ],
        },
        {
          code: 'const helper = () => { console.log("test"); };',
          filename: '/project/src/utils/index.ts',
          errors: [
            {
              messageId: 'logicInIndexFile',
              data: {
                nodeType: 'ArrowFunctionExpression',
              },
            },
          ],
        },
      ],
    });
  });

  it('should allow non-index files to have logic', () => {
    ruleTester.run('no-logic-in-index (non-index files)', rule, {
      valid: [
        {
          code: 'export function add(a, b) { return a + b; }',
          filename: '/project/src/math.js',
        },
        {
          code: 'export class User { getName() { return this.name; } }',
          filename: '/project/src/user.ts',
        },
      ],
      invalid: [],
    });
  });

  it('should handle Windows paths', () => {
    ruleTester.run('no-logic-in-index (Windows paths)', rule, {
      valid: [
        {
          code: 'export * from "./user";',
          filename: 'C:\\project\\src\\index.js',
        },
      ],
      invalid: [
        {
          code: 'export function add(a, b) { return a + b; }',
          filename: 'C:\\project\\src\\index.js',
          errors: [
            {
              messageId: 'logicInIndexFile',
              data: {
                nodeType: 'FunctionDeclaration',
              },
            },
          ],
        },
      ],
    });
  });

  it('should handle index files with different extensions', () => {
    ruleTester.run('no-logic-in-index (extensions)', rule, {
      valid: [],
      invalid: [
        {
          code: 'export function add(a, b) { return a + b; }',
          filename: '/project/src/index.ts',
          errors: [{ messageId: 'logicInIndexFile' }],
        },
        {
          code: 'export const Button = () => { return <button />; };',
          filename: '/project/src/index.jsx',
          errors: [{ messageId: 'logicInIndexFile' }],
        },
        {
          code: 'export const Card = () => { return <div />; };',
          filename: '/project/src/index.tsx',
          errors: [{ messageId: 'logicInIndexFile' }],
        },
      ],
    });
  });
});
