// 🚦 routes.tsx: 앱에서 URL에 따라 화면을 보여주는 설정 파일이에요!
// 📋 라우팅 검증 명령서:
// 1. 모든 페이지가 올바른 경로로 연결되는지 확인해요
// 2. 각 페이지에 필요한 컴포넌트가 모두 import 되었는지 확인해요
// 3. 보호된 페이지(로그인 필요)가 올바르게 설정되었는지 확인해요
// 4. 404 페이지(없는 페이지) 처리가 되어있는지 확인해요
// 5. 페이지 간 이동이 잘 되는지 확인해요
// 6. URL이 올바르게 표시되는지 확인해요

// 📦 필요한 기능과 페이지 컴포넌트를 가져와요
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import RoutinePage from './features/routine/pages/RoutinePage'
import ExpensePage from '@/features/expense/pages/ExpensePage'

// 🔍 라우터 설정 시작/완료 로그를 찍어요
console.log('🚦 routes.tsx: 라우터 설정 시작')

// 🛣️ createBrowserRouter: 경로(path)와 보여줄 화면(element)을 정의해요
export const router = createBrowserRouter([
  // ➡️ path: '/': 홈페이지(간단한 div)를 보여줘요
  {
    path: '/',
    element: <div>홈페이지</div>,
  },
  // ➡️ '/routines': 루틴 페이지를 보여줘요
  // 📝 루틴 관리: 일상적인 활동을 기록하고 관리해요
  {
    path: '/routines',
    element: <RoutinePage />,
  },
  // ➡️ '/expense': 지출 페이지를 보여줘요
  // 💰 지출 관리: 돈을 어떻게 썼는지 기록하고 관리해요
  {
    path: '/expense',
    element: <ExpensePage />,
  },
  // ➡️ '/test-routine': 루틴 테스트 페이지를 보여줘요
  // 🧪 테스트: 루틴 기능을 테스트하는 페이지예요
  {
    path: '/test-routine',
    element: <div>루틴 테스트 페이지</div>,
  },
  // ➡️ '/test-expense': 지출 테스트 페이지를 보여줘요
  // 🧪 테스트: 지출 기능을 테스트하는 페이지예요
  {
    path: '/test-expense',
    element: <div>지출 테스트 페이지</div>,
  },
  // ➡️ '/test-diary': 일기 테스트 페이지를 보여줘요
  // 🧪 테스트: 일기 기능을 테스트하는 페이지예요
  {
    path: '/test-diary',
    element: <div>일기 테스트 페이지</div>,
  },
])

console.log('🚦 routes.tsx: 라우터 설정 완료')

// 🛡️ RouterProvider: 정의한 router를 앱에 적용해요
// 🎯 AppRoutes 컴포넌트: 이곳에서 실제로 라우터를 렌더링해요
export default function AppRoutes() {
  console.log('🚦 AppRoutes 렌더링')
  return <RouterProvider router={router} />
}

// 📝 라우팅 구조:
// /                  - 홈페이지
// ├── /routines     - 루틴 관리
// ├── /expense      - 지출 관리
// └── /test-*       - 테스트 페이지들
//     ├── /test-routine
//     ├── /test-expense
//     └── /test-diary 