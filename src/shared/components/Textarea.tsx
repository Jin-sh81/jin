import React, { forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

// 🎨 Textarea 컴포넌트의 props 타입 정의
export interface TextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  /** 텍스트 영역의 레이블 */
  label?: string
  /** 에러 메시지 */
  error?: string
  /** 도움말 텍스트 */
  helperText?: string
  /** 텍스트 영역이 비활성화되었는지 여부 */
  disabled?: boolean
  /** 텍스트 영역이 필수인지 여부 */
  required?: boolean
  /** 텍스트 영역의 크기 */
  size?: 'small' | 'medium' | 'large'
  /** 텍스트 영역의 너비 */
  fullWidth?: boolean
  /** 최대 글자 수 */
  maxLength?: number
  /** 현재 글자 수 */
  currentLength?: number
  /** 자동 크기 조절 여부 */
  autoResize?: boolean
}

/**
 * 🎯 재사용 가능한 텍스트 영역 컴포넌트
 * 
 * 이 컴포넌트는 여러 줄 텍스트 입력을 제공합니다.
 * 접근성과 사용자 경험을 고려하여 설계되었습니다.
 * 
 * @example
 * // 기본 텍스트 영역
 * <Textarea
 *   label="설명"
 *   placeholder="내용을 입력하세요"
 * />
 * 
 * // 에러가 있는 텍스트 영역
 * <Textarea
 *   label="내용"
 *   error="내용을 입력해주세요"
 * />
 * 
 * // 자동 크기 조절 텍스트 영역
 * <Textarea
 *   label="메모"
 *   autoResize
 * />
 */
const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
  label,
  error,
  helperText,
  disabled = false,
  required = false,
  size = 'medium',
  fullWidth = false,
  maxLength,
  currentLength,
  autoResize = false,
  className,
  ...props
}, ref) => {
  // 🎨 텍스트 영역 크기에 따른 클래스
  const sizeClasses = {
    small: 'p-2 text-sm',
    medium: 'p-3 text-base',
    large: 'p-4 text-lg'
  }

  // 🎨 기본 클래스
  const baseClasses = 'w-full rounded-lg border bg-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

  // 🎨 상태에 따른 클래스
  const stateClasses = {
    default: 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
    error: 'border-red-500 focus:border-red-500 focus:ring-red-500'
  }

  // 🎨 자동 크기 조절 핸들러
  const handleResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (autoResize) {
      e.target.style.height = 'auto'
      e.target.style.height = `${e.target.scrollHeight}px`
    }
  }

  return (
    <div className={twMerge('flex flex-col gap-1', fullWidth && 'w-full')}>
      {/* 🎨 레이블 */}
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* 🎨 텍스트 영역 컨테이너 */}
      <div className="relative">
        <textarea
          ref={ref}
          className={twMerge(
            baseClasses,
            sizeClasses[size],
            error ? stateClasses.error : stateClasses.default,
            className
          )}
          disabled={disabled}
          required={required}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? 'error-message' : helperText ? 'helper-text' : undefined}
          onChange={handleResize}
          {...props}
        />

        {/* 🎨 글자 수 표시 */}
        {maxLength && (
          <div className="absolute bottom-2 right-2 text-xs text-gray-500">
            {currentLength || 0}/{maxLength}
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
Textarea.displayName = 'Textarea'

export default Textarea 