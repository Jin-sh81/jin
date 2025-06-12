import React, { forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'
import { useRadioGroup } from './RadioGroup'

// 🎨 Radio 컴포넌트의 props 타입 정의
export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** 라디오 버튼의 레이블 */
  label?: string
  /** 에러 메시지 */
  error?: string
  /** 도움말 텍스트 */
  helperText?: string
  /** 라디오 버튼이 비활성화되었는지 여부 */
  disabled?: boolean
  /** 라디오 버튼이 필수인지 여부 */
  required?: boolean
  /** 라디오 버튼의 크기 */
  size?: 'small' | 'medium' | 'large'
  /** 라디오 버튼의 색상 */
  color?: 'primary' | 'success' | 'warning' | 'error'
}

/**
 * 🎯 재사용 가능한 라디오 버튼 컴포넌트
 * 
 * 이 컴포넌트는 라디오 버튼 입력을 제공합니다.
 * 접근성과 사용자 경험을 고려하여 설계되었습니다.
 * 
 * @example
 * // 기본 라디오 버튼
 * <Radio
 *   label="남성"
 *   name="gender"
 *   value="male"
 * />
 * 
 * // 에러가 있는 라디오 버튼
 * <Radio
 *   label="여성"
 *   name="gender"
 *   value="female"
 *   error="성별을 선택해주세요"
 * />
 * 
 * // 다른 색상의 라디오 버튼
 * <Radio
 *   label="기타"
 *   name="gender"
 *   value="other"
 *   color="success"
 * />
 */
const Radio = forwardRef<HTMLInputElement, RadioProps>(({
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
  // 🎨 RadioGroup Context 사용
  const group = useRadioGroup()

  // 🎨 RadioGroup의 값이 있으면 그것을 사용
  const isDisabled = disabled || group?.disabled
  const radioSize = group?.size || size
  const radioColor = group?.color || color
  const isChecked = group?.value === props.value

  // 🎨 값이 변경될 때 호출되는 함수
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (group?.onChange) {
      group.onChange(event.target.value)
    }
    props.onChange?.(event)
  }

  // 🎨 라디오 버튼 크기에 따른 클래스
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-5 h-5',
    large: 'w-6 h-6'
  }

  // 🎨 라디오 버튼 색상에 따른 클래스
  const colorClasses = {
    primary: 'text-blue-500 border-gray-300 focus:ring-blue-500',
    success: 'text-green-500 border-gray-300 focus:ring-green-500',
    warning: 'text-yellow-500 border-gray-300 focus:ring-yellow-500',
    error: 'text-red-500 border-gray-300 focus:ring-red-500'
  }

  // 🎨 기본 클래스
  const baseClasses = 'rounded-full border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

  return (
    <div className="flex flex-col gap-1">
      {/* 🎨 라디오 버튼 컨테이너 */}
      <label className="inline-flex items-center gap-2 cursor-pointer">
        {/* 🎨 라디오 버튼 입력 */}
        <div className="relative">
          <input
            ref={ref}
            type="radio"
            className={twMerge(
              baseClasses,
              sizeClasses[radioSize],
              colorClasses[radioColor],
              error && 'border-red-500 focus:ring-red-500',
              'peer'
            )}
            disabled={isDisabled}
            required={required}
            checked={isChecked}
            name={group?.name}
            onChange={handleChange}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? 'error-message' : helperText ? 'helper-text' : undefined}
            {...props}
          />
          {/* 🎨 선택 표시 */}
          <div
            className={twMerge(
              'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 rounded-full bg-current opacity-0 peer-checked:opacity-100 transition-opacity duration-200',
              radioSize === 'small' && 'w-1/3 h-1/3'
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
Radio.displayName = 'Radio'

export default Radio 