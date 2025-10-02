import { Rule } from 'eslint';

export interface RuleContext extends Rule.RuleContext {
  getFilename(): string;
  getPhysicalFilename?(): string;
}
