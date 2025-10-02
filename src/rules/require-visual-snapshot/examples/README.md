# require-visual-snapshot Examples

## Valid Examples

**JSX component with complete visual snapshot setup:**
- ✅ `valid/Button.jsx` - Component file
- ✅ `valid/Button.spec.jsx` - Spec file
- ✅ `valid/Button.spec-snapshots/` - Snapshot folder
- ✅ `valid/Button.spec-snapshots/button-default.png` - PNG snapshot

**TSX component with complete visual snapshot setup:**
- ✅ `valid/Card.tsx` - Component file
- ✅ `valid/Card.spec.tsx` - Spec file
- ✅ `valid/Card.spec-snapshots/` - Snapshot folder
- ✅ `valid/Card.spec-snapshots/card-default.png` - PNG snapshot

## Invalid Examples

**Missing spec file:**
- ❌ `invalid/Alert.jsx` - Component without spec file

**Missing snapshot folder:**
- ❌ `invalid/Modal.jsx` - Component file
- ✅ `invalid/Modal.spec.jsx` - Spec file exists
- ❌ Missing `Modal.spec-snapshots/` folder

## Rule Behavior

The rule requires all three components for JSX/TSX files:
1. **Spec file**: `<filename>.spec.jsx` or `<filename>.spec.tsx` next to the component
2. **Snapshot folder**: `<filename>.spec-snapshots/` directory next to the component
3. **PNG files**: At least one `.png` file inside the snapshot folder

Default excluded patterns:
- `**/*.spec.jsx` - Spec files themselves
- `**/*.spec.tsx` - Spec files themselves
- `**/*.test.jsx` - Test files
- `**/*.test.tsx` - Test files
- `**/index.jsx` - Index files
- `**/index.tsx` - Index files

The snapshot folder name always follows the pattern: `<component-name>.spec-snapshots`

Examples:
- `Button.jsx` → `Button.spec.jsx` → `Button.spec-snapshots/`
- `Card.tsx` → `Card.spec.tsx` → `Card.spec-snapshots/`
