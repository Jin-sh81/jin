import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { getExpenses, createExpense, updateExpense, deleteExpense } from '@/services/expenseService'
import type { Expense } from '@/types/expense'
import ExpenseList from '../components/ExpenseList'
import ExpenseForm from '../components/ExpenseForm'
import ExpenseDetailModal from '../components/ExpenseDetailModal'

// 💰 ExpensePage는 우리의 지출 내역을 보여주는 페이지예요
// 📊 모든 지출 내역을 한눈에 볼 수 있어요
const ExpensePage = () => {
  const { user } = useAuth()
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [isAddingExpense, setIsAddingExpense] = useState(false)
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 지출 목록 조회
  const fetchExpenses = async () => {
    if (!user) return
    try {
      setIsLoading(true)
      setError(null)
      const expenses = await getExpenses(user.uid)
      setExpenses(expenses)
    } catch (error) {
      console.error('지출 목록을 불러오는데 실패했습니다:', error)
      setError('지출 목록을 불러오는데 실패했습니다. 다시 시도해주세요.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchExpenses()
  }, [user])

  // 지출 추가
  const handleAddExpense = async (expenseData: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return
    try {
      setError(null)
      await createExpense(user.uid, expenseData)
      // 지출 추가 후 목록 새로고침
      await fetchExpenses()
      setIsAddingExpense(false)
    } catch (error) {
      console.error('지출 추가 실패:', error)
      setError('지출 추가에 실패했습니다. 다시 시도해주세요.')
    }
  }

  // 지출 수정
  const handleUpdateExpense = async (expenseId: string, expenseData: Partial<Expense>) => {
    if (!user) return
    try {
      setError(null)
      await updateExpense(user.uid, expenseId, expenseData)
      // 지출 수정 후 목록 새로고침
      await fetchExpenses()
      setSelectedExpense(null)
    } catch (error) {
      console.error('지출 수정 실패:', error)
      setError('지출 수정에 실패했습니다. 다시 시도해주세요.')
    }
  }

  // 지출 삭제
  const handleDeleteExpense = async (expenseId: string) => {
    if (!user) return
    try {
      setError(null)
      await deleteExpense(user.uid, expenseId)
      // 지출 삭제 후 목록 새로고침
      await fetchExpenses()
      setSelectedExpense(null)
    } catch (error) {
      console.error('지출 삭제 실패:', error)
      setError('지출 삭제에 실패했습니다. 다시 시도해주세요.')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">지출 관리</h1>
        <button
          onClick={() => setIsAddingExpense(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          지출 추가
        </button>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {isAddingExpense && (
        <div className="mb-6">
          <ExpenseForm
            onSubmit={handleAddExpense}
            onCancel={() => setIsAddingExpense(false)}
          />
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <ExpenseList
          expenses={expenses}
          onExpenseClick={setSelectedExpense}
          onDelete={handleDeleteExpense}
        />
      )}

      {selectedExpense && (
        <ExpenseDetailModal
          expense={selectedExpense}
          onClose={() => setSelectedExpense(null)}
          onUpdate={handleUpdateExpense}
          onDelete={handleDeleteExpense}
        />
      )}
    </div>
  )
}

export default ExpensePage 