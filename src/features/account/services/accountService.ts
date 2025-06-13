// 🛠️ accountService: 계정 삭제, 비활성화, 백업, 다운로드 함수들이에요!
export const accountService = {
  // 🗑️ 계정 삭제
  deleteAccount: async () => {
    // 실제로는 서버에 삭제 요청!
    alert('계정이 삭제되었습니다.')
  },
  // 💤 계정 비활성화
  deactivateAccount: async () => {
    // 실제로는 서버에 비활성화 요청!
    alert('계정이 비활성화되었습니다.')
  },
  // 💾 데이터 백업
  backupData: async () => {
    // 실제로는 서버에서 데이터 백업 파일 생성!
    alert('데이터 백업이 완료되었습니다.')
  },
  // 📥 개인정보 다운로드
  downloadPersonalData: async () => {
    // 실제로는 서버에서 개인정보 파일 다운로드!
    alert('개인정보 다운로드가 시작되었습니다.')
  }
}
