import eslint from '@eslint/js'
import diff from 'eslint-plugin-diff'
import typescriptEslint from 'typescript-eslint'

// In CI, only lint changed lines. Locally, lint everything.
const diffConfig = process.env.CI
  ? [{ files: ['**/*.ts', '**/*.tsx'], processor: diff.processors.ci }]
  : []

export default typescriptEslint.config(
  eslint.configs.recommended,
  ...typescriptEslint.configs.strictTypeChecked,
  ...typescriptEslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/array-type': 'off',
      '@typescript-eslint/consistent-type-assertions': [
        'error',
        { assertionStyle: 'never' },
      ],
      '@typescript-eslint/restrict-template-expressions': [
        'error',
        { allowNumber: true },
      ],
      '@typescript-eslint/no-confusing-void-expression': 'off',
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'function',
          format: ['PascalCase', 'camelCase'],
        },
        {
          selector: 'typeAlias',
          format: ['PascalCase'],
        },
      ],
      'no-duplicate-imports': 'error',
      'require-await': 'error',
      'no-param-reassign': 'error',
      'object-shorthand': 'error',
      'no-console': ['warn', { allow: ['error', 'warn'] }],
      'padding-line-between-statements': [
        'warn',
        { blankLine: 'always', prev: '*', next: 'return' },
        { blankLine: 'always', prev: '*', next: 'if' },
        { blankLine: 'always', prev: '*', next: 'export' },
      ],
    },
  },
  {
    // Config files live outside tsconfig — disable type-aware rules for them
    files: ['*.config.js', '*.config.mjs', '*.config.ts', 'eslint.config.*'],
    extends: [typescriptEslint.configs.disableTypeChecked],
  },
  {
    ignores: ['dist/**', '.turbo/**', 'node_modules/**'],
  },
  ...diffConfig,
)
