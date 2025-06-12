import React from 'react'
import { twMerge } from 'tailwind-merge'

// 🎨 Badge 컴포넌트의 props 타입 정의
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** 배지의 내용 */
  children: React.ReactNode
  /** 배지의 색상 */
  color?: 'primary' | 'success' | 'warning' | 'error' | 'info'
  /** 배지의 크기 */
  size?: 'small' | 'medium' | 'large'
  /** 배지의 모양 */
  variant?: 'solid' | 'outline' | 'soft'
  /** 배지가 둥근 모서리를 가질지 여부 */
  rounded?: boolean
  /** 배지에 아이콘을 추가할지 여부 */
  withIcon?: boolean
  /** 배지의 최대 너비 */
  maxWidth?: string
}

/**
 * 🎯 재사용 가능한 배지 컴포넌트
 * 
 * 이 컴포넌트는 상태나 카운트를 표시하는 배지를 제공합니다.
 * 다양한 색상과 스타일을 지원합니다.
 * 
 * @example
 * // 기본 배지
 * <Badge>New</Badge>
 * 
 * // 색상이 있는 배지
 * <Badge color="success">Completed</Badge>
 * 
 * // 아이콘이 있는 배지
 * <Badge withIcon>
 *   <Icon name="check" />
 *   Active
 * </Badge>
 */
const Badge: React.FC<BadgeProps> = ({
  children,
  color = 'primary',
  size = 'medium',
  variant = 'solid',
  rounded = true,
  withIcon = false,
  maxWidth,
  className,
  ...props
}) => {
  // 🎨 배지 크기에 따른 클래스
  const sizeClasses = {
    small: 'px-1.5 py-0.5 text-xs',
    medium: 'px-2 py-0.5 text-sm',
    large: 'px-2.5 py-1 text-base'
  }

  // 🎨 배지 색상에 따른 클래스
  const colorClasses = {
    primary: {
      solid: 'bg-blue-500 text-white',
      outline: 'border border-blue-500 text-blue-500',
      soft: 'bg-blue-100 text-blue-700'
    },
    success: {
      solid: 'bg-green-500 text-white',
      outline: 'border border-green-500 text-green-500',
      soft: 'bg-green-100 text-green-700'
    },
    warning: {
      solid: 'bg-yellow-500 text-white',
      outline: 'border border-yellow-500 text-yellow-500',
      soft: 'bg-yellow-100 text-yellow-700'
    },
    error: {
      solid: 'bg-red-500 text-white',
      outline: 'border border-red-500 text-red-500',
      soft: 'bg-red-100 text-red-700'
    },
    info: {
      solid: 'bg-gray-500 text-white',
      outline: 'border border-gray-500 text-gray-500',
      soft: 'bg-gray-100 text-gray-700'
    }
  }

  // 🎨 기본 클래스
  const baseClasses = 'inline-flex items-center font-medium whitespace-nowrap'

  return (
    <span
      className={twMerge(
        baseClasses,
        sizeClasses[size],
        colorClasses[color][variant],
        rounded && 'rounded-full',
        withIcon && 'gap-1',
        maxWidth && `max-w-[${maxWidth}]`,
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

export default Badge 