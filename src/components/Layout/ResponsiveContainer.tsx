// 📱 ResponsiveContainer: 화면 크기에 따라 레이아웃이 달라지는 반응형 컨테이너예요!
import React from 'react'

interface ResponsiveContainerProps {
  children: React.ReactNode
}

const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({ children }) => (
  // 🖥️ 데스크톱, 📱 모바일, 🧳 태블릿에서 모두 예쁘게 보이도록 스타일을 적용해요!
  <div className="max-w-md md:max-w-2xl lg:max-w-4xl mx-auto px-4 py-8">
    {children}
  </div>
)

export default ResponsiveContainer
