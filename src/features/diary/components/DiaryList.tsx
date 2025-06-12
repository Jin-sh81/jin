import { useState } from 'react'
import type { Diary } from '@/types/diary'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { useAuth } from '@/hooks/useAuth'
import { DiaryDetail } from './DiaryDetail'

interface DiaryListProps {
  diaries: Diary[];
  onDiaryClick?: (diaryId: string) => void;
  onUpdate: (diary: Diary) => void;
  onDelete: (diaryId: string) => Promise<void>;
}

export const DiaryList: React.FC<DiaryListProps> = ({
  diaries = [],
  onDiaryClick,
  onUpdate,
  onDelete
}) => {
  const { user } = useAuth()
  const [selectedDiary, setSelectedDiary] = useState<Diary | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDiaryClick = (diary: Diary) => {
    setSelectedDiary(diary)
    setIsModalOpen(true)
    onDiaryClick?.(diary.id)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedDiary(null)
    setError(null)
  }

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
      {diaries.map((diary) => (
        <div
          key={diary.id}
          onClick={() => handleDiaryClick(diary)}
          className="bg-white shadow rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                {format(new Date(diary.date), 'yyyy년 MM월 dd일 (EEEE)', { locale: ko })}
              </h3>
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

          {diary.content && (
            <p className="mt-2 text-sm text-gray-600 line-clamp-3">{diary.content}</p>
          )}

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

      {selectedDiary && isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <DiaryDetail
              diary={selectedDiary}
              onUpdate={onUpdate}
              onDelete={handleDelete}
              isDeleting={isDeleting}
            />
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-600">
                {error}
              </div>
            )}
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