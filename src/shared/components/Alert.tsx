import React from 'react'
import { twMerge } from 'tailwind-merge'

// 🎨 Alert 컴포넌트의 props 타입 정의
export interface AlertProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'style' | 'title'> {
  /** 알림의 제목 */
  title?: React.ReactNode
  /** 알림의 내용 */
  children: React.ReactNode
  /** 알림의 종류 */
  variant?: 'info' | 'success' | 'warning' | 'error'
  /** 알림의 크기 */
  size?: 'small' | 'medium' | 'large'
  /** 알림의 스타일 */
  style?: 'default' | 'bordered' | 'filled'
  /** 알림을 닫을 수 있는지 여부 */
  closable?: boolean
  /** 알림이 닫힐 때 호출되는 함수 */
  onClose?: () => void
  /** 알림의 아이콘 */
  icon?: React.ReactNode
  /** 알림의 액션 버튼 */
  action?: React.ReactNode
}

/**
 * 🎯 재사용 가능한 알림 컴포넌트
 * 
 * 이 컴포넌트는 사용자에게 중요한 정보를 전달하는 알림을 표시합니다.
 * 다양한 스타일과 레이아웃을 지원합니다.
 * 
 * @example
 * // 기본 알림
 * <Alert>
 *   기본 알림 메시지입니다.
 * </Alert>
 * 
 * // 제목이 있는 알림
 * <Alert
 *   title="알림 제목"
 *   variant="success"
 * >
 *   성공 메시지입니다.
 * </Alert>
 */
const Alert: React.FC<AlertProps> = ({
  title,
  children,
  variant = 'info',
  size = 'medium',
  style = 'default',
  closable = false,
  onClose,
  icon,
  action,
  className,
  ...props
}) => {
  // 🎨 알림 종류에 따른 클래스
  const variantClasses = {
    info: {
      default: 'bg-blue-50 text-blue-800',
      bordered: 'border-blue-200 bg-white text-blue-800',
      filled: 'bg-blue-500 text-white'
    },
    success: {
      default: 'bg-green-50 text-green-800',
      bordered: 'border-green-200 bg-white text-green-800',
      filled: 'bg-green-500 text-white'
    },
    warning: {
      default: 'bg-yellow-50 text-yellow-800',
      bordered: 'border-yellow-200 bg-white text-yellow-800',
      filled: 'bg-yellow-500 text-white'
    },
    error: {
      default: 'bg-red-50 text-red-800',
      bordered: 'border-red-200 bg-white text-red-800',
      filled: 'bg-red-500 text-white'
    }
  }

  // 🎨 알림 크기에 따른 클래스
  const sizeClasses = {
    small: 'text-sm p-2',
    medium: 'text-base p-4',
    large: 'text-lg p-6'
  }

  // 🎨 기본 아이콘
  const defaultIcons = {
    info: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    success: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    warning: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    error: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  }

  return (
    <div
      role="alert"
      className={twMerge(
        'relative flex items-start gap-3 rounded-lg',
        variantClasses[variant][style],
        sizeClasses[size],
        style === 'bordered' && 'border',
        className
      )}
      {...props}
    >
      {/* 🎨 아이콘 */}
      <div className="flex-shrink-0">
        {icon || defaultIcons[variant]}
      </div>

      {/* 🎨 내용 */}
      <div className="flex-1">
        {title && (
          <h5 className="font-medium mb-1">
            {title}
          </h5>
        )}
        <div>{children}</div>
      </div>

      {/* 🎨 액션 버튼 */}
      {action && (
        <div className="flex-shrink-0">
          {action}
        </div>
      )}

      {/* 🎨 닫기 버튼 */}
      {closable && (
        <button
          type="button"
          className="flex-shrink-0 ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-current"
          onClick={onClose}
          aria-label="닫기"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  )
}

export default Alert 