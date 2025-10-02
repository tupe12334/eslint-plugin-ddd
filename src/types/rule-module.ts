import { Rule } from 'eslint';
import { RuleContext } from './rule-context.js';

export interface RuleModule extends Rule.RuleModule {
  meta: {
    type: 'problem' | 'suggestion' | 'layout';
    docs: {
      description: string;
      category?: string;
      recommended?: boolean;
      url?: string;
    };
    messages: Record<string, string>;
    schema?: unknown[];
    fixable?: 'code' | 'whitespace';
  };
  create(context: RuleContext): Rule.RuleListener;
}
