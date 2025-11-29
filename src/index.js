import requireSpecFile from './rules/require-spec-file/require-spec-file.js';
import requireStorybookFile from './rules/require-storybook-file/require-storybook-file.js';
import requireVisualSnapshot from './rules/require-visual-snapshot/require-visual-snapshot.js';
import noLogicInIndex from './rules/no-logic-in-index/no-logic-in-index.js';

const plugin = {
  rules: {
    'require-spec-file': requireSpecFile,
    'require-storybook-file': requireStorybookFile,
    'require-visual-snapshot': requireVisualSnapshot,
    'no-logic-in-index': noLogicInIndex,
  },
  configs: {
    recommended: {
      plugins: ['ddd'],
      rules: {
        'ddd/require-spec-file': 'error',
        'ddd/require-storybook-file': 'error',
        'ddd/require-visual-snapshot': 'error',
        'ddd/no-logic-in-index': 'error',
      },
    },
    strict: {
      plugins: ['ddd'],
      rules: {
        'ddd/require-spec-file': [
          'error',
          {
            excludePatterns: [
              '**/*.spec.js',
              '**/*.spec.ts',
              '**/*.test.js',
              '**/*.test.ts',
              '**/*.d.ts',
            ],
          },
        ],
        'ddd/require-storybook-file': [
          'error',
          {
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
          },
        ],
        'ddd/require-visual-snapshot': [
          'error',
          {
            excludePatterns: [
              '**/*.spec.jsx',
              '**/*.spec.tsx',
              '**/*.test.jsx',
              '**/*.test.tsx',
              '**/index.jsx',
              '**/index.tsx',
            ],
          },
        ],
        'ddd/no-logic-in-index': 'error',
      },
    },
  },
};

export default plugin;
