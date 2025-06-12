// 🔽 React와 ReactDOM 임포트
import React from 'react'
import ReactDOM from 'react-dom/client'

// 🔽 React Router 관련 임포트
import { BrowserRouter } from 'react-router-dom'

// 🔽 라우터 설정 임포트
import AppRoutes from '@/config/routes'   // src/config/routes.tsx 에서 내보낸 라우터 컴포넌트

// 🔽 전역 스타일 임포트
import '@/index.css'                     // Tailwind 또는 전역 CSS

// 🔽 ErrorBoundary 컴포넌트 임포트
import { ErrorBoundary } from '@/components/ErrorBoundary'

console.log('🌱 main.tsx 시작: ReactDOM.createRoot 호출 직전')

// 🔽 루트 엘리먼트 찾기
const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('root element not found')

// 🔽 React 앱 렌더링
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        {(() => {
          console.log('🌱 BrowserRouter 렌더링')
          return <AppRoutes />
        })()}
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
)

console.log('🌱 main.tsx 끝: 렌더링 실행됨') 