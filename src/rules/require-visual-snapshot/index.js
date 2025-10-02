import { existsSync, readdirSync, statSync } from 'fs';
import { parse as parsePath, join as joinPath } from 'path';

const checkExcludePatterns = (filename, excludePatterns) => {
  return excludePatterns.some((pattern) => {
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
};

const checkSnapshotFolder = (context, node, snapshotFolderPath, snapshotFolderName) => {
  const snapshotFolderExists = existsSync(snapshotFolderPath);

  if (!snapshotFolderExists) {
    context.report({
      node,
      messageId: 'missingSnapshotFolder',
      data: { snapshotFolder: snapshotFolderName },
    });
    return false;
  }

  let isDirectory = false;
  try {
    isDirectory = statSync(snapshotFolderPath).isDirectory();
  } catch {
    context.report({
      node,
      messageId: 'missingSnapshotFolder',
      data: { snapshotFolder: snapshotFolderName },
    });
    return false;
  }

  if (!isDirectory) {
    context.report({
      node,
      messageId: 'missingSnapshotFolder',
      data: { snapshotFolder: snapshotFolderName },
    });
    return false;
  }

  return true;
};

const checkPngFiles = (context, node, snapshotFolderPath, snapshotFolderName) => {
  let files = [];
  try {
    files = readdirSync(snapshotFolderPath);
  } catch {
    context.report({
      node,
      messageId: 'missingPngFiles',
      data: { snapshotFolder: snapshotFolderName },
    });
    return;
  }

  const pngFiles = files.filter((file) => file.toLowerCase().endsWith('.png'));

  if (pngFiles.length === 0) {
    context.report({
      node,
      messageId: 'missingPngFiles',
      data: { snapshotFolder: snapshotFolderName },
    });
  }
};

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
      '**/*.spec.jsx', '**/*.spec.tsx', '**/*.test.jsx', '**/*.test.tsx',
      '**/index.jsx', '**/index.tsx',
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
          return;
        }

        // Check exclude patterns
        if (checkExcludePatterns(filename, excludePatterns)) {
          return;
        }

        const parsed = parsePath(filename);
        const specFileName = `${parsed.name}.spec${fileExtension}`;
        const specFilePath = joinPath(parsed.dir, specFileName);

        // Check if spec file exists
        if (!existsSync(specFilePath)) {
          context.report({
            node,
            messageId: 'missingSpecFile',
            data: { specFile: specFileName },
          });
          return;
        }

        // Check snapshot folder and PNG files
        const snapshotFolderName = `${parsed.name}.spec-snapshots`;
        const snapshotFolderPath = joinPath(parsed.dir, snapshotFolderName);

        if (checkSnapshotFolder(context, node, snapshotFolderPath, snapshotFolderName)) {
          checkPngFiles(context, node, snapshotFolderPath, snapshotFolderName);
        }
      },
    };
  },
};

export default rule;
