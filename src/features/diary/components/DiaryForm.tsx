// 📝 DiaryForm: 사용자가 일기를 작성할 수 있는 입력 폼이에요!
// 📋 기능 검증 명령서:
// 1. 일기 내용이 잘 입력되는지 확인해요
// 2. 기분과 날씨가 잘 선택되는지 확인해요
// 3. 사진이 잘 첨부되는지 확인해요
// 4. 저장 버튼이 잘 작동하는지 확인해요
// 5. 빈 내용일 때 에러 메시지가 잘 보이는지 확인해요

import { useState } from 'react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'

interface DiaryFormProps {
  onSubmit: (diary: {
    content: string
    mood?: string
    weather?: string
    images?: string[]
  }) => Promise<void>
}

export const DiaryForm: React.FC<DiaryFormProps> = ({ onSubmit }) => {
  // ✍️ content: 일기 내용을 저장해요
  const [content, setContent] = useState('')
  // 😊 mood: 오늘의 기분을 선택해서 저장해요
  const [mood, setMood] = useState<string>('')
  // ☁️ weather: 오늘의 날씨를 선택해서 저장해요
  const [weather, setWeather] = useState<string>('')
  // 📸 images: 업로드된 이미지 URL 목록을 저장해요
  const [images, setImages] = useState<string[]>([])
  // ⏳ isSubmitting: 제출 중 로딩 표시를 제어해요
  const [isSubmitting, setIsSubmitting] = useState(false)
  // 🚨 error: 제출 중 발생한 에러 메시지를 저장해요
  const [error, setError] = useState<string | null>(null)

  // ✋ 폼 제출 방지: 새로고침 없이 제출 처리해요
  // 🚨 content 검증: 빈 내용일 경우 에러 메시지 보여줘요
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!content.trim()) {
      setError('일기 내용을 입력해주세요.')
      return
    }

    try {
      // 🔄 isSubmitting true: 제출 시작
      setIsSubmitting(true)
      setError(null)

      // 💾 onSubmit: 부모 컴포넌트에 작성한 일기 데이터를 전달해요
      await onSubmit({
        content: content.trim(),
        mood: mood || undefined,
        weather: weather || undefined,
        images: images.length > 0 ? images : undefined
      })

      // 🆕 폼 초기화: 제출 후 입력 필드를 초기화해요
      setContent('')
      setMood('')
      setWeather('')
      setImages([])
    } catch (error) {
      console.error('일기 저장 실패:', error)
      setError('일기를 저장하는데 실패했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // 📂 이미지 선택 시 호출: 파일 목록을 받아서 업로드 로직을 처리해요
  // TODO: uploadImages 함수 연동 검토
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    try {
      // TODO: 실제 이미지 업로드 로직 구현
      const uploadedUrls = Array.from(files).map(file => URL.createObjectURL(file))
      setImages(prev => [...prev, ...uploadedUrls])
    } catch (error) {
      console.error('이미지 업로드 실패:', error)
      setError('이미지 업로드에 실패했습니다.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 🚨 error: 에러 메시지 표시 */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* 📅 날짜 표시: 현재 날짜를 보여줘요 */}
      <div className="text-lg font-semibold text-gray-900">
        {format(new Date(), 'yyyy년 MM월 dd일 (EEEE)', { locale: ko })}
      </div>

      {/* 📋 기분 선택: 드롭다운에서 기분을 선택해요 */}
      <div>
        <label htmlFor="mood" className="block text-sm font-medium text-gray-700">
          오늘의 기분
        </label>
        <select
          id="mood"
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">기분 선택</option>
          <option value="happy">😊 행복해요</option>
          <option value="sad">😢 슬퍼요</option>
          <option value="angry">😠 화나요</option>
          <option value="excited">🤩 신나요</option>
          <option value="tired">😫 피곤해요</option>
        </select>
      </div>

      {/* 🌤️ 날씨 선택: 드롭다운에서 날씨를 선택해요 */}
      <div>
        <label htmlFor="weather" className="block text-sm font-medium text-gray-700">
          오늘의 날씨
        </label>
        <select
          id="weather"
          value={weather}
          onChange={(e) => setWeather(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">날씨 선택</option>
          <option value="sunny">☀️ 맑아요</option>
          <option value="cloudy">☁️ 흐려요</option>
          <option value="rainy">🌧️ 비와요</option>
          <option value="snowy">❄️ 눈와요</option>
          <option value="windy">💨 바람불어요</option>
        </select>
      </div>

      {/* ✏️ 일기 내용: 텍스트 영역에서 일기 내용을 입력해요 */}
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
          일기 내용
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="오늘 있었던 일을 자유롭게 적어보세요..."
        />
      </div>

      {/* 📷 사진 업로드: 파일 업로드 버튼을 통해 사진을 첨부할 수 있어요 */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          사진 첨부
        </label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
          <div className="space-y-1 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
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
            <p className="text-xs text-gray-500">PNG, JPG, GIF 최대 10MB</p>
          </div>
        </div>
      </div>

      {/* 🔘 저장하기 버튼: 누르면 handleSubmit을 실행해요 */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? '저장 중...' : '저장하기'}
        </button>
      </div>
    </form>
  )
} 