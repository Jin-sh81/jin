// 🚪 로그인 페이지: 이메일과 비밀번호로 로그인하거나 구글로 로그인할 수 있어요!
// 📝 검증 명령서:
// 1. 이메일 형식이 올바른지 확인해요 (예: user@example.com)
// 2. 비밀번호는 6자 이상이어야 해요
// 3. 로그인 버튼을 누르면 로딩 화면이 나타나요
// 4. 로그인에 실패하면 빨간색 오류 메시지가 보여요
// 5. 로그인에 성공하면 홈 화면으로 이동해요
import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks'
import { GoogleButton } from '../components'
import { RememberMeCheckbox } from '../components/RememberMeCheckbox'
import { Spinner } from 'components/Loading'
import { Toast, Modal, InlineError } from 'components/Feedback'
import { ResponsiveContainer } from 'components/Layout'
import { ThemeToggleButton } from 'components/Theme'
import 'styles/global.css'

export const LoginPage: React.FC = () => {
  // 📧 email 상태: 사용자가 입력한 이메일을 저장해요
  const [email, setEmail] = useState('')
  // 🔒 password 상태: 사용자가 입력한 비밀번호를 저장해요
  const [password, setPassword] = useState('')
  // ⚠️ error 상태: 에러 메시지를 보여줄 때 사용해요
  const [error, setError] = useState('')
  // 🔄 isLoading 상태: 요청 중 로딩 표시를 제어해요
  const [isLoading, setIsLoading] = useState(false)
  // 💾 rememberMe 상태: 로그인 상태를 기억할지 여부를 저장해요
  const [rememberMe, setRememberMe] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [showModal, setShowModal] = useState(false)
  
  const navigate = useNavigate()
  const { login, signInWithGoogle, isGoogleLoading } = useAuth()

  // 🌐 구글 로그인 핸들러: 구글 로그인 버튼을 클릭했을 때 실행해요
  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle()
      // ✅ 구글 로그인 성공 시 홈('/') 페이지로 이동해요
      navigate('/')
    } catch (error) {
      // ❌ 구글 로그인 실패 시 에러 메시지를 보여줘요
      setError('구글 로그인에 실패했습니다.')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    // ✋ 폼 제출 방지: 페이지 새로고침 없이 로그인 처리
    e.preventDefault()
    // 🔄 로그인 요청 시작, 로딩 상태 true로 변경
    setError('')
    setIsLoading(true)

    // 📧 이메일 형식 검사: @ 기호가 있는지 확인해요
    if (!email.includes('@')) {
      setError('올바른 이메일 형식이 아니에요!')
      setIsLoading(false)
      return
    }

    // 🔒 비밀번호 길이 검사: 6자 이상인지 확인해요
    if (password.length < 6) {
      setError('비밀번호는 6자 이상이어야 해요!')
      setIsLoading(false)
      return
    }

    try {
      await login({ email, password, rememberMe })
      // ✅ 로그인 성공 시 홈('/') 페이지로 이동해요
      navigate('/')
    } catch (err: any) {
      // ❌ 로그인 실패 시 사용자에게 오류 문구를 보여줘요
      setError(err.message)
      setShowToast(true)
    } finally {
      // 🔚 로그인 처리 완료 후 로딩 상태 false로 변경
      setIsLoading(false)
    }
  }

  return (
    <ResponsiveContainer>
      <div className="responsive-form rounded shadow p-6">
        <h2 className="text-2xl font-bold mb-4">로그인</h2>
        {isLoading ? (
          <Spinner />
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email" className="sr-only">
                  이메일
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="이메일"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  비밀번호
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="비밀번호"
                />
              </div>
            </div>

            {/* 💾 Remember Me 체크박스: 로그인 상태를 기억할지 선택해요 */}
            <div className="flex items-center justify-between">
              <RememberMeCheckbox
                checked={rememberMe}
                onChange={setRememberMe}
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}

            <div>
              {/* 🔘 로그인 버튼: 누르면 로그인 요청을 보내요 */}
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isLoading ? '로그인 중...' : '로그인'}
              </button>
            </div>

            <div className="text-sm text-center">
              {/* ➕ 계정이 없으면 회원가입 페이지로 이동해요 */}
              <Link
                to="/register"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                계정이 없으신가요? 회원가입
              </Link>
            </div>

            {/* 🔘 구글 로그인 버튼: 구글로 로그인할 수 있어요 */}
            <div className="mt-4">
              <GoogleButton
                onClick={handleGoogleLogin}
                text={isGoogleLoading ? '구글 로그인 중...' : 'Google로 로그인'}
              />
            </div>

            {showToast && error && (
              <Toast message={error} onClose={() => setShowToast(false)} />
            )}
            <Modal open={showModal} message={error || ''} onClose={() => setShowModal(false)} />
            <ThemeToggleButton />
          </form>
        )}
      </div>
    </ResponsiveContainer>
  )
} 