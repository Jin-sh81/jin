// 📧 ForgotPasswordPage: 비밀번호 재설정 이메일을 보내는 페이지예요!
import React, { useState } from 'react'
import { useForgotPassword } from '../hooks/useForgotPassword'

const ForgotPasswordPage: React.FC = () => {
  // 📧 이메일 입력값 상태
  const [email, setEmail] = useState('')
  // ✅ 이메일 전송 성공 여부
  const [sent, setSent] = useState(false)
  // 🚨 에러 메시지
  const [error, setError] = useState<string | null>(null)
  // 🔄 이메일 전송 함수
  const { sendResetEmail, loading } = useForgotPassword()

  // 📤 폼 제출 시 실행되는 함수
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      await sendResetEmail(email)
      setSent(true)
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div>
      <h2>비밀번호 재설정</h2>
      {sent ? (
        <p>📧 이메일로 재설정 링크를 보냈어요! 메일함을 확인해 주세요.</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <label>
            이메일 주소
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </label>
          <button type="submit" disabled={loading}>
            {loading ? '전송 중...' : '재설정 링크 보내기'}
          </button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
      )}
    </div>
  )
}

export default ForgotPasswordPage
