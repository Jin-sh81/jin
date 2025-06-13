// 📋 ActivityLogTable: 로그인 기록을 표로 보여주는 컴포넌트예요!
import React from 'react'
import { ActivityLog } from '../types'

interface ActivityLogTableProps {
  logs: ActivityLog[]
}

const ActivityLogTable: React.FC<ActivityLogTableProps> = ({ logs }) => (
  <table className="activity-log-table w-full border-collapse">
    <thead>
      <tr>
        <th>로그인 시간</th>
        <th>IP</th>
        <th>기기</th>
        <th>위치</th>
      </tr>
    </thead>
    <tbody>
      {logs.map((log, idx) => (
        <tr key={idx}>
          <td>{log.timestamp}</td>
          <td>{log.ip}</td>
          <td>{log.device}</td>
          <td>{log.location}</td>
        </tr>
      ))}
    </tbody>
  </table>
)

export default ActivityLogTable
