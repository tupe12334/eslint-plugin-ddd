/* eslint-disable max-lines */
/* eslint-disable max-lines-per-function */
import { readdirSync, existsSync, statSync } from 'fs';
import { parse as parsePath, join as joinPath, dirname } from 'path';

const rule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Require an index file in directories with multiple files',
      category: 'Best Practices',
      recommended: true,
      url: '',
    },
    messages: {
      missingIndexFile:
        'Directory "{{directory}}" contains multiple files but is missing an index file (index.js or index.ts).',
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
            description: 'Array of glob patterns to exclude from index file requirement',
          },
          minFiles: {
            type: 'number',
            description: 'Minimum number of files required before index is needed (default: 2)',
            minimum: 1,
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context) {
    const options = context.options[0] || {};
    const excludePatterns = options.excludePatterns || [
      '**/examples/**',
      '**/test/**',
      '**/tests/**',
      '**/__tests__/**',
    ];
    const minFiles = options.minFiles || 2;

    // Track which directories we've already reported to avoid duplicate errors
    const reportedDirs = new Set();

    return {
      'Program:exit'(node) {
        const filename = context.getFilename ? context.getFilename() : context.filename;

        // Skip if this is an index file itself
        const parsed = parsePath(filename);
        if (parsed.name === 'index') {
          return;
        }

        // Skip spec/test files
        if (
          parsed.name.endsWith('.spec') ||
          parsed.name.endsWith('.test') ||
          parsed.name.includes('.spec.') ||
          parsed.name.includes('.test.')
        ) {
          return;
        }

        // Check exclude patterns
        const shouldExclude = excludePatterns.some((pattern) => {
          if (pattern.includes('**/')) {
            const suffix = pattern.replace('**/', '');
            return filename.includes(`/${suffix}`) || filename.includes(`\\${suffix}`);
          }
          return filename.includes(pattern);
        });

        if (shouldExclude) {
          return;
        }

        const dir = dirname(filename);

        // Skip if we've already reported this directory
        if (reportedDirs.has(dir)) {
          return;
        }

        // Check if directory exists and read its contents
        // eslint-disable-next-line security/detect-non-literal-fs-filename
        if (!existsSync(dir)) {
          return;
        }

        let files;
        try {
          // eslint-disable-next-line security/detect-non-literal-fs-filename
          files = readdirSync(dir);
        } catch {
          return;
        }

        // Filter to only implementation files (not spec, test, or index files)
        const implementationFiles = files.filter((file) => {
          const filePath = joinPath(dir, file);
          // eslint-disable-next-line security/detect-non-literal-fs-filename
          const isFile = statSync(filePath).isFile();
          if (!isFile) return false;

          const isJsOrTs = file.endsWith('.js') || file.endsWith('.ts');
          const isIndex = file === 'index.js' || file === 'index.ts';
          const isSpec = file.includes('.spec.') || file.includes('.test.');
          const isDts = file.endsWith('.d.ts');

          return isJsOrTs && !isIndex && !isSpec && !isDts;
        });

        // Check if we have enough files to require an index
        if (implementationFiles.length < minFiles) {
          return;
        }

        // Check if index file exists
        const indexJs = joinPath(dir, 'index.js');
        const indexTs = joinPath(dir, 'index.ts');

        // eslint-disable-next-line security/detect-non-literal-fs-filename
        const hasIndexJs = existsSync(indexJs);
        // eslint-disable-next-line security/detect-non-literal-fs-filename
        const hasIndexTs = existsSync(indexTs);

        if (!hasIndexJs && !hasIndexTs) {
          reportedDirs.add(dir);
          context.report({
            node,
            messageId: 'missingIndexFile',
            data: {
              directory: parsePath(dir).base || dir,
            },
          });
        }
      },
    };
  },
};

export default rule;
