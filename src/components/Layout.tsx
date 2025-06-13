// 🏠 Layout 컴포넌트: 앱의 공통 레이아웃과 네비게이션을 그려주는 큰 틀이에요!
// 📋 레이아웃 검증 명령서:
// 1. 모든 메뉴 항목이 올바르게 표시되는지 확인해요
// 2. 현재 페이지가 메뉴에서 강조 표시되는지 확인해요
// 3. 로고를 클릭하면 홈으로 이동하는지 확인해요
// 4. 로그인한 사용자의 이메일이 표시되는지 확인해요
// 5. 로그아웃 버튼이 작동하는지 확인해요
// 6. 모바일 화면에서도 잘 보이는지 확인해요

import React from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

// 🎨 Layout 컴포넌트: 앱의 기본 모양을 결정해요
export const Layout: React.FC = () => {
  // 🔑 useAuth 훅: 로그인한 사용자 정보(user)와 로그아웃 기능(signOut)을 가져와요
  const { user, signOut } = useAuth()
  // 📍 useLocation 훅: 현재 보고 있는 페이지 경로를 알려줘요
  const location = useLocation()

  // 🌟 isActive(path): 메뉴 항목이 현재 페이지와 같으면 강조 표시해요
  const isActive = (path: string) => {
    return location.pathname === path
  }

  // 📑 navItems: 네비게이션 메뉴에 보여줄 페이지 목록을 담고 있어요
  const navItems = [
    { path: '/projects', label: '프로젝트' },  // 📂 프로젝트 관리
    { path: '/routines', label: '루틴' },      // ⏰ 일상 루틴 관리
    { path: '/diary', label: '일기' },         // 📝 일기 작성
    { path: '/expenses', label: '지출' },      // 💰 지출 관리
  ]

  return (
    // 🎯 전체 레이아웃: 최소 높이를 화면 크기로 설정하고 배경색을 지정해요
    <div className="min-h-screen bg-gray-100">
      {/* �� 네비게이션 바: 상단에 고정된 메뉴 바예요 */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* 🎯 왼쪽 영역: 로고와 메뉴 항목들을 담아요 */}
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                {/* 🔗 로고 클릭 시 홈('/')으로 이동해요 */}
                <Link to="/" className="text-xl font-bold text-gray-800">
                  Jin App
                </Link>
              </div>
              {/* 📱 반응형 메뉴: 모바일에서는 숨겨지고, 큰 화면에서는 보여요 */}
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navItems.map((item) => (
                  // ➡️ 메뉴 버튼: 해당 페이지로 이동하며, isActive에 따라 스타일이 바뀌어요
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      isActive(item.path)
                        ? 'border-blue-500 text-gray-900'  // ✅ 현재 페이지: 파란색 강조
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'  // ⏳ 다른 페이지: 회색
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            {/* 👤 오른쪽 영역: 사용자 정보와 로그아웃 버튼을 담아요 */}
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <div className="ml-3 relative">
                <div className="flex items-center space-x-4">
                  {/* 📧 사용자 이메일: 로그인된 사용자의 이메일을 보여줘요 */}
                  <span className="text-sm text-gray-700">{user?.email}</span>
                  {/* 🚪 로그아웃 버튼: 누르면 signOut 함수를 호출해요 */}
                  <button
                    onClick={signOut}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    로그아웃
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* 📄 메인 콘텐츠 영역: 각 페이지의 내용이 여기에 표시돼요 */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* 🎯 Outlet: 각 페이지 컴포넌트를 여기서 렌더링해요 */}
        <Outlet />
      </main>
    </div>
  )
} 