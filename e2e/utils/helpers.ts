// 🧰 helpers: E2E 테스트에서 자주 쓰는 함수들을 모아놨어요!
import { Page } from '@playwright/test'

export async function login(page: Page, email: string, password: string) {
  await page.goto('http://localhost:3000/login')
  await page.fill('input[name="email"]', email)
  await page.fill('input[name="password"]', password)
  await page.click('button[type="submit"]')
}
