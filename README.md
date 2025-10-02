# eslint-plugin-ddd

ESLint plugin to enforce Domain-Driven Design (DDD) principles in your JavaScript and TypeScript projects.

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

Enforces that every `.js` or `.ts` file has a corresponding `.spec.js` or `.spec.ts` file in the same directory.

**Rule Details**

This rule ensures test coverage by requiring spec files alongside implementation files, promoting test-driven development and maintaining test organization. The rule automatically matches the file extension:
- `.js` files require `.spec.js` files
- `.ts` files require `.spec.ts` files

**Examples of incorrect code:**

```javascript
// src/user-service.js exists
// but src/user-service.spec.js does NOT exist
// ❌ ESLint will report an error
```

```typescript
// src/product-repository.ts exists
// but src/product-repository.spec.ts does NOT exist
// ❌ ESLint will report an error
```

**Examples of correct code:**

```javascript
// src/user-service.js exists
// AND src/user-service.spec.js exists
// ✅ No error
```

```typescript
// src/product-repository.ts exists
// AND src/product-repository.spec.ts exists
// ✅ No error
```

**Options**

This rule accepts an options object with the following properties:

- `excludePatterns` (array of strings): Glob patterns to exclude from the spec file requirement

**Default exclude patterns:**
- `**/*.spec.js` - JavaScript spec files
- `**/*.spec.ts` - TypeScript spec files
- `**/*.test.js` - JavaScript test files
- `**/*.test.ts` - TypeScript test files
- `**/index.js` - JavaScript index files
- `**/index.ts` - TypeScript index files
- `**/*.d.ts` - TypeScript declaration files

**Example configuration:**

```json
{
  "rules": {
    "ddd/require-spec-file": ["error", {
      "excludePatterns": [
        "**/*.spec.js",
        "**/*.spec.ts",
        "**/*.test.js",
        "**/*.test.ts",
        "**/config/**",
        "**/*.config.js",
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

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Lint the code
pnpm lint
```

## Releasing

This project uses [release-it](https://github.com/release-it/release-it) for automated releases.

### Setup

1. Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Add your tokens to the `.env` file:
   - `GITHUB_TOKEN`: GitHub Personal Access Token ([generate here](https://github.com/settings/tokens))
   - `NPM_TOKEN`: NPM Access Token ([generate here](https://www.npmjs.com/settings/tokens))

### Create a Release

```bash
pnpm release
```

This will:
- Run linting and tests
- Bump the version
- Create a git commit and tag
- Push to GitHub
- Create a GitHub release
- Publish to npm

## License

MIT
