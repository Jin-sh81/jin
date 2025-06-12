import React, { forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

// 🎨 Switch 컴포넌트의 props 타입 정의
export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** 스위치의 레이블 */
  label?: string
  /** 에러 메시지 */
  error?: string
  /** 도움말 텍스트 */
  helperText?: string
  /** 스위치가 비활성화되었는지 여부 */
  disabled?: boolean
  /** 스위치가 필수인지 여부 */
  required?: boolean
  /** 스위치의 크기 */
  size?: 'small' | 'medium' | 'large'
  /** 스위치의 색상 */
  color?: 'primary' | 'success' | 'warning' | 'error'
  /** 스위치의 너비 */
  fullWidth?: boolean
}

/**
 * 🎯 재사용 가능한 스위치 컴포넌트
 * 
 * 이 컴포넌트는 토글 스위치를 제공합니다.
 * 접근성과 사용자 경험을 고려하여 설계되었습니다.
 * 
 * @example
 * // 기본 스위치
 * <Switch
 *   label="알림 받기"
 *   checked={isEnabled}
 *   onChange={setIsEnabled}
 * />
 * 
 * // 에러가 있는 스위치
 * <Switch
 *   label="자동 저장"
 *   error="자동 저장을 활성화해주세요"
 * />
 * 
 * // 다른 색상의 스위치
 * <Switch
 *   label="성공"
 *   color="success"
 * />
 */
const Switch = forwardRef<HTMLInputElement, SwitchProps>(({
  label,
  error,
  helperText,
  disabled = false,
  required = false,
  size = 'medium',
  color = 'primary',
  fullWidth = false,
  className,
  ...props
}, ref) => {
  // 🎨 스위치 크기에 따른 클래스
  const sizeClasses = {
    small: 'w-8 h-4',
    medium: 'w-11 h-6',
    large: 'w-14 h-7'
  }

  // 🎨 스위치 색상에 따른 클래스
  const colorClasses = {
    primary: 'bg-gray-200 peer-checked:bg-blue-500',
    success: 'bg-gray-200 peer-checked:bg-green-500',
    warning: 'bg-gray-200 peer-checked:bg-yellow-500',
    error: 'bg-gray-200 peer-checked:bg-red-500'
  }

  // 🎨 기본 클래스
  const baseClasses = 'relative inline-flex items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed peer'

  // 🎨 썸(이동하는 원) 크기에 따른 클래스
  const thumbSizeClasses = {
    small: 'w-3 h-3',
    medium: 'w-5 h-5',
    large: 'w-6 h-6'
  }

  // 🎨 썸 위치에 따른 클래스
  const thumbPositionClasses = {
    small: 'translate-x-4',
    medium: 'translate-x-5',
    large: 'translate-x-7'
  }

  return (
    <div className={twMerge('flex flex-col gap-1', fullWidth && 'w-full')}>
      {/* 🎨 스위치 컨테이너 */}
      <label className="inline-flex items-center gap-2 cursor-pointer">
        {/* 🎨 스위치 입력 */}
        <div className="relative">
          <input
            ref={ref}
            type="checkbox"
            className={twMerge(
              baseClasses,
              sizeClasses[size],
              colorClasses[color],
              error && 'peer-checked:bg-red-500',
              'peer'
            )}
            disabled={disabled}
            required={required}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? 'error-message' : helperText ? 'helper-text' : undefined}
            {...props}
          />
          {/* 🎨 썸(이동하는 원) */}
          <div
            className={twMerge(
              'absolute left-0.5 top-1/2 -translate-y-1/2 bg-white rounded-full shadow-sm transition-transform duration-200',
              thumbSizeClasses[size],
              'peer-checked:' + thumbPositionClasses[size]
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
Switch.displayName = 'Switch'

export default Switch 