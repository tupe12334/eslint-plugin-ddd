## require-spec-file Examples

## Valid Examples

**Files with logic and matching spec files:**
- ✅ `valid/user-service.js` + `valid/user-service.spec.js` - Implementation with spec
- ✅ `valid/order-service.ts` + `valid/order-service.spec.ts` - TypeScript implementation with spec

**Files without logic (no spec required):**
- ✅ `valid/constants.js` - Only contains constants
- ✅ `valid/types.ts` - Only contains type definitions

## Invalid Examples

**Implementation files without spec files:**
- ❌ `invalid/product-repository.js` - Missing `product-repository.spec.js`
- ❌ `invalid/payment-gateway.ts` - Missing `payment-gateway.spec.ts`

**Spec files without implementation files:**
- ❌ `invalid/orphan-spec.spec.js` - Missing `orphan-spec.js`

**Invalid spec file names:**
- ❌ `invalid/index.spec.js` - Spec files cannot be named `index.spec.*`

## Rule Behavior

### For Implementation Files:
Files with logic (functions, classes with methods) require a matching spec file:
- `user.js` → requires `user.spec.js`
- `product.ts` → requires `product.spec.ts`

Files without logic (only constants, types) don't require spec files.

### For Spec Files:
Spec files must have a corresponding implementation file with the same base name:
- `user.spec.js` → requires `user.js`
- `product.spec.ts` → requires `product.ts`

**Forbidden**: Spec files cannot be named `index.spec.*` or `index.test.*` because they don't follow the naming convention of matching an implementation file.

### Why This Matters:
- **Bidirectional validation**: Ensures specs and implementations stay in sync
- **Clear naming**: Each spec file clearly maps to its implementation
- **No orphaned specs**: Prevents spec files without corresponding code
- **No index specs**: Index files are for re-exports, not logic requiring tests
