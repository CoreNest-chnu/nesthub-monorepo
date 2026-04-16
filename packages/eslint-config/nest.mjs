import typescriptEslint from 'typescript-eslint'
import basicConfig from './base.mjs'

export default typescriptEslint.config(
  ...basicConfig,
  {
    rules: {
      '@typescript-eslint/no-misused-spread': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'error',
    },
  },
  {
    files: ['src/**/*.module.ts'],
    rules: {
      '@typescript-eslint/no-extraneous-class': 'off',
    },
  },
  {
    // Config files live outside tsconfig — disable type-aware rules for them
    files: ['*.config.js', '*.config.mjs', '*.config.ts', 'eslint.config.*'],
    extends: [typescriptEslint.configs.disableTypeChecked],
  },
  {
    ignores: ['src/@generated/**/*', 'generated/**/*', 'dist/**'],
  },
)
