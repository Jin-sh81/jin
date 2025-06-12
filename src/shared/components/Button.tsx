import React from 'react'
import { twMerge } from 'tailwind-merge'

// 🎨 버튼의 크기를 정의하는 타입
export type ButtonSize = 'small' | 'medium' | 'large'

// 🎨 버튼의 스타일을 정의하는 타입
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost'

// 🎨 버튼 컴포넌트의 props 타입 정의
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** 버튼의 크기 (기본값: 'medium') */
  size?: ButtonSize
  /** 버튼의 스타일 (기본값: 'primary') */
  variant?: ButtonVariant
  /** 버튼 내부에 표시될 텍스트나 요소 */
  children: React.ReactNode
  /** 버튼이 로딩 중인지 여부 */
  isLoading?: boolean
  /** 버튼의 너비를 100%로 설정할지 여부 */
  fullWidth?: boolean
  /** 버튼의 왼쪽에 표시될 아이콘 */
  leftIcon?: React.ReactNode
  /** 버튼의 오른쪽에 표시될 아이콘 */
  rightIcon?: React.ReactNode
}

/**
 * 🎯 재사용 가능한 버튼 컴포넌트
 * 
 * 이 컴포넌트는 다양한 크기와 스타일의 버튼을 생성할 수 있습니다.
 * 접근성과 사용자 경험을 고려하여 설계되었습니다.
 * 
 * @example
 * // 기본 버튼
 * <Button>클릭하세요</Button>
 * 
 * // 큰 크기의 위험 버튼
 * <Button size="large" variant="danger">삭제</Button>
 * 
 * // 로딩 중인 버튼
 * <Button isLoading>저장 중...</Button>
 * 
 * // 아이콘이 있는 버튼
 * <Button leftIcon={<PlusIcon />}>새로 만들기</Button>
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
  size = 'medium',
  variant = 'primary',
  children,
  isLoading = false,
  fullWidth = false,
  className = '',
  disabled,
  leftIcon,
  rightIcon,
  ...props
}, ref) => {
  // 🎨 버튼의 크기에 따른 스타일 클래스
  const sizeClasses = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg'
  }

  // 🎨 버튼의 스타일에 따른 클래스
  const variantClasses = {
    primary: 'bg-blue-500 hover:bg-blue-600 text-white',
    secondary: 'bg-gray-500 hover:bg-gray-600 text-white',
    outline: 'border-2 border-blue-500 text-blue-500 hover:bg-blue-50',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
    ghost: 'hover:bg-gray-100 text-gray-700'
  }

  // 🎨 기본 버튼 스타일
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed'

  // 🎨 모든 클래스를 조합
  const buttonClasses = twMerge(
    baseClasses,
    sizeClasses[size],
    variantClasses[variant],
    fullWidth ? 'w-full' : '',
    className
  )

  return (
    <button
      ref={ref}
      className={buttonClasses}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
          <span>로딩 중...</span>
        </div>
      ) : (
        <>
          {leftIcon && <span className="mr-2">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="ml-2">{rightIcon}</span>}
        </>
      )}
    </button>
  )
})

// 🎨 컴포넌트 이름 설정 (개발자 도구에서 확인용)
Button.displayName = 'Button'

export default Button 