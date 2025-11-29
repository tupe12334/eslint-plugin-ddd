import {
  hasLogicInNode,
  isSpecFile,
  validateSpecFile,
  validateImplementationFile,
} from './helpers.js';

const rule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Require spec file alongside JS/TS files with logic; ensure specs match implementations',
      category: 'Best Practices',
      recommended: true,
      url: '',
    },
    messages: {
      missingSpecFile:
        'Missing spec file: "{{specFile}}" should exist alongside this file.',
      missingImplementationFile:
        'Spec file "{{specFile}}" has no corresponding implementation file "{{implFile}}".',
      indexSpecNotAllowed:
        'Spec files cannot be named "index.spec.*". Spec files must match their implementation file names.',
    },
    schema: [
      {
        type: 'object',
        properties: {
          excludePatterns: {
            type: 'array',
            items: { type: 'string' },
            description:
              'Array of glob patterns to exclude from spec file requirement',
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
        const filename = context.getFilename
          ? context.getFilename()
          : context.filename;

        if (isSpecFile(filename)) {
          validateSpecFile(context, node, filename);
        } else {
          validateImplementationFile(
            context,
            node,
            filename,
            hasLogic,
            excludePatterns
          );
        }
      },
    };
  },
};

export default rule;
