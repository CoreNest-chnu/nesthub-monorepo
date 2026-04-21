import nextConfig from '@repo/eslint-config/next'

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...nextConfig,
  {
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      'import/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: false,
          optionalDependencies: false,
          peerDependencies: false,
          packageDir: [import.meta.dirname, `${import.meta.dirname}/../../`],
        },
      ],
    },
  },
]
