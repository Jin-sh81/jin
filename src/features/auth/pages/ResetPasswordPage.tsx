// 🔑 ResetPasswordPage: 이메일 링크로 들어와서 비밀번호를 바꾸는 폼이에요!
import React, { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useForgotPassword } from '../hooks/useForgotPassword'

const ResetPasswordPage: React.FC = () => {
  // 🔑 oobCode: 이메일 링크에 포함된 인증 코드
  const [searchParams] = useSearchParams()
  const oobCode = searchParams.get('oobCode')
  // 🔒 새 비밀번호 입력값
  const [password, setPassword] = useState('')
  // 🚨 에러 메시지
  const [error, setError] = useState<string | null>(null)
  // ✅ 성공 메시지
  const [success, setSuccess] = useState(false)
  // 🔄 비밀번호 재설정 함수
  const { confirmResetPassword, loading } = useForgotPassword()
  const navigate = useNavigate()

  // 📤 폼 제출 시 실행되는 함수
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!oobCode) {
      setError('잘못된 접근입니다.')
      return
    }
    try {
      await confirmResetPassword(oobCode, password)
      setSuccess(true)
      setTimeout(() => navigate('/'), 2000) // 2초 후 홈으로 이동
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div>
      <h2>비밀번호 재설정</h2>
      {success ? (
        <p>✅ 비밀번호가 성공적으로 변경되었어요! 잠시 후 홈으로 이동합니다.</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <label>
            새 비밀번호
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              minLength={6}
              required
            />
          </label>
          <button type="submit" disabled={loading}>
            {loading ? '변경 중...' : '비밀번호 변경'}
          </button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
      )}
    </div>
  )
}

export default ResetPasswordPage
