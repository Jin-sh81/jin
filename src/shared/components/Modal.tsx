import React, { useEffect, useRef } from 'react'
import { twMerge } from 'tailwind-merge'
import { XMarkIcon } from '@heroicons/react/24/outline'

// 🎨 모달 크기 타입
export type ModalSize = 'small' | 'medium' | 'large' | 'full'

// 🎨 모달 컴포넌트의 props 타입 정의
export interface ModalProps {
  /** 모달이 열려있는지 여부 */
  isOpen: boolean
  /** 모달을 닫는 함수 */
  onClose: () => void
  /** 모달 제목 */
  title?: string
  /** 모달 내용 */
  children: React.ReactNode
  /** 모달 크기 (기본값: 'medium') */
  size?: ModalSize
  /** 모달 하단에 표시될 버튼들 */
  footer?: React.ReactNode
  /** 모달을 닫을 수 있는지 여부 (기본값: true) */
  closeable?: boolean
  /** 모달이 열릴 때 실행될 함수 */
  onOpen?: () => void
  /** 모달이 닫힐 때 실행될 함수 */
  onAfterClose?: () => void
  /** 모달의 최대 높이 (기본값: '90vh') */
  maxHeight?: string
  /** 모달의 배경 클릭으로 닫을 수 있는지 여부 (기본값: true) */
  closeOnOverlayClick?: boolean
}

/**
 * 🎯 재사용 가능한 모달 컴포넌트
 * 
 * 이 컴포넌트는 화면 중앙에 떠있는 모달 창을 생성합니다.
 * 접근성과 사용자 경험을 고려하여 설계되었습니다.
 * 
 * @example
 * // 기본 모달
 * <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
 *   <p>모달 내용입니다.</p>
 * </Modal>
 * 
 * // 제목이 있는 모달
 * <Modal 
 *   isOpen={isOpen} 
 *   onClose={() => setIsOpen(false)}
 *   title="알림"
 * >
 *   <p>모달 내용입니다.</p>
 * </Modal>
 * 
 * // 커스텀 푸터가 있는 모달
 * <Modal
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   footer={
 *     <div className="flex justify-end space-x-2">
 *       <Button variant="outline" onClick={() => setIsOpen(false)}>취소</Button>
 *       <Button onClick={handleSave}>저장</Button>
 *     </div>
 *   }
 * >
 *   <p>모달 내용입니다.</p>
 * </Modal>
 */
const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'medium',
  footer,
  closeable = true,
  onOpen,
  onAfterClose,
  maxHeight = '90vh',
  closeOnOverlayClick = true
}) => {
  const modalRef = useRef<HTMLDivElement>(null)

  // 🎨 ESC 키를 누르면 모달 닫기
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && closeable) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // 모달이 열릴 때 body 스크롤 방지
      document.body.style.overflow = 'hidden'
      onOpen?.()
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      // 모달이 닫힐 때 body 스크롤 복원
      document.body.style.overflow = 'unset'
      if (!isOpen) {
        onAfterClose?.()
      }
    }
  }, [isOpen, onClose, closeable, onOpen, onAfterClose])

  // 🎨 모달이 닫혀있으면 아무것도 렌더링하지 않음
  if (!isOpen) return null

  // 🎨 모달 크기에 따른 클래스
  const sizeClasses = {
    small: 'max-w-sm',
    medium: 'max-w-md',
    large: 'max-w-lg',
    full: 'max-w-full mx-4'
  }

  return (
    // 🎨 모달 배경 (오버레이)
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn"
      onClick={closeOnOverlayClick ? onClose : undefined}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      {/* 🎨 모달 컨텐츠 */}
      <div
        ref={modalRef}
        className={twMerge(
          'bg-white rounded-lg shadow-xl w-full mx-4 animate-scaleIn',
          sizeClasses[size]
        )}
        style={{ maxHeight }}
        onClick={(e) => e.stopPropagation()} // 모달 내부 클릭 시 닫히지 않도록
      >
        {/* 🎨 모달 헤더 */}
        {(title || closeable) && (
          <div className="px-6 py-4 border-b flex items-center justify-between">
            {title && (
              <h3 id="modal-title" className="text-lg font-semibold text-gray-900">
                {title}
              </h3>
            )}
            {closeable && (
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="모달 닫기"
              >
                <XMarkIcon className="w-5 h-5 text-gray-500" />
              </button>
            )}
          </div>
        )}

        {/* 🎨 모달 본문 */}
        <div className="px-6 py-4 overflow-y-auto">
          {children}
        </div>

        {/* 🎨 모달 푸터 */}
        {footer && (
          <div className="px-6 py-4 border-t bg-gray-50 rounded-b-lg">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

export default Modal 