import React, { useState } from 'react'
import type { Diary } from '@/types/diary'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import Button from '@/shared/components/Button'
import { updateDiary, deleteDiary } from '@/services/diaryService'
import { useAuth } from '@/hooks/useAuth'

interface DiaryDetailModalProps {
  diary: Diary;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (diaryId: string) => Promise<void>;
}

const DiaryDetailModal: React.FC<DiaryDetailModalProps> = ({
  diary,
  isOpen,
  onClose,
  onDelete
}) => {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [content, setContent] = useState(diary.content)
  const [mood, setMood] = useState(diary.mood)
  const [weather, setWeather] = useState(diary.weather || '')

  if (!isOpen) return null

  const handleEditToggle = () => {
    setIsEditing(prev => !prev)
  }

  const handleSave = async () => {
    try {
      if (!user?.uid) {
        console.error('로그인이 필요합니다.')
        return
      }

      await updateDiary(user.uid, diary.id, {
        content,
        mood,
        weather
      })
      
      setIsEditing(false)
    } catch (error) {
      console.error('일기 수정 실패:', error)
    }
  }

  const handleCancel = () => {
    setContent(diary.content)
    setMood(diary.mood)
    setWeather(diary.weather || '')
    setIsEditing(false)
  }

  const handleDelete = async () => {
    try {
      const isConfirmed = window.confirm('정말로 이 일기를 삭제하시겠습니까?')
      if (!isConfirmed) return

      if (!user?.uid) {
        console.error('로그인이 필요합니다.')
        return
      }

      await deleteDiary(user.uid, diary.id)
      await onDelete(diary.id)
      onClose()
    } catch (error) {
      console.error('일기 삭제 실패:', error)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">
            {format(new Date(diary.date), 'yyyy년 MM월 dd일', {
              locale: ko,
            })}
          </h2>
          <div className="flex gap-2">
            {!isEditing && (
              <>
                <Button
                  onClick={handleEditToggle}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  수정
                </Button>
                <Button
                  onClick={handleDelete}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  삭제
                </Button>
              </>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-700 text-2xl font-bold"
              aria-label="닫기"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              기분: {isEditing ? (
                <input
                  type="text"
                  value={mood}
                  onChange={e => setMood(e.target.value)}
                  className="border rounded px-2 py-1"
                />
              ) : (
                mood
              )}
            </div>
            <div className="text-sm text-gray-600">
              날씨: {isEditing ? (
                <input
                  type="text"
                  value={weather}
                  onChange={e => setWeather(e.target.value)}
                  className="border rounded px-2 py-1"
                />
              ) : (
                weather
              )}
            </div>
          </div>

          <div className="mt-4">
            {isEditing ? (
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                className="w-full h-48 border rounded p-2"
                placeholder="일기 내용을 입력하세요"
              />
            ) : (
              <p className="text-gray-700 whitespace-pre-wrap">{content}</p>
            )}
          </div>

          {diary.images && diary.images.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-2">
              {diary.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`일기 이미지 ${index + 1}`}
                  className="w-full h-24 object-cover rounded"
                />
              ))}
            </div>
          )}

          {isEditing && (
            <div className="mt-4 flex justify-end gap-2">
              <Button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                취소
              </Button>
              <Button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                저장
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DiaryDetailModal 