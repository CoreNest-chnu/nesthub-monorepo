import { defineConfig } from 'orval'

export default defineConfig({
  nesthub: {
    input: {
      target: 'http://localhost:8000/docs-json',
    },
    output: {
      target: './src/generated/index.ts',
      client: 'react-query',
      mode: 'tags-split',
      baseUrl: '/api',
    },
  },
})
