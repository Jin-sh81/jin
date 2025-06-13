// 🪝 useProfile: 프로필 정보 가져오기/수정하기를 쉽게 해주는 훅이에요!
import { useState, useEffect } from 'react'
import { Profile } from '../types'
import { profileService } from '../services/profileService'

export const useProfile = () => {
  // 👤 프로필 상태
  const [profile, setProfile] = useState<Profile | null>(null)
  // ⏳ 로딩 상태
  const [loading, setLoading] = useState(false)
  // 🚨 에러 상태
  const [error, setError] = useState<string | null>(null)

  // 👀 프로필 정보 불러오기
  const fetchProfile = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await profileService.getProfile()
      setProfile(data)
    } catch (err: any) {
      setError('프로필 정보를 불러오지 못했어요.')
    } finally {
      setLoading(false)
    }
  }

  // ✏️ 프로필 정보 수정하기
  const updateProfile = async (newProfile: Profile) => {
    setLoading(true)
    setError(null)
    try {
      const updated = await profileService.updateProfile(newProfile)
      setProfile(updated)
    } catch (err: any) {
      setError('프로필 정보를 수정하지 못했어요.')
    } finally {
      setLoading(false)
    }
  }

  // 처음에 프로필 정보 불러오기
  useEffect(() => {
    fetchProfile()
  }, [])

  return { profile, loading, error, fetchProfile, updateProfile }
}
