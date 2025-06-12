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
  // 현재 선택된 지출을 저장하는 상태
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // 지출을 클릭했을 때 실행하는 함수입니다
  const handleExpenseClick = (expense: Expense) => {
    setSelectedExpense(expense)
    setIsModalOpen(true)
    if (onExpenseClick) {
      onExpenseClick(expense)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedExpense(null)
  }

  const handleDelete = async (expenseId: string) => {
    try {
      await onDelete?.(expenseId)
      handleCloseModal()
    } catch (error) {
      console.error('지출 삭제 실패:', error)
    }
  }

  // 금액을 한국 돈 형식으로 바꿔주는 함수입니다
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(amount)
  }

  return (
    <div className="space-y-4">
      {expenses.map((expense) => (
        <div
          key={expense.id}
          onClick={() => handleExpenseClick(expense)}
          className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow cursor-pointer"
        >
          {/* 제목과 설명을 보여주는 부분 */}
          <div>
            <h3 className="text-lg font-semibold">{expense.title}</h3>
            {expense.description && (
              <p className="mt-1 text-gray-600">{expense.description}</p>
            )}
          </div>

          {/* 금액과 카테고리를 보여주는 부분 */}
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

          {/* 첨부파일이 있으면 보여주는 부분 */}
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