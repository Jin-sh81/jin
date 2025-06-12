import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { LoginPage } from './features/auth/pages/LoginPage'
import { RegisterPage } from './features/auth/pages/RegisterPage'
import ProjectPage from './features/project/pages/ProjectPage'
import ProjectDetailPage from './features/project/pages/ProjectDetailPage'
import RoutinePage from './features/routine/pages/RoutinePage'
import DiaryPage from './features/diary/pages/DiaryPage'
import ExpensePage from './features/expense/pages/ExpensePage'
import { Layout } from './components/Layout'
import { NotFoundPage } from './pages/NotFoundPage'
import { ErrorBoundary } from './components/ErrorBoundary'

/**
 * 앱의 메인 컴포넌트
 * 
 * 이 컴포넌트는 라우팅 설정을 담당합니다.
 * 
 * 사용된 주요 컴포넌트:
 * - BrowserRouter: HTML5 History API를 사용하여 URL과 UI를 동기화
 * - Routes: 여러 Route를 감싸는 컨테이너
 * - Route: URL 경로와 컴포넌트를 매칭
 * 
 * 라우트 구조:
 * / - 메인 페이지
 * /projects - 프로젝트 목록
 * /projects/:id - 프로젝트 상세
 * /routines - 루틴 목록
 * /expense - 지출 관리
 * /diary - 일기
 * /login - 로그인
 * /register - 회원가입
 * * - 404 페이지 (존재하지 않는 경로)
 */
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return <div>Loading...</div>
  }

  return user ? <>{children}</> : <Navigate to="/login" />
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Layout />
                </PrivateRoute>
              }
            >
              <Route index element={<Navigate to="/projects" replace />} />
              <Route path="projects" element={<ProjectPage />} />
              <Route path="projects/:id" element={<ProjectDetailPage />} />
              <Route path="routines" element={<RoutinePage />} />
              <Route path="diary" element={<DiaryPage />} />
              <Route path="expense" element={<ExpensePage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  )
}

export default App 