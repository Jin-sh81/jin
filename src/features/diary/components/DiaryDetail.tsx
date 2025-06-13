// 📖 DiaryDetail: 일기 상세 내용을 보여주고, 수정 및 삭제할 수 있는 컴포넌트예요!
// 📋 기능 검증 명령서:
// 1. 편집 모드 전환이 잘 되는지 확인해요
// 2. 수정된 내용이 잘 저장되는지 확인해요
// 3. 편집 취소 시 원래 내용이 복원되는지 확인해요
// 4. 삭제 버튼이 잘 작동하는지 확인해요
// 5. 기분과 날씨 이모지가 올바르게 표시되는지 확인해요
// 6. 이미지가 있는 일기는 이미지가 잘 보이는지 확인해요

import { useState } from 'react'
import type { Diary } from '@/types/diary'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline'

// 📝 DiaryDetailProps: 일기 상세 컴포넌트에 필요한 속성들을 정의해요
interface DiaryDetailProps {
  diary: Diary;                    // 📚 일기 데이터
  onUpdate: (diary: Diary) => void;  // ✏️ 일기 수정 시 실행할 함수
  onDelete: (diaryId: string) => Promise<void>;  // 🗑️ 일기 삭제 시 실행할 함수
  isDeleting: boolean;             // ⏳ 삭제 진행 중인지 알려줘요
}

export const DiaryDetail: React.FC<DiaryDetailProps> = ({
  diary,
  onUpdate,
  onDelete,
  isDeleting
}) => {
  // ✏️ isEditing: 편집 모드 여부를 저장해요
  const [isEditing, setIsEditing] = useState(false)
  // 📝 editedContent: 수정 중인 일기 내용을 저장해요
  const [editedContent, setEditedContent] = useState(diary.content)
  // 💾 isSaving: 저장 중 로딩 표시를 제어해요
  const [isSaving, setIsSaving] = useState(false)
  // 🚨 error: 편집/저장 중 에러 메시지를 저장해요
  const [error, setError] = useState<string | null>(null)

  // ✏️ handleEdit: 편집 모드를 켜고, 현재 내용을 입력 필드에 불러와요
  const handleEdit = () => {
    setIsEditing(true)
    setEditedContent(diary.content)
  }

  // 🔄 handleSave: 수정된 내용을 저장하고, 편집 모드를 종료해요
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

  // 🚫 handleCancel: 편집을 취소하고 원래 내용을 복원해요
  const handleCancel = () => {
    setIsEditing(false)
    setEditedContent(diary.content)
    setError(null)
  }

  // 😃 getMoodEmoji: 기분 코드에 맞는 이모지를 반환해요
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

  // 🌤️ getWeatherEmoji: 날씨 코드에 맞는 이모지를 반환해요
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
          {/* 🔍 날짜 및 기분/날씨 표시: format 함수로 날짜를 예쁘게 보여줘요 */}
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
          {/* 🖊️ 편집 버튼(PencilIcon): 편집 모드를 활성화해요 */}
          <button
            onClick={handleEdit}
            disabled={isEditing || isDeleting}
            className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PencilIcon className="h-5 w-5" />
          </button>
          {/* 🗑️ 삭제 버튼(TrashIcon): 누르면 일기를 삭제해요 */}
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
          {/* 📜 내용 영역: 편집 모드 시 textarea로 렌더링해요 */}
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full h-48 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="오늘의 일기를 작성해주세요..."
          />
          {/* ⚠️ 에러 메시지 표시 */}
          {error && (
            <div className="text-sm text-red-600">{error}</div>
          )}
          {/* ✅ 저장/취소 버튼: 편집 모드에서만 보이며, handleSave/handleCancel을 호출해요 */}
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
          {/* 📜 내용 영역: 읽기 모드 시 p 태그로 렌더링해요 */}
          <p className="text-gray-700 whitespace-pre-wrap">{diary.content}</p>
          {/* 🖼️ 일기 이미지 표시 */}
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