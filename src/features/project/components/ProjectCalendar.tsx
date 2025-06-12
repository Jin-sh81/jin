import React, { useState } from 'react'
import { ProjectTask } from '@/types/project'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay, addMonths, subMonths } from 'date-fns'
import { ko } from 'date-fns/locale'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

interface ProjectCalendarProps {
  tasks: ProjectTask[];
  onDateClick?: (date: Date) => void;
}

export const ProjectCalendar: React.FC<ProjectCalendarProps> = ({ tasks, onDateClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date())

  // 현재 월의 시작일과 종료일
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)

  // 현재 월의 모든 날짜
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // 이전 달로 이동
  const handlePrevMonth = () => {
    setCurrentDate(prev => subMonths(prev, 1))
  }

  // 다음 달로 이동
  const handleNextMonth = () => {
    setCurrentDate(prev => addMonths(prev, 1))
  }

  const handleDateClick = (date: Date) => {
    if (onDateClick) {
      onDateClick(date)
    }
  }

  // 특정 날짜의 작업 수 계산
  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => {
      if (!task.dueDate) return false
      const taskDate = new Date(task.dueDate)
      return isSameDay(taskDate, date)
    })
  }

  // 요일 헤더
  const weekDays = ['일', '월', '화', '수', '목', '금', '토']

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-900">
          {format(currentDate, 'yyyy년 MM월', { locale: ko })}
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={handlePrevMonth}
            className="p-2 text-gray-400 hover:text-gray-500"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <button
            onClick={handleNextMonth}
            className="p-2 text-gray-400 hover:text-gray-500"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {weekDays.map((day, index) => (
          <div
            key={day}
            className={`text-center py-2 text-sm font-medium ${
              index === 0 ? 'text-red-500' : index === 6 ? 'text-blue-500' : 'text-gray-900'
            }`}
          >
            {day}
          </div>
        ))}

        {days.map((day, dayIdx) => {
          const tasksForDay = getTasksForDate(day)
          const isCurrentMonth = isSameMonth(day, currentDate)
          const isCurrentDay = isToday(day)

          return (
            <div
              key={day.toString()}
              onClick={() => handleDateClick(day)}
              className={`min-h-[100px] p-2 bg-white ${
                !isCurrentMonth ? 'text-gray-400' : ''
              } ${isCurrentDay ? 'bg-blue-50' : ''} ${
                onDateClick ? 'cursor-pointer hover:bg-gray-50' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-sm ${
                    isCurrentDay ? 'font-bold text-blue-600' : ''
                  }`}
                >
                  {format(day, 'd')}
                </span>
                {tasksForDay.length > 0 && (
                  <span className="text-xs text-gray-500">
                    {tasksForDay.length}개 작업
                  </span>
                )}
              </div>
              <div className="mt-1 space-y-1">
                {tasksForDay.slice(0, 2).map((task) => (
                  <div
                    key={task.id}
                    className={`text-xs p-1 rounded truncate ${
                      getPriorityColor(task.priority)
                    } ${task.completed ? 'line-through opacity-50' : ''}`}
                  >
                    {task.title}
                  </div>
                ))}
                {tasksForDay.length > 2 && (
                  <div className="text-xs text-gray-500">
                    +{tasksForDay.length - 2}개 더보기
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
} 