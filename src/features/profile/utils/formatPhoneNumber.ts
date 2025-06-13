// 📞 formatPhoneNumber: 전화번호를 예쁘게 만들어주는 함수예요!
export function formatPhoneNumber(phone: string): string {
  // 01012345678 → 010-1234-5678
  return phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')
}
