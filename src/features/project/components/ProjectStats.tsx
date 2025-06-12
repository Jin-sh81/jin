import React from 'react'
import { ProjectStats as ProjectStatsType } from '@/types/project'
import { ChartBarIcon, CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline'

interface ProjectStatsProps {
  stats: ProjectStatsType;
}

export const ProjectStats: React.FC<ProjectStatsProps> = ({ stats }) => {
  const completionRate = Math.round((stats.completedTasks / stats.totalTasks) * 100) || 0

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">프로젝트 통계</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center">
            <ChartBarIcon className="h-6 w-6 text-blue-600" />
            <h3 className="ml-2 text-sm font-medium text-blue-900">전체 작업</h3>
          </div>
          <p className="mt-2 text-3xl font-semibold text-blue-600">{stats.totalTasks}</p>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircleIcon className="h-6 w-6 text-green-600" />
            <h3 className="ml-2 text-sm font-medium text-green-900">완료된 작업</h3>
          </div>
          <p className="mt-2 text-3xl font-semibold text-green-600">{stats.completedTasks}</p>
        </div>

        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="flex items-center">
            <ClockIcon className="h-6 w-6 text-yellow-600" />
            <h3 className="ml-2 text-sm font-medium text-yellow-900">진행률</h3>
          </div>
          <div className="mt-2">
            <p className="text-3xl font-semibold text-yellow-600">{completionRate}%</p>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-yellow-600 h-2 rounded-full"
                style={{ width: `${completionRate}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 