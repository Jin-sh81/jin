// 🎨 GoogleButton: 구글 로그인/회원가입 버튼을 예쁘게 만든 컴포넌트예요!
import React from 'react'
import { FcGoogle } from 'react-icons/fc'

// 📦 GoogleButtonProps: 버튼에 필요한 정보를 담는 상자예요
interface GoogleButtonProps {
  // 👆 onClick: 버튼을 클릭했을 때 실행할 함수예요
  onClick: () => void
  // 📝 text: 버튼에 보여줄 글자예요
  text: string
}

// 🎯 GoogleButton: 구글 로그인/회원가입 버튼을 만들어요
export const GoogleButton: React.FC<GoogleButtonProps> = ({ onClick, text }) => {
  return (
    // 🔘 버튼: 클릭하면 구글 로그인/회원가입을 시작해요
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      {/* 🖼️ 구글 아이콘: 버튼 왼쪽에 구글 로고를 보여줘요 */}
      <FcGoogle className="w-5 h-5" />
      {/* 📝 버튼 글자: "Google로 로그인" 또는 "Google로 회원가입" */}
      {text}
    </button>
  )
}
