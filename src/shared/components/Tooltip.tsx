import React, { useState, useRef, useEffect } from 'react'
import { twMerge } from 'tailwind-merge'

// 🎨 Tooltip 컴포넌트의 props 타입 정의
export interface TooltipProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'content'> {
  /** 툴팁의 내용 */
  content: React.ReactNode
  /** 툴팁이 표시될 위치 */
  placement?: 'top' | 'right' | 'bottom' | 'left'
  /** 툴팁의 크기 */
  size?: 'small' | 'medium' | 'large'
  /** 툴팁의 색상 */
  color?: 'primary' | 'success' | 'warning' | 'error'
  /** 툴팁이 표시되는 지연 시간 (ms) */
  delay?: number
  /** 툴팁이 사라지는 지연 시간 (ms) */
  hideDelay?: number
  /** 툴팁이 항상 표시될지 여부 */
  alwaysShow?: boolean
  /** 툴팁이 비활성화되었는지 여부 */
  disabled?: boolean
  /** 툴팁의 최대 너비 */
  maxWidth?: string
  /** 툴팁의 화살표 표시 여부 */
  showArrow?: boolean
}

/**
 * 🎯 재사용 가능한 툴팁 컴포넌트
 * 
 * 이 컴포넌트는 요소에 대한 추가 정보를 표시합니다.
 * 다양한 위치와 스타일을 지원합니다.
 * 
 * @example
 * // 기본 툴팁
 * <Tooltip content="도움말">
 *   <button>버튼</button>
 * </Tooltip>
 * 
 * // 위치가 지정된 툴팁
 * <Tooltip content="오른쪽 툴팁" placement="right">
 *   <button>버튼</button>
 * </Tooltip>
 * 
 * // 색상이 있는 툴팁
 * <Tooltip content="성공" color="success">
 *   <button>버튼</button>
 * </Tooltip>
 */
const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  placement = 'top',
  size = 'medium',
  color = 'primary',
  delay = 0,
  hideDelay = 0,
  alwaysShow = false,
  disabled = false,
  maxWidth = '200px',
  showArrow = true,
  className,
  ...props
}) => {
  // 🎨 툴팁 상태 관리
  const [isVisible, setIsVisible] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const triggerRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  let showTimeout: NodeJS.Timeout
  let hideTimeout: NodeJS.Timeout

  // 🎨 툴팁 위치 계산
  const calculatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return

    const trigger = triggerRef.current.getBoundingClientRect()
    const tooltip = tooltipRef.current.getBoundingClientRect()
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop

    const positions = {
      top: {
        top: trigger.top - tooltip.height - 8 + scrollTop,
        left: trigger.left + (trigger.width - tooltip.width) / 2 + scrollLeft
      },
      right: {
        top: trigger.top + (trigger.height - tooltip.height) / 2 + scrollTop,
        left: trigger.right + 8 + scrollLeft
      },
      bottom: {
        top: trigger.bottom + 8 + scrollTop,
        left: trigger.left + (trigger.width - tooltip.width) / 2 + scrollLeft
      },
      left: {
        top: trigger.top + (trigger.height - tooltip.height) / 2 + scrollTop,
        left: trigger.left - tooltip.width - 8 + scrollLeft
      }
    }

    setPosition(positions[placement])
  }

  // 🎨 툴팁 표시 핸들러
  const handleShow = () => {
    if (disabled) return
    clearTimeout(hideTimeout)
    showTimeout = setTimeout(() => {
      setIsVisible(true)
      calculatePosition()
    }, delay)
  }

  // 🎨 툴팁 숨김 핸들러
  const handleHide = () => {
    if (disabled) return
    clearTimeout(showTimeout)
    hideTimeout = setTimeout(() => {
      setIsVisible(false)
    }, hideDelay)
  }

  // 🎨 스크롤 및 리사이즈 이벤트 처리
  useEffect(() => {
    if (isVisible) {
      window.addEventListener('scroll', calculatePosition)
      window.addEventListener('resize', calculatePosition)
    }

    return () => {
      window.removeEventListener('scroll', calculatePosition)
      window.removeEventListener('resize', calculatePosition)
    }
  }, [isVisible])

  // 🎨 툴팁 크기에 따른 클래스
  const sizeClasses = {
    small: 'text-xs px-2 py-1',
    medium: 'text-sm px-3 py-1.5',
    large: 'text-base px-4 py-2'
  }

  // 🎨 툴팁 색상에 따른 클래스
  const colorClasses = {
    primary: 'bg-blue-500 text-white',
    success: 'bg-green-500 text-white',
    warning: 'bg-yellow-500 text-white',
    error: 'bg-red-500 text-white'
  }

  // 🎨 툴팁 위치에 따른 클래스
  const placementClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2'
  }

  // 🎨 화살표 위치에 따른 클래스
  const arrowPlacementClasses = {
    top: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-full border-t-current',
    right: 'left-0 top-1/2 -translate-y-1/2 -translate-x-full border-r-current',
    bottom: 'top-0 left-1/2 -translate-x-1/2 -translate-y-full border-b-current',
    left: 'right-0 top-1/2 -translate-y-1/2 translate-x-full border-l-current'
  }

  return (
    <div
      ref={triggerRef}
      className="inline-block"
      onMouseEnter={handleShow}
      onMouseLeave={handleHide}
      onFocus={handleShow}
      onBlur={handleHide}
    >
      {children}
      {(isVisible || alwaysShow) && !disabled && (
        <div
          ref={tooltipRef}
          className={twMerge(
            'fixed z-50 rounded-lg shadow-lg',
            sizeClasses[size],
            colorClasses[color],
            placementClasses[placement],
            'max-w-[${maxWidth}]',
            className
          )}
          style={{
            top: position.top,
            left: position.left
          }}
          role="tooltip"
          {...props}
        >
          {content}
          {showArrow && (
            <div
              className={twMerge(
                'absolute w-0 h-0 border-4 border-transparent',
                arrowPlacementClasses[placement]
              )}
            />
          )}
        </div>
      )}
    </div>
  )
}

export default Tooltip 