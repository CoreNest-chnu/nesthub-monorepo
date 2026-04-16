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
    ignores: ['src/@generated/**/*', 'generated/**/*', 'dist/**'],
  },
)
