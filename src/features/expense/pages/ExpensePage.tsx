// 💰 ExpensePage: 사용자가 지출 내역을 보고 추가, 수정, 삭제할 수 있는 페이지예요!
// 📋 기능 검증 명령서:
// 1. 지출 목록이 잘 불러와지는지 확인해요
// 2. 새 지출 작성 폼이 잘 열리고 닫히는지 확인해요
// 3. 지출 수정과 삭제가 잘 되는지 확인해요
// 4. 지출을 클릭하면 상세 페이지로 잘 이동하는지 확인해요
// 5. 로딩 중일 때 로딩 표시가 잘 보이는지 확인해요
// 6. 에러가 발생했을 때 에러 메시지가 잘 보이는지 확인해요

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks'
import { ExpenseList } from '../components/ExpenseList'
import { ExpenseForm } from '../components/ExpenseForm'
import { expenseService } from '../services/expenseService'
import type { Expense } from '@/types/expense'

export const ExpensePage = () => {
  // 📋 expenses: 불러온 지출 목록을 저장해요
  const [expenses, setExpenses] = useState<Expense[]>([])
  // ✍️ isCreating: 새 지출 작성 폼 표시 여부를 제어해요
  const [isCreating, setIsCreating] = useState(false)
  // ⏳ isLoading: 목록 불러오기 중 로딩 표시를 제어해요
  const [isLoading, setIsLoading] = useState(true)
  // 🚨 error: 호출 중 발생한 에러 메시지를 저장해요
  const [error, setError] = useState<string | null>(null)

  // 🔑 useAuth 훅: 로그인한 사용자 정보(user)를 가져와요
  const { user } = useAuth()
  // 🔀 useNavigate: 상세 페이지나 다른 경로로 이동할 때 사용해요
  const navigate = useNavigate()

  // 🔄 fetchExpenses: 서버에서 지출 목록을 가져와 expenses 상태에 저장해요
  const fetchExpenses = async () => {
    if (!user) return
    try {
      setIsLoading(true)
      setError(null)
      const data = await expenseService.getExpenses(user.uid)
      setExpenses(data)
    } catch (error) {
      console.error('지출 목록 불러오기 실패:', error)
      setError('지출 목록을 불러오는데 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchExpenses()
  }, [user])

  // ➕ handleCreateExpense: 새 지출을 생성하고 목록을 갱신해요
  const handleCreateExpense = async (expense: Omit<Expense, 'id'>) => {
    if (!user) return
    try {
      setError(null)
      await expenseService.createExpense(user.uid, expense)
      setIsCreating(false)
      fetchExpenses()
    } catch (error) {
      console.error('지출 생성 실패:', error)
      setError('지출을 생성하는데 실패했습니다.')
    }
  }

  // ✏️ handleUpdateExpense: 지출을 수정하고 목록을 갱신해요
  const handleUpdateExpense = async (expenseId: string, expense: Partial<Expense>) => {
    if (!user) return
    try {
      setError(null)
      await expenseService.updateExpense(user.uid, expenseId, expense)
      fetchExpenses()
    } catch (error) {
      console.error('지출 수정 실패:', error)
      setError('지출을 수정하는데 실패했습니다.')
    }
  }

  // 🗑 handleDeleteExpense: 지출을 삭제하고 목록을 갱신해요
  const handleDeleteExpense = async (expenseId: string) => {
    if (!user) return
    try {
      setError(null)
      await expenseService.deleteExpense(user.uid, expenseId)
      fetchExpenses()
    } catch (error) {
      console.error('지출 삭제 실패:', error)
      setError('지출을 삭제하는데 실패했습니다.')
    }
  }

  // 🔍 handleExpenseClick: 선택한 지출 상세 페이지로 이동해요
  const handleExpenseClick = (expenseId: string) => {
    navigate(`/expenses/${expenseId}`)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 🏷️ 제목과 작성 버튼 설명 */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">지출 관리</h1>
        <button
          onClick={() => setIsCreating(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          새 지출 작성
        </button>
      </div>

      {/* ⏳ isLoading: 로딩 스피너 표시 */}
      {isLoading && (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* 🚨 error: 에러 메시지 박스 표시 */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* ✍️ isCreating: 새 지출 작성 폼 토글 영역 설명 */}
      {isCreating && (
        <div className="mb-6">
          <ExpenseForm
            onSubmit={handleCreateExpense}
            onCancel={() => setIsCreating(false)}
          />
        </div>
      )}

      {/* 📜 ExpenseList: 지출 목록 컴포넌트 렌더링 */}
      {!isLoading && expenses.length > 0 ? (
        <ExpenseList
          expenses={expenses}
          onUpdate={handleUpdateExpense}
          onDelete={handleDeleteExpense}
          onExpenseClick={handleExpenseClick}
        />
      ) : (
        /* 🚫 목록이 비어있을 때 안내 메시지 표시 */
        <div className="text-center py-8 text-gray-500">
          {isLoading ? '지출 목록을 불러오는 중...' : '등록된 지출이 없습니다.'}
        </div>
      )}
    </div>
  )
} 