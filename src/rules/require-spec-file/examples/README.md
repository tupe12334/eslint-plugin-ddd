# Examples for `require-spec-file` Rule

## Valid Examples

Files in the `valid/` directory demonstrate correct usage where each `.ts` file has a corresponding `.spec.ts` file next to it.

- ✅ `user-service.ts` + `user-service.spec.ts`

## Invalid Examples

Files in the `invalid/` directory demonstrate violations where `.ts` files are missing their corresponding `.spec.ts` files.

- ❌ `product-repository.ts` (missing `product-repository.spec.ts`)

## Excluded Files

These patterns are excluded by default and don't require spec files:
- `**/*.spec.ts` - Test files themselves
- `**/*.test.ts` - Alternative test files
- `**/index.ts` - Index/barrel files
- `**/*.d.ts` - TypeScript declaration files
- `**/types.ts` - Type definition files
