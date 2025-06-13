// 👤 Profile 타입: 사용자 프로필 정보를 담는 상자예요!
export interface Profile {
  // 🏷️ 이름
  displayName: string
  // 📧 이메일
  email: string
  // 📱 전화번호
  phoneNumber?: string
  // 🏠 주소
  address?: string
  // 🖼️ 프로필 이미지(파일 URL)
  photoURL?: string
}
