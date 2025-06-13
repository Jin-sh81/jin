// 🗑️ DeleteAccountButton: 계정을 완전히 삭제하는 버튼이에요!
import React from 'react'
import { accountService } from '../services/accountService'

const DeleteAccountButton: React.FC = () => (
  <button
    className="bg-red-500 text-white px-4 py-2 rounded"
    onClick={() => {
      if (window.confirm('정말로 계정을 삭제하시겠어요?')) {
        accountService.deleteAccount()
      }
    }}
  >
    계정 삭제
  </button>
)

export default DeleteAccountButton
