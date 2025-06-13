// 💾 useRememberMe: Remember Me 기능을 관리하는 훅이에요!
import { useState, useEffect } from 'react'
import { StorageService } from '../services/storageService'

export const useRememberMe = () => {
  // �� rememberMe 상태: 로그인 상태를 기억할지 여부를 저장해요
  const [rememberMe, setRememberMe] = useState<boolean>(
    StorageService.getRememberMe()
  )

  // ⚡️ rememberMe가 변경될 때마다 로컬 스토리지에 저장해요
  useEffect(() => {
    StorageService.setRememberMe(rememberMe)
  }, [rememberMe])

  // 🔄 rememberMe 상태를 토글하는 함수예요
  const toggleRememberMe = () => {
    setRememberMe(prev => !prev)
  }

  return {
    rememberMe,
    setRememberMe,
    toggleRememberMe
  }
}
