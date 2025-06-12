import { useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { XMarkIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import { updateRoutine, getRoutine } from '@/services/routineService'
import type { Routine } from '@/types/firestore'
import { useAuth } from '@/hooks/useAuth'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'

interface RoutineDetailModalProps {
  routine: Routine;
  onClose: () => void;
  onUpdate: (routine: Routine) => void;
  onDelete: (routineId: string) => void;
}

export default function RoutineDetailModal({ routine, onClose, onUpdate, onDelete }: RoutineDetailModalProps) {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState(routine.title)
  const [editedDescription, setEditedDescription] = useState(routine.description || '')
  const [editedFrequency, setEditedFrequency] = useState<Routine['frequency']>(routine.frequency)
  const [editedDaysOfWeek, setEditedDaysOfWeek] = useState<number[]>(routine.daysOfWeek ? [...routine.daysOfWeek] : [])
  const [editedTimeOfDay, setEditedTimeOfDay] = useState(routine.timeOfDay || '')
  const [isDeleting, setIsDeleting] = useState(false)

  const handleSave = async () => {
    if (!user) return
    try {
      await updateRoutine(user.uid, routine.id, {
        title: editedTitle,
        description: editedDescription || undefined,
        frequency: editedFrequency,
        daysOfWeek: editedDaysOfWeek,
        timeOfDay: editedTimeOfDay
      })
      const updatedRoutine = await getRoutine(user.uid, routine.id)
      if (updatedRoutine) {
        onUpdate(updatedRoutine)
        setIsEditing(false)
      }
    } catch (error) {
      console.error('루틴 업데이트 실패:', error)
    }
  }

  const handleDelete = async () => {
    if (!user) return
    try {
      setIsDeleting(true)
      await onDelete(routine.id)
      onClose()
    } catch (error) {
      console.error('루틴 삭제 실패:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const getDayName = (day: number): string => {
    const days = ['일', '월', '화', '수', '목', '금', '토']
    return days[day] ?? String(day)
  }

  return (
    <Transition appear show={true} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      className="w-full border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                    />
                  ) : (
                    routine.title
                  )}
                </Dialog.Title>

                <div className="mt-4">
                  {isEditing ? (
                    <textarea
                      value={editedDescription}
                      onChange={(e) => setEditedDescription(e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:outline-none"
                      rows={3}
                    />
                  ) : (
                    <p className="text-gray-600">{routine.description}</p>
                  )}
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">빈도</h4>
                    {isEditing ? (
                      <select
                        value={editedFrequency}
                        onChange={(e) => setEditedFrequency(e.target.value as Routine['frequency'])}
                        className="mt-1 w-full border border-gray-300 rounded-md p-2"
                      >
                        <option value="daily">매일</option>
                        <option value="weekly">매주</option>
                        <option value="monthly">매월</option>
                      </select>
                    ) : (
                      <p className="mt-1">{routine.frequency}</p>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">시간</h4>
                    {isEditing ? (
                      <input
                        type="time"
                        value={editedTimeOfDay}
                        onChange={(e) => setEditedTimeOfDay(e.target.value)}
                        className="mt-1 w-full border border-gray-300 rounded-md p-2"
                      />
                    ) : (
                      <p className="mt-1">{routine.timeOfDay}</p>
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-500">반복 요일</h4>
                  {isEditing ? (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {[0, 1, 2, 3, 4, 5, 6].map((day) => (
                        <label key={day} className="inline-flex items-center">
                          <input
                            type="checkbox"
                            checked={editedDaysOfWeek.includes(day)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setEditedDaysOfWeek([...editedDaysOfWeek, day].sort((a, b) => a - b))
                              } else {
                                setEditedDaysOfWeek(editedDaysOfWeek.filter((d) => d !== day))
                              }
                            }}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">{getDayName(day)}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-1">
                      {routine.daysOfWeek && routine.daysOfWeek.map(getDayName).join(', ')}
                    </p>
                  )}
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  {isEditing ? (
                    <>
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        onClick={handleSave}
                      >
                        저장
                      </button>
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        onClick={() => setIsEditing(false)}
                      >
                        취소
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        onClick={() => setIsEditing(true)}
                      >
                        <PencilIcon className="h-5 w-5 mr-2" />
                        수정
                      </button>
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                        onClick={handleDelete}
                        disabled={isDeleting}
                      >
                        <TrashIcon className="h-5 w-5 mr-2" />
                        {isDeleting ? '삭제 중...' : '삭제'}
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={onClose}
                  >
                    <XMarkIcon className="h-5 w-5 mr-2" />
                    닫기
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

// 🔽 수정 로직 설명
// 1. 수정 버튼 클릭 시 isEditing 상태가 true로 변경되어 수정 모드로 전환됩니다.
// 2. 수정 모드에서는 모든 필드가 입력 가능한 상태로 변경됩니다.
// 3. 저장 버튼 클릭 시 updateRoutine 함수를 호출하여 Firestore에 변경사항을 저장합니다.
// 4. 저장 성공 시 isEditing이 false로 변경되어 보기 모드로 돌아갑니다.
// 5. 취소 버튼 클릭 시 모든 입력값이 초기 상태로 되돌아가고 보기 모드로 전환됩니다. 