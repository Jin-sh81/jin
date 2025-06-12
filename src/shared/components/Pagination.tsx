import React from 'react'
import { twMerge } from 'tailwind-merge'

// 🎨 Pagination 컴포넌트의 props 타입 정의
export interface PaginationProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** 전체 페이지 수 */
  totalPages: number
  /** 현재 페이지 */
  currentPage: number
  /** 페이지 변경 시 호출되는 함수 */
  onChange: (page: number) => void
  /** 페이지네이션의 크기 */
  size?: 'small' | 'medium' | 'large'
  /** 페이지네이션의 색상 */
  color?: 'primary' | 'success' | 'warning' | 'error'
  /** 페이지네이션의 스타일 */
  variant?: 'default' | 'bordered' | 'rounded'
  /** 페이지네이션이 전체 너비를 차지할지 여부 */
  fullWidth?: boolean
  /** 표시할 페이지 수 */
  siblingCount?: number
  /** 첫 페이지와 마지막 페이지를 항상 표시할지 여부 */
  showFirstLast?: boolean
  /** 이전/다음 버튼을 표시할지 여부 */
  showPrevNext?: boolean
  /** 페이지 번호를 표시할지 여부 */
  showNumbers?: boolean
}

/**
 * 🎯 재사용 가능한 페이지네이션 컴포넌트
 * 
 * 이 컴포넌트는 페이지 간 이동을 위한 컨트롤을 제공합니다.
 * 다양한 스타일과 레이아웃을 지원합니다.
 * 
 * @example
 * // 기본 페이지네이션
 * <Pagination
 *   totalPages={10}
 *   currentPage={1}
 *   onChange={setPage}
 * />
 * 
 * // 스타일이 있는 페이지네이션
 * <Pagination
 *   totalPages={10}
 *   currentPage={1}
 *   onChange={setPage}
 *   variant="bordered"
 *   color="success"
 * />
 */
const Pagination: React.FC<PaginationProps> = ({
  totalPages,
  currentPage,
  onChange,
  size = 'medium',
  color = 'primary',
  variant = 'default',
  fullWidth = false,
  siblingCount = 1,
  showFirstLast = true,
  showPrevNext = true,
  showNumbers = true,
  className,
  ...props
}) => {
  // 🎨 페이지네이션 크기에 따른 클래스
  const sizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  }

  // 🎨 페이지네이션 색상에 따른 클래스
  const colorClasses = {
    primary: {
      active: 'bg-blue-500 text-white',
      hover: 'hover:bg-blue-50',
      border: 'border-blue-500'
    },
    success: {
      active: 'bg-green-500 text-white',
      hover: 'hover:bg-green-50',
      border: 'border-green-500'
    },
    warning: {
      active: 'bg-yellow-500 text-white',
      hover: 'hover:bg-yellow-50',
      border: 'border-yellow-500'
    },
    error: {
      active: 'bg-red-500 text-white',
      hover: 'hover:bg-red-50',
      border: 'border-red-500'
    }
  }

  // 🎨 페이지네이션 스타일에 따른 클래스
  const variantClasses = {
    default: 'gap-1',
    bordered: 'gap-1',
    rounded: 'gap-2'
  }

  // 🎨 페이지 범위 계산
  const range = (start: number, end: number) => {
    const length = end - start + 1
    return Array.from({ length }, (_, i) => start + i)
  }

  // 🎨 페이지 번호 생성
  const generatePagination = () => {
    const totalNumbers = siblingCount + 5
    const totalBlocks = totalNumbers + 2

    if (totalPages > totalBlocks) {
      const startPage = Math.max(2, currentPage - siblingCount)
      const endPage = Math.min(totalPages - 1, currentPage + siblingCount)

      const pages = range(startPage, endPage)

      const hasLeftSpill = startPage > 2
      const hasRightSpill = totalPages - endPage > 1
      const spillOffset = totalNumbers - (pages.length + 1)

      return [
        showFirstLast ? 1 : null,
        hasLeftSpill ? '...' : null,
        ...pages,
        hasRightSpill ? '...' : null,
        showFirstLast ? totalPages : null
      ].filter((item): item is number | string => item !== null)
    }

    return range(1, totalPages)
  }

  // 🎨 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return
    onChange(page)
  }

  // 🎨 페이지 버튼 렌더링
  const renderPageButton = (page: number | string, index: number) => {
    if (page === '...') {
      return (
        <span
          key={`ellipsis-${index}`}
          className="px-4 py-2"
        >
          ...
        </span>
      )
    }

    const isActive = page === currentPage

    return (
      <button
        key={page}
        className={twMerge(
          'px-4 py-2 font-medium transition-colors duration-200',
          sizeClasses[size],
          variant === 'bordered' && 'border',
          variant === 'rounded' && 'rounded-full',
          isActive
            ? colorClasses[color].active
            : [
                colorClasses[color].hover,
                variant === 'bordered' && colorClasses[color].border
              ],
          fullWidth && 'flex-1'
        )}
        onClick={() => handlePageChange(page as number)}
        disabled={isActive}
        aria-current={isActive ? 'page' : undefined}
      >
        {page}
      </button>
    )
  }

  return (
    <div
      className={twMerge(
        'flex items-center justify-center',
        variantClasses[variant],
        fullWidth && 'w-full',
        className
      )}
      role="navigation"
      aria-label="페이지네이션"
      {...props}
    >
      {/* 🎨 이전 버튼 */}
      {showPrevNext && (
        <button
          className={twMerge(
            'px-4 py-2 font-medium transition-colors duration-200',
            sizeClasses[size],
            variant === 'bordered' && 'border',
            variant === 'rounded' && 'rounded-full',
            colorClasses[color].hover,
            variant === 'bordered' && colorClasses[color].border,
            currentPage === 1 && 'opacity-50 cursor-not-allowed',
            fullWidth && 'flex-1'
          )}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="이전 페이지"
        >
          이전
        </button>
      )}

      {/* 🎨 페이지 번호 */}
      {showNumbers && generatePagination().map(renderPageButton)}

      {/* 🎨 다음 버튼 */}
      {showPrevNext && (
        <button
          className={twMerge(
            'px-4 py-2 font-medium transition-colors duration-200',
            sizeClasses[size],
            variant === 'bordered' && 'border',
            variant === 'rounded' && 'rounded-full',
            colorClasses[color].hover,
            variant === 'bordered' && colorClasses[color].border,
            currentPage === totalPages && 'opacity-50 cursor-not-allowed',
            fullWidth && 'flex-1'
          )}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="다음 페이지"
        >
          다음
        </button>
      )}
    </div>
  )
}

export default Pagination 