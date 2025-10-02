import agent from 'eslint-config-agent';

export default [
  ...agent,
  {
    ignores: ['dist/**', 'node_modules/**', 'coverage/**'],
  },
];
