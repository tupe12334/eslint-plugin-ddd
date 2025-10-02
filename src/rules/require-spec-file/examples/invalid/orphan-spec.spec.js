// ❌ Invalid: Spec file without corresponding implementation file
// This spec file expects an "orphan-spec.js" file which doesn't exist
import { describe, it } from 'vitest';

describe('OrphanSpec', () => {
  it('should not exist without implementation', () => {
    // This spec has no corresponding implementation file
  });
});
