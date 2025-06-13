// 🧪 접근성 테스트: 페이지에 접근성 문제가 없는지 확인해요!
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test('홈페이지는 접근성 에러가 없어야 해요', async ({ page }) => {
  await page.goto('http://localhost:3000/')
  const accessibilityScanResults = await new AxeBuilder({ page }).analyze()
  expect(accessibilityScanResults.violations).toEqual([])
})
