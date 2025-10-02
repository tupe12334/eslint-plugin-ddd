// ❌ Invalid: Spec files cannot be named "index.spec.*"
// Spec files must match their implementation file names
import { describe, it } from 'vitest';

describe('Index', () => {
  it('should not be named index.spec', () => {
    // index.spec.* files are not allowed
  });
});
