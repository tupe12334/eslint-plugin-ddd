import { describe, it, expect } from 'vitest';
import { hasLogicInNode, isIndexFile, isReExport } from './helpers.js';

describe('hasLogicInNode', () => {
  it('should return true for function declarations', () => {
    const node = { type: 'FunctionDeclaration', body: {} };
    expect(hasLogicInNode(node)).toBe(true);
  });

  it('should return true for classes with methods', () => {
    const node = {
      type: 'ClassDeclaration',
      body: {
        body: [
          { type: 'MethodDefinition', value: { body: {} } },
        ],
      },
    };
    expect(hasLogicInNode(node)).toBe(true);
  });

  it('should return false for null node', () => {
    expect(hasLogicInNode(null)).toBe(false);
  });
});

describe('isIndexFile', () => {
  it('should return true for index files', () => {
    expect(isIndexFile('/path/to/index.js')).toBe(true);
    expect(isIndexFile('/path/to/index.ts')).toBe(true);
    expect(isIndexFile('\\path\\to\\index.jsx')).toBe(true);
  });

  it('should return false for non-index files', () => {
    expect(isIndexFile('/path/to/component.js')).toBe(false);
  });
});

describe('isReExport', () => {
  it('should return true for ExportAllDeclaration', () => {
    expect(isReExport({ type: 'ExportAllDeclaration' })).toBe(true);
  });

  it('should return true for ExportNamedDeclaration with source', () => {
    expect(isReExport({ type: 'ExportNamedDeclaration', source: {} })).toBeTruthy();
  });

  it('should return true for type exports', () => {
    expect(isReExport({ type: 'ExportNamedDeclaration', exportKind: 'type' })).toBe(true);
  });

  it('should return false for other statements', () => {
    expect(isReExport({ type: 'VariableDeclaration' })).toBe(false);
  });
});
