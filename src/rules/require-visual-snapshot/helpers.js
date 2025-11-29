/* eslint-disable single-export/single-export */
/* eslint-disable security/detect-non-literal-fs-filename */
import { existsSync, readdirSync, statSync } from 'fs';

export const checkExcludePatterns = (filename, excludePatterns) => {
  return excludePatterns.some(pattern => {
    if (pattern.includes('**/*.')) {
      const extension = pattern.split('**/').pop().replace('*', '');
      return filename.endsWith(extension || '');
    }
    if (pattern.includes('**/')) {
      const suffix = pattern.replace('**/', '');
      return (
        filename.endsWith(`/${suffix}`) || filename.endsWith(`\\${suffix}`)
      );
    }
    return filename.includes(pattern);
  });
};

export const checkSnapshotFolder = (
  context,
  node,
  snapshotFolderPath,
  snapshotFolderName
) => {
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

export const checkPngFiles = (
  context,
  node,
  snapshotFolderPath,
  snapshotFolderName
) => {
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

  const pngFiles = files.filter(file => file.toLowerCase().endsWith('.png'));

  if (pngFiles.length === 0) {
    context.report({
      node,
      messageId: 'missingPngFiles',
      data: { snapshotFolder: snapshotFolderName },
    });
  }
};
