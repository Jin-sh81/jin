// 🗝️ SessionList: 활성 세션 목록과 세션 종료 버튼을 보여줘요!
import React from 'react'
import { Session } from '../types'
import { sessionService } from '../services/sessionService'

interface SessionListProps {
  sessions: Session[]
  onEndSession: (id: string) => void
}

const SessionList: React.FC<SessionListProps> = ({ sessions, onEndSession }) => (
  <table className="session-table w-full border-collapse">
    <thead>
      <tr>
        <th>로그인 시간</th>
        <th>기기</th>
        <th>IP</th>
        <th>위치</th>
        <th>상태</th>
        <th>종료</th>
      </tr>
    </thead>
    <tbody>
      {sessions.map((s) => (
        <tr key={s.id}>
          <td>{s.loginAt}</td>
          <td>{s.device}</td>
          <td>{s.ip}</td>
          <td>{s.location}</td>
          <td>{s.isActive ? '활성' : '종료됨'}</td>
          <td>
            {s.isActive && (
              <button
                className="bg-red-500 text-white px-2 py-1 rounded"
                onClick={() => onEndSession(s.id)}
              >
                세션 종료
              </button>
            )}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
)

export default SessionList
