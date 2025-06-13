// 📒 DiaryPage: 사용자가 일기 목록을 보고 작성하거나 수정할 수 있는 페이지예요!
// 📋 기능 검증 명령서:
// 1. 일기 목록이 올바르게 표시되는지 확인해요
// 2. 새 일기 작성 버튼이 작동하는지 확인해요
// 3. 일기 수정과 삭제가 잘 되는지 확인해요
// 4. 월별 이동 버튼이 잘 작동하는지 확인해요
// 5. 로딩 중일 때 스피너가 표시되는지 확인해요
// 6. 오류 메시지가 잘 표시되는지 확인해요

import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { getDiaries, createDiary, updateDiary, deleteDiary } from '@/services/diaryService'
import { auth } from '@/infrastructure/firebase/firebaseConfig'
import type { Diary } from '@/types/diary'
import { DiaryList } from '../components/DiaryList'
import { DiaryForm } from '../components/DiaryForm'
import { useAuth } from '@/hooks/useAuth'
import { PlusIcon } from '@heroicons/react/24/outline'

// 🎨 DiaryPage 컴포넌트: 일기 목록을 보여주고 관리하는 페이지예요
const DiaryPage = () => {
  // 📋 diaries: 불러온 일기 목록을 저장해요
  const [diaries, setDiaries] = useState<Diary[]>([])
  // 🗓️ currentMonth: 보고 싶은 달(YYYY-MM) 정보를 저장해요
  const [currentMonth, setCurrentMonth] = useState(format(new Date(), 'yyyy-MM'))
  // ⏳ isLoading: 목록을 불러오는 중인지 알려줘요
  const [isLoading, setIsLoading] = useState(true)
  // 🚨 error: 발생한 에러 메시지를 저장해요
  const [error, setError] = useState<string | null>(null)
  // ✍️ isCreating: 새 일기 작성 폼 표시를 제어해요
  const [isCreating, setIsCreating] = useState(false)

  // 🔀 useNavigate: 일기 상세 페이지로 이동하거나 리스트를 갱신할 때 사용해요
  const navigate = useNavigate()

  // 🔑 useAuth 훅: 로그인한 사용자 정보(user)를 가져와요
  const { user } = useAuth()

  // 🔄 fetchDiaries: 서버에서 일기 목록을 가져와 diaries 상태에 저장해요
  const fetchDiaries = useCallback(async () => {
    if (!user) return

    try {
      setIsLoading(true)
      setError(null)
      const fetchedDiaries = await getDiaries(user.uid)
      setDiaries(fetchedDiaries)
    } catch (error) {
      console.error('일기 목록 조회 실패:', error)
      setError('일기 목록을 불러오는데 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchDiaries()
  }, [fetchDiaries])

  // ➕ handleCreateDiary: 새 일기를 만들고 목록을 갱신해요
  const handleCreateDiary = async (diaryData: Omit<Diary, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return

    try {
      setIsCreating(true)
      setError(null)
      await createDiary(user.uid, diaryData)
      await fetchDiaries()
      setIsCreating(false)
    } catch (error) {
      console.error('일기 작성 실패:', error)
      setError('일기 작성에 실패했습니다.')
      setIsCreating(false)
    }
  }

  // 📝 handleUpdateDiary: 일기 내용을 수정하고 목록을 갱신해요
  const handleUpdateDiary = async (diary: Diary) => {
    if (!user) return

    try {
      setError(null)
      await updateDiary(user.uid, diary.id, diary)
      await fetchDiaries()
    } catch (error) {
      console.error('일기 수정 실패:', error)
      setError('일기 수정에 실패했습니다.')
    }
  }

  // 🗑️ handleDeleteDiary: 일기를 삭제하고 목록을 갱신해요
  const handleDeleteDiary = async (diaryId: string) => {
    if (!user) return

    try {
      setError(null)
      await deleteDiary(user.uid, diaryId)
      await fetchDiaries()
    } catch (error) {
      console.error('일기 삭제 실패:', error)
      setError('일기 삭제에 실패했습니다.')
      throw error
    }
  }

  // 🔍 handleDiaryClick: 클릭한 일기 상세 페이지로 이동해요
  const handleDiaryClick = (diaryId: string) => {
    navigate(`/diaries/${diaryId}`)
  }

  // ⬅️ handlePrevMonth: 이전 달 목록으로 이동해요
  const handlePrevMonth = () => {
    const date = new Date(currentMonth)
    date.setMonth(date.getMonth() - 1)
    setCurrentMonth(format(date, 'yyyy-MM'))
  }

  // ➡️ handleNextMonth: 다음 달 목록으로 이동해요
  const handleNextMonth = () => {
    const date = new Date(currentMonth)
    date.setMonth(date.getMonth() + 1)
    setCurrentMonth(format(date, 'yyyy-MM'))
  }

  // ⏳ isLoading: 스피너 화면으로 보여줘요
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 🏷️ 제목과 작성 버튼 영역 */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">일기</h1>
        <button
          onClick={() => setIsCreating(true)}
          disabled={isLoading}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {/* ➕ PlusIcon: 새 일기 작성 버튼에 아이콘을 보여줘요 */}
          <PlusIcon className="h-5 w-5 mr-2" />
          일기 작성
        </button>
      </div>

      {/* ⚠️ error: 에러 메시지 박스 표시 */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* ✍️ isCreating: 새 일기 작성 폼 표시 */}
      {isCreating && (
        <div className="mb-8 bg-white p-6 rounded-lg shadow">
          <DiaryForm
            onSubmit={handleCreateDiary}
          />
        </div>
      )}

      {/* 📜 DiaryList: 일기 목록 컴포넌트 렌더링 */}
      {diaries.length > 0 ? (
        <DiaryList
          diaries={diaries}
          onDiaryClick={handleDiaryClick}
          onUpdate={handleUpdateDiary}
          onDelete={handleDeleteDiary}
        />
      ) : (
        /* 🚫 일기가 없을 때 안내 메시지 표시 */
        <div className="text-center py-12">
          <p className="text-gray-500">
            {isCreating
              ? '새로운 일기를 작성해보세요.'
              : '작성된 일기가 없습니다.'}
          </p>
        </div>
      )}
    </div>
  )
}

export default DiaryPage 