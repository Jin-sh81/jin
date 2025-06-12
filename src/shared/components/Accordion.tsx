import React, { createContext, useContext, useState } from 'react'
import { twMerge } from 'tailwind-merge'

// 🎨 Accordion 아이템 타입 정의
export interface AccordionItem {
  /** 아코디언의 고유 식별자 */
  id: string
  /** 아코디언의 제목 */
  title: React.ReactNode
  /** 아코디언의 내용 */
  content: React.ReactNode
  /** 아코디언이 비활성화되었는지 여부 */
  disabled?: boolean
  /** 아코디언의 아이콘 */
  icon?: React.ReactNode
}

// 🎨 Accordion 컴포넌트의 props 타입 정의
export interface AccordionProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** 아코디언 아이템 배열 */
  items: AccordionItem[]
  /** 기본 확장된 아이템의 ID */
  defaultExpanded?: string
  /** 아이템 확장 시 호출되는 함수 */
  onChange?: (itemId: string) => void
  /** 아코디언의 크기 */
  size?: 'small' | 'medium' | 'large'
  /** 아코디언의 스타일 */
  variant?: 'default' | 'bordered' | 'separated'
  /** 아코디언의 색상 */
  color?: 'primary' | 'success' | 'warning' | 'error'
  /** 여러 아이템을 동시에 확장할 수 있는지 여부 */
  allowMultiple?: boolean
  /** 아코디언이 전체 너비를 차지할지 여부 */
  fullWidth?: boolean
}

// 🎨 Accordion 컨텍스트 타입 정의
interface AccordionContextType {
  expandedItems: string[]
  setExpandedItems: (items: string[]) => void
  variant: AccordionProps['variant']
  color: AccordionProps['color']
  size: AccordionProps['size']
  allowMultiple: boolean
}

// 🎨 Accordion 컨텍스트 생성
const AccordionContext = createContext<AccordionContextType | undefined>(undefined)

/**
 * 🎯 재사용 가능한 아코디언 컴포넌트
 * 
 * 이 컴포넌트는 확장/축소 가능한 콘텐츠를 제공합니다.
 * 다양한 스타일과 레이아웃을 지원합니다.
 * 
 * @example
 * // 기본 아코디언
 * <Accordion
 *   items={[
 *     { id: 'item1', title: '제목 1', content: '내용 1' },
 *     { id: 'item2', title: '제목 2', content: '내용 2' }
 *   ]}
 * />
 * 
 * // 아이콘이 있는 아코디언
 * <Accordion
 *   items={[
 *     { id: 'item1', title: '홈', icon: <HomeIcon />, content: '홈 내용' },
 *     { id: 'item2', title: '설정', icon: <SettingsIcon />, content: '설정 내용' }
 *   ]}
 * />
 */
const Accordion: React.FC<AccordionProps> = ({
  items,
  defaultExpanded,
  onChange,
  size = 'medium',
  variant = 'default',
  color = 'primary',
  allowMultiple = false,
  fullWidth = false,
  className,
  ...props
}) => {
  // 🎨 확장된 아이템 상태 관리
  const [expandedItems, setExpandedItems] = useState<string[]>(
    defaultExpanded ? [defaultExpanded] : []
  )

  // 🎨 아이템 확장/축소 핸들러
  const handleItemToggle = (itemId: string) => {
    const newExpandedItems = allowMultiple
      ? expandedItems.includes(itemId)
        ? expandedItems.filter(id => id !== itemId)
        : [...expandedItems, itemId]
      : expandedItems.includes(itemId)
        ? []
        : [itemId]

    setExpandedItems(newExpandedItems)
    onChange?.(itemId)
  }

  // 🎨 아코디언 크기에 따른 클래스
  const sizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  }

  // 🎨 아코디언 스타일에 따른 클래스
  const variantClasses = {
    default: 'border-b border-gray-200 last:border-b-0',
    bordered: 'border border-gray-200 rounded-lg mb-2 last:mb-0',
    separated: 'mb-2 last:mb-0'
  }

  // 🎨 아코디언 색상에 따른 클래스
  const colorClasses = {
    primary: 'text-blue-500',
    success: 'text-green-500',
    warning: 'text-yellow-500',
    error: 'text-red-500'
  }

  return (
    <AccordionContext.Provider
      value={{
        expandedItems,
        setExpandedItems,
        variant,
        color,
        size,
        allowMultiple
      }}
    >
      <div
        className={twMerge(
          'w-full',
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {items.map((item) => {
          const isExpanded = expandedItems.includes(item.id)

          return (
            <div
              key={item.id}
              className={twMerge(
                'transition-all duration-200',
                variantClasses[variant]
              )}
            >
              {/* 🎨 아코디언 헤더 */}
              <button
                className={twMerge(
                  'flex items-center justify-between w-full px-4 py-2 font-medium transition-colors duration-200',
                  sizeClasses[size],
                  isExpanded ? colorClasses[color] : 'text-gray-700',
                  item.disabled && 'opacity-50 cursor-not-allowed',
                  'hover:bg-gray-50'
                )}
                onClick={() => !item.disabled && handleItemToggle(item.id)}
                disabled={item.disabled}
                aria-expanded={isExpanded}
                aria-controls={`content-${item.id}`}
              >
                <div className="flex items-center gap-2">
                  {item.icon}
                  {item.title}
                </div>
                <svg
                  className={twMerge(
                    'w-5 h-5 transition-transform duration-200',
                    isExpanded && 'transform rotate-180'
                  )}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* 🎨 아코디언 내용 */}
              <div
                id={`content-${item.id}`}
                className={twMerge(
                  'overflow-hidden transition-all duration-200',
                  isExpanded ? 'max-h-96' : 'max-h-0'
                )}
              >
                <div className="p-4">
                  {item.content}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </AccordionContext.Provider>
  )
}

export default Accordion 