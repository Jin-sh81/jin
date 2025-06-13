// 💾 DataBackupButton: 내 데이터를 백업하는 버튼이에요!
import React from 'react'
import { accountService } from '../services/accountService'

const DataBackupButton: React.FC = () => (
  <button
    className="bg-blue-500 text-white px-4 py-2 rounded"
    onClick={() => accountService.backupData()}
  >
    데이터 백업
  </button>
)

export default DataBackupButton
