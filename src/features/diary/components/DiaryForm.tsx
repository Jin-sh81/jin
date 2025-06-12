import { useState } from 'react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { PhotoIcon } from '@heroicons/react/24/outline'
import type { Diary } from '@/types/diary'

interface DiaryFormProps {
  onSubmit: (diary: Omit<Diary, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
}

export const DiaryForm: React.FC<DiaryFormProps> = ({ onSubmit }) => {
  const [content, setContent] = useState('')
  const [mood, setMood] = useState<Diary['mood']>(undefined)
  const [weather, setWeather] = useState<Diary['weather']>(undefined)
  const [images, setImages] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!content.trim()) {
      setError('일기 내용을 입력해주세요.')
      return
    }

    try {
      setIsSubmitting(true)
      setError(null)
      
      await onSubmit({
        date: new Date().toISOString(),
        content: content.trim(),
        mood,
        weather,
        images
      })

      // 폼 초기화
      setContent('')
      setMood(undefined)
      setWeather(undefined)
      setImages([])
    } catch (error) {
      console.error('일기 작성 실패:', error)
      setError('일기 작성에 실패했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    try {
      // TODO: 이미지 업로드 로직 구현
      // const uploadedUrls = await uploadImages(files)
      // setImages(prev => [...prev, ...uploadedUrls])
    } catch (error) {
      console.error('이미지 업로드 실패:', error)
      setError('이미지 업로드에 실패했습니다.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700">
          날짜
        </label>
        <div className="mt-1">
          <p className="text-lg font-medium text-gray-900">
            {format(new Date(), 'yyyy년 MM월 dd일 (EEEE)', { locale: ko })}
          </p>
        </div>
      </div>

      <div>
        <label htmlFor="mood" className="block text-sm font-medium text-gray-700">
          오늘의 기분
        </label>
        <select
          id="mood"
          value={mood}
          onChange={(e) => setMood(e.target.value as Diary['mood'])}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          <option value="">선택해주세요</option>
          <option value="happy">행복해요 😊</option>
          <option value="sad">슬퍼요 😢</option>
          <option value="angry">화나요 😠</option>
          <option value="excited">신나요 🤩</option>
          <option value="tired">피곤해요 😫</option>
        </select>
      </div>

      <div>
        <label htmlFor="weather" className="block text-sm font-medium text-gray-700">
          오늘의 날씨
        </label>
        <select
          id="weather"
          value={weather}
          onChange={(e) => setWeather(e.target.value as Diary['weather'])}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          <option value="">선택해주세요</option>
          <option value="sunny">맑음 ☀️</option>
          <option value="cloudy">흐림 ☁️</option>
          <option value="rainy">비 🌧️</option>
          <option value="snowy">눈 ❄️</option>
          <option value="windy">바람 💨</option>
        </select>
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
          일기 내용
        </label>
        <div className="mt-1">
          <textarea
            id="content"
            rows={6}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            placeholder="오늘의 일기를 작성해주세요..."
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">사진 첨부</label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
          <div className="space-y-1 text-center">
            <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
            <div className="flex text-sm text-gray-600">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
              >
                <span>사진 업로드</span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                />
              </label>
              <p className="pl-1">또는 드래그 앤 드롭</p>
            </div>
            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
          </div>
        </div>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative">
              <img
                src={image}
                alt={`업로드된 이미지 ${index + 1}`}
                className="w-full h-48 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => setImages(prev => prev.filter((_, i) => i !== index))}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="text-sm text-red-600">{error}</div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? '저장 중...' : '저장하기'}
        </button>
      </div>
    </form>
  )
} 