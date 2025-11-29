import { describe, it, expect, beforeEach, vi } from 'vitest';
import { existsSync } from 'fs';
import {
  hasLogicInNode,
  isSpecFile,
  checkExcludePatterns,
  validateSpecFile,
  validateImplementationFile,
} from './helpers.js';

vi.mock('fs');

describe('hasLogicInNode', () => {
  it('should return true for function declarations', () => {
    const node = { type: 'FunctionDeclaration', body: {} };
    expect(hasLogicInNode(node)).toBe(true);
  });

  it('should return true for arrow functions with block statements', () => {
    const node = {
      type: 'ArrowFunctionExpression',
      body: { type: 'BlockStatement' },
    };
    expect(hasLogicInNode(node)).toBe(true);
  });

  it('should return false for arrow functions returning literals', () => {
    const node = { type: 'ArrowFunctionExpression', body: { type: 'Literal' } };
    expect(hasLogicInNode(node)).toBe(false);
  });

  it('should return true for classes with methods', () => {
    const node = {
      type: 'ClassDeclaration',
      body: {
        body: [{ type: 'MethodDefinition', value: { body: {} } }],
      },
    };
    expect(hasLogicInNode(node)).toBe(true);
  });

  it('should return false for null', () => {
    expect(hasLogicInNode(null)).toBe(false);
  });
});

describe('isSpecFile', () => {
  it('should return true for spec files', () => {
    expect(isSpecFile('/path/to/file.spec.js')).toBe(true);
    expect(isSpecFile('/path/to/file.spec.ts')).toBe(true);
    expect(isSpecFile('/path/to/file.test.js')).toBe(true);
  });

  it('should return false for non-spec files', () => {
    expect(isSpecFile('/path/to/file.js')).toBe(false);
  });
});

describe('checkExcludePatterns', () => {
  it('should match files with **/* pattern', () => {
    expect(
      checkExcludePatterns('/path/to/file.spec.js', ['**/*.spec.js'])
    ).toBe(true);
    expect(
      checkExcludePatterns('/path/to/file.test.js', ['**/*.spec.js'])
    ).toBe(false);
  });

  it('should match files with **/ pattern', () => {
    expect(checkExcludePatterns('/path/to/index.js', ['**/index.js'])).toBe(
      true
    );
    expect(checkExcludePatterns('\\path\\to\\index.js', ['**/index.js'])).toBe(
      true
    );
  });

  it('should match files with simple pattern', () => {
    expect(checkExcludePatterns('/path/examples/file.js', ['/examples/'])).toBe(
      true
    );
  });

  it('should match files inside directory with **/dirname/** pattern', () => {
    expect(
      checkExcludePatterns('/src/errors/blocks-fetch-error.ts', [
        '**/errors/**',
      ])
    ).toBe(true);
    expect(
      checkExcludePatterns('/path/to/errors/custom-error.js', ['**/errors/**'])
    ).toBe(true);
    expect(
      checkExcludePatterns('/project/exceptions/not-found.ts', [
        '**/exceptions/**',
      ])
    ).toBe(true);
    expect(
      checkExcludePatterns('/src/services/user-service.ts', ['**/errors/**'])
    ).toBe(false);
  });

  it('should handle Windows paths with directory patterns', () => {
    expect(
      checkExcludePatterns('C:\\project\\src\\errors\\my-error.ts', [
        '**/errors/**',
      ])
    ).toBe(true);
  });

  it('should match files with brace expansion patterns', () => {
    expect(
      checkExcludePatterns('/src/utils/helper-error.js', ['**/*-error.{js,ts}'])
    ).toBe(true);
    expect(
      checkExcludePatterns('/src/utils/helper-error.ts', ['**/*-error.{js,ts}'])
    ).toBe(true);
    expect(
      checkExcludePatterns('/src/utils/helper-error.tsx', [
        '**/*-error.{js,ts}',
      ])
    ).toBe(false);
  });

  it('should match files with dot notation error patterns', () => {
    expect(
      checkExcludePatterns('/src/my-module.error.js', ['**/*.error.{js,ts}'])
    ).toBe(true);
    expect(
      checkExcludePatterns('/src/my-module.error.ts', ['**/*.error.{js,ts}'])
    ).toBe(true);
  });
});

describe('validateSpecFile', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should report error for index.spec files', () => {
    const context = { report: vi.fn() };
    validateSpecFile(context, {}, '/path/to/index.spec.js');
    expect(context.report).toHaveBeenCalledWith({
      node: {},
      messageId: 'indexSpecNotAllowed',
    });
  });

  it('should report error when implementation file does not exist', () => {
    existsSync.mockReturnValue(false);
    const context = { report: vi.fn() };
    validateSpecFile(context, {}, '/path/to/component.spec.js');
    expect(context.report).toHaveBeenCalled();
  });

  it('should not report when implementation file exists', () => {
    existsSync.mockReturnValue(true);
    const context = { report: vi.fn() };
    validateSpecFile(context, {}, '/path/to/component.spec.js');
    expect(context.report).not.toHaveBeenCalled();
  });
});

describe('validateImplementationFile', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should not check files without logic', () => {
    const context = { report: vi.fn() };
    validateImplementationFile(context, {}, '/path/to/file.js', false, []);
    expect(context.report).not.toHaveBeenCalled();
  });

  it('should not check excluded files', () => {
    const context = { report: vi.fn() };
    validateImplementationFile(context, {}, '/path/to/index.js', true, [
      '**/index.js',
    ]);
    expect(context.report).not.toHaveBeenCalled();
  });

  it('should report error when spec file is missing', () => {
    existsSync.mockReturnValue(false);
    const context = { report: vi.fn() };
    validateImplementationFile(context, {}, '/path/to/component.js', true, []);
    expect(context.report).toHaveBeenCalled();
  });

  it('should not report when spec file exists', () => {
    existsSync.mockReturnValue(true);
    const context = { report: vi.fn() };
    validateImplementationFile(context, {}, '/path/to/component.js', true, []);
    expect(context.report).not.toHaveBeenCalled();
  });
});
