import requireSpecFile from './rules/require-spec-file/index.js';
import requireIndexFile from './rules/require-index-file/index.js';
import requireStorybookFile from './rules/require-storybook-file/index.js';
import requireVisualSnapshot from './rules/require-visual-snapshot/index.js';

const plugin = {
  rules: {
    'require-spec-file': requireSpecFile,
    'require-index-file': requireIndexFile,
    'require-storybook-file': requireStorybookFile,
    'require-visual-snapshot': requireVisualSnapshot,
  },
  configs: {
    recommended: {
      plugins: ['ddd'],
      rules: {
        'ddd/require-spec-file': 'error',
        'ddd/require-index-file': 'error',
        'ddd/require-storybook-file': 'error',
        'ddd/require-visual-snapshot': 'error',
      },
    },
    strict: {
      plugins: ['ddd'],
      rules: {
        'ddd/require-spec-file': ['error', {
          excludePatterns: [
            '**/*.spec.js',
            '**/*.spec.ts',
            '**/*.test.js',
            '**/*.test.ts',
            '**/*.d.ts',
          ],
        }],
        'ddd/require-index-file': ['error', {
          excludePatterns: [
            '**/examples/**',
            '**/test/**',
            '**/tests/**',
            '**/__tests__/**',
          ],
          minFiles: 2,
        }],
        'ddd/require-storybook-file': ['error', {
          excludePatterns: [
            '**/*.stories.jsx',
            '**/*.stories.tsx',
            '**/*.stories.js',
            '**/*.stories.ts',
            '**/index.jsx',
            '**/index.tsx',
            '**/*.spec.jsx',
            '**/*.spec.tsx',
            '**/*.test.jsx',
            '**/*.test.tsx',
          ],
        }],
        'ddd/require-visual-snapshot': ['error', {
          excludePatterns: [
            '**/*.spec.jsx',
            '**/*.spec.tsx',
            '**/*.test.jsx',
            '**/*.test.tsx',
            '**/index.jsx',
            '**/index.tsx',
          ],
        }],
      },
    },
  },
};

export default plugin;
