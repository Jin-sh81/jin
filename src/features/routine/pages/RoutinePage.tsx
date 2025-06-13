// ⏰ RoutinePage: 매일의 루틴을 관리할 수 있는 페이지예요!
// 📋 기능 검증 명령서:
// 1. 루틴 목록이 잘 불러와지는지 확인해요
// 2. 새 루틴 추가 버튼이 잘 작동하는지 확인해요
// 3. 루틴을 클릭했을 때 상세 모달이 잘 열리는지 확인해요
// 4. 루틴 수정과 삭제가 잘 되는지 확인해요
// 5. 로딩과 에러 상태가 잘 표시되는지 확인해요

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import RoutineList from '../components/RoutineList'
import RoutineForm from '../components/RoutineForm'
import RoutineDetailModal from '../components/RoutineDetailModal'
import { getRoutines, createRoutine, updateRoutine, deleteRoutine } from '@/services/routineService'
import type { Routine } from '@/types/firestore'

export const RoutinePage = () => {
  // 🔑 useAuth: 로그인한 사용자 정보를 가져와요
  const { user } = useAuth()
  // 📋 routines: 불러온 루틴 목록을 저장해요
  const [routines, setRoutines] = useState<Routine[]>([])
  // ➕ isAddingRoutine: 새 루틴 작성 폼 표시 여부를 저장해요
  const [isAddingRoutine, setIsAddingRoutine] = useState(false)
  // 🔍 selectedRoutine: 클릭한 루틴 상세 정보를 저장해요
  const [selectedRoutine, setSelectedRoutine] = useState<Routine | null>(null)
  // ⏳ isLoading: 데이터를 불러오는 동안 로딩 상태를 저장해요
  const [isLoading, setIsLoading] = useState(true)
  // 🚨 error: 에러 메시지를 저장해요
  const [error, setError] = useState<string | null>(null)

  // 🔄 fetchRoutines: 서버에서 루틴 목록을 가져와 routines 상태에 저장해요
  const fetchRoutines = async () => {
    if (!user) return

    try {
      setIsLoading(true)
      setError(null)
      const data = await getRoutines(user.uid)
      setRoutines(data)
    } catch (error) {
      console.error('루틴 목록 불러오기 실패:', error)
      setError('루틴 목록을 불러오는데 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchRoutines()
  }, [user])

  // 🔦 handleRoutineClick: 루틴을 클릭하면 상세 모달을 보여줘요
  const handleRoutineClick = (routine: Routine) => {
    setSelectedRoutine(routine)
  }

  // 🛠️ handleRoutineUpdate: 수정된 루틴을 목록에 반영해요
  const handleRoutineUpdate = async (updatedRoutine: Routine) => {
    if (!user) return

    try {
      await updateRoutine(user.uid, updatedRoutine.id, updatedRoutine)
      setRoutines(prev => prev.map(routine => 
        routine.id === updatedRoutine.id ? updatedRoutine : routine
      ))
      setSelectedRoutine(null)
    } catch (error) {
      console.error('루틴 수정 실패:', error)
      setError('루틴을 수정하는데 실패했습니다.')
    }
  }

  // 🗑️ handleRoutineDelete: 선택한 루틴을 목록에서 삭제해요
  const handleRoutineDelete = async (routineId: string) => {
    if (!user) return

    try {
      await deleteRoutine(user.uid, routineId)
      setRoutines(prev => prev.filter(routine => routine.id !== routineId))
      setSelectedRoutine(null)
    } catch (error) {
      console.error('루틴 삭제 실패:', error)
      setError('루틴을 삭제하는데 실패했습니다.')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 🏷️ 제목/추가 버튼 영역: 페이지 제목과 루틴 추가 버튼을 보여줘요 */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">나의 루틴</h1>
        <button
          onClick={() => setIsAddingRoutine(true)}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          새 루틴 추가
        </button>
      </div>

      {/* 🚨 error: 에러 메시지 표시 */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* ✍️ isAddingRoutine: 새 루틴 작성 폼을 토글로 표시해요 */}
      {isAddingRoutine && (
        <div className="mb-6">
          <RoutineForm
            onSubmit={async (routineData: Omit<Routine, 'id'>) => {
              if (!user) return

              try {
                const newRoutine = await createRoutine(user.uid, {
                  ...routineData,
                  isActive: true,
                  createdAt: new Date(),
                  updatedAt: new Date()
                })
                setRoutines(prev => [...prev, newRoutine])
                setIsAddingRoutine(false)
              } catch (error) {
                console.error('루틴 생성 실패:', error)
                setError('새 루틴을 만드는데 실패했습니다.')
              }
            }}
            onCancel={() => setIsAddingRoutine(false)}
          />
        </div>
      )}

      {/* 📜 RoutineList: 루틴 목록 컴포넌트를 렌더링해요 */}
      {isLoading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">루틴을 불러오는 중...</p>
        </div>
      ) : (
        <RoutineList
          routines={routines}
          onRoutineClick={handleRoutineClick}
          onDelete={handleRoutineDelete}
        />
      )}

      {/* 🔍 RoutineDetailModal: selectedRoutine이 있을 때 상세 모달을 보여줘요 */}
      {selectedRoutine && (
        <RoutineDetailModal
          routine={selectedRoutine}
          onClose={() => setSelectedRoutine(null)}
          onUpdate={handleRoutineUpdate}
          onDelete={handleRoutineDelete}
        />
      )}
    </div>
  )
}

export default RoutinePage 