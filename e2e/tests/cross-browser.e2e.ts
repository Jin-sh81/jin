// 🧪 크로스 브라우저: 여러 브라우저에서 앱이 잘 동작하는지 테스트해요!
import { test, expect } from '@playwright/test'

test.describe.configure({ mode: 'parallel' })

for (const browserType of ['chromium', 'firefox', 'webkit'] as const) {
  test(`홈페이지가 ${browserType}에서 잘 열려요`, async ({ playwright }) => {
    const browser = await playwright[browserType].launch()
    const context = await browser.newContext()
    const page = await context.newPage()
    await page.goto('http://localhost:3000/')
    await expect(page).toHaveTitle(/JIN 앱/i)
    await browser.close()
  })
}
