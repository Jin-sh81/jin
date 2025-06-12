import React, { createContext, useContext, forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'
import Radio from './Radio'

// 🎨 RadioGroup 옵션 타입
export interface RadioOption {
  /** 옵션의 값 */
  value: string
  /** 옵션의 레이블 */
  label: string
  /** 옵션이 비활성화되었는지 여부 */
  disabled?: boolean
}

// 🎨 RadioGroup Context 타입
interface RadioGroupContextType {
  /** 선택된 값 */
  value?: string
  /** 값이 변경될 때 호출되는 함수 */
  onChange?: (value: string) => void
  /** 라디오 버튼의 이름 */
  name?: string
  /** 라디오 버튼이 비활성화되었는지 여부 */
  disabled?: boolean
  /** 라디오 버튼의 크기 */
  size?: 'small' | 'medium' | 'large'
  /** 라디오 버튼의 색상 */
  color?: 'primary' | 'success' | 'warning' | 'error'
}

// 🎨 RadioGroup Context 생성
const RadioGroupContext = createContext<RadioGroupContextType>({})

// 🎨 RadioGroup 컴포넌트의 props 타입 정의
export interface RadioGroupProps {
  /** 라디오 그룹의 레이블 */
  label?: string
  /** 에러 메시지 */
  error?: string
  /** 도움말 텍스트 */
  helperText?: string
  /** 선택된 값 */
  value?: string
  /** 값이 변경될 때 호출되는 함수 */
  onChange?: (value: string) => void
  /** 라디오 버튼의 이름 */
  name?: string
  /** 라디오 버튼이 비활성화되었는지 여부 */
  disabled?: boolean
  /** 라디오 버튼이 필수인지 여부 */
  required?: boolean
  /** 라디오 버튼의 크기 */
  size?: 'small' | 'medium' | 'large'
  /** 라디오 버튼의 색상 */
  color?: 'primary' | 'success' | 'warning' | 'error'
  /** 라디오 버튼의 너비 */
  fullWidth?: boolean
  /** 라디오 버튼의 배치 방향 */
  orientation?: 'horizontal' | 'vertical'
  /** 라디오 버튼 옵션 목록 */
  options?: RadioOption[]
  /** 자식 요소 */
  children?: React.ReactNode
  /** 추가 클래스 */
  className?: string
}

/**
 * 재사용 가능한 라디오 그룹 컴포넌트
 * 
 * 이 컴포넌트는 라디오 버튼들을 그룹화하고 상태를 관리합니다.
 * 접근성과 사용자 경험을 고려하여 설계되었습니다.
 * 
 * @example
 * // 기본 라디오 그룹
 * <RadioGroup
 *   label="성별"
 *   name="gender"
 *   value={gender}
 *   onChange={setGender}
 *   options={[
 *     { value: 'male', label: '남성' },
 *     { value: 'female', label: '여성' }
 *   ]}
 * />
 * 
 * // 에러가 있는 라디오 그룹
 * <RadioGroup
 *   label="지역"
 *   error="지역을 선택해주세요"
 *   options={[
 *     { value: 'seoul', label: '서울' },
 *     { value: 'busan', label: '부산' }
 *   ]}
 * />
 * 
 * // 커스텀 자식 요소가 있는 라디오 그룹
 * <RadioGroup
 *   label="취미"
 *   orientation="vertical"
 * >
 *   <Radio label="독서" value="reading" />
 *   <Radio label="운동" value="exercise" />
 *   <Radio label="음악" value="music" />
 * </RadioGroup>
 */
const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(({
  label,
  error,
  helperText,
  value,
  onChange,
  name,
  disabled = false,
  required = false,
  size = 'medium',
  color = 'primary',
  fullWidth = false,
  orientation = 'horizontal',
  options,
  children,
  className,
  ...props
}, ref) => {
  // 🎨 Context 값
  const contextValue = {
    value,
    onChange,
    name,
    disabled,
    size,
    color
  }

  return (
    <RadioGroupContext.Provider value={contextValue}>
      <div
        ref={ref}
        className={twMerge(
          'flex flex-col gap-1',
          fullWidth && 'w-full',
          className
        )}
        role="radiogroup"
        aria-labelledby={label ? 'radio-group-label' : undefined}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? 'error-message' : helperText ? 'helper-text' : undefined}
        {...props}
      >
        {/* 🎨 레이블 */}
        {label && (
          <label
            id="radio-group-label"
            className="text-sm font-medium text-gray-700"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {/* 🎨 라디오 버튼 컨테이너 */}
        <div
          className={twMerge(
            'flex gap-4',
            orientation === 'vertical' ? 'flex-col' : 'flex-row'
          )}
        >
          {/* 🎨 옵션 목록이 있는 경우 */}
          {options?.map((option) => (
            <Radio
              key={option.value}
              label={option.label}
              value={option.value}
              disabled={option.disabled || disabled}
            />
          ))}

          {/* 🎨 커스텀 자식 요소가 있는 경우 */}
          {children}
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
    </RadioGroupContext.Provider>
  )
})

// 🎨 컴포넌트 이름 설정
RadioGroup.displayName = 'RadioGroup'

// 🎨 Radio 컴포넌트에서 Context 사용을 위한 Hook
export const useRadioGroup = () => {
  const context = useContext(RadioGroupContext)
  if (!context) {
    throw new Error('Radio 컴포넌트는 RadioGroup 내부에서 사용되어야 합니다.')
  }
  return context
}

 