module.exports = {
  root: true,
  extends: [
    'airbnb-base',
    'plugin:json/recommended',
    'plugin:xwalk/recommended',
  ],
  env: {
    browser: true,
  },
  parser: '@babel/eslint-parser',
  parserOptions: {
    allowImportExportEverywhere: true,
    sourceType: 'module',
    requireConfigFile: false,
  },
  rules: {
    'import/extensions': ['error', { js: 'always' }], // require js file extensions in imports
    'linebreak-style': ['error', 'unix'], // enforce unix linebreaks
    'no-param-reassign': [2, { props: false }], // allow modifying properties of param
    // Blocks that intentionally use more than 4 model fields
    'xwalk/max-cells': ['error', {
      'carousel-item': 7,
      cta: 8,
      'features-item': 7,
      hero: 7,
      'page-hero': 6,
      'pricing-plan': 8,
      'richtext-block': 8,
    }],
  },
};
