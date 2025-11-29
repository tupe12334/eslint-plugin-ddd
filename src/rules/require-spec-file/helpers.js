/* eslint-disable single-export/single-export */
/* eslint-disable security/detect-non-literal-fs-filename */
/* eslint-disable max-lines */
import { existsSync } from 'fs';
import { parse as parsePath, join as joinPath } from 'path';

const FUNC_TYPES = [
  'FunctionDeclaration',
  'FunctionExpression',
  'ArrowFunctionExpression',
];
const SIMPLE_BODIES = [
  'Literal',
  'Identifier',
  'ObjectExpression',
  'ArrayExpression',
];

export const hasLogicInNode = node => {
  if (!node) return false;
  if (FUNC_TYPES.includes(node.type) && node.body) {
    if (
      node.type === 'ArrowFunctionExpression' &&
      node.body.type !== 'BlockStatement'
    ) {
      return !SIMPLE_BODIES.includes(node.body.type);
    }
    return true;
  }
  if (node.type === 'ClassDeclaration' || node.type === 'ClassExpression') {
    return node.body.body.some(
      m => m.type === 'MethodDefinition' && m.value && m.value.body
    );
  }
  return false;
};

export const isSpecFile = filename =>
  ['.spec.js', '.spec.ts', '.test.js', '.test.ts'].some(ext =>
    filename.includes(ext)
  );

const checkSinglePattern = (filename, pattern) => {
  if (pattern.startsWith('**/') && pattern.endsWith('/**')) {
    return filename.includes(`/${pattern.slice(3, -3)}/`);
  }
  if (pattern.includes('**/')) {
    const suffix = pattern.replace('**/', '');
    if (suffix.startsWith('*')) return filename.endsWith(suffix.slice(1));
    if (suffix.includes('*')) {
      const basename = filename.split('/').pop();
      return suffix.split('*').every(part => basename.includes(part));
    }
    return filename.endsWith(`/${suffix}`);
  }
  return filename.includes(pattern);
};

export const checkExcludePatterns = (filename, excludePatterns) => {
  const normalized = filename.replace(/\\/g, '/');
  return excludePatterns.some(pattern => {
    const braceMatch = pattern.match(/\{([^}]+)\}/);
    if (braceMatch) {
      return braceMatch[1]
        .split(',')
        .some(alt =>
          checkSinglePattern(normalized, pattern.replace(/\{[^}]+\}/, alt))
        );
    }
    return checkSinglePattern(normalized, pattern);
  });
};

export const validateSpecFile = (context, node, filename) => {
  const parsed = parsePath(filename);
  if (parsed.name === 'index.spec' || parsed.name === 'index.test') {
    return context.report({ node, messageId: 'indexSpecNotAllowed' });
  }
  const isSpec = parsed.name.endsWith('.spec');
  if (!isSpec && !parsed.name.endsWith('.test')) return;
  const implFileName = parsed.name.slice(0, -5);
  const implFilePath = joinPath(parsed.dir, `${implFileName}${parsed.ext}`);
  if (!existsSync(implFilePath)) {
    context.report({
      node,
      messageId: 'missingImplementationFile',
      data: {
        specFile: `${parsed.name}${parsed.ext}`,
        implFile: `${implFileName}${parsed.ext}`,
      },
    });
  }
};

export const validateImplementationFile = (
  context,
  node,
  filename,
  hasLogic,
  excludePatterns
) => {
  const ext = filename.endsWith('.js')
    ? '.js'
    : filename.endsWith('.ts') && !filename.endsWith('.d.ts')
      ? '.ts'
      : null;
  if (!ext || checkExcludePatterns(filename, excludePatterns) || !hasLogic)
    return;
  const parsed = parsePath(filename);
  const specFileName = `${parsed.name}.spec${ext}`;
  if (!existsSync(joinPath(parsed.dir, specFileName))) {
    context.report({
      node,
      messageId: 'missingSpecFile',
      data: { specFile: specFileName },
    });
  }
};
