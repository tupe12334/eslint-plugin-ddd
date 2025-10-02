import 'dotenv/config';

export default {
  git: {
    commitMessage: 'chore: release v${version}',
    tagName: 'v${version}',
    requireCleanWorkingDir: true,
    requireBranch: 'main',
    push: true,
    commit: true,
    tag: true,
  },
  github: {
    release: true,
    releaseName: 'Release v${version}',
    tokenRef: 'GITHUB_TOKEN',
  },
  npm: {
    publish: true,
    publishPath: '.',
    tokenRef: 'NPM_TOKEN',
  },
  hooks: {
    'before:init': ['pnpm lint', 'pnpm test'],
  },
  plugins: {},
};
