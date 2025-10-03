import { describe, it, expect, beforeEach, vi } from 'vitest';
import { existsSync, readdirSync, statSync } from 'fs';
import { checkExcludePatterns, checkSnapshotFolder, checkPngFiles } from './helpers.js';

vi.mock('fs');

describe('checkExcludePatterns', () => {
  it('should match files with **/* pattern', () => {
    expect(checkExcludePatterns('/path/to/file.spec.jsx', ['**/*.spec.jsx'])).toBe(true);
    expect(checkExcludePatterns('/path/to/file.test.jsx', ['**/*.spec.jsx'])).toBe(false);
  });

  it('should match files with **/ pattern', () => {
    expect(checkExcludePatterns('/path/to/index.tsx', ['**/index.tsx'])).toBe(true);
    expect(checkExcludePatterns('\\path\\to\\index.tsx', ['**/index.tsx'])).toBe(true);
  });
});

describe('checkSnapshotFolder', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should return false when folder does not exist', () => {
    existsSync.mockReturnValue(false);
    const context = { report: vi.fn() };
    const result = checkSnapshotFolder(context, {}, '/path/to/snapshots', 'snapshots');
    expect(result).toBe(false);
    expect(context.report).toHaveBeenCalled();
  });

  it('should return true when folder exists and is directory', () => {
    existsSync.mockReturnValue(true);
    statSync.mockReturnValue({ isDirectory: () => true });
    const context = { report: vi.fn() };
    const result = checkSnapshotFolder(context, {}, '/path/to/snapshots', 'snapshots');
    expect(result).toBe(true);
    expect(context.report).not.toHaveBeenCalled();
  });
});

describe('checkPngFiles', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should report when no PNG files found', () => {
    readdirSync.mockReturnValue(['file.txt', 'file.js']);
    const context = { report: vi.fn() };
    checkPngFiles(context, {}, '/path/to/snapshots', 'snapshots');
    expect(context.report).toHaveBeenCalled();
  });

  it('should not report when PNG files exist', () => {
    readdirSync.mockReturnValue(['screenshot.png', 'file.txt']);
    const context = { report: vi.fn() };
    checkPngFiles(context, {}, '/path/to/snapshots', 'snapshots');
    expect(context.report).not.toHaveBeenCalled();
  });
});
