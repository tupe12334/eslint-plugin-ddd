/* eslint-disable max-lines */
/* eslint-disable max-lines-per-function */
import { existsSync } from 'fs';
import { parse as parsePath, join as joinPath } from 'path';

// Helper to check if a node contains logic
const hasLogicInNode = (node) => {
  if (!node) return false;

  // Functions with bodies are logic
  if (
    (node.type === 'FunctionDeclaration' ||
     node.type === 'FunctionExpression' ||
     node.type === 'ArrowFunctionExpression') &&
    node.body
  ) {
    // Simple arrow function expressions might not be logic
    if (node.type === 'ArrowFunctionExpression' && node.body.type !== 'BlockStatement') {
      const bodyType = node.body.type;
      return bodyType !== 'Literal' && bodyType !== 'Identifier' &&
             bodyType !== 'ObjectExpression' && bodyType !== 'ArrayExpression';
    }
    return true;
  }

  // Classes with methods are logic
  if (node.type === 'ClassDeclaration' || node.type === 'ClassExpression') {
    return node.body.body.some(
      (member) => member.type === 'MethodDefinition' && member.value && member.value.body
    );
  }

  return false;
};

const rule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Require a spec file to exist alongside each JS/TS file with logic, and ensure spec files have corresponding implementation files',
      category: 'Best Practices',
      recommended: true,
      url: '',
    },
    messages: {
      missingSpecFile: 'Missing spec file: "{{specFile}}" should exist alongside this file.',
      missingImplementationFile: 'Spec file "{{specFile}}" has no corresponding implementation file "{{implFile}}".',
      indexSpecNotAllowed: 'Spec files cannot be named "index.spec.*". Spec files must match their implementation file names.',
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
      '**/*.spec.ts',
      '**/*.test.js',
      '**/*.test.ts',
      '**/index.js',
      '**/index.ts',
      '**/*.d.ts',
    ];

    let hasLogic = false;

    return {
      FunctionDeclaration(node) {
        if (hasLogicInNode(node)) hasLogic = true;
      },
      FunctionExpression(node) {
        if (hasLogicInNode(node)) hasLogic = true;
      },
      ArrowFunctionExpression(node) {
        if (hasLogicInNode(node)) hasLogic = true;
      },
      ClassDeclaration(node) {
        if (hasLogicInNode(node)) hasLogic = true;
      },
      ClassExpression(node) {
        if (hasLogicInNode(node)) hasLogic = true;
      },

      'Program:exit'(node) {
        const filename = context.getFilename ? context.getFilename() : context.filename;

        // Check if this is a spec file
        const isSpecFile =
          filename.includes('.spec.js') ||
          filename.includes('.spec.ts') ||
          filename.includes('.test.js') ||
          filename.includes('.test.ts');

        if (isSpecFile) {
          // Validate spec file
          const parsed = parsePath(filename);

          // Disallow index.spec.* files
          if (parsed.name === 'index.spec' || parsed.name === 'index.test') {
            context.report({
              node,
              messageId: 'indexSpecNotAllowed',
            });
            return;
          }

          // Determine the implementation file name
          let implFileName = null;
          let implFileExt = null;

          if (parsed.name.endsWith('.spec')) {
            implFileName = parsed.name.replace(/\.spec$/, '');
            implFileExt = parsed.ext; // .js or .ts
          } else if (parsed.name.endsWith('.test')) {
            implFileName = parsed.name.replace(/\.test$/, '');
            implFileExt = parsed.ext; // .js or .ts
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

          return;
        }

        // Not a spec file - check if implementation needs a spec file
        // Determine file extension
        let fileExtension = null;
        if (filename.endsWith('.js')) {
          fileExtension = '.js';
        } else if (filename.endsWith('.ts') && !filename.endsWith('.d.ts')) {
          fileExtension = '.ts';
        } else {
          // Skip files that are not .js or .ts (or are .d.ts)
          return;
        }

        // Check if file matches any exclude pattern using simple string matching
        const shouldExclude = excludePatterns.some((pattern) => {
          // Simple pattern matching for common cases
          if (pattern.includes('**/*.')) {
            // Handle patterns like **/*.spec.js
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

        // Skip files that don't contain logic
        if (!hasLogic) {
          return;
        }

        // Determine expected spec file path based on file extension
        const parsed = parsePath(filename);
        const specFileName = `${parsed.name}.spec${fileExtension}`;
        const specFilePath = joinPath(parsed.dir, specFileName);

        // Check if spec file exists
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
