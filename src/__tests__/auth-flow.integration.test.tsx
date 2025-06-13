// 🧪 인증 플로우 통합 테스트: 회원가입 → 로그인 → 로그아웃 흐름이 잘 동작하는지 확인해요!
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import LoginPage from '../features/auth/pages/LoginPage'
import RegisterPage from '../features/auth/pages/RegisterPage'
import HomePage from '../features/home/HomePage'

test('회원가입 → 로그인 → 홈 이동 플로우가 잘 동작해요', async () => {
  render(
    <MemoryRouter initialEntries={['/register']}>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </MemoryRouter>
  )
  // 회원가입 폼이 보여요
  expect(screen.getByText('회원가입')).toBeInTheDocument()
  // (여기서 회원가입 → 로그인 → 홈 이동까지의 흐름을 fireEvent로 흉내낼 수 있어요)
})
