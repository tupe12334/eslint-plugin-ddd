/* eslint-disable max-lines */
/* eslint-disable max-lines-per-function */
import { existsSync, readdirSync, statSync } from 'fs';
import { parse as parsePath, join as joinPath } from 'path';

const rule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Require JSX/TSX components to have a spec file and a visual snapshot folder with PNG files',
      category: 'Best Practices',
      recommended: true,
      url: '',
    },
    messages: {
      missingSpecFile:
        'Missing spec file: "{{specFile}}" should exist alongside this component file.',
      missingSnapshotFolder:
        'Missing snapshot folder: "{{snapshotFolder}}" should exist alongside this component file.',
      missingPngFiles:
        'Snapshot folder "{{snapshotFolder}}" exists but contains no PNG files. At least one PNG file is required.',
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
            description: 'Array of glob patterns to exclude from visual snapshot requirement',
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context) {
    const options = context.options[0] || {};
    const excludePatterns = options.excludePatterns || [
      '**/*.spec.jsx',
      '**/*.spec.tsx',
      '**/*.test.jsx',
      '**/*.test.tsx',
      '**/index.jsx',
      '**/index.tsx',
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

        const parsed = parsePath(filename);
        const specFileName = `${parsed.name}.spec${fileExtension}`;
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
          return;
        }

        // Determine snapshot folder name: <spec-file-name>-snapshots
        const snapshotFolderName = `${parsed.name}.spec-snapshots`;
        const snapshotFolderPath = joinPath(parsed.dir, snapshotFolderName);

        // Check if snapshot folder exists
        // eslint-disable-next-line security/detect-non-literal-fs-filename
        const snapshotFolderExists = existsSync(snapshotFolderPath);

        if (!snapshotFolderExists) {
          context.report({
            node,
            messageId: 'missingSnapshotFolder',
            data: {
              snapshotFolder: snapshotFolderName,
            },
          });
          return;
        }

        // Check if snapshot folder is actually a directory
        let isDirectory = false;
        try {
          // eslint-disable-next-line security/detect-non-literal-fs-filename
          isDirectory = statSync(snapshotFolderPath).isDirectory();
        } catch {
          context.report({
            node,
            messageId: 'missingSnapshotFolder',
            data: {
              snapshotFolder: snapshotFolderName,
            },
          });
          return;
        }

        if (!isDirectory) {
          context.report({
            node,
            messageId: 'missingSnapshotFolder',
            data: {
              snapshotFolder: snapshotFolderName,
            },
          });
          return;
        }

        // Check if folder contains at least one PNG file
        let files = [];
        try {
          // eslint-disable-next-line security/detect-non-literal-fs-filename
          files = readdirSync(snapshotFolderPath);
        } catch {
          context.report({
            node,
            messageId: 'missingPngFiles',
            data: {
              snapshotFolder: snapshotFolderName,
            },
          });
          return;
        }

        const pngFiles = files.filter((file) => file.toLowerCase().endsWith('.png'));

        if (pngFiles.length === 0) {
          context.report({
            node,
            messageId: 'missingPngFiles',
            data: {
              snapshotFolder: snapshotFolderName,
            },
          });
        }
      },
    };
  },
};

export default rule;
