# require-index-file Examples

## Valid Examples

**Directory with index file:**
- ✅ `valid/domain/` - Contains multiple files (`user.js`, `product.js`) and has `index.js`

## Invalid Examples

**Directory without index file:**
- ❌ `invalid/services/` - Contains multiple files (`user-service.js`, `product-service.js`) but missing index file

## Rule Behavior

The rule requires an index file when:
- A directory contains 2 or more implementation files (configurable via `minFiles` option)
- Files are `.js` or `.ts` (not `.d.ts`, `.spec.js`, `.test.js`, etc.)
- Directory is not excluded via `excludePatterns`

Default excluded patterns:
- `**/examples/**`
- `**/test/**`
- `**/tests/**`
- `**/__tests__/**`
