/** @type {import('tailwindcss').Config} */
export default {
  // 🔽 적용할 파일 경로
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  // 🔽 테마 설정
  theme: {
    extend: {
      // 🔽 색상 설정
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
      },
      // 🔽 폰트 설정
      fontFamily: {
        sans: ['Pretendard', 'sans-serif'],
      },
      // 🎨 애니메이션 설정
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.2s ease-out',
        scaleIn: 'scaleIn 0.2s ease-out'
      }
    },
  },

  // 🔽 플러그인 설정
  plugins: [],
} 