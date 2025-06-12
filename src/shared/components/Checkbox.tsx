import React, { forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'
import { CheckIcon } from '@heroicons/react/24/outline'

// 🎨 Checkbox 컴포넌트의 props 타입 정의
export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** 체크박스의 레이블 */
  label?: string
  /** 에러 메시지 */
  error?: string
  /** 도움말 텍스트 */
  helperText?: string
  /** 체크박스가 비활성화되었는지 여부 */
  disabled?: boolean
  /** 체크박스가 필수인지 여부 */
  required?: boolean
  /** 체크박스의 크기 */
  size?: 'small' | 'medium' | 'large'
  /** 체크박스의 색상 */
  color?: 'primary' | 'success' | 'warning' | 'error'
}

/**
 * 🎯 재사용 가능한 체크박스 컴포넌트
 * 
 * 이 컴포넌트는 체크박스 입력을 제공합니다.
 * 접근성과 사용자 경험을 고려하여 설계되었습니다.
 * 
 * @example
 * // 기본 체크박스
 * <Checkbox
 *   label="이용약관 동의"
 *   required
 * />
 * 
 * // 에러가 있는 체크박스
 * <Checkbox
 *   label="개인정보 수집 동의"
 *   error="개인정보 수집에 동의해주세요"
 * />
 * 
 * // 다른 색상의 체크박스
 * <Checkbox
 *   label="성공"
 *   color="success"
 * />
 */
const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(({
  label,
  error,
  helperText,
  disabled = false,
  required = false,
  size = 'medium',
  color = 'primary',
  className,
  ...props
}, ref) => {
  // 🎨 체크박스 크기에 따른 클래스
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-5 h-5',
    large: 'w-6 h-6'
  }

  // 🎨 체크박스 색상에 따른 클래스
  const colorClasses = {
    primary: 'text-blue-500 border-gray-300 focus:ring-blue-500',
    success: 'text-green-500 border-gray-300 focus:ring-green-500',
    warning: 'text-yellow-500 border-gray-300 focus:ring-yellow-500',
    error: 'text-red-500 border-gray-300 focus:ring-red-500'
  }

  // 🎨 기본 클래스
  const baseClasses = 'rounded border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

  return (
    <div className="flex flex-col gap-1">
      {/* 🎨 체크박스 컨테이너 */}
      <label className="inline-flex items-center gap-2 cursor-pointer">
        {/* 🎨 체크박스 입력 */}
        <div className="relative">
          <input
            ref={ref}
            type="checkbox"
            className={twMerge(
              baseClasses,
              sizeClasses[size],
              colorClasses[color],
              error && 'border-red-500 focus:ring-red-500',
              'peer'
            )}
            disabled={disabled}
            required={required}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? 'error-message' : helperText ? 'helper-text' : undefined}
            {...props}
          />
          {/* 🎨 체크 아이콘 */}
          <CheckIcon
            className={twMerge(
              'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200',
              size === 'small' && 'w-2/3 h-2/3'
            )}
          />
        </div>

        {/* 🎨 레이블 */}
        {label && (
          <span className="text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </span>
        )}
      </label>

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
Checkbox.displayName = 'Checkbox'

export default Checkbox 