// 📥 DownloadPersonalDataButton: 내 개인정보를 파일로 내려받는 버튼이에요!
import React from 'react'
import { accountService } from '../services/accountService'

const DownloadPersonalDataButton: React.FC = () => (
  <button
    className="bg-green-500 text-white px-4 py-2 rounded"
    onClick={() => accountService.downloadPersonalData()}
  >
    개인정보 다운로드
  </button>
)

export default DownloadPersonalDataButton
