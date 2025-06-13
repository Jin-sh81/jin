// 🪟 Modal: 중요한 알림이나 에러를 크게 보여주는 창이에요!
import React from 'react'

interface ModalProps {
  open: boolean
  title?: string
  message: string
  onClose: () => void
}

const Modal: React.FC<ModalProps> = ({ open, title, message, onClose }) => {
  if (!open) return null
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
        {title && <h3 className="text-lg font-bold mb-2">{title}</h3>}
        <p className="mb-4">{message}</p>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={onClose}
        >
          닫기
        </button>
      </div>
    </div>
  )
}

export default Modal
