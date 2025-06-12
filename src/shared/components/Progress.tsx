import React from 'react'
import { twMerge } from 'tailwind-merge'

// 🎨 Progress 컴포넌트의 props 타입 정의
export interface ProgressProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'style'> {
  /** 진행률 (0-100) */
  value: number
  /** 진행률의 최대값 */
  max?: number
  /** 진행률의 최소값 */
  min?: number
  /** 진행률의 크기 */
  size?: 'small' | 'medium' | 'large'
  /** 진행률의 색상 */
  variant?: 'primary' | 'success' | 'warning' | 'error'
  /** 진행률의 스타일 */
  style?: 'default' | 'striped' | 'gradient'
  /** 진행률의 라벨을 표시할지 여부 */
  showLabel?: boolean
  /** 진행률의 라벨 포맷 */
  labelFormat?: (value: number) => string
  /** 진행률의 배경색 */
  bgColor?: string
  /** 진행률의 색상 */
  barColor?: string
  /** 진행률의 애니메이션 */
  animated?: boolean
}

/**
 * 🎯 재사용 가능한 진행률 컴포넌트
 * 
 * 이 컴포넌트는 작업의 진행 상태를 시각적으로 표시합니다.
 * 다양한 스타일과 레이아웃을 지원합니다.
 * 
 * @example
 * // 기본 진행률
 * <Progress value={75} />
 * 
 * // 스타일이 있는 진행률
 * <Progress
 *   value={75}
 *   style="striped"
 *   variant="success"
 *   showLabel
 * />
 */
const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  min = 0,
  size = 'medium',
  variant = 'primary',
  style = 'default',
  showLabel = false,
  labelFormat,
  bgColor,
  barColor,
  animated = false,
  className,
  ...props
}) => {
  // 🎨 진행률 계산
  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100))

  // 🎨 진행률 크기에 따른 클래스
  const sizeClasses = {
    small: 'h-1',
    medium: 'h-2',
    large: 'h-4'
  }

  // 🎨 진행률 색상에 따른 클래스
  const colorClasses = {
    primary: {
      bg: 'bg-blue-100',
      bar: 'bg-blue-500'
    },
    success: {
      bg: 'bg-green-100',
      bar: 'bg-green-500'
    },
    warning: {
      bg: 'bg-yellow-100',
      bar: 'bg-yellow-500'
    },
    error: {
      bg: 'bg-red-100',
      bar: 'bg-red-500'
    }
  }

  // 🎨 진행률 스타일에 따른 클래스
  const styleClasses = {
    default: '',
    striped: 'bg-stripes',
    gradient: 'bg-gradient-to-r from-blue-500 to-purple-500'
  }

  // 🎨 라벨 포맷
  const formatLabel = (value: number) => {
    if (labelFormat) return labelFormat(value)
    return `${Math.round(value)}%`
  }

  return (
    <div className="w-full" {...props}>
      {/* 🎨 진행률 바 */}
      <div
        className={twMerge(
          'relative w-full overflow-hidden rounded-full',
          sizeClasses[size],
          bgColor || colorClasses[variant].bg,
          className
        )}
      >
        <div
          className={twMerge(
            'h-full transition-all duration-300 ease-in-out',
            style === 'default' && (barColor || colorClasses[variant].bar),
            styleClasses[style],
            animated && 'animate-progress'
          )}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={min}
          aria-valuemax={max}
        />
      </div>

      {/* 🎨 라벨 */}
      {showLabel && (
        <div className="mt-1 text-sm text-gray-600 text-right">
          {formatLabel(percentage)}
        </div>
      )}
    </div>
  )
}

export default Progress 