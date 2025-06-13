// 🧪 성능 테스트: 페이지 로딩 속도가 빠른지 확인해요!
import { test, expect } from '@playwright/test'

test('홈페이지 로딩 속도는 2초 이내여야 해요', async ({ page }) => {
  const start = Date.now()
  await page.goto('http://localhost:3000/')
  const duration = Date.now() - start
  expect(duration).toBeLessThan(2000)
})
