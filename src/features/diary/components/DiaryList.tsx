// 📋 DiaryList: 일기 목록 아이템과 모달 로직을 보여주는 컴포넌트예요
// 📋 기능 검증 명령서:
// 1. useAuth 훅으로 사용자 정보가 잘 가져와지는지 확인해요
// 2. 일기 삭제 시 모달이 닫히고 목록이 갱신되는지 확인해요
// 3. 모달 열고 닫기가 잘 되는지 확인해요
// 4. 기분과 날씨 이모지가 올바르게 표시되는지 확인해요
// 5. 일기 목록이 잘 보이는지 확인해요
// 6. 이미지가 있는 일기는 썸네일이 잘 보이는지 확인해요

import { useState } from 'react'
import type { Diary } from '@/types/diary'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { useAuth } from '@/hooks/useAuth'
import { DiaryDetail } from './DiaryDetail'

// 📝 DiaryListProps: 일기 목록 컴포넌트에 필요한 속성들을 정의해요
interface DiaryListProps {
  diaries: Diary[];                    // 📚 일기 목록 데이터
  onDiaryClick?: (diaryId: string) => void;  // 👆 일기 클릭 시 실행할 함수
  onUpdate: (diary: Diary) => void;    // ✏️ 일기 수정 시 실행할 함수
  onDelete: (diaryId: string) => Promise<void>;  // 🗑️ 일기 삭제 시 실행할 함수
}

export const DiaryList: React.FC<DiaryListProps> = ({
  diaries = [],
  onDiaryClick,
  onUpdate,
  onDelete
}) => {
  // 🔑 useAuth 훅: 로그인한 사용자 정보를 가져와요
  const { user } = useAuth()
  
  // ✉️ selectedDiary: 선택한 일기 데이터를 저장해요
  const [selectedDiary, setSelectedDiary] = useState<Diary | null>(null)
  // 🔔 isModalOpen: 모달(상세 뷰) 열림 상태를 기록해요
  const [isModalOpen, setIsModalOpen] = useState(false)
  // 🗑️ isDeleting: 삭제 진행 중인 상태를 알려줘요
  const [isDeleting, setIsDeleting] = useState(false)
  // 🚨 error: 모달 내 에러 메시지를 보여줘요
  const [error, setError] = useState<string | null>(null)

  // 👍 handleDiaryClick: 일기를 클릭하면 모달을 열고 상세 보기로 이동해요
  const handleDiaryClick = (diary: Diary) => {
    setSelectedDiary(diary)
    setIsModalOpen(true)
    onDiaryClick?.(diary.id)
  }

  // 🔒 handleCloseModal: 모달을 닫고 선택 데이터를 초기화해요
  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedDiary(null)
    setError(null)
  }

  // 🗑️ handleDelete: 일기 삭제 로직으로 모달과 상태를 처리해요
  const handleDelete = async (diaryId: string) => {
    if (!user) return
    
    try {
      setIsDeleting(true)
      setError(null)
      await onDelete(diaryId)
      handleCloseModal()
    } catch (error) {
      console.error('일기 삭제 실패:', error)
      setError('일기 삭제에 실패했습니다.')
    } finally {
      setIsDeleting(false)
    }
  }

  // 😃 getMoodEmoji: 기분에 맞는 이모지를 보여줘요
  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case 'happy':
        return '😊'
      case 'sad':
        return '😢'
      case 'angry':
        return '😠'
      case 'excited':
        return '🤩'
      case 'tired':
        return '😫'
      default:
        return '😐'
    }
  }

  // 🌤️ getWeatherEmoji: 날씨에 맞는 이모지를 보여줘요
  const getWeatherEmoji = (weather: string) => {
    switch (weather) {
      case 'sunny':
        return '☀️'
      case 'cloudy':
        return '☁️'
      case 'rainy':
        return '🌧️'
      case 'snowy':
        return '❄️'
      case 'windy':
        return '💨'
      default:
        return '🌤️'
    }
  }

  return (
    <div className="space-y-4">
      {/* 📚 일기 목록 렌더링 */}
      {diaries.map((diary) => (
        <div
          key={diary.id}
          onClick={() => handleDiaryClick(diary)}
          className="bg-white shadow rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start">
            <div>
              {/* 📅 일기 날짜 표시 */}
              <h3 className="text-lg font-medium text-gray-900">
                {format(new Date(diary.date), 'yyyy년 MM월 dd일 (EEEE)', { locale: ko })}
              </h3>
              {/* 😊 기분과 날씨 이모지 표시 */}
              <div className="mt-1 flex items-center space-x-2">
                {diary.mood && (
                  <span className="text-sm text-gray-500">
                    {getMoodEmoji(diary.mood)} {diary.mood}
                  </span>
                )}
                {diary.weather && (
                  <span className="text-sm text-gray-500">
                    {getWeatherEmoji(diary.weather)} {diary.weather}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* 📝 일기 내용 미리보기 */}
          {diary.content && (
            <p className="mt-2 text-sm text-gray-600 line-clamp-3">{diary.content}</p>
          )}

          {/* 🖼️ 일기 이미지 썸네일 */}
          {diary.images && diary.images.length > 0 && (
            <div className="mt-4 flex space-x-2">
              {diary.images.slice(0, 3).map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`일기 이미지 ${index + 1}`}
                  className="w-16 h-16 object-cover rounded"
                />
              ))}
              {diary.images.length > 3 && (
                <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
                  <span className="text-sm text-gray-500">+{diary.images.length - 3}</span>
                </div>
              )}
            </div>
          )}
        </div>
      ))}

      {/* 🔔 일기 상세 모달 */}
      {selectedDiary && isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* 📖 DiaryDetail: 일기 상세 내용 컴포넌트 */}
            <DiaryDetail
              diary={selectedDiary}
              onUpdate={onUpdate}
              onDelete={handleDelete}
              isDeleting={isDeleting}
            />
            {/* ⚠️ 에러 메시지 표시 */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-600">
                {error}
              </div>
            )}
            {/* 🔒 모달 닫기 버튼 */}
            <div className="p-4 border-t">
              <button
                onClick={handleCloseModal}
                disabled={isDeleting}
                className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 