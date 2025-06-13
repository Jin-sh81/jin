// 🦴 Skeleton: 데이터가 로딩 중일 때 뼈대(스켈레톤) UI를 보여줘요!
import React from 'react'

interface SkeletonProps {
  width?: string | number
  height?: string | number
  style?: React.CSSProperties
  className?: string
}

const Skeleton: React.FC<SkeletonProps> = ({ width = '100%', height = 20, style, className }) => (
  <div
    className={`animate-pulse bg-gray-200 rounded ${className || ''}`}
    style={{ width, height, ...style }}
    aria-label="로딩 중"
  />
)

export default Skeleton
