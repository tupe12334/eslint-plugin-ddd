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

const isIndexFile = (filename) => {
  return filename.endsWith('/index.js') ||
    filename.endsWith('/index.ts') ||
    filename.endsWith('/index.jsx') ||
    filename.endsWith('/index.tsx') ||
    filename.endsWith('\\index.js') ||
    filename.endsWith('\\index.ts') ||
    filename.endsWith('\\index.jsx') ||
    filename.endsWith('\\index.tsx');
};

const isReExport = (statement) => {
  return statement.type === 'ExportAllDeclaration' ||
    (statement.type === 'ExportNamedDeclaration' && statement.source) ||
    (statement.type === 'ExportNamedDeclaration' && statement.exportKind === 'type');
};

const checkStatement = (context, statement) => {
  if (isReExport(statement)) {
    return;
  }

  // Check for logic in export declarations
  if (statement.type === 'ExportNamedDeclaration' && statement.declaration) {
    if (hasLogicInNode(statement.declaration)) {
      context.report({
        node: statement,
        messageId: 'logicInIndexFile',
        data: { nodeType: statement.declaration.type },
      });
    }
    return;
  }

  // Check for logic in export default
  if (statement.type === 'ExportDefaultDeclaration') {
    if (hasLogicInNode(statement.declaration)) {
      context.report({
        node: statement,
        messageId: 'logicInIndexFile',
        data: { nodeType: statement.declaration.type },
      });
    }
    return;
  }

  // Check for function declarations
  if (statement.type === 'FunctionDeclaration' && hasLogicInNode(statement)) {
    context.report({
      node: statement,
      messageId: 'logicInIndexFile',
      data: { nodeType: 'FunctionDeclaration' },
    });
    return;
  }

  // Check for class declarations
  if (statement.type === 'ClassDeclaration' && hasLogicInNode(statement)) {
    context.report({
      node: statement,
      messageId: 'logicInIndexFile',
      data: { nodeType: 'ClassDeclaration' },
    });
    return;
  }

  // Check for variable declarations with logic
  if (statement.type === 'VariableDeclaration') {
    statement.declarations.forEach((declarator) => {
      if (declarator.init && hasLogicInNode(declarator.init)) {
        context.report({
          node: declarator,
          messageId: 'logicInIndexFile',
          data: { nodeType: declarator.init.type },
        });
      }
    });
  }
};

const rule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow logic in index files - index files should only contain re-exports',
      category: 'Best Practices',
      recommended: true,
      url: '',
    },
    messages: {
      logicInIndexFile:
        'Index files should only contain re-exports, not logic. Found {{nodeType}} with implementation.',
    },
    schema: [],
  },

  create(context) {
    return {
      Program(node) {
        const filename = context.getFilename ? context.getFilename() : context.filename;

        if (!isIndexFile(filename)) {
          return;
        }

        node.body.forEach((statement) => checkStatement(context, statement));
      },
    };
  },
};

export default rule;
