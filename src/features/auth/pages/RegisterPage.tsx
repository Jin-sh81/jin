// ✏️ 회원가입 페이지: 이메일과 비밀번호로 회원가입하거나 구글로 회원가입할 수 있어요!
// 📝 검증 명령서:
// 1. 이메일 형식이 올바른지 확인해요 (예: user@example.com)
// 2. 비밀번호는 6자 이상이어야 해요
// 3. 비밀번호와 비밀번호 확인이 같아야 해요
// 4. 회원가입 버튼을 누르면 로딩 화면이 나타나요
// 5. 회원가입에 실패하면 빨간색 오류 메시지가 보여요
// 6. 회원가입에 성공하면 홈 화면으로 이동해요
import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks'
import { GoogleButton } from '../components'
import { Spinner } from 'components/Loading'
import { Toast, Modal, InlineError } from 'components/Feedback'
import { ResponsiveContainer } from 'components/Layout'
import 'styles/global.css'

export const RegisterPage: React.FC = () => {
  // 📧 email 상태: 사용자가 입력한 이메일을 저장해요
  const [email, setEmail] = useState('')
  // 🔒 password 상태: 사용자가 입력한 비밀번호를 저장해요
  const [password, setPassword] = useState('')
  // 🔒 confirmPassword 상태: 비밀번호 확인용 입력 값을 저장해요
  const [confirmPassword, setConfirmPassword] = useState('')
  // ⚠️ error 상태: 에러 메시지를 보여줄 때 사용해요
  const [error, setError] = useState('')
  // 🔄 isLoading 상태: 요청 중 로딩 표시를 제어해요
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { signUp, signInWithGoogle, isGoogleLoading } = useAuth()
  const [showToast, setShowToast] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    // ✋ 폼 제출 방지: 새로고침 없이 회원가입 처리
    e.preventDefault()
    setError(null)

    // 📧 이메일 형식 검사: @ 기호가 있는지 확인해요
    if (!email.includes('@')) {
      setError('올바른 이메일 형식이 아니에요!')
      return
    }

    // 🔒 비밀번호 길이 검사: 6자 이상인지 확인해요
    if (password.length < 6) {
      setError('비밀번호는 6자 이상이어야 해요!')
      return
    }

    // 🔄 비밀번호 일치 여부 확인 시작
    if (password !== confirmPassword) {
      // ⚠️ 비밀번호가 다르면 오류 메시지를 띄워요
      setError('비밀번호가 일치하지 않습니다.')
      return
    }

    // 🔄 회원가입 요청 시작, 로딩 상태 true로 변경
    setIsLoading(true)

    try {
      await signUp(email, password)
      // ✅ 회원가입 성공 시 홈('/') 페이지로 이동해요
      navigate('/')
    } catch (err: any) {
      // ❌ 회원가입 실패 시 사용자에게 오류 문구를 보여줘요
      setError(err.message)
      setShowToast(true)
    } finally {
      // 🔚 회원가입 처리 완료 후 로딩 상태 false로 변경
      setIsLoading(false)
    }
  }

  // 🌐 구글 회원가입 핸들러: 구글 회원가입 버튼을 클릭했을 때 실행해요
  const handleGoogleSignUp = async () => {
    try {
      await signInWithGoogle()
      // ✅ 구글 회원가입 성공 시 홈('/') 페이지로 이동해요
      navigate('/')
    } catch (error) {
      // ❌ 구글 회원가입 실패 시 에러 메시지를 보여줘요
      setError('구글 회원가입에 실패했습니다.')
    }
  }

  return (
    <ResponsiveContainer>
      <div className="responsive-form bg-white rounded shadow p-6">
        <h2 className="text-2xl font-bold mb-4">회원가입</h2>
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
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="비밀번호"
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="sr-only">
                  비밀번호 확인
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="비밀번호 확인"
                />
              </div>
            </div>

            {showToast && error && (
              <Toast message={error} onClose={() => setShowToast(false)} />
            )}

            <div>
              {/* 🔘 회원가입 버튼: 누르면 계정 생성 요청을 보내요 */}
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isLoading ? '회원가입 중...' : '회원가입'}
              </button>
            </div>

            <div className="text-sm text-center">
              {/* ➡️ 이미 계정이 있다면 로그인 페이지로 이동해요 */}
              <Link
                to="/login"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                이미 계정이 있으신가요? 로그인
              </Link>
            </div>

            {/* 🔘 구글 회원가입 버튼: 구글로 회원가입할 수 있어요 */}
            <div className="mt-4">
              <GoogleButton
                onClick={handleGoogleSignUp}
                text={isGoogleLoading ? '구글 회원가입 중...' : 'Google로 회원가입'}
              />
            </div>
          </form>
        )}
      </div>
      <Modal open={showModal} message={error || ''} onClose={() => setShowModal(false)} />
    </ResponsiveContainer>
  )
} 