import * as fs from 'fs';
import * as path from 'path';
import { RuleModule } from '../types';

const rule: RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Require a .spec.ts file to exist alongside each .ts file',
      category: 'Best Practices',
      recommended: true,
      url: 'https://github.com/tupe12334/eslint-plugin-ddd/blob/main/docs/rules/require-spec-file.md',
    },
    messages: {
      missingSpecFile: 'Missing spec file: "{{specFile}}" should exist alongside this file.',
    },
    schema: [
      {
        type: 'object',
        properties: {
          excludePatterns: {
            type: 'array',
            items: {
              type: 'string',
            },
            description: 'Array of glob patterns to exclude from spec file requirement',
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context) {
    const options = context.options[0] || {};
    const excludePatterns: string[] = options.excludePatterns || [
      '**/*.spec.ts',
      '**/*.test.ts',
      '**/index.ts',
      '**/*.d.ts',
      '**/types.ts',
    ];

    return {
      Program(node) {
        const filename = context.getFilename?.() || context.filename;

        // Skip if not a TypeScript file
        if (!filename.endsWith('.ts')) {
          return;
        }

        // Check if file matches any exclude pattern
        const shouldExclude = excludePatterns.some((pattern) => {
          const regex = new RegExp(
            pattern
              .replace(/\*\*/g, '.*')
              .replace(/\*/g, '[^/]*')
              .replace(/\?/g, '.')
          );
          return regex.test(filename);
        });

        if (shouldExclude) {
          return;
        }

        // Determine expected spec file path
        const parsedPath = path.parse(filename);
        const specFileName = `${parsedPath.name}.spec.ts`;
        const specFilePath = path.join(parsedPath.dir, specFileName);

        // Check if spec file exists
        if (!fs.existsSync(specFilePath)) {
          context.report({
            node,
            messageId: 'missingSpecFile',
            data: {
              specFile: specFileName,
            },
          });
        }
      },
    };
  },
};

export default rule;
