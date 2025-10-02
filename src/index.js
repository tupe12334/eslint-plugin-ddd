import requireSpecFile from './rules/require-spec-file.js';
import requireIndexFile from './rules/require-index-file.js';
import requireStorybookFile from './rules/require-storybook-file.js';

const plugin = {
  rules: {
    'require-spec-file': requireSpecFile,
    'require-index-file': requireIndexFile,
    'require-storybook-file': requireStorybookFile,
  },
  configs: {
    recommended: {
      plugins: ['ddd'],
      rules: {
        'ddd/require-spec-file': 'error',
        'ddd/require-index-file': 'error',
        'ddd/require-storybook-file': 'error',
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
      },
    },
  },
};

export default plugin;
