import { isIndexFile, checkStatement } from './helpers.js';

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
