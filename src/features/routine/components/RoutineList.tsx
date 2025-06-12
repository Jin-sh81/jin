import { useState } from 'react'
import { ClockIcon } from '@heroicons/react/24/outline'
import type { Routine } from '@/types/routine'
import RoutineDetailModal from './RoutineDetailModal'

// 루틴 목록 컴포넌트의 필요한 정보를 정의합니다
interface RoutineListProps {
  routines: Routine[];  // 보여줄 루틴 목록
  onRoutineClick?: (routine: Routine) => void;  // 루틴을 클릭했을 때 실행할 함수 (선택사항)
  onDelete: (routineId: string) => Promise<void>;
}

// 루틴 목록을 보여주는 컴포넌트입니다
const RoutineList = ({ routines, onRoutineClick, onDelete }: RoutineListProps) => {
  // 현재 선택된 루틴을 저장하는 상태
  const [selectedRoutine, setSelectedRoutine] = useState<Routine | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // 루틴을 클릭했을 때 실행하는 함수입니다
  const handleRoutineClick = (routine: Routine) => {
    setSelectedRoutine(routine)
    setIsModalOpen(true)
    if (onRoutineClick) {
      onRoutineClick(routine)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedRoutine(null)
  }

  const handleDelete = async (routineId: string) => {
    try {
      await onDelete(routineId)
      handleCloseModal()
    } catch (error) {
      console.error('루틴 삭제 실패:', error)
    }
  }

  // 요일 이름을 가져오는 함수입니다
  const getDayName = (day: string) => {
    const dayNames: { [key: string]: string } = {
      '월': '월요일',
      '화': '화요일',
      '수': '수요일',
      '목': '목요일',
      '금': '금요일',
      '토': '토요일',
      '일': '일요일'
    }
    return dayNames[day] || day
  }

  return (
    <div className="space-y-4">
      {routines.map((routine) => (
        <div
          key={routine.id}
          onClick={() => handleRoutineClick(routine)}
          className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow cursor-pointer"
        >
          {/* 제목과 설명을 보여주는 부분 */}
          <div>
            <h3 className="text-lg font-semibold">{routine.title}</h3>
            {routine.description && (
              <p className="mt-1 text-gray-600">{routine.description}</p>
            )}
          </div>

          {/* 시간과 카테고리를 보여주는 부분 */}
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">시간</h4>
              <div className="mt-1 flex items-center">
                <ClockIcon className="h-4 w-4 text-gray-400 mr-1" />
                <p className="text-sm">{routine.time}</p>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">카테고리</h4>
              <div className="mt-1 flex items-center">
                <ClockIcon className="h-4 w-4 text-gray-400 mr-1" />
                <p className="text-sm">{routine.category}</p>
              </div>
            </div>
          </div>

          {/* 반복 요일을 보여주는 부분 */}
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-500">반복 요일</h4>
            <div className="mt-2 flex flex-wrap gap-2">
              {routine.repeat.map((day) => (
                <span
                  key={day}
                  className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
                >
                  {getDayName(day)}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}

      {selectedRoutine && (
        <RoutineDetailModal
          routine={selectedRoutine}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}

export default RoutineList 