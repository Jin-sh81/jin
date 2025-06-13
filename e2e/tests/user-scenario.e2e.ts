// 🧪 사용자 시나리오: 실제 사용자가 회원가입 → 로그인 → 로그아웃까지 하는 과정을 테스트해요!
import { test, expect } from '@playwright/test'

test('회원가입, 로그인, 로그아웃 시나리오', async ({ page }) => {
  // 홈페이지 접속
  await page.goto('http://localhost:3000/')
  // 회원가입 페이지로 이동
  await page.click('text=회원가입')
  // 회원가입 폼 작성
  await page.fill('input[name="email"]', 'testuser@sample.com')
  await page.fill('input[name="password"]', 'test1234')
  await page.fill('input[name="displayName"]', '테스트유저')
  await page.click('button[type="submit"]')
  // 로그인 페이지로 이동
  await page.click('text=로그인')
  // 로그인 폼 작성
  await page.fill('input[name="email"]', 'testuser@sample.com')
  await page.fill('input[name="password"]', 'test1234')
  await page.click('button[type="submit"]')
  // 홈 화면에 "로그아웃" 버튼이 보이면 성공!
  await expect(page.getByText('로그아웃')).toBeVisible()
  // 로그아웃
  await page.click('text=로그아웃')
  // 다시 로그인 버튼이 보이면 성공!
  await expect(page.getByText('로그인')).toBeVisible()
})
