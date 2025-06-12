import React, { forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'
import { ChevronDownIcon } from '@heroicons/react/24/outline'

// 🎨 Select 옵션 타입
export interface SelectOption {
  /** 옵션의 값 */
  value: string
  /** 옵션의 레이블 */
  label: string
  /** 옵션이 비활성화되었는지 여부 */
  disabled?: boolean
}

// 🎨 Select 컴포넌트의 props 타입 정의
export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  /** 선택 필드의 레이블 */
  label?: string
  /** 에러 메시지 */
  error?: string
  /** 도움말 텍스트 */
  helperText?: string
  /** 선택 옵션 목록 */
  options: SelectOption[]
  /** 선택 필드의 크기 */
  size?: 'small' | 'medium' | 'large'
  /** 선택 필드의 변형 */
  variant?: 'outline' | 'filled' | 'flushed'
  /** 선택 필드가 비활성화되었는지 여부 */
  disabled?: boolean
  /** 선택 필드가 필수인지 여부 */
  required?: boolean
  /** 선택 필드의 너비 */
  fullWidth?: boolean
  /** 기본 선택 옵션 텍스트 */
  placeholder?: string
}

/**
 * 🎯 재사용 가능한 선택 필드 컴포넌트
 * 
 * 이 컴포넌트는 드롭다운 선택 메뉴를 제공합니다.
 * 접근성과 사용자 경험을 고려하여 설계되었습니다.
 * 
 * @example
 * // 기본 선택 필드
 * <Select
 *   label="카테고리"
 *   options={[
 *     { value: 'food', label: '음식' },
 *     { value: 'clothes', label: '의류' },
 *     { value: 'electronics', label: '전자제품' }
 *   ]}
 * />
 * 
 * // 에러가 있는 선택 필드
 * <Select
 *   label="지역"
 *   error="지역을 선택해주세요"
 *   options={[
 *     { value: 'seoul', label: '서울' },
 *     { value: 'busan', label: '부산' }
 *   ]}
 * />
 */
const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  error,
  helperText,
  options,
  size = 'medium',
  variant = 'outline',
  disabled = false,
  required = false,
  fullWidth = false,
  placeholder,
  className,
  ...props
}, ref) => {
  // 🎨 선택 필드 크기에 따른 클래스
  const sizeClasses = {
    small: 'px-2 py-1 text-sm',
    medium: 'px-3 py-2 text-base',
    large: 'px-4 py-3 text-lg'
  }

  // 🎨 선택 필드 변형에 따른 클래스
  const variantClasses = {
    outline: 'border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500',
    filled: 'bg-gray-100 border border-transparent focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500',
    flushed: 'border-b border-gray-300 focus:border-blue-500 rounded-none px-0'
  }

  // 🎨 기본 클래스
  const baseClasses = 'rounded-md transition-colors duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed read-only:bg-gray-50 appearance-none'

  return (
    <div className={twMerge('flex flex-col gap-1', fullWidth && 'w-full')}>
      {/* 🎨 레이블 */}
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* 🎨 선택 필드 컨테이너 */}
      <div className="relative">
        {/* 🎨 선택 필드 */}
        <select
          ref={ref}
          className={twMerge(
            baseClasses,
            sizeClasses[size],
            variantClasses[variant],
            'pr-10',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
            className
          )}
          disabled={disabled}
          required={required}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? 'error-message' : helperText ? 'helper-text' : undefined}
          {...props}
        >
          {/* 🎨 기본 옵션 */}
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}

          {/* 🎨 옵션 목록 */}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>

        {/* 🎨 화살표 아이콘 */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
          <ChevronDownIcon className="w-5 h-5" />
        </div>
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
Select.displayName = 'Select'

export default Select 