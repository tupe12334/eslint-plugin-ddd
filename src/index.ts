import requireSpecFile from './rules/require-spec-file';

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
            '**/*.spec.ts',
            '**/*.test.ts',
            '**/*.d.ts',
          ],
        }],
      },
    },
  },
};

export = plugin;
