import React from 'react'
import { twMerge } from 'tailwind-merge'

// 🎨 Card 컴포넌트의 props 타입 정의
export interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** 카드의 제목 */
  title?: React.ReactNode
  /** 카드의 부제목 */
  subtitle?: React.ReactNode
  /** 카드의 내용 */
  children: React.ReactNode
  /** 카드의 이미지 URL */
  image?: string
  /** 카드의 이미지 대체 텍스트 */
  imageAlt?: string
  /** 카드의 푸터 */
  footer?: React.ReactNode
  /** 카드가 호버 효과를 가질지 여부 */
  hoverable?: boolean
  /** 카드가 클릭 가능한지 여부 */
  clickable?: boolean
  /** 카드의 너비 */
  width?: string
  /** 카드의 높이 */
  height?: string
  /** 카드의 그림자 크기 */
  shadow?: 'none' | 'sm' | 'md' | 'lg'
  /** 카드의 테두리 스타일 */
  bordered?: boolean
}

/**
 * 🎯 재사용 가능한 카드 컴포넌트
 * 
 * 이 컴포넌트는 콘텐츠를 카드 형태로 표시합니다.
 * 제목, 이미지, 내용, 푸터를 포함할 수 있습니다.
 * 
 * @example
 * // 기본 카드
 * <Card title="제목" subtitle="부제목">
 *   내용
 * </Card>
 * 
 * // 이미지가 있는 카드
 * <Card
 *   image="/image.jpg"
 *   imageAlt="이미지 설명"
 *   title="이미지 카드"
 * >
 *   이미지와 함께 표시되는 내용
 * </Card>
 * 
 * // 호버 효과가 있는 카드
 * <Card hoverable title="호버 카드">
 *   마우스를 올리면 효과가 나타납니다
 * </Card>
 */
const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  children,
  image,
  imageAlt,
  footer,
  hoverable = false,
  clickable = false,
  width,
  height,
  shadow = 'md',
  bordered = true,
  className,
  ...props
}) => {
  // 🎨 그림자 크기에 따른 클래스
  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg'
  }

  // 🎨 기본 클래스
  const baseClasses = twMerge(
    'bg-white rounded-lg overflow-hidden',
    bordered && 'border border-gray-200',
    shadowClasses[shadow],
    hoverable && 'transition-shadow duration-200 hover:shadow-lg',
    clickable && 'cursor-pointer',
    width && `w-[${width}]`,
    height && `h-[${height}]`,
    className
  )

  return (
    <div className={baseClasses} {...props}>
      {/* 🎨 이미지 */}
      {image && (
        <div className="relative w-full h-48">
          <img
            src={image}
            alt={imageAlt}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* 🎨 헤더 */}
      {(title || subtitle) && (
        <div className="p-4 border-b border-gray-200">
          {title && (
            <h3 className="text-lg font-semibold text-gray-900">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="mt-1 text-sm text-gray-500">
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* 🎨 내용 */}
      <div className="p-4">
        {children}
      </div>

      {/* 🎨 푸터 */}
      {footer && (
        <div className="p-4 border-t border-gray-200">
          {footer}
        </div>
      )}
    </div>
  )
}

export default Card 