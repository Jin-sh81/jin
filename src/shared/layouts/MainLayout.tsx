import { Outlet, Link } from 'react-router-dom'

// 🏠 MainLayout은 우리 앱의 기본 모양을 만드는 컴포넌트예요
// 📱 모든 페이지에서 공통으로 보여지는 부분을 담당해요
export const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex space-x-8">
                <Link to="/" className="hover:underline">🏠 홈</Link>
                <Link to="/routine" className="hover:underline">📅 루틴</Link>
                <Link to="/projects" className="hover:underline">📋 프로젝트</Link>
                <Link to="/expenses" className="hover:underline">💰 지출</Link>
                <Link to="/diaries" className="hover:underline">📝 일기</Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  )
} 