/* eslint-disable single-export/single-export */
export const hasLogicInNode = node => {
  if (!node) return false;

  if (
    (node.type === 'FunctionDeclaration' ||
      node.type === 'FunctionExpression' ||
      node.type === 'ArrowFunctionExpression') &&
    node.body
  ) {
    return true;
  }

  if (node.type === 'ClassDeclaration' || node.type === 'ClassExpression') {
    return node.body.body.some(
      member =>
        member.type === 'MethodDefinition' && member.value && member.value.body
    );
  }

  return false;
};

export const isIndexFile = filename => {
  return (
    filename.endsWith('/index.js') ||
    filename.endsWith('/index.ts') ||
    filename.endsWith('/index.jsx') ||
    filename.endsWith('/index.tsx') ||
    filename.endsWith('\\index.js') ||
    filename.endsWith('\\index.ts') ||
    filename.endsWith('\\index.jsx') ||
    filename.endsWith('\\index.tsx')
  );
};

export const isReExport = statement => {
  return (
    statement.type === 'ExportAllDeclaration' ||
    (statement.type === 'ExportNamedDeclaration' && statement.source) ||
    (statement.type === 'ExportNamedDeclaration' &&
      statement.exportKind === 'type')
  );
};

export const checkStatement = (context, statement) => {
  if (isReExport(statement)) {
    return;
  }

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

  if (statement.type === 'FunctionDeclaration' && hasLogicInNode(statement)) {
    context.report({
      node: statement,
      messageId: 'logicInIndexFile',
      data: { nodeType: 'FunctionDeclaration' },
    });
    return;
  }

  if (statement.type === 'ClassDeclaration' && hasLogicInNode(statement)) {
    context.report({
      node: statement,
      messageId: 'logicInIndexFile',
      data: { nodeType: 'ClassDeclaration' },
    });
    return;
  }

  if (statement.type === 'VariableDeclaration') {
    statement.declarations.forEach(declarator => {
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
