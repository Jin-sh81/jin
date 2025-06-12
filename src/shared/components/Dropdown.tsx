import React, { useState, useRef, useEffect } from 'react'
import { twMerge } from 'tailwind-merge'

// 🎨 Dropdown 아이템 타입 정의
export interface DropdownItem {
  /** 드롭다운 아이템의 고유 식별자 */
  id: string
  /** 드롭다운 아이템의 레이블 */
  label: React.ReactNode
  /** 드롭다운 아이템의 아이콘 */
  icon?: React.ReactNode
  /** 드롭다운 아이템이 비활성화되었는지 여부 */
  disabled?: boolean
  /** 드롭다운 아이템이 구분선인지 여부 */
  divider?: boolean
  /** 드롭다운 아이템의 색상 */
  color?: 'primary' | 'success' | 'warning' | 'error'
}

// 🎨 Dropdown 컴포넌트의 props 타입 정의
export interface DropdownProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** 드롭다운의 트리거 요소 */
  trigger: React.ReactNode
  /** 드롭다운 아이템 배열 */
  items: DropdownItem[]
  /** 드롭다운이 표시될 위치 */
  placement?: 'top' | 'right' | 'bottom' | 'left'
  /** 드롭다운의 크기 */
  size?: 'small' | 'medium' | 'large'
  /** 드롭다운의 너비 */
  width?: string
  /** 드롭다운이 표시되는 지연 시간 (ms) */
  delay?: number
  /** 드롭다운이 사라지는 지연 시간 (ms) */
  hideDelay?: number
  /** 드롭다운이 항상 표시될지 여부 */
  alwaysShow?: boolean
  /** 드롭다운이 비활성화되었는지 여부 */
  disabled?: boolean
  /** 아이템 선택 시 호출되는 함수 */
  onChange?: (itemId: string) => void
  /** 드롭다운의 스타일 */
  variant?: 'default' | 'bordered' | 'shadow'
}

/**
 * 🎯 재사용 가능한 드롭다운 컴포넌트
 * 
 * 이 컴포넌트는 클릭 시 메뉴를 표시합니다.
 * 다양한 스타일과 레이아웃을 지원합니다.
 * 
 * @example
 * // 기본 드롭다운
 * <Dropdown
 *   trigger={<button>메뉴</button>}
 *   items={[
 *     { id: 'item1', label: '항목 1' },
 *     { id: 'item2', label: '항목 2' }
 *   ]}
 * />
 * 
 * // 아이콘이 있는 드롭다운
 * <Dropdown
 *   trigger={<button>메뉴</button>}
 *   items={[
 *     { id: 'item1', label: '홈', icon: <HomeIcon /> },
 *     { id: 'item2', label: '설정', icon: <SettingsIcon /> }
 *   ]}
 * />
 */
const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  items,
  placement = 'bottom',
  size = 'medium',
  width = '200px',
  delay = 0,
  hideDelay = 0,
  alwaysShow = false,
  disabled = false,
  onChange,
  variant = 'default',
  className,
  ...props
}) => {
  // 🎨 드롭다운 상태 관리
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const triggerRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  let showTimeout: NodeJS.Timeout
  let hideTimeout: NodeJS.Timeout

  // 🎨 드롭다운 위치 계산
  const calculatePosition = () => {
    if (!triggerRef.current || !dropdownRef.current) return

    const trigger = triggerRef.current.getBoundingClientRect()
    const dropdown = dropdownRef.current.getBoundingClientRect()
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop

    const positions = {
      top: {
        top: trigger.top - dropdown.height - 8 + scrollTop,
        left: trigger.left + scrollLeft
      },
      right: {
        top: trigger.top + scrollTop,
        left: trigger.right + 8 + scrollLeft
      },
      bottom: {
        top: trigger.bottom + 8 + scrollTop,
        left: trigger.left + scrollLeft
      },
      left: {
        top: trigger.top + scrollTop,
        left: trigger.left - dropdown.width - 8 + scrollLeft
      }
    }

    setPosition(positions[placement])
  }

  // 🎨 드롭다운 표시 핸들러
  const handleShow = () => {
    if (disabled) return
    clearTimeout(hideTimeout)
    showTimeout = setTimeout(() => {
      setIsOpen(true)
      calculatePosition()
    }, delay)
  }

  // 🎨 드롭다운 숨김 핸들러
  const handleHide = () => {
    if (disabled) return
    clearTimeout(showTimeout)
    hideTimeout = setTimeout(() => {
      setIsOpen(false)
    }, hideDelay)
  }

  // 🎨 아이템 클릭 핸들러
  const handleItemClick = (item: DropdownItem) => {
    if (item.disabled || item.divider) return
    onChange?.(item.id)
    handleHide()
  }

  // 🎨 스크롤 및 리사이즈 이벤트 처리
  useEffect(() => {
    if (isOpen) {
      window.addEventListener('scroll', calculatePosition)
      window.addEventListener('resize', calculatePosition)
    }

    return () => {
      window.removeEventListener('scroll', calculatePosition)
      window.removeEventListener('resize', calculatePosition)
    }
  }, [isOpen])

  // 🎨 드롭다운 크기에 따른 클래스
  const sizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  }

  // 🎨 드롭다운 스타일에 따른 클래스
  const variantClasses = {
    default: 'bg-white',
    bordered: 'bg-white border border-gray-200',
    shadow: 'bg-white shadow-lg'
  }

  // 🎨 아이템 색상에 따른 클래스
  const colorClasses = {
    primary: 'text-blue-500 hover:bg-blue-50',
    success: 'text-green-500 hover:bg-green-50',
    warning: 'text-yellow-500 hover:bg-yellow-50',
    error: 'text-red-500 hover:bg-red-50'
  }

  return (
    <div
      ref={triggerRef}
      className="inline-block"
      onMouseEnter={handleShow}
      onMouseLeave={handleHide}
    >
      {trigger}
      {(isOpen || alwaysShow) && !disabled && (
        <div
          ref={dropdownRef}
          className={twMerge(
            'fixed z-50 rounded-lg',
            sizeClasses[size],
            variantClasses[variant],
            className
          )}
          style={{
            top: position.top,
            left: position.left,
            width
          }}
          role="menu"
          {...props}
        >
          {items.map((item) => (
            item.divider ? (
              <div
                key={item.id}
                className="h-px bg-gray-200 my-1"
              />
            ) : (
              <button
                key={item.id}
                className={twMerge(
                  'flex items-center gap-2 w-full px-4 py-2 text-left transition-colors duration-200',
                  item.disabled
                    ? 'opacity-50 cursor-not-allowed'
                    : colorClasses[item.color || 'primary']
                )}
                onClick={() => handleItemClick(item)}
                disabled={item.disabled}
                role="menuitem"
              >
                {item.icon}
                {item.label}
              </button>
            )
          ))}
        </div>
      )}
    </div>
  )
}

export default Dropdown 