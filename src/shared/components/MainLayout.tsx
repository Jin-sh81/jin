import { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { auth } from '@/infrastructure/firebase/firebaseConfig'

// 🔽 컴포넌트 props 타입 정의
interface MainLayoutProps {
  children: ReactNode;
}

// 🔽 네비게이션 메뉴 아이템 타입 정의
interface NavItem {
  path: string;
  label: string;
  icon: string;
}

// 🔽 네비게이션 메뉴 아이템 목록
const NAV_ITEMS: NavItem[] = [
  {
    path: '/',
    label: '홈',
    icon: '🏠'
  },
  {
    path: '/projects',
    label: '프로젝트',
    icon: '📋'
  },
  {
    path: '/expenses',
    label: '지출',
    icon: '💰'
  },
  {
    path: '/diaries',
    label: '일기',
    icon: '📝'
  }
]

// 🔽 메인 레이아웃 컴포넌트
const MainLayout = ({ children }: MainLayoutProps) => {
  // 🔽 현재 경로 가져오기
  const location = useLocation()

  // 🔽 현재 로그인한 사용자의 uid 가져오기
  const uid = auth.currentUser?.uid

  // 🔽 로그아웃 핸들러
  const handleLogout = async () => {
    try {
      await auth.signOut()
      console.log('로그아웃 성공')
    } catch (error) {
      console.error('로그아웃 실패:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 🔽 헤더 영역 */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {/* 🔸 로고 */}
            <Link to="/" className="text-xl font-bold text-gray-800">
              Jin App
            </Link>

            {/* 🔸 사용자 메뉴 */}
            <div className="flex items-center gap-4">
              {uid ? (
                <>
                  <span className="text-gray-600">
                    {auth.currentUser?.email}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                  >
                    로그아웃
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  로그인
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 🔽 메인 컨텐츠 영역 */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      {/* 🔽 네비게이션 바 */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex justify-around items-center h-16">
            {NAV_ITEMS.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center w-full h-full
                  ${location.pathname === item.path
                    ? 'text-blue-500'
                    : 'text-gray-600 hover:text-gray-800'
                  }`}
              >
                <span className="text-xs mb-1">{item.icon}</span>
                <span className="text-xs">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* 🔽 푸터 영역 */}
      <footer className="bg-white border-t border-gray-200 py-4 mt-16">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-600 text-sm">
            <p>© 2024 Jin App. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default MainLayout 