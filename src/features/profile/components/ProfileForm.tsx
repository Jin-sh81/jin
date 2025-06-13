// 📝 ProfileForm: 이름, 이메일, 전화번호, 주소를 수정할 수 있는 폼이에요!
import React, { useState, useEffect } from 'react'
import { Profile } from '../types'
import ProfileImageUploader from './ProfileImageUploader'

interface ProfileFormProps {
  initialProfile: Profile
  onSave: (profile: Profile) => void
  loading: boolean
}

const ProfileForm: React.FC<ProfileFormProps> = ({ initialProfile, onSave, loading }) => {
  // 🏷️ 각 입력값 상태
  const [displayName, setDisplayName] = useState(initialProfile.displayName)
  const [email, setEmail] = useState(initialProfile.email)
  const [phoneNumber, setPhoneNumber] = useState(initialProfile.phoneNumber || '')
  const [address, setAddress] = useState(initialProfile.address || '')
  const [photoURL, setPhotoURL] = useState(initialProfile.photoURL || '')

  // 폼 값이 바뀌면 상태도 바꿔줘요!
  useEffect(() => {
    setDisplayName(initialProfile.displayName)
    setEmail(initialProfile.email)
    setPhoneNumber(initialProfile.phoneNumber || '')
    setAddress(initialProfile.address || '')
    setPhotoURL(initialProfile.photoURL || '')
  }, [initialProfile])

  // 저장 버튼 클릭 시 실행
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      displayName,
      email,
      phoneNumber,
      address,
      photoURL
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <ProfileImageUploader value={photoURL} onChange={setPhotoURL} />
      <div>
        <label>이름</label>
        <input
          type="text"
          value={displayName}
          onChange={e => setDisplayName(e.target.value)}
          className="w-full border rounded px-2 py-1"
          required
        />
      </div>
      <div>
        <label>이메일</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full border rounded px-2 py-1"
          required
        />
      </div>
      <div>
        <label>전화번호</label>
        <input
          type="tel"
          value={phoneNumber}
          onChange={e => setPhoneNumber(e.target.value)}
          className="w-full border rounded px-2 py-1"
        />
      </div>
      <div>
        <label>주소</label>
        <input
          type="text"
          value={address}
          onChange={e => setAddress(e.target.value)}
          className="w-full border rounded px-2 py-1"
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? '저장 중...' : '저장하기'}
      </button>
    </form>
  )
}

export default ProfileForm
