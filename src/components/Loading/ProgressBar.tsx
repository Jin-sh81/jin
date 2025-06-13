// 📊 ProgressBar: 로딩 진행 상황을 보여주는 바예요!
import React from 'react'

interface ProgressBarProps {
  progress: number // 0~100
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => (
  <div className="w-full bg-gray-200 rounded h-2">
    <div
      className="bg-blue-500 h-2 rounded transition-all"
      style={{ width: `${progress}%` }}
      aria-label="로딩 진행 바"
    />
  </div>
)

export default ProgressBar
