import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import RoutinePage from './features/routine/pages/RoutinePage'
import ExpensePage from '@/features/expense/pages/ExpensePage'

console.log('🚦 routes.tsx: 라우터 설정 시작')

// 🔽 라우터 설정
export const router = createBrowserRouter([
  {
    path: '/',
    element: <div>홈페이지</div>,
  },
  {
    path: '/routines',
    element: <RoutinePage />,
  },
  {
    path: '/expense',
    element: <ExpensePage />,
  },
  {
    path: '/test-routine',
    element: <div>루틴 테스트 페이지</div>,
  },
  {
    path: '/test-expense',
    element: <div>지출 테스트 페이지</div>,
  },
  {
    path: '/test-diary',
    element: <div>일기 테스트 페이지</div>,
  },
])

console.log('🚦 routes.tsx: 라우터 설정 완료')

// 🔽 라우터 프로바이더 컴포넌트
export default function AppRoutes() {
  console.log('🚦 AppRoutes 렌더링')
  return <RouterProvider router={router} />
} 