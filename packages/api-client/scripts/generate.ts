const API_URL = 'http://localhost:8000/docs-json'
const MAX_RETRIES = 20
const RETRY_DELAY = 2000

async function waitForApi() {
  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      const res = await fetch(API_URL)
      if (res.ok) {
        console.log('✅ API is ready, generating hooks...')
        return true
      }
    } catch {
      console.log(`⏳ Waiting for API... (${i + 1}/${MAX_RETRIES})`)
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY))
    }
  }
  throw new Error('❌ API did not start in time')
}

await waitForApi()

const { execSync } = await import('node:child_process')
execSync('bun run generate', { stdio: 'inherit', cwd: import.meta.dir + '/..' })
