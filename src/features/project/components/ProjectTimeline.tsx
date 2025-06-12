import React from 'react'
import { ProjectTask } from '@/types/project'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline'

interface ProjectTimelineProps {
  tasks: ProjectTask[];
}

export const ProjectTimeline: React.FC<ProjectTimelineProps> = ({ tasks }) => {
  // 작업을 날짜별로 그룹화
  const groupedTasks = tasks.reduce((groups, task) => {
    const date = task.completedAt || task.createdAt
    const dateKey = format(new Date(date), 'yyyy-MM-dd')
    if (!groups[dateKey]) {
      groups[dateKey] = []
    }
    groups[dateKey].push(task)
    return groups
  }, {} as Record<string, ProjectTask[]>)

  // 날짜별로 정렬
  const sortedDates = Object.keys(groupedTasks).sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-6">프로젝트 타임라인</h2>
      <div className="flow-root">
        <ul className="-mb-8">
          {sortedDates.map((date, dateIndex) => (
            <li key={date}>
              <div className="relative pb-8">
                {dateIndex !== sortedDates.length - 1 && (
                  <span
                    className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                    aria-hidden="true"
                  />
                )}
                <div className="relative flex space-x-3">
                  <div>
                    <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                      <ClockIcon className="h-5 w-5 text-white" aria-hidden="true" />
                    </span>
                  </div>
                  <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                    <div>
                      <p className="text-sm text-gray-500">
                        {format(new Date(date), 'yyyy년 MM월 dd일', { locale: ko })}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 ml-12 space-y-4">
                  {groupedTasks[date].map((task) => (
                    <div
                      key={task.id}
                      className="flex items-start space-x-3 bg-gray-50 rounded-lg p-4"
                    >
                      <div className="flex-shrink-0">
                        {task.completed ? (
                          <CheckCircleIcon className="h-5 w-5 text-green-500" />
                        ) : (
                          <ClockIcon className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={`text-sm font-medium ${task.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                          {task.title}
                        </p>
                        {task.description && (
                          <p className="mt-1 text-sm text-gray-500">{task.description}</p>
                        )}
                        <div className="mt-2 flex items-center space-x-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            task.priority === 'high'
                              ? 'bg-red-100 text-red-800'
                              : task.priority === 'medium'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {task.priority === 'high' ? '높음' : task.priority === 'medium' ? '중간' : '낮음'}
                          </span>
                          {task.dueDate && (
                            <span className="text-xs text-gray-500">
                              마감일: {format(new Date(task.dueDate), 'yyyy년 MM월 dd일', { locale: ko })}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
} 