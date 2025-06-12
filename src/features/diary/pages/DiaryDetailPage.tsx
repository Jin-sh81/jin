import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { getDiaryByDate, createDiary, updateDiary, deleteDiary } from '@/services/diaryService'
import { auth } from '@/infrastructure/firebase/firebaseConfig'
import type { Diary } from '@/types/diary'
import { useAuth } from '@/hooks/useAuth'

// 🔽 일기 상세 페이지 컴포넌트
const DiaryDetailPage = () => {
  // 🔽 라우터 훅
  const { date } = useParams<{ date: string }>()
  const navigate = useNavigate()

  // 🔽 상태 관리
  const [diary, setDiary] = useState<Diary | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [content, setContent] = useState('')
  const [mood, setMood] = useState('')
  const [weather, setWeather] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // 🔽 현재 로그인한 사용자의 uid 가져오기
  const uid = auth.currentUser?.uid

  // 🔽 일기 데이터 가져오기
  useEffect(() => {
    const fetchDiary = async () => {
      try {
        if (!uid || !date) {
          console.error('로그인이 필요하거나 날짜가 없습니다.')
          return
        }

        setIsLoading(true)
        setError(null)

        // 🔽 일기 데이터 가져오기
        const data = await getDiaryByDate(uid, date)
        
        if (data) {
          setDiary(data)
          setContent(data.content)
          setMood(data.mood || '')
          setWeather(data.weather || '')
        }

        console.log('일기 데이터 가져오기 성공:', {
          userId: uid,
          date,
          exists: !!data
        })
      } catch (error) {
        // 🔽 에러 발생 시 상세 정보 로깅
        console.error('일기 데이터 가져오기 실패:', {
          error,
          userId: uid,
          date
        })
        setError('일기 데이터를 가져오는데 실패했습니다.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchDiary()
  }, [uid, date])

  // 🔽 수정 모드 토글
  const handleEditToggle = () => {
    setIsEditing(!isEditing)
  }

  // 🔽 취소 핸들러
  const handleCancel = () => {
    // 🔽 원래 데이터로 복원
    if (diary) {
      setContent(diary.content)
      setMood(diary.mood || '')
      setWeather(diary.weather || '')
    }
    setIsEditing(false)
  }

  // 🔽 저장 핸들러
  const handleSave = async () => {
    try {
      if (!uid || !date) {
        console.error('로그인이 필요하거나 날짜가 없습니다.')
        return
      }

      // 🔽 업데이트할 데이터 객체 구성
      const updateData = {
        content,
        mood,
        weather
      }

      if (diary) {
        // 🔽 기존 일기 수정
        await updateDiary(uid, date, updateData)
      } else {
        // 🔽 새 일기 생성
        await createDiary(uid, date, updateData)
      }

      // 🔽 수정 모드 종료
      setIsEditing(false)
      
      // 🔽 데이터 다시 가져오기
      const updatedDiary = await getDiaryByDate(uid, date)
      setDiary(updatedDiary)
      
      console.log('일기 저장 성공:', date)
    } catch (error) {
      console.error('일기 저장 실패:', error)
      setError('일기 저장에 실패했습니다.')
    }
  }

  // 🔽 삭제 핸들러
  const handleDelete = async () => {
    try {
      // 🔽 삭제 확인
      const isConfirmed = window.confirm('정말로 이 일기를 삭제하시겠습니까?')
      if (!isConfirmed) return

      if (!uid || !date) {
        console.error('로그인이 필요하거나 날짜가 없습니다.')
        return
      }

      setIsDeleting(true)

      // 🔽 일기 삭제
      await deleteDiary(uid, date)
      
      // 🔽 목록 페이지로 이동
      navigate('/diaries')
      
      console.log('일기 삭제 성공:', date)
    } catch (error) {
      console.error('일기 삭제 실패:', error)
      setError('일기 삭제에 실패했습니다.')
    } finally {
      setIsDeleting(false)
    }
  }

  // 🔽 로딩 중 표시
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  // 🔽 에러 표시
  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        {error}
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 🔽 헤더 영역 */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          {format(new Date(date!), 'yyyy년 M월 d일 (EEEE)', { locale: ko })}
        </h1>
        <div className="flex gap-2">
          {!isEditing && (
            <>
              <button
                onClick={handleEditToggle}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                수정
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
              >
                {isDeleting ? '삭제 중...' : '삭제'}
              </button>
            </>
          )}
          <button
            onClick={() => navigate('/diaries')}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
          >
            목록으로
          </button>
        </div>
      </div>

      {/* 🔽 일기 내용 영역 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* 🔸 기분 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            오늘의 기분
          </label>
          {isEditing ? (
            <input
              type="text"
              value={mood}
              onChange={e => setMood(e.target.value)}
              className="w-full border rounded px-2 py-1"
              placeholder="오늘의 기분을 입력하세요"
            />
          ) : (
            <p className="text-gray-600">{mood || '기분을 입력하지 않았습니다.'}</p>
          )}
        </div>

        {/* 🔸 날씨 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            오늘의 날씨
          </label>
          {isEditing ? (
            <input
              type="text"
              value={weather}
              onChange={e => setWeather(e.target.value)}
              className="w-full border rounded px-2 py-1"
              placeholder="오늘의 날씨를 입력하세요"
            />
          ) : (
            <p className="text-gray-600">{weather || '날씨를 입력하지 않았습니다.'}</p>
          )}
        </div>

        {/* 🔸 일기 내용 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            오늘의 일기
          </label>
          {isEditing ? (
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              className="w-full border rounded px-2 py-1 h-48"
              placeholder="오늘 있었던 일을 기록해보세요"
            />
          ) : (
            <p className="text-gray-600 whitespace-pre-wrap">
              {content || '작성된 일기가 없습니다.'}
            </p>
          )}
        </div>

        {/* 🔸 수정 모드일 때만 저장/취소 버튼 표시 */}
        {isEditing && (
          <div className="flex justify-end space-x-2 mt-4">
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
            >
              취소
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              저장
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default DiaryDetailPage 