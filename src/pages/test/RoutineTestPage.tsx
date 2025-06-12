import React, { useState } from 'react'
import Button from '../../shared/components/Button'
import { testCreateRoutine } from '../../services/routineService'

/**
 * 루틴 테스트 페이지
 * 
 * 이 페이지는 루틴 관련 기능을 테스트하기 위한 페이지입니다.
 * testCreateRoutine 함수를 호출하여 테스트용 루틴을 생성할 수 있습니다.
 */
const RoutineTestPage: React.FC = () => {
  // 로딩 상태 관리
  const [isLoading, setIsLoading] = useState(false)
  // 결과 메시지 상태 관리
  const [resultMessage, setResultMessage] = useState<string | null>(null)

  /**
   * 테스트 루틴 생성 함수
   * 
   * 이 함수는 testCreateRoutine을 호출하여 테스트용 루틴을 생성합니다.
   * 생성 중에는 로딩 상태를 표시하고, 완료되면 결과 메시지를 보여줍니다.
   */
  const handleCreateTestRoutine = async () => {
    try {
      // 로딩 상태 시작
      setIsLoading(true)
      setResultMessage(null)

      // 테스트 루틴 생성 함수 호출
      await testCreateRoutine()

      // 성공 메시지 설정
      setResultMessage('테스트 루틴이 성공적으로 생성되었습니다! 🎉')
    } catch (error) {
      // 에러 메시지 설정
      setResultMessage(`오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`)
    } finally {
      // 로딩 상태 종료
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">루틴 테스트 페이지</h1>

        {/* 테스트 섹션 */}
        <section className="bg-white rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">테스트 루틴 생성</h2>
          
          <div className="space-y-4">
            {/* 설명 */}
            <div className="bg-blue-50 p-4 rounded-md">
              <p className="text-blue-800">
                이 버튼을 클릭하면 테스트용 루틴이 생성됩니다.
                <br />
                생성되는 루틴:
                <ul className="list-disc list-inside mt-2">
                  <li>제목: 아침 운동</li>
                  <li>설명: 매일 아침 30분 운동하기</li>
                  <li>시간: 매일 아침 7시</li>
                  <li>사용자 ID: testUser123</li>
                </ul>
              </p>
            </div>

            {/* 테스트 버튼 */}
            <div className="flex gap-4">
              <Button
                onClick={handleCreateTestRoutine}
                isLoading={isLoading}
                variant="primary"
                size="large"
              >
                테스트 루틴 생성하기
              </Button>
            </div>

            {/* 결과 메시지 */}
            {resultMessage && (
              <div className={`p-4 rounded-md ${
                resultMessage.includes('성공') 
                  ? 'bg-green-50 text-green-800' 
                  : 'bg-red-50 text-red-800'
              }`}>
                {resultMessage}
              </div>
            )}
          </div>
        </section>

        {/* 사용 방법 섹션 */}
        <section className="bg-white rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">사용 방법</h2>
          
          <div className="space-y-4">
            <div className="prose">
              <h3>1. 테스트 루틴 생성하기</h3>
              <p>
                "테스트 루틴 생성하기" 버튼을 클릭하면 testCreateRoutine 함수가 호출되어
                테스트용 루틴이 생성됩니다. 생성 중에는 로딩 상태가 표시되고,
                완료되면 결과 메시지가 표시됩니다.
              </p>

              <h3>2. 결과 확인하기</h3>
              <p>
                루틴이 성공적으로 생성되면 Firebase 콘솔에서 확인할 수 있습니다.
                생성된 루틴은 testUser123 사용자의 routines 컬렉션에 저장됩니다.
              </p>

              <h3>3. 주의사항</h3>
              <p>
                - 이 테스트는 실제 데이터를 생성하므로 주의해서 사용해야 합니다.
                - 테스트용 루틴은 testUser123 사용자 ID로 생성됩니다.
                - 동일한 ID의 루틴이 이미 존재하면 덮어쓰기가 됩니다.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default RoutineTestPage 