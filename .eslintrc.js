module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: [
      '@typescript-eslint',
    ],
    extends: [
      'airbnb/base',
      'airbnb-typescript/base',
    ],
    parserOptions: {
      project: './tsconfig.json'
    },
    rules: {
      'no-bitwise': 0,
      '@typescript-eslint/indent': ["error", 4],
      'import/prefer-default-export': 0,
      'no-restricted-syntax': 0,
      'no-plusplus': 0,
      'no-continue': 0,
      'max-classes-per-file': 0,
      "@typescript-eslint/no-use-before-define": 0,
      '@typescript-eslint/no-unused-vars': [
        "warn", { vars: "all", args: 'none' }
      ],
      'func-names': 0,
      'max-len': ['error', { "code": 160 }],
    }
  };
