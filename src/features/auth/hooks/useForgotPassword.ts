// 🔄 useForgotPassword: 비밀번호 재설정 관련 로직을 담은 훅이에요!
import { useState } from 'react'
import { AuthService } from '../services/authService'

export const useForgotPassword = () => {
  // ⏳ 로딩 상태
  const [loading, setLoading] = useState(false)

  // 📧 비밀번호 재설정 이메일 보내기
  const sendResetEmail = async (email: string) => {
    setLoading(true)
    try {
      await AuthService.sendPasswordResetEmail(email)
    } finally {
      setLoading(false)
    }
  }

  // 🔑 비밀번호 재설정(이메일 링크 클릭 후)
  const confirmResetPassword = async (oobCode: string, newPassword: string) => {
    setLoading(true)
    try {
      await AuthService.confirmPasswordReset(oobCode, newPassword)
    } finally {
      setLoading(false)
    }
  }

  return { sendResetEmail, confirmResetPassword, loading }
}
