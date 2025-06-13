// 🖼️ ProfileImageUploader: 프로필 이미지를 업로드/크롭/미리보기 할 수 있어요!
import React, { useRef, useState } from 'react'

// 기본 이미지 경로
import defaultProfile from 'assets/default-profile.png'

interface ProfileImageUploaderProps {
  value?: string // 현재 이미지 URL
  onChange: (url: string) => void
}

const ProfileImageUploader: React.FC<ProfileImageUploaderProps> = ({ value, onChange }) => {
  // 🖼️ 미리보기 이미지 상태
  const [preview, setPreview] = useState<string>(value || defaultProfile)
  // 파일 input 참조
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 파일 선택 시 실행
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // 미리보기용 URL 생성
      const reader = new FileReader()
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setPreview(ev.target.result as string)
          onChange(ev.target.result as string) // 실제로는 서버 업로드 후 URL을 받아야 해요!
        }
      }
      reader.readAsDataURL(file)
    }
  }

  // 크롭 기능은 실제로는 라이브러리(react-easy-crop 등)로 구현 가능!
  // 여기선 간단히 미리보기만 제공해요.

  // 기본 이미지로 변경
  const handleSetDefault = () => {
    setPreview(defaultProfile)
    onChange(defaultProfile)
  }

  return (
    <div className="flex flex-col items-center space-y-2">
      {/* 🖼️ 이미지 미리보기 */}
      <img
        src={preview}
        alt="프로필 미리보기"
        className="w-24 h-24 rounded-full object-cover border"
      />
      {/* 파일 선택 버튼 */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <div className="flex space-x-2">
        <button
          type="button"
          className="bg-gray-200 px-2 py-1 rounded"
          onClick={() => fileInputRef.current?.click()}
        >
          이미지 업로드
        </button>
        <button
          type="button"
          className="bg-gray-200 px-2 py-1 rounded"
          onClick={handleSetDefault}
        >
          기본 이미지
        </button>
      </div>
      {/* ✂️ 크롭 기능은 실제 구현 시 라이브러리로 추가 가능 */}
      <span className="text-xs text-gray-500">이미지는 동그랗게 잘려서 보여져요!</span>
    </div>
  )
}

export default ProfileImageUploader
