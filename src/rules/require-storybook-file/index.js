import { existsSync } from 'fs';
import { parse as parsePath, join as joinPath } from 'path';

const rule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Require a Storybook file to exist alongside each JSX/TSX component file',
      category: 'Best Practices',
      recommended: true,
      url: '',
    },
    messages: {
      missingStorybookFile:
        'Missing Storybook file: "{{storybookFile}}" should exist alongside this component file.',
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
            description: 'Array of glob patterns to exclude from Storybook file requirement',
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context) {
    const options = context.options[0] || {};
    const excludePatterns = options.excludePatterns || [
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
    ];

    return {
      Program(node) {
        const filename = context.getFilename ? context.getFilename() : context.filename;

        // Determine file extension
        let fileExtension = null;
        if (filename.endsWith('.jsx')) {
          fileExtension = '.jsx';
        } else if (filename.endsWith('.tsx')) {
          fileExtension = '.tsx';
        } else {
          // Not a JSX/TSX file, skip
          return;
        }

        // Check exclude patterns
        const shouldExclude = excludePatterns.some((pattern) => {
          if (pattern.includes('**/*.')) {
            const extension = pattern.split('**/').pop().replace('*', '');
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

        // Determine expected Storybook file path
        const parsed = parsePath(filename);
        const storybookFileName = `${parsed.name}.stories${fileExtension}`;
        const storybookFilePath = joinPath(parsed.dir, storybookFileName);

        // Check if Storybook file exists
         
        const storybookFileExists = existsSync(storybookFilePath);

        if (!storybookFileExists) {
          context.report({
            node,
            messageId: 'missingStorybookFile',
            data: {
              storybookFile: storybookFileName,
            },
          });
        }
      },
    };
  },
};

export default rule;
