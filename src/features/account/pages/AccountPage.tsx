// 🧑‍💼 AccountPage: 계정 관리(삭제, 비활성화, 백업, 다운로드)를 한 곳에서 할 수 있어요!
import React from 'react'
import {
  DeleteAccountButton,
  DeactivateAccountButton,
  DataBackupButton,
  DownloadPersonalDataButton
} from '../components'

const AccountPage: React.FC = () => (
  <div className="max-w-md mx-auto p-4 space-y-4">
    <h2 className="text-2xl font-bold mb-4">계정 관리</h2>
    <DeactivateAccountButton />
    <DeleteAccountButton />
    <DataBackupButton />
    <DownloadPersonalDataButton />
  </div>
)

export default AccountPage
