import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// 🔽 Vite 설정
export default defineConfig({
  // 🔽 React 플러그인 사용
  plugins: [react()],

  // 🔽 경로 별칭 설정
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@types': path.resolve(__dirname, './src/types'),
      '@services': path.resolve(__dirname, './src/services'),
      '@shared': path.resolve(__dirname, './src/shared')
    }
  },

  // 🔽 개발 서버 설정
  server: {
    port: 3000, // 개발 서버 포트
    open: true // 브라우저 자동 실행
  },

  // 🔽 빌드 설정
  build: {
    outDir: 'dist', // 빌드 출력 디렉토리
    sourcemap: true // 소스맵 생성
  }
}) 

/*
 * 🔥 Vite 설정 변경 후 필수 단계
 * 
 * 1. 개발 서버 재시작:
 *    - 개발 서버 중지 (Ctrl+C)
 *    - npm run dev 또는 yarn dev로 재시작
 * 
 * 2. 캐시 삭제가 필요한 경우:
 *    - node_modules/.vite 폴더 삭제
 *    - npm install 또는 yarn install 실행
 * 
 * 3. 경로 별칭 사용 예시:
 *    - import { useAuth } from '@hooks/useAuth'
 *    - import { formatDate } from '@utils/date'
 *    - import { User } from '@types/user'
 *    - import { api } from '@services/api'
 *    - import { Button } from '@shared/atoms/Button'
 */ 