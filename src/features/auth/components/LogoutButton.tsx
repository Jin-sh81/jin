// 🚪 LogoutButton: 로그아웃 버튼 컴포넌트예요!
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthService } from '../services/authService'

export const LogoutButton: React.FC = () => {
  // 🔄 navigate: 페이지 이동을 도와주는 함수예요
  const navigate = useNavigate()

  // 🚪 로그아웃 함수: 로그아웃 후 홈페이지로 이동해요
  const handleLogout = async () => {
    try {
      await AuthService.logout()
      navigate('/')
    } catch (error) {
      console.error('로그아웃 중 오류가 발생했습니다:', error)
    }
  }

  return (
    // 🎨 로그아웃 버튼: 클릭하면 로그아웃해요
    <button
      onClick={handleLogout}
      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
    >
      로그아웃
    </button>
  )
}