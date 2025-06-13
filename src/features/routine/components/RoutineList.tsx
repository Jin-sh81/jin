import { useState } from 'react'
import { ClockIcon } from '@heroicons/react/24/outline'
import type { Routine } from '@/types/firestore'
import RoutineDetailModal from './RoutineDetailModal'

// 📜 RoutineList: 매일의 루틴을 목록으로 보여주는 컴포넌트예요!

// 컴포넌트의 props 타입 정의
interface RoutineListProps {
  routines: Routine[];  // 보여줄 루틴 목록
  onRoutineClick: (routine: Routine) => void;  // 루틴 클릭 시 실행할 함수
  onDelete: (routineId: string) => Promise<void>;  // 루틴 삭제 시 실행할 함수
}

// 루틴 목록 컴포넌트
const RoutineList = ({ routines, onRoutineClick, onDelete }: RoutineListProps) => {
  // 🔍 selectedRoutine: 선택된 루틴 데이터를 저장해요
  const [selectedRoutine, setSelectedRoutine] = useState<Routine | null>(null)
  // 🚪 isModalOpen: 상세 모달 열림/닫힘 상태를 저장해요
  const [isModalOpen, setIsModalOpen] = useState(false)

  // 🔦 handleRoutineClick: 루틴을 클릭하면 상세 모달을 열고 onRoutineClick 콜백을 호출해요
  const handleRoutineClick = (routine: Routine) => {
    setSelectedRoutine(routine)
    setIsModalOpen(true)
    onRoutineClick(routine)
  }

  // ❌ handleCloseModal: 모달을 닫고 선택 루틴을 초기화해요
  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedRoutine(null)
  }

  // 🗑️ handleDelete: 모달에서 루틴 삭제 요청을 보내고 목록에서 제거해요
  const handleDelete = async (routineId: string) => {
    try {
      await onDelete(routineId)
      handleCloseModal()
    } catch (error) {
      console.error('루틴 삭제 중 오류 발생:', error)
    }
  }

  // 📅 getDayName: 숫자로 된 요일을 한국어 요일 이름으로 바꿔요
  const getDayName = (day: number): string => {
    const days = ['일', '월', '화', '수', '목', '금', '토']
    return days[day]
  }

  return (
    <div className="space-y-4">
      {/* 📋 routines.map: 각 루틴을 카드 스타일로 렌더링해요 */}
      {routines.map((routine) => (
        <div
          key={routine.id}
          onClick={() => handleRoutineClick(routine)}
          className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-md transition-shadow"
        >
          {/* 🏷️ 제목/설명 영역 */}
          <div className="mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{routine.title}</h3>
            {routine.description && (
              <p className="text-sm text-gray-600 mt-1">{routine.description}</p>
            )}
          </div>

          {/* 🏷️ 시간/빈도 영역 */}
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <ClockIcon className="h-4 w-4 mr-1" />
            <span>{routine.timeOfDay}</span>
            <span className="mx-2">•</span>
            <span>{routine.frequency === 'daily' ? '매일' : routine.frequency === 'weekly' ? '매주' : '매월'}</span>
          </div>

          {/* 🏷️ 반복 요일 영역 */}
          {routine.frequency === 'weekly' && routine.daysOfWeek && (
            <div className="flex flex-wrap gap-1">
              {routine.daysOfWeek.map((day) => (
                <span
                  key={day}
                  className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                >
                  {getDayName(day)}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* 🌟 RoutineDetailModal: 루틴 상세 정보를 모달 창으로 보여줘요 */}
      {selectedRoutine && (
        <RoutineDetailModal
          routine={selectedRoutine}
          onClose={handleCloseModal}
          onUpdate={onRoutineClick}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}

export default RoutineList 