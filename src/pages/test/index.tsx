import React, { useState } from 'react'
import Button from '../../shared/components/Button'
import Modal from '../../shared/components/Modal'

/**
 * 테스트 페이지
 * 
 * 이 페이지는 공통 컴포넌트들의 동작을 테스트하기 위한 페이지입니다.
 * 버튼과 모달 컴포넌트의 다양한 상태와 스타일을 확인할 수 있습니다.
 */
const TestPage: React.FC = () => {
  // 모달 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false)
  // 로딩 상태 관리
  const [isLoading, setIsLoading] = useState(false)

  // 로딩 버튼 테스트 함수
  const handleLoadingTest = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">컴포넌트 테스트 페이지</h1>

        {/* 버튼 테스트 섹션 */}
        <section className="bg-white rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">버튼 컴포넌트 테스트</h2>
          
          <div className="space-y-4">
            {/* 기본 버튼들 */}
            <div className="flex gap-4">
              <Button>기본 버튼</Button>
              <Button variant="secondary">보조 버튼</Button>
              <Button variant="outline">아웃라인 버튼</Button>
              <Button variant="danger">위험 버튼</Button>
            </div>

            {/* 크기별 버튼들 */}
            <div className="flex gap-4 items-center">
              <Button size="small">작은 버튼</Button>
              <Button size="medium">중간 버튼</Button>
              <Button size="large">큰 버튼</Button>
            </div>

            {/* 로딩 버튼 */}
            <div className="flex gap-4">
              <Button isLoading={isLoading} onClick={handleLoadingTest}>
                로딩 테스트
              </Button>
              <Button variant="danger" isLoading={isLoading}>
                로딩 중...
              </Button>
            </div>

            {/* 전체 너비 버튼 */}
            <div className="w-full">
              <Button fullWidth>전체 너비 버튼</Button>
            </div>
          </div>
        </section>

        {/* 모달 테스트 섹션 */}
        <section className="bg-white rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">모달 컴포넌트 테스트</h2>
          
          <div className="space-y-4">
            {/* 모달 열기 버튼들 */}
            <div className="flex gap-4">
              <Button onClick={() => setIsModalOpen(true)}>
                모달 열기
              </Button>
            </div>

            {/* 테스트용 모달 */}
            <Modal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              title="테스트 모달"
              size="medium"
              footer={
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsModalOpen(false)}
                  >
                    취소
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => setIsModalOpen(false)}
                  >
                    확인
                  </Button>
                </div>
              }
            >
              <div className="space-y-4">
                <p>이것은 테스트용 모달입니다.</p>
                <p>ESC 키를 누르거나 모달 외부를 클릭하면 닫힙니다.</p>
              </div>
            </Modal>
          </div>
        </section>
      </div>
    </div>
  )
}

export default TestPage 