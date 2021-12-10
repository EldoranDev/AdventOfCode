module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: [
      '@typescript-eslint',
      'jest',
    ],
    extends: [
      'airbnb/base',
      'airbnb-typescript/base',
    ],
    parserOptions: {
      project: './tsconfig.json'
    },
    rules: {
      '@typescript-eslint/indent': ["error", 4],
      'import/prefer-default-export': 0,
      'no-restricted-syntax': 0,
      'no-plusplus': 0,
      'no-continue': 0,
      'max-classes-per-file': 0,
    }
  };