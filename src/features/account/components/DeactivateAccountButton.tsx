// 💤 DeactivateAccountButton: 계정을 잠시 쉴 수 있게 비활성화하는 버튼이에요!
import React from 'react'
import { accountService } from '../services/accountService'

const DeactivateAccountButton: React.FC = () => (
  <button
    className="bg-yellow-500 text-white px-4 py-2 rounded"
    onClick={() => {
      if (window.confirm('계정을 비활성화하시겠어요?')) {
        accountService.deactivateAccount()
      }
    }}
  >
    계정 비활성화
  </button>
)

export default DeactivateAccountButton
