// 🛡️ securityService: 비밀번호 강도 체크 등 보안 검증 함수예요!
export const SecurityService = {
  // 🔒 비밀번호가 안전한지 검사
  isPasswordStrong: (password: string): boolean => {
    // 예시: 6자 이상, 숫자/영문/특수문자 포함
    return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*]{6,}$/.test(password)
  }
}
