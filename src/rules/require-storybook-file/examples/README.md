# require-storybook-file Examples

## Valid Examples

**JSX component with Storybook file:**
- ✅ `valid/Button.jsx` + `valid/Button.stories.jsx`

**TSX component with Storybook file:**
- ✅ `valid/Card.tsx` + `valid/Card.stories.tsx`

## Invalid Examples

**JSX component without Storybook file:**
- ❌ `invalid/Alert.jsx` - Missing `Alert.stories.jsx`

**TSX component without Storybook file:**
- ❌ `invalid/Modal.tsx` - Missing `Modal.stories.tsx`

## Rule Behavior

The rule requires a Storybook file when:
- File has `.jsx` or `.tsx` extension
- File is not excluded via `excludePatterns`

Default excluded patterns:
- `**/*.stories.jsx` - Storybook files themselves
- `**/*.stories.tsx` - Storybook files themselves
- `**/*.stories.js` - Storybook files
- `**/*.stories.ts` - Storybook files
- `**/index.jsx` - Index files
- `**/index.tsx` - Index files
- `**/*.spec.jsx` - Spec files
- `**/*.spec.tsx` - Spec files
- `**/*.test.jsx` - Test files
- `**/*.test.tsx` - Test files

The expected Storybook file will match the component's extension:
- `.jsx` files require `.stories.jsx` files
- `.tsx` files require `.stories.tsx` files
