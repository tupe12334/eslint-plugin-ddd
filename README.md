# eslint-plugin-ddd

ESLint plugin to enforce Domain-Driven Design (DDD) principles in your TypeScript projects.

## Installation

```bash
pnpm add -D eslint-plugin-ddd
```

## Usage

Add `ddd` to the plugins section of your `.eslintrc` configuration file:

```json
{
  "plugins": ["ddd"]
}
```

Then configure the rules you want to use:

```json
{
  "rules": {
    "ddd/require-spec-file": "error"
  }
}
```

### Using Recommended Config

Alternatively, you can use the recommended configuration:

```json
{
  "extends": ["plugin:ddd/recommended"]
}
```

Or the strict configuration:

```json
{
  "extends": ["plugin:ddd/strict"]
}
```

## Rules

### `require-spec-file`

Enforces that every `.ts` file has a corresponding `.spec.ts` file in the same directory.

**Rule Details**

This rule ensures test coverage by requiring spec files alongside implementation files, promoting test-driven development and maintaining test organization.

**Examples of incorrect code:**

```typescript
// src/user-service.ts exists
// but src/user-service.spec.ts does NOT exist
// ❌ ESLint will report an error
```

**Examples of correct code:**

```typescript
// src/user-service.ts exists
// AND src/user-service.spec.ts exists
// ✅ No error
```

**Options**

This rule accepts an options object with the following properties:

- `excludePatterns` (array of strings): Glob patterns to exclude from the spec file requirement

**Default exclude patterns:**
- `**/*.spec.ts` - Spec files themselves
- `**/*.test.ts` - Test files
- `**/index.ts` - Index files
- `**/*.d.ts` - Type definition files
- `**/types.ts` - Types files

**Example configuration:**

```json
{
  "rules": {
    "ddd/require-spec-file": ["error", {
      "excludePatterns": [
        "**/*.spec.ts",
        "**/*.test.ts",
        "**/config/**",
        "**/*.config.ts"
      ]
    }]
  }
}
```

## Development

```bash
# Install dependencies
pnpm install

# Build the plugin
pnpm build

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch
```

## License

MIT
