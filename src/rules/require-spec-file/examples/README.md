# Examples for `require-spec-file` Rule

## Valid Examples

Files in the `valid/` directory demonstrate correct usage.

**Files with logic + spec files:**
- ✅ `user-service.js` + `user-service.spec.js`
- ✅ `order-service.ts` + `order-service.spec.ts`

**Files without logic (no spec required):**
- ✅ `constants.js` - Only contains constants
- ✅ `types.ts` - Only contains type definitions

## Invalid Examples

Files in the `invalid/` directory demonstrate violations where files are missing their corresponding spec files.

**JavaScript:**
- ❌ `product-repository.js` (missing `product-repository.spec.js`)

**TypeScript:**
- ❌ `payment-gateway.ts` (missing `payment-gateway.spec.ts`)

## Excluded Files

These patterns are excluded by default and don't require spec files:
- `**/*.spec.js` / `**/*.spec.ts` - Test files themselves
- `**/*.test.js` / `**/*.test.ts` - Alternative test files
- `**/index.js` / `**/index.ts` - Index/barrel files
- `**/*.d.ts` - TypeScript declaration files
