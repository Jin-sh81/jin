// 📱 DeviceList: 로그인한 기기 목록과 접속 제한 버튼을 보여줘요!
import React from 'react'
import { Device } from '../types'

interface DeviceListProps {
  devices: Device[]
  onDisconnect: (id: string) => void
}

const DeviceList: React.FC<DeviceListProps> = ({ devices, onDisconnect }) => (
  <table className="device-table w-full border-collapse">
    <thead>
      <tr>
        <th>기기 이름</th>
        <th>마지막 접속</th>
        <th>상태</th>
        <th>접속 제한</th>
      </tr>
    </thead>
    <tbody>
      {devices.map((d) => (
        <tr key={d.id}>
          <td>{d.name}</td>
          <td>{d.lastActiveAt}</td>
          <td>{d.isActive ? '접속 중' : '해제됨'}</td>
          <td>
            {d.isActive && (
              <button
                className="bg-yellow-500 text-white px-2 py-1 rounded"
                onClick={() => onDisconnect(d.id)}
              >
                접속 제한
              </button>
            )}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
)

export default DeviceList
