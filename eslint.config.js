import js from '@eslint/js';
import globals from 'globals';

const config = [
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      semi: 'error',
    },
    ignores: [
      '.git/**',
      'node_modules/**',
      '.idea/**',
      '.vscode/**',
      'dist/**',
      'build/**',
      'package/**',
    ],
  },
];

export default config;
