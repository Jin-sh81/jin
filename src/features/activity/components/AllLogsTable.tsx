// 📋 AllLogsTable: 모든 활동 로그를 표로 보여주는 컴포넌트예요!
import React from 'react'
import { AllLog } from '../types'

interface AllLogsTableProps {
  logs: AllLog[]
}

const typeLabel: Record<AllLog['type'], string> = {
  login: '로그인',
  update: '변경',
  access: '접근',
  error: '에러'
}

const AllLogsTable: React.FC<AllLogsTableProps> = ({ logs }) => (
  <table className="activity-log-table w-full border-collapse">
    <thead>
      <tr>
        <th>시간</th>
        <th>종류</th>
        <th>내용</th>
        <th>IP</th>
        <th>기기</th>
        <th>위치</th>
      </tr>
    </thead>
    <tbody>
      {logs.map((log, idx) => (
        <tr key={idx}>
          <td>{log.timestamp}</td>
          <td>{typeLabel[log.type]}</td>
          <td>{log.message}</td>
          <td>{log.ip || '-'}</td>
          <td>{log.device || '-'}</td>
          <td>{log.location || '-'}</td>
        </tr>
      ))}
    </tbody>
  </table>
)

export default AllLogsTable
