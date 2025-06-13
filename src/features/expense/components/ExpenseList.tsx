// 📑 ExpenseList: 사용자가 지출 내역을 한눈에 볼 수 있는 목록 컴포넌트예요!
// 📋 기능 검증 명령서:
// 1. 지출 목록이 잘 보이는지 확인해요
// 2. 지출을 클릭하면 모달이 잘 열리는지 확인해요
// 3. 모달에서 삭제 버튼이 잘 작동하는지 확인해요
// 4. 금액이 예쁘게 표시되는지 확인해요
// 5. 첨부파일이 있는 지출은 파일 아이콘이 잘 보이는지 확인해요

import { useState } from 'react'
import { CurrencyYenIcon, TagIcon } from '@heroicons/react/24/outline'
import type { Expense } from '@/types/expense'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import ExpenseDetailModal from './ExpenseDetailModal'

// 지출 목록 컴포넌트의 필요한 정보를 정의합니다
interface ExpenseListProps {
  expenses: Expense[];  // 보여줄 지출 목록
  onExpenseClick?: (expense: Expense) => void;  // 지출을 클릭했을 때 실행할 함수 (선택사항)
  onDelete?: (expenseId: string) => void;  // 지출을 삭제할 때 실행할 함수 (선택사항)
}

// 지출 목록을 보여주는 컴포넌트입니다
const ExpenseList = ({ expenses, onExpenseClick, onDelete }: ExpenseListProps) => {
  // 🔍 selectedExpense: 사용자가 선택한 지출 데이터를 저장해요
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null)
  // 🚪 isModalOpen: 상세 모달 열림/닫힘 상태를 저장해요
  const [isModalOpen, setIsModalOpen] = useState(false)

  // 🔦 handleExpenseClick: 지출 항목을 클릭하면 상세 모달을 열어요
  const handleExpenseClick = (expense: Expense) => {
    setSelectedExpense(expense)
    setIsModalOpen(true)
    if (onExpenseClick) {
      onExpenseClick(expense)
    }
  }

  // ❌ handleCloseModal: 모달을 닫고 선택된 지출을 초기화해요
  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedExpense(null)
  }

  // 🗑️ handleDelete: 상세 모달에서 지출 삭제 요청을 보내고 모달을 닫아요
  const handleDelete = async (expenseId: string) => {
    try {
      await onDelete?.(expenseId)
      handleCloseModal()
    } catch (error) {
      console.error('지출 삭제 실패:', error)
    }
  }

  // 💴 formatAmount: 숫자를 한글 화폐(KRW) 형식으로 예쁘게 바꿔줘요
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(amount)
  }

  return (
    <div className="space-y-4">
      {/* 📋 expenses.map: 각 지출 항목을 카드 스타일로 렌더링해요 */}
      {expenses.map((expense) => (
        <div
          key={expense.id}
          onClick={() => handleExpenseClick(expense)}
          className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow cursor-pointer"
        >
          {/* 🏷️ 제목/설명 영역 */}
          <div>
            <h3 className="text-lg font-semibold">{expense.title}</h3>
            {expense.description && (
              <p className="mt-1 text-gray-600">{expense.description}</p>
            )}
          </div>

          {/* 💰 금액/카테고리/날짜 표시 영역 */}
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">금액</h4>
              <div className="mt-1 flex items-center">
                <CurrencyYenIcon className="h-4 w-4 text-blue-500 mr-1" />
                <p className="text-sm font-semibold text-blue-600">
                  {formatAmount(expense.amount)}
                </p>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">카테고리</h4>
              <div className="mt-1 flex items-center">
                <TagIcon className="h-4 w-4 text-gray-400 mr-1" />
                <p className="text-sm">{expense.category}</p>
              </div>
            </div>
          </div>

          {/* 날짜를 보여주는 부분 */}
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-500">날짜</h4>
            <p className="mt-1 text-sm">
              {format(new Date(expense.date), 'yyyy년 MM월 dd일', { locale: ko })}
            </p>
          </div>

          {/* 📎 첨부파일 안내 영역 */}
          {expense.attachments && expense.attachments.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-500">첨부파일</h4>
              <p className="mt-1 text-sm text-blue-600">
                {expense.attachments.length}개의 파일
              </p>
            </div>
          )}
        </div>
      ))}

      {/* 🔍 ExpenseDetailModal: 선택된 지출의 자세한 정보를 모달로 보여줘요 */}
      {selectedExpense && (
        <ExpenseDetailModal
          expense={selectedExpense}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}

export default ExpenseList 