import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getExpenseById, updateExpense } from '@/services/expenseService'
import type { Expense } from '@/types/expense'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { useAuth } from '@/hooks/useAuth'

// 🔍 ExpenseDetailPage는 하나의 지출 내역을 자세히 보여주는 페이지예요
// 📝 지출의 날짜, 금액, 카테고리, 메모 등을 볼 수 있어요
export default function ExpenseDetailPage() {
  // 🔑 URL에서 지출 ID를 가져와요 (예: /expenses/abc123)
  const { expenseId } = useParams<{ expenseId: string }>()
  const navigate = useNavigate()
  const uid = useAuth().user?.uid || ''
  
  // 📦 지출 데이터를 저장할 상자
  const [expense, setExpense] = useState<Expense | null>(null)

  // 🔄 페이지가 로드될 때 지출 정보를 가져와요
  useEffect(() => {
    if (!uid || !expenseId) return
    getExpenseById(uid, expenseId).then(data => {
      if (data) setExpense(data)
    })
  }, [uid, expenseId])

  // ⏳ 데이터를 가져오는 동안 로딩 표시
  if (!expense) {
    return <p className="p-4">지출 정보를 불러오는 중...</p>
  }

  // 🗑️ 삭제 버튼을 눌렀을 때 실행되는 함수
  const handleDelete = async () => {
    if (!window.confirm('이 지출 내역을 삭제할까요?')) return
    if (!expenseId) return
    await updateExpense(uid, expenseId, { isDeleted: true })
    navigate('/expenses')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 🎯 지출 상세 정보 표시 */}
      <h1 className="text-2xl font-bold mb-4">지출 상세</h1>
      
      {/* 📅 날짜 */}
      <div className="mb-4">
        <span className="font-semibold">날짜:</span> {format(new Date(expense.date), 'PP', { locale: ko })}
      </div>
      
      {/* 💰 금액 */}
      <div className="mb-4">
        <span className="font-semibold">금액:</span> ₩{expense.amount}
      </div>
      
      {/* 🏷️ 카테고리 */}
      <div className="mb-4">
        <span className="font-semibold">카테고리:</span> {expense.category}
      </div>
      
      {/* 📝 설명 */}
      <div className="mb-4">
        <span className="font-semibold">설명:</span> {expense.description || '없음'}
      </div>

      {/* 🎯 버튼들 */}
      <div className="mt-8 flex gap-4">
        {/* 🗑️ 삭제 버튼 */}
        <button
          onClick={handleDelete}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          삭제
        </button>
        
        {/* ↩️ 목록으로 돌아가기 */}
        <button
          onClick={() => navigate('/expenses')}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          목록으로
        </button>
      </div>
    </div>
  )
} 