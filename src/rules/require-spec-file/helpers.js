/* eslint-disable single-export/single-export */
/* eslint-disable security/detect-non-literal-fs-filename */
import { existsSync } from 'fs';
import { parse as parsePath, join as joinPath } from 'path';

export const hasLogicInNode = (node) => {
  if (!node) return false;

  if (
    (node.type === 'FunctionDeclaration' ||
     node.type === 'FunctionExpression' ||
     node.type === 'ArrowFunctionExpression') &&
    node.body
  ) {
    if (node.type === 'ArrowFunctionExpression' && node.body.type !== 'BlockStatement') {
      const bodyType = node.body.type;
      return bodyType !== 'Literal' && bodyType !== 'Identifier' &&
             bodyType !== 'ObjectExpression' && bodyType !== 'ArrayExpression';
    }
    return true;
  }

  if (node.type === 'ClassDeclaration' || node.type === 'ClassExpression') {
    return node.body.body.some(
      (member) => member.type === 'MethodDefinition' && member.value && member.value.body
    );
  }

  return false;
};

export const isSpecFile = (filename) => {
  return filename.includes('.spec.js') ||
    filename.includes('.spec.ts') ||
    filename.includes('.test.js') ||
    filename.includes('.test.ts');
};

export const checkExcludePatterns = (filename, excludePatterns) => {
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

export const validateSpecFile = (context, node, filename) => {
  const parsed = parsePath(filename);

  if (parsed.name === 'index.spec' || parsed.name === 'index.test') {
    context.report({ node, messageId: 'indexSpecNotAllowed' });
    return;
  }

  let implFileName = null;
  let implFileExt = null;

  if (parsed.name.endsWith('.spec')) {
    implFileName = parsed.name.replace(/\.spec$/, '');
    implFileExt = parsed.ext;
  } else if (parsed.name.endsWith('.test')) {
    implFileName = parsed.name.replace(/\.test$/, '');
    implFileExt = parsed.ext;
  }

  if (implFileName && implFileExt) {
    const implFilePath = joinPath(parsed.dir, `${implFileName}${implFileExt}`);
    const implFileExists = existsSync(implFilePath);

    if (!implFileExists) {
      context.report({
        node,
        messageId: 'missingImplementationFile',
        data: {
          specFile: `${parsed.name}${parsed.ext}`,
          implFile: `${implFileName}${implFileExt}`,
        },
      });
    }
  }
};

export const validateImplementationFile = (context, node, filename, hasLogic, excludePatterns) => {
  let fileExtension = null;
  if (filename.endsWith('.js')) {
    fileExtension = '.js';
  } else if (filename.endsWith('.ts') && !filename.endsWith('.d.ts')) {
    fileExtension = '.ts';
  } else {
    return;
  }

  if (checkExcludePatterns(filename, excludePatterns)) {
    return;
  }

  if (!hasLogic) {
    return;
  }

  const parsed = parsePath(filename);
  const specFileName = `${parsed.name}.spec${fileExtension}`;
  const specFilePath = joinPath(parsed.dir, specFileName);
  const specFileExists = existsSync(specFilePath);

  if (!specFileExists) {
    context.report({
      node,
      messageId: 'missingSpecFile',
      data: { specFile: specFileName },
    });
  }
};
