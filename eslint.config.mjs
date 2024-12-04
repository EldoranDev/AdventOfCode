import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    "files": ['src/lib/**/*.ts'],
    "rules": {
      '@typescript-eslint/no-unused-vars': [
        "warn", { vars: "all", args: 'none' }
      ],
    }
  }
);
