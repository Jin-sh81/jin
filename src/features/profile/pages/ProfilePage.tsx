// 👤 ProfilePage: 내 프로필 정보를 보고, 수정할 수 있는 페이지예요!
import React from 'react'
import { useProfile } from '../hooks/useProfile'
import ProfileForm from '../components/ProfileForm'

const ProfilePage: React.FC = () => {
  const { profile, loading, error, updateProfile } = useProfile()

  if (loading && !profile) return <div>⏳ 프로필 정보를 불러오는 중이에요...</div>
  if (error) return <div>🚨 {error}</div>
  if (!profile) return null

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">내 프로필</h2>
      <ProfileForm
        initialProfile={profile}
        onSave={updateProfile}
        loading={loading}
      />
    </div>
  )
}

export default ProfilePage
