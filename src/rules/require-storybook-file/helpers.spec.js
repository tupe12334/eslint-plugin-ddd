import { describe, it, expect } from 'vitest';
import { checkExcludePatterns } from './helpers.js';

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
    expect(checkExcludePatterns('/path/to/index.jsx', ['**/index.jsx'])).toBe(
      true
    );
    expect(
      checkExcludePatterns('\\path\\to\\index.jsx', ['**/index.jsx'])
    ).toBe(true);
    expect(checkExcludePatterns('/path/to/other.jsx', ['**/index.jsx'])).toBe(
      false
    );
  });

  it('should match files with simple pattern', () => {
    expect(checkExcludePatterns('/path/examples/file.js', ['/examples/'])).toBe(
      true
    );
    expect(checkExcludePatterns('/path/src/file.js', ['/examples/'])).toBe(
      false
    );
  });
});
