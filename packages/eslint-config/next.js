import js from '@eslint/js'
import pluginNext from '@next/eslint-plugin-next'
import { globalIgnores } from 'eslint/config'
import eslintConfigPrettier from 'eslint-config-prettier'
import pluginReact from 'eslint-plugin-react'
import pluginReactHooks from 'eslint-plugin-react-hooks'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import baseConfig from './base.mjs'

/**
 * A custom ESLint configuration for libraries that use Next.js.
 *
 * @type {import("eslint").Linter.Config[]}
 * */
export const nextJsConfig = [
  ...baseConfig.flat(),
  js.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.recommended,
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
  {
    ...pluginReact.configs.flat.recommended,
    languageOptions: {
      ...pluginReact.configs.flat.recommended.languageOptions,
      globals: {
        ...globals.serviceworker,
      },
    },
    rules: {
      ...pluginReact.configs.flat.recommended.rules,
      'react/jsx-no-bind': [
        'error',
        {
          allowArrowFunctions: false,
          allowBind: false,
          allowFunctions: false,
          ignoreDOMComponents: false,
        },
      ],
    },
  },
  {
    plugins: {
      '@next/next': pluginNext,
    },
    rules: {
      ...pluginNext.configs.recommended.rules,
      ...pluginNext.configs['core-web-vitals'].rules,
    },
  },
  {
    plugins: {
      'react-hooks': pluginReactHooks,
    },
    settings: { react: { version: 'detect' } },
    rules: {
      ...pluginReactHooks.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/jsx-no-bind': [
        'error',
        {
          allowArrowFunctions: false,
          allowBind: false,
          allowFunctions: false,
          ignoreDOMComponents: false,
        },
      ],
      'react/jsx-curly-brace-presence': [
        'error',
        {
          props: 'always',
          children: 'always',
        },
      ],
      'react/prop-types': 'off',
    },
  },
]
