import React, { forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

// 🎨 Input 컴포넌트의 props 타입 정의
export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** 입력 필드의 레이블 */
  label?: string
  /** 에러 메시지 */
  error?: string
  /** 도움말 텍스트 */
  helperText?: string
  /** 왼쪽에 표시될 아이콘 */
  leftIcon?: React.ReactNode
  /** 오른쪽에 표시될 아이콘 */
  rightIcon?: React.ReactNode
  /** 입력 필드의 크기 */
  size?: 'small' | 'medium' | 'large'
  /** 입력 필드의 변형 */
  variant?: 'outline' | 'filled' | 'flushed'
  /** 입력 필드가 비활성화되었는지 여부 */
  disabled?: boolean
  /** 입력 필드가 읽기 전용인지 여부 */
  readOnly?: boolean
  /** 입력 필드가 필수인지 여부 */
  required?: boolean
  /** 입력 필드의 너비 */
  fullWidth?: boolean
}

/**
 * 🎯 재사용 가능한 입력 필드 컴포넌트
 * 
 * 이 컴포넌트는 다양한 스타일과 기능을 지원하는 입력 필드를 생성합니다.
 * 접근성과 사용자 경험을 고려하여 설계되었습니다.
 * 
 * @example
 * // 기본 입력 필드
 * <Input
 *   label="이름"
 *   placeholder="이름을 입력하세요"
 * />
 * 
 * // 에러가 있는 입력 필드
 * <Input
 *   label="이메일"
 *   type="email"
 *   error="올바른 이메일 주소를 입력해주세요"
 * />
 * 
 * // 아이콘이 있는 입력 필드
 * <Input
 *   label="검색"
 *   leftIcon={<SearchIcon />}
 *   placeholder="검색어를 입력하세요"
 * />
 */
const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  size = 'medium',
  variant = 'outline',
  disabled = false,
  readOnly = false,
  required = false,
  fullWidth = false,
  className,
  ...props
}, ref) => {
  // 🎨 입력 필드 크기에 따른 클래스
  const sizeClasses = {
    small: 'px-2 py-1 text-sm',
    medium: 'px-3 py-2 text-base',
    large: 'px-4 py-3 text-lg'
  }

  // 🎨 입력 필드 변형에 따른 클래스
  const variantClasses = {
    outline: 'border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500',
    filled: 'bg-gray-100 border border-transparent focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500',
    flushed: 'border-b border-gray-300 focus:border-blue-500 rounded-none px-0'
  }

  // 🎨 기본 클래스
  const baseClasses = 'rounded-md transition-colors duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed read-only:bg-gray-50'

  return (
    <div className={twMerge('flex flex-col gap-1', fullWidth && 'w-full')}>
      {/* 🎨 레이블 */}
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* 🎨 입력 필드 컨테이너 */}
      <div className="relative">
        {/* 🎨 왼쪽 아이콘 */}
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {leftIcon}
          </div>
        )}

        {/* 🎨 입력 필드 */}
        <input
          ref={ref}
          className={twMerge(
            baseClasses,
            sizeClasses[size],
            variantClasses[variant],
            leftIcon && 'pl-10',
            rightIcon && 'pr-10',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
            className
          )}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? 'error-message' : helperText ? 'helper-text' : undefined}
          {...props}
        />

        {/* 🎨 오른쪽 아이콘 */}
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            {rightIcon}
          </div>
        )}
      </div>

      {/* 🎨 에러 메시지 */}
      {error && (
        <p id="error-message" className="text-sm text-red-500">
          {error}
        </p>
      )}

      {/* 🎨 도움말 텍스트 */}
      {helperText && !error && (
        <p id="helper-text" className="text-sm text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  )
})

// 🎨 컴포넌트 이름 설정
Input.displayName = 'Input'

export default Input 