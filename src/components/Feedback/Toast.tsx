// 🍞 Toast: 화면 오른쪽 위에 잠깐 뜨는 알림 메시지예요!
import React, { useEffect } from 'react'

interface ToastProps {
  message: string
  onClose: () => void
  duration?: number // ms
}

const Toast: React.FC<ToastProps> = ({ message, onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [onClose, duration])

  return (
    <div
      className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow-lg z-50 animate-fade-in"
      role="alert"
    >
      {message}
    </div>
  )
}

export default Toast
