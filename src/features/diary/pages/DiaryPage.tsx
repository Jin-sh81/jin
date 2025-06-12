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

// 🔽 일기 목록 페이지 컴포넌트
const DiaryPage = () => {
  // 🔽 상태 관리
  const [diaries, setDiaries] = useState<Diary[]>([])
  const [currentMonth, setCurrentMonth] = useState(format(new Date(), 'yyyy-MM'))
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  // 🔽 라우터 훅
  const navigate = useNavigate()

  // 🔽 현재 로그인한 사용자의 uid 가져오기
  const uid = auth.currentUser?.uid

  // 🔽 현재 로그인한 사용자의 정보 가져오기
  const { user } = useAuth()

  // 🔽 일기 목록 가져오기
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

  // 🔽 일기 생성
  const handleCreateDiary = async (diaryData: Omit<Diary, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return

    try {
      setIsCreating(true)
      setError(null)
      await createDiary(user.uid, diaryData)
      await fetchDiaries()
    } catch (error) {
      console.error('일기 작성 실패:', error)
      setError('일기 작성에 실패했습니다.')
    } finally {
      setIsCreating(false)
    }
  }

  // 🔽 일기 수정
  const handleUpdateDiary = async (diary: Diary) => {
    if (!user) return

    try {
      setError(null)
      await updateDiary(user.uid, diary)
      await fetchDiaries()
    } catch (error) {
      console.error('일기 수정 실패:', error)
      setError('일기 수정에 실패했습니다.')
    }
  }

  // 🔽 일기 삭제
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

  // 🔽 일기 상세 페이지로 이동
  const handleDiaryClick = (diaryId: string) => {
    navigate(`/diaries/${diaryId}`)
  }

  // 🔽 이전 달로 이동
  const handlePrevMonth = () => {
    const date = new Date(currentMonth)
    date.setMonth(date.getMonth() - 1)
    setCurrentMonth(format(date, 'yyyy-MM'))
  }

  // 🔽 다음 달로 이동
  const handleNextMonth = () => {
    const date = new Date(currentMonth)
    date.setMonth(date.getMonth() + 1)
    setCurrentMonth(format(date, 'yyyy-MM'))
  }

  // 🔽 로딩 중 표시
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">일기</h1>
        <button
          onClick={() => setIsCreating(true)}
          disabled={isLoading}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          일기 작성
        </button>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {isCreating && (
        <div className="mb-8 bg-white p-6 rounded-lg shadow">
          <DiaryForm
            onSubmit={handleCreateDiary}
            onCancel={() => setIsCreating(false)}
          />
        </div>
      )}

      {diaries.length > 0 ? (
        <DiaryList
          diaries={diaries}
          onDiaryClick={handleDiaryClick}
          onUpdate={handleUpdateDiary}
          onDelete={handleDeleteDiary}
        />
      ) : (
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