import requireSpecFile from './rules/require-spec-file.js';

const plugin = {
  rules: {
    'require-spec-file': requireSpecFile,
  },
  configs: {
    recommended: {
      plugins: ['ddd'],
      rules: {
        'ddd/require-spec-file': 'error',
      },
    },
    strict: {
      plugins: ['ddd'],
      rules: {
        'ddd/require-spec-file': ['error', {
          excludePatterns: [
            '**/*.spec.js',
            '**/*.test.js',
          ],
        }],
      },
    },
  },
};

export default plugin;
