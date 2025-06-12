import { useState } from 'react'
import type { Diary } from '@/types/diary'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline'

interface DiaryDetailProps {
  diary: Diary;
  onUpdate: (diary: Diary) => void;
  onDelete: (diaryId: string) => Promise<void>;
  isDeleting: boolean;
}

export const DiaryDetail: React.FC<DiaryDetailProps> = ({
  diary,
  onUpdate,
  onDelete,
  isDeleting
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(diary.content)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleEdit = () => {
    setIsEditing(true)
    setEditedContent(diary.content)
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      setError(null)
      await onUpdate({
        ...diary,
        content: editedContent
      })
      setIsEditing(false)
    } catch (error) {
      console.error('일기 수정 실패:', error)
      setError('일기 수정에 실패했습니다.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditedContent(diary.content)
    setError(null)
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
    <div className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {format(new Date(diary.date), 'yyyy년 MM월 dd일 (EEEE)', { locale: ko })}
          </h2>
          <div className="mt-2 flex items-center space-x-4">
            {diary.mood && (
              <span className="text-sm text-gray-600">
                {getMoodEmoji(diary.mood)} {diary.mood}
              </span>
            )}
            {diary.weather && (
              <span className="text-sm text-gray-600">
                {getWeatherEmoji(diary.weather)} {diary.weather}
              </span>
            )}
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleEdit}
            disabled={isEditing || isDeleting}
            className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PencilIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => onDelete(diary.id)}
            disabled={isDeleting || isEditing}
            className="p-2 text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full h-48 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="오늘의 일기를 작성해주세요..."
          />
          {error && (
            <div className="text-sm text-red-600">{error}</div>
          )}
          <div className="flex justify-end space-x-2">
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              취소
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? '저장 중...' : '저장'}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-gray-700 whitespace-pre-wrap">{diary.content}</p>
          {diary.images && diary.images.length > 0 && (
            <div className="grid grid-cols-2 gap-4">
              {diary.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`일기 이미지 ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg"
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
} 