import React, { createContext, useContext, useState } from 'react'
import { twMerge } from 'tailwind-merge'

// 🎨 Tab 아이템 타입 정의
export interface TabItem {
  /** 탭의 고유 식별자 */
  id: string
  /** 탭의 레이블 */
  label: React.ReactNode
  /** 탭의 내용 */
  content: React.ReactNode
  /** 탭이 비활성화되었는지 여부 */
  disabled?: boolean
  /** 탭의 아이콘 */
  icon?: React.ReactNode
}

// 🎨 Tabs 컴포넌트의 props 타입 정의
export interface TabsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** 탭 아이템 배열 */
  items: TabItem[]
  /** 기본 선택된 탭의 ID */
  defaultTab?: string
  /** 탭 변경 시 호출되는 함수 */
  onChange?: (tabId: string) => void
  /** 탭의 크기 */
  size?: 'small' | 'medium' | 'large'
  /** 탭의 스타일 */
  variant?: 'line' | 'enclosed' | 'soft-rounded' | 'solid-rounded'
  /** 탭의 색상 */
  color?: 'primary' | 'success' | 'warning' | 'error'
  /** 탭이 전체 너비를 차지할지 여부 */
  fullWidth?: boolean
  /** 탭의 위치 */
  position?: 'top' | 'bottom' | 'left' | 'right'
}

// 🎨 Tabs 컨텍스트 타입 정의
interface TabsContextType {
  selectedTab: string
  setSelectedTab: (id: string) => void
  variant: TabsProps['variant']
  color: TabsProps['color']
  size: TabsProps['size']
}

// 🎨 Tabs 컨텍스트 생성
const TabsContext = createContext<TabsContextType | undefined>(undefined)

/**
 * 🎯 재사용 가능한 탭 컴포넌트
 * 
 * 이 컴포넌트는 여러 콘텐츠를 탭으로 구분하여 표시합니다.
 * 다양한 스타일과 레이아웃을 지원합니다.
 * 
 * @example
 * // 기본 탭
 * <Tabs
 *   items={[
 *     { id: 'tab1', label: '탭 1', content: '내용 1' },
 *     { id: 'tab2', label: '탭 2', content: '내용 2' }
 *   ]}
 * />
 * 
 * // 아이콘이 있는 탭
 * <Tabs
 *   items={[
 *     { id: 'tab1', label: '홈', icon: <HomeIcon />, content: '홈 내용' },
 *     { id: 'tab2', label: '설정', icon: <SettingsIcon />, content: '설정 내용' }
 *   ]}
 * />
 */
const Tabs: React.FC<TabsProps> = ({
  items,
  defaultTab,
  onChange,
  size = 'medium',
  variant = 'line',
  color = 'primary',
  fullWidth = false,
  position = 'top',
  className,
  ...props
}) => {
  // 🎨 선택된 탭 상태 관리
  const [selectedTab, setSelectedTab] = useState(defaultTab || items[0]?.id)

  // 🎨 탭 변경 핸들러
  const handleTabChange = (tabId: string) => {
    setSelectedTab(tabId)
    onChange?.(tabId)
  }

  // 🎨 탭 크기에 따른 클래스
  const sizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  }

  // 🎨 탭 스타일에 따른 클래스
  const variantClasses = {
    line: 'border-b-2 border-transparent hover:border-gray-300',
    enclosed: 'border border-transparent rounded-t-lg',
    'soft-rounded': 'rounded-lg',
    'solid-rounded': 'rounded-full'
  }

  // 🎨 탭 색상에 따른 클래스
  const colorClasses = {
    primary: {
      line: 'border-blue-500 text-blue-500',
      enclosed: 'bg-blue-500 text-white',
      'soft-rounded': 'bg-blue-100 text-blue-700',
      'solid-rounded': 'bg-blue-500 text-white'
    },
    success: {
      line: 'border-green-500 text-green-500',
      enclosed: 'bg-green-500 text-white',
      'soft-rounded': 'bg-green-100 text-green-700',
      'solid-rounded': 'bg-green-500 text-white'
    },
    warning: {
      line: 'border-yellow-500 text-yellow-500',
      enclosed: 'bg-yellow-500 text-white',
      'soft-rounded': 'bg-yellow-100 text-yellow-700',
      'solid-rounded': 'bg-yellow-500 text-white'
    },
    error: {
      line: 'border-red-500 text-red-500',
      enclosed: 'bg-red-500 text-white',
      'soft-rounded': 'bg-red-100 text-red-700',
      'solid-rounded': 'bg-red-500 text-white'
    }
  }

  // 🎨 탭 레이아웃 클래스
  const layoutClasses = {
    top: 'flex-col',
    bottom: 'flex-col-reverse',
    left: 'flex-row',
    right: 'flex-row-reverse'
  }

  return (
    <TabsContext.Provider
      value={{
        selectedTab,
        setSelectedTab: handleTabChange,
        variant,
        color,
        size
      }}
    >
      <div
        className={twMerge(
          'flex',
          layoutClasses[position],
          className
        )}
        {...props}
      >
        {/* 🎨 탭 목록 */}
        <div
          className={twMerge(
            'flex',
            position === 'left' || position === 'right'
              ? 'flex-col'
              : 'flex-row',
            fullWidth && 'w-full'
          )}
        >
          {items.map((item) => (
            <button
              key={item.id}
              className={twMerge(
                'flex items-center gap-2 px-4 py-2 font-medium transition-colors duration-200',
                sizeClasses[size],
                variantClasses[variant],
                selectedTab === item.id
                  ? colorClasses[color][variant]
                  : 'text-gray-500 hover:text-gray-700',
                item.disabled && 'opacity-50 cursor-not-allowed',
                fullWidth && 'flex-1'
              )}
              onClick={() => !item.disabled && handleTabChange(item.id)}
              disabled={item.disabled}
              role="tab"
              aria-selected={selectedTab === item.id}
              aria-controls={`panel-${item.id}`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>

        {/* 🎨 탭 내용 */}
        <div className="flex-1 p-4">
          {items.map((item) => (
            <div
              key={item.id}
              role="tabpanel"
              id={`panel-${item.id}`}
              aria-labelledby={item.id}
              hidden={selectedTab !== item.id}
            >
              {item.content}
            </div>
          ))}
        </div>
      </div>
    </TabsContext.Provider>
  )
}

export default Tabs 