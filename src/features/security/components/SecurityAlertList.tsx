// 🛡️ SecurityAlertList: 보안 알림을 리스트로 보여주는 컴포넌트예요!
import React from 'react'
import { SecurityAlert } from '../types'

interface SecurityAlertListProps {
  alerts: SecurityAlert[]
}

const typeLabel: Record<SecurityAlert['type'], string> = {
  login: '로그인 알림',
  password: '비밀번호 변경',
  suspicious: '의심스러운 활동',
  settings: '계정 설정 변경'
}

const SecurityAlertList: React.FC<SecurityAlertListProps> = ({ alerts }) => (
  <ul className="security-alert-list space-y-2">
    {alerts.map((alert, idx) => (
      <li key={idx} className="p-3 rounded shadow bg-white dark:bg-gray-800">
        <div className="font-bold">{typeLabel[alert.type]}</div>
        <div className="text-sm text-gray-600 dark:text-gray-300">{alert.message}</div>
        <div className="text-xs text-gray-400 mt-1">
          {alert.timestamp}
          {alert.ip && <> | IP: {alert.ip}</>}
          {alert.device && <> | 기기: {alert.device}</>}
        </div>
      </li>
    ))}
  </ul>
)

export default SecurityAlertList
