import { useState } from 'react'
import type { Expense, ExpenseCategory } from '@/types/expense'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { CurrencyYenIcon, TagIcon } from '@heroicons/react/24/outline'
import { useAuth } from '@/hooks/useAuth'

// 지출 폼 컴포넌트의 props 타입 정의
interface ExpenseFormProps {
  expense?: Expense;  // 수정할 지출 (없으면 새로 생성)
  onSubmit: (expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;  // 폼 제출 시 실행할 함수
  onCancel: () => void;  // 취소 시 실행할 함수
}

// 지출 생성/수정 폼 컴포넌트
const ExpenseForm = ({ expense, onSubmit, onCancel }: ExpenseFormProps) => {
  const { user } = useAuth()
  
  // 폼 상태 관리 - 기본값 안전 처리
  const [title, setTitle] = useState<string>(expense?.title || '')
  const [description, setDescription] = useState<string>(expense?.description || '')
  const [amount, setAmount] = useState<number>(expense?.amount || 0)
  const [category, setCategory] = useState<ExpenseCategory>(expense?.category || 'food')
  const [date, setDate] = useState<string>(expense?.date || format(new Date(), 'yyyy-MM-dd'))
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  // 금액 입력 처리
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '')
    setAmount(value ? parseInt(value) : 0)
  }

  // 폼 제출 처리
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    if (!user) {
      setError('로그인이 필요합니다.')
      return
    }

    if (amount <= 0) {
      setError('금액은 0보다 커야 합니다.')
      return
    }

    if (!title.trim()) {
      setError('제목을 입력해주세요.')
      return
    }

    try {
      setIsSubmitting(true)
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        amount,
        category,
        date,
        userId: user.uid
      })
    } catch (error) {
      console.error('지출 저장 실패:', error)
      setError('지출 저장에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          제목
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          설명
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
          금액
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <CurrencyYenIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            id="amount"
            value={amount.toLocaleString()}
            onChange={handleAmountChange}
            className="block w-full pl-10 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          카테고리
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <TagIcon className="h-5 w-5 text-gray-400" />
          </div>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
            className="block w-full pl-10 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="food">식비</option>
            <option value="transport">교통비</option>
            <option value="housing">주거비</option>
            <option value="communication">통신비</option>
            <option value="medical">의료비</option>
            <option value="education">교육비</option>
            <option value="culture">문화생활</option>
            <option value="other">기타</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700">
          날짜
        </label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          disabled={isSubmitting}
        >
          취소
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {isSubmitting ? '처리중...' : expense ? '수정하기' : '생성하기'}
        </button>
      </div>
    </form>
  )
}

export default ExpenseForm 