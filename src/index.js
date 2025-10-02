import requireSpecFile from './rules/require-spec-file.js';
import requireIndexFile from './rules/require-index-file.js';

const plugin = {
  rules: {
    'require-spec-file': requireSpecFile,
    'require-index-file': requireIndexFile,
  },
  configs: {
    recommended: {
      plugins: ['ddd'],
      rules: {
        'ddd/require-spec-file': 'error',
        'ddd/require-index-file': 'error',
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
      },
    },
  },
};

export default plugin;
