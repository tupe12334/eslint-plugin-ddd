/* eslint-disable security/detect-non-literal-fs-filename */
import { existsSync } from 'fs';
import { parse as parsePath, join as joinPath } from 'path';
import {
  checkExcludePatterns,
  checkSnapshotFolder,
  checkPngFiles,
} from './helpers.js';

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
            items: { type: 'string' },
            description:
              'Array of glob patterns to exclude from visual snapshot requirement',
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
        const filename = context.getFilename
          ? context.getFilename()
          : context.filename;

        let fileExtension = null;
        if (filename.endsWith('.jsx')) {
          fileExtension = '.jsx';
        } else if (filename.endsWith('.tsx')) {
          fileExtension = '.tsx';
        } else {
          return;
        }

        if (checkExcludePatterns(filename, excludePatterns)) {
          return;
        }

        const parsed = parsePath(filename);
        const specFileName = `${parsed.name}.spec${fileExtension}`;
        const specFilePath = joinPath(parsed.dir, specFileName);

        if (!existsSync(specFilePath)) {
          context.report({
            node,
            messageId: 'missingSpecFile',
            data: { specFile: specFileName },
          });
          return;
        }

        const snapshotFolderName = `${parsed.name}.spec-snapshots`;
        const snapshotFolderPath = joinPath(parsed.dir, snapshotFolderName);

        if (
          checkSnapshotFolder(
            context,
            node,
            snapshotFolderPath,
            snapshotFolderName
          )
        ) {
          checkPngFiles(context, node, snapshotFolderPath, snapshotFolderName);
        }
      },
    };
  },
};

export default rule;
