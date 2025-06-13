// 📝 ExpenseForm: 새로운 지출을 추가하거나 기존 지출을 수정할 수 있는 입력 폼이에요!
// 📋 기능 검증 명령서:
// 1. 금액 입력 시 숫자만 입력되는지 확인해요
// 2. 필수 입력(금액>0, 제목)이 잘 검증되는지 확인해요
// 3. 제출 버튼이 잘 작동하는지 확인해요
// 4. 취소 버튼이 잘 작동하는지 확인해요
// 5. 로딩 중일 때 버튼이 비활성화되는지 확인해요

import { useState, useEffect } from 'react'
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
  
  // ✏️ title: 지출 제목을 저장해요
  const [title, setTitle] = useState<string>(expense?.title || '')
  // 📝 description: 지출 설명을 저장해요
  const [description, setDescription] = useState<string>(expense?.description || '')
  // 💰 amount: 지출 금액을 숫자로 저장해요
  const [amount, setAmount] = useState<number>(expense?.amount || 0)
  // 🏷️ category: 지출 카테고리를 저장해요
  const [category, setCategory] = useState<ExpenseCategory>(expense?.category || 'food')
  // 📅 date: 지출 날짜를 YYYY-MM-DD 형식으로 저장해요
  const [date, setDate] = useState<string>(expense?.date || format(new Date(), 'yyyy-MM-dd'))
  // ⏳ isSubmitting: 제출 중 로딩 표시를 제어해요
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  // �� error: 검증이나 제출 중 발생한 에러 메시지를 저장해요
  const [error, setError] = useState<string | null>(null)

  // 🔢 handleAmountChange: 숫자가 아닌 문자를 제거하고 금액 상태를 안전하게 업데이트해요
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '')
    setAmount(value ? parseInt(value) : 0)
  }

  // ✋ 폼 제출 방지: 페이지 리로드 없이 제출을 처리해요
  // 🚨 로그인 여부 및 필수 필드(금액 > 0, 제목) 검증 후 에러 메시지를 보여줘요
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
      // 🔄 isSubmitting true: 제출 시작
      setIsSubmitting(true)
      setError(null)

      // 💾 onSubmit: 부모 컴포넌트에 지출 데이터를 전달해요
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        amount,
        category,
        date,
        userId: user.uid
      })

      // 🆕 제출 후 상태 초기화: 취소나 재작성 대비
      setTitle('')
      setDescription('')
      setAmount(0)
      setCategory('food')
      setDate(format(new Date(), 'yyyy-MM-dd'))
    } catch (error) {
      console.error('지출 저장 실패:', error)
      setError('지출을 저장하는데 실패했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 🚨 error: 에러 메시지 표시 */}
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
        {/* ❌ 취소 버튼: onCancel 콜백을 호출해요 */}
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          disabled={isSubmitting}
        >
          취소
        </button>
        {/* 🔘 생성/수정 버튼: 제출 상태에 따라 '생성하기' 또는 '수정하기'로 표시해요 */}
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