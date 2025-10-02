# eslint-plugin-ddd

ESLint plugin to enforce Domain-Driven Design (DDD) principles in your JavaScript projects.

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

Enforces that every `.js` file has a corresponding `.spec.js` file in the same directory.

**Rule Details**

This rule ensures test coverage by requiring spec files alongside implementation files, promoting test-driven development and maintaining test organization.

**Examples of incorrect code:**

```javascript
// src/user-service.js exists
// but src/user-service.spec.js does NOT exist
// ❌ ESLint will report an error
```

**Examples of correct code:**

```javascript
// src/user-service.js exists
// AND src/user-service.spec.js exists
// ✅ No error
```

**Options**

This rule accepts an options object with the following properties:

- `excludePatterns` (array of strings): Glob patterns to exclude from the spec file requirement

**Default exclude patterns:**
- `**/*.spec.js` - Spec files themselves
- `**/*.test.js` - Test files
- `**/index.js` - Index files

**Example configuration:**

```json
{
  "rules": {
    "ddd/require-spec-file": ["error", {
      "excludePatterns": [
        "**/*.spec.js",
        "**/*.test.js",
        "**/config/**",
        "**/*.config.js"
      ]
    }]
  }
}
```

## Development

```bash
# Install dependencies
pnpm install

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Lint the code
pnpm lint
```

## License

MIT
