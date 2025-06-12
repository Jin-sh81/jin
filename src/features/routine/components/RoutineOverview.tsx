import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getRoutineHistory, getRoutineStats } from "@/services/routineService"
import { auth } from '@/infrastructure/firebase/firebaseConfig'
import type { RoutineHistory, RoutineStats } from '@/types/firestore'

// 🔽 요일 한글 매핑
const WEEKDAY_NAMES: { [key: string]: string } = {
  monday: '월',
  tuesday: '화',
  wednesday: '수',
  thursday: '목',
  friday: '금',
  saturday: '토',
  sunday: '일'
}

// 🔽 루틴 개요 컴포넌트
const RoutineOverview: React.FC = () => {
  // 🔽 URL 파라미터에서 루틴 ID 가져오기
  const { routineId } = useParams<{ routineId: string }>()
  
  // 🔽 상태 관리
  const [history, setHistory] = useState<RoutineHistory[]>([])
  const [stats, setStats] = useState<RoutineStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 🔽 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        // 🔽 현재 로그인한 사용자의 uid 가져오기
        const uid = auth.currentUser?.uid
        if (!uid) {
          throw new Error('로그인이 필요합니다.')
        }

        if (!routineId) {
          throw new Error('루틴 ID가 없습니다.')
        }

        // 🔽 병렬로 데이터 가져오기
        const [historyData, monthlyStats] = await Promise.all([
          getRoutineHistory(uid, routineId, 10),  // 최근 10개 기록
          getRoutineStats(uid, routineId)
        ])

        setHistory(historyData.map(record => ({
          date: record.date,
          completed: !!record.completedAt,
          memo: record.memo,
          afterImageURL: record.afterImageURL
        })))
        setStats(monthlyStats)
      } catch (error) {
        console.error('데이터 가져오기 실패:', error)
        setError(error instanceof Error ? error.message : '데이터를 가져오는데 실패했습니다.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [routineId])

  // 🔽 주차 계산 헬퍼 함수
  const getWeekNumber = (date: Date): number => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
  }

  if (loading) {
    return <div className="p-4 text-center">로딩 중...</div>
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 🔸 통계 섹션 */}
      <section className="mb-8">
        <h2 className="text-lg font-bold mb-4">통계</h2>
        {stats && (
          <div className="bg-white rounded-lg shadow p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">성공률</p>
                <p className="text-2xl font-bold">{stats.successRate}%</p>
              </div>
              <div>
                <p className="text-gray-600">완료 횟수</p>
                <p className="text-2xl font-bold">
                  {stats.totalCompletions} / {stats.totalRecords}
                </p>
              </div>
            </div>

            {/* 🔸 요일별 성공률 */}
            <div className="mt-4">
              <h3 className="text-sm font-semibold mb-2">요일별 성공률</h3>
              <div className="space-y-2">
                {Object.entries(stats.weekdayStats).map(([weekday, rate]) => (
                  <div key={weekday} className="flex justify-between items-center border-b py-2">
                    <span className="text-gray-600">{WEEKDAY_NAMES[weekday]}</span>
                    <span className="font-medium">{rate}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 🔸 히스토리 섹션 */}
      <section>
        <h2 className="text-lg font-bold mb-4">히스토리</h2>
        <div className="bg-white rounded-lg shadow">
          {history.map((record, index) => (
            <div key={index} className="flex justify-between items-center border-b py-3 px-4">
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">{record.date}</span>
                <span className={`px-2 py-1 rounded text-sm ${
                  record.completed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {record.completed ? '완료' : '미완료'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                {record.memo && (
                  <span className="text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </span>
                )}
                {record.afterImageURL && (
                  <img
                    src={record.afterImageURL}
                    alt="완료 후 이미지"
                    className="w-8 h-8 rounded object-cover"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default RoutineOverview 