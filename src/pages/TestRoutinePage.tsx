import React, { useEffect, useState } from 'react'
import { updateTestRoutineWithImages } from '@/features/routine/routineService'

const TestRoutinePage: React.FC = () => {
  const [result, setResult] = useState<string>('')

  useEffect(() => {
    const updateTestRoutine = async () => {
      try {
        const success = await updateTestRoutineWithImages()
        setResult(success ? '테스트 루틴 이미지 URL 업데이트 완료!' : '테스트 루틴을 찾을 수 없습니다.')
      } catch (error) {
        setResult(`에러 발생: ${error instanceof Error ? error.message : '알 수 없는 오류'}`)
      }
    }

    updateTestRoutine()
  }, [])

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">테스트 루틴 이미지 URL 업데이트</h1>
      <div className="bg-white p-4 rounded-lg shadow">
        <p className="text-gray-800">{result}</p>
      </div>
    </div>
  )
}

export default TestRoutinePage 