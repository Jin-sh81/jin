// 🛠️ Playwright 설정 파일: 브라우저, 경로, 타임아웃 등을 정해요!
import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  timeout: 10000,
  retries: 1,
  use: {
    baseURL: 'http://localhost:3000',
    headless: true
  }
})
