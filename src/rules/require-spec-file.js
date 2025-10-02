import { existsSync } from 'fs';
import { parse as parsePath, join as joinPath } from 'path';

const rule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Require a .spec.js file to exist alongside each .js file',
      category: 'Best Practices',
      recommended: true,
      url: '',
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
    const excludePatterns = options.excludePatterns || [
      '**/*.spec.js',
      '**/*.test.js',
      '**/index.js',
    ];

    return {
      Program(node) {
        const filename = context.getFilename ? context.getFilename() : context.filename;

        // Skip if not a JavaScript file
        if (!filename.endsWith('.js')) {
          return;
        }

        // Check if file matches any exclude pattern using simple string matching
        const shouldExclude = excludePatterns.some((pattern) => {
          // Simple pattern matching for common cases
          if (pattern.includes('**/*.')) {
            const extension = pattern.split('**/').pop();
            return filename.endsWith(extension || '');
          }
          if (pattern.includes('**/')) {
            const suffix = pattern.replace('**/', '');
            return filename.endsWith(`/${suffix}`) || filename.endsWith(`\\${suffix}`);
          }
          return filename.includes(pattern);
        });

        if (shouldExclude) {
          return;
        }

        // Determine expected spec file path
        const parsed = parsePath(filename);
        const specFileName = `${parsed.name}.spec.js`;
        const specFilePath = joinPath(parsed.dir, specFileName);

        // Check if spec file exists
        // eslint-disable-next-line security/detect-non-literal-fs-filename
        const specFileExists = existsSync(specFilePath);

        if (!specFileExists) {
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
