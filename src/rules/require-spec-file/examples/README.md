# Examples for `require-spec-file` Rule

## Valid Examples

Files in the `valid/` directory demonstrate correct usage where each `.js` file has a corresponding `.spec.js` file next to it.

- ✅ `user-service.js` + `user-service.spec.js`

## Invalid Examples

Files in the `invalid/` directory demonstrate violations where `.js` files are missing their corresponding `.spec.js` files.

- ❌ `product-repository.js` (missing `product-repository.spec.js`)

## Excluded Files

These patterns are excluded by default and don't require spec files:
- `**/*.spec.js` - Test files themselves
- `**/*.test.js` - Alternative test files
- `**/index.js` - Index/barrel files
