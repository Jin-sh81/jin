import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { getRoutines } from '@/services/routineService'
import type { Routine } from '@/types/routine'
import RoutineList from '../components/RoutineList'
import RoutineForm from '../components/RoutineForm'
import RoutineDetailModal from '../components/RoutineDetailModal'

const RoutinePage = () => {
  const { user } = useAuth()
  const [routines, setRoutines] = useState<Routine[]>([])
  const [isAddingRoutine, setIsAddingRoutine] = useState(false)
  const [selectedRoutine, setSelectedRoutine] = useState<Routine | null>(null)

  useEffect(() => {
    const fetchRoutines = async () => {
      if (!user) return
      try {
        const routines = await getRoutines(user.uid)
        setRoutines(routines)
      } catch (error) {
        console.error('루틴 목록을 불러오는데 실패했습니다:', error)
      }
    }

    fetchRoutines()
  }, [user])

  const handleRoutineClick = (routine: Routine) => {
    setSelectedRoutine(routine)
  }

  const handleRoutineUpdate = (updatedRoutine: Routine) => {
    setRoutines(prevRoutines =>
      prevRoutines.map(routine =>
        routine.id === updatedRoutine.id ? updatedRoutine : routine
      )
    )
    setSelectedRoutine(null)
  }

  const handleRoutineDelete = (routineId: string) => {
    setRoutines(prevRoutines =>
      prevRoutines.filter(routine => routine.id !== routineId)
    )
    setSelectedRoutine(null)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">루틴 관리</h1>
        <button
          onClick={() => setIsAddingRoutine(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          루틴 추가
        </button>
      </div>

      {isAddingRoutine && (
        <div className="mb-6">
          <RoutineForm
            onCancel={() => setIsAddingRoutine(false)}
            onSuccess={() => {
              setIsAddingRoutine(false)
              // 루틴 목록 새로고침
            }}
          />
        </div>
      )}

      <RoutineList
        routines={routines}
        onRoutineClick={handleRoutineClick}
      />

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