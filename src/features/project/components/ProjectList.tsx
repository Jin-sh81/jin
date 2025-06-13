/**
 * 🎯 프로젝트 목록 컴포넌트
 * 사용자가 만든 모든 프로젝트를 보여주는 화면입니다.
 * 각 프로젝트는 카드 형태로 표시되며,
 * 프로젝트의 제목, 마감일, 진행 상황을 한눈에 볼 수 있습니다.
 */

// 🎯 ProjectList: 사용자가 만든 모든 프로젝트를 카드 형태로 보여주는 컴포넌트예요!

// 📦 React, Project 타입, date-fns, icons, useAuth, 서비스 함수 등을 가져와요
import React, { useState } from 'react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { CheckCircleIcon, FlagIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import { useAuth } from '@/hooks/useAuth'
import { deleteProject } from '@/services/projectService'
import type { Project } from '@/types/firestore'

// 📋 projects: 렌더링할 프로젝트 배열
// 🔀 onProjectClick?: 카드 클릭 시 호출되는 함수
// 📝 onUpdate: 프로젝트 수정 후 목록 업데이트 콜백
// 🗑️ onDelete: 프로젝트 삭제 후 목록 업데이트 콜백
interface ProjectListProps {
  projects: Project[];
  onProjectClick?: (project: Project) => void;
  onUpdate?: () => void;
  onDelete?: () => void;
}

const ProjectList = ({ projects, onProjectClick, onUpdate, onDelete }: ProjectListProps) => {
  // 🔑 useAuth: 로그인 사용자 검증 후 권한에 따라 삭제/수정 버튼 표시 가능
  const { user } = useAuth()
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  // 🗑️ deleteProject 호출 로직과 onDelete 콜백 연결 확인
  const handleDelete = async (projectId: string) => {
    if (!user) return

    try {
      setIsDeleting(projectId)
      await deleteProject(user.uid, projectId)
      onDelete?.()
    } catch (error) {
      console.error('프로젝트 삭제 실패:', error)
    } finally {
      setIsDeleting(null)
    }
  }

  // ⚠️ projects가 비어 있으면 안내 메시지를 보여줘요
  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">등록된 프로젝트가 없어요</p>
      </div>
    )
  }

  // 📜 projects.map: 각 프로젝트를 <li>로 렌더링해요
  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <li
          key={project.id}
          className="bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200"
        >
          <div
            className="p-6 cursor-pointer"
            onClick={() => onProjectClick?.(project)}
          >
            <div className="flex justify-between items-start mb-4">
              {/* 🏷️ 제목 표시: project.title */}
              <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
              {/* ✅ 상태 표시: CheckCircleIcon 또는 FlagIcon으로 완료 여부 시각화 */}
              {project.status === 'completed' ? (
                <CheckCircleIcon className="h-6 w-6 text-green-500" />
              ) : (
                <FlagIcon className="h-6 w-6 text-blue-500" />
              )}
            </div>

            {/* 📝 설명 표시: project.description */}
            {project.description && (
              <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>
            )}

            <div className="flex justify-between items-center">
              {/* 📅 마감일 표시: format(new Date(project.endDate), 'yyyy-MM-dd', { locale: ko }) 사용 */}
              {project.endDate && (
                <p className="text-sm text-gray-500">
                  마감일: {format(new Date(project.endDate), 'yyyy년 MM월 dd일', { locale: ko })}
                </p>
              )}
              <div className="flex space-x-2">
                {/* ✏️ 수정 버튼(onUpdate) 호출 로직 검증 */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onUpdate?.()
                  }}
                  className="p-2 text-gray-400 hover:text-gray-500"
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDelete(project.id)
                  }}
                  disabled={isDeleting === project.id}
                  className="p-2 text-gray-400 hover:text-red-500 disabled:opacity-50"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}

export default ProjectList 