import { useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { XMarkIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import { updateProject, getProjectById } from '@/services/projectService'
import type { Project } from '@/types/project'

interface ProjectDetailModalProps {
  project: Project;
  onClose: () => void;
  onUpdate: (project: Project) => void;
  onDelete: (projectId: string) => void;
}

export default function ProjectDetailModal({ project, onClose, onUpdate, onDelete }: ProjectDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState(project.title)
  const [editedDescription, setEditedDescription] = useState(project.description || '')
  const [editedStartDate, setEditedStartDate] = useState(project.startDate)
  const [editedDueDate, setEditedDueDate] = useState(project.dueDate)
  const [editedPriority, setEditedPriority] = useState(project.priority)
  const [editedStatus, setEditedStatus] = useState(project.status)

  const handleSave = async () => {
    try {
      await updateProject(project.userId, project.id, {
        title: editedTitle,
        description: editedDescription || undefined,
        startDate: editedStartDate,
        dueDate: editedDueDate,
        priority: editedPriority,
        status: editedStatus
      })
      
      const updatedProject = await getProjectById(project.userId, project.id)
      if (updatedProject) {
        onUpdate(updatedProject)
        setIsEditing(false)
      }
    } catch (error) {
      console.error('프로젝트 업데이트 실패:', error)
    }
  }

  const handleDelete = async () => {
    if (window.confirm('이 프로젝트를 삭제하시겠습니까?')) {
      onDelete(project.id)
    }
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
                    project.title
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
                    <p className="text-gray-600">{project.description}</p>
                  )}
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">시작일</h4>
                    {isEditing ? (
                      <input
                        type="date"
                        value={editedStartDate}
                        onChange={(e) => setEditedStartDate(e.target.value)}
                        className="mt-1 w-full border border-gray-300 rounded-md p-2"
                      />
                    ) : (
                      <p className="mt-1">{project.startDate}</p>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">마감일</h4>
                    {isEditing ? (
                      <input
                        type="date"
                        value={editedDueDate}
                        onChange={(e) => setEditedDueDate(e.target.value)}
                        className="mt-1 w-full border border-gray-300 rounded-md p-2"
                      />
                    ) : (
                      <p className="mt-1">{project.dueDate}</p>
                    )}
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">우선순위</h4>
                    {isEditing ? (
                      <select
                        value={editedPriority}
                        onChange={(e) => setEditedPriority(e.target.value as 'low' | 'medium' | 'high')}
                        className="mt-1 w-full border border-gray-300 rounded-md p-2"
                      >
                        <option value="low">낮음</option>
                        <option value="medium">중간</option>
                        <option value="high">높음</option>
                      </select>
                    ) : (
                      <p className="mt-1">{project.priority}</p>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">상태</h4>
                    {isEditing ? (
                      <select
                        value={editedStatus}
                        onChange={(e) => setEditedStatus(e.target.value as 'not_started' | 'in_progress' | 'completed')}
                        className="mt-1 w-full border border-gray-300 rounded-md p-2"
                      >
                        <option value="not_started">시작 전</option>
                        <option value="in_progress">진행 중</option>
                        <option value="completed">완료</option>
                      </select>
                    ) : (
                      <p className="mt-1">{project.status}</p>
                    )}
                  </div>
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
                      >
                        <TrashIcon className="h-5 w-5 mr-2" />
                        삭제
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