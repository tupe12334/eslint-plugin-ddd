import { Rule } from 'eslint';

export interface RuleContext extends Rule.RuleContext {
  getFilename(): string;
  getPhysicalFilename?(): string;
}

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
    schema?: any[];
    fixable?: 'code' | 'whitespace';
  };
  create(context: RuleContext): Rule.RuleListener;
}

export interface PluginOptions {
  excludePatterns?: string[];
}
