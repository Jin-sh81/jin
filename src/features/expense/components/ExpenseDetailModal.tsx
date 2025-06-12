import { useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { XMarkIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { updateExpense, getExpenseById } from '@/services/expenseService'
import type { Expense } from '@/types/expense'

// 🔽 모달 props 타입 정의
interface ExpenseDetailModalProps {
  expense: Expense;
  onClose: () => void;
  onUpdate: (expense: Expense) => void;
  onDelete: (expenseId: string) => void;
}

// 🔽 카테고리 옵션
const CATEGORIES = [
  '식비',
  '교통비',
  '주거비',
  '통신비',
  '의료비',
  '교육비',
  '문화생활',
  '쇼핑',
  '기타'
]

// 🔽 지출 상세 모달 컴포넌트
const ExpenseDetailModal = ({ expense, onClose, onUpdate, onDelete }: ExpenseDetailModalProps) => {
  // 🔽 상태 관리
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState(expense.title)
  const [editedDescription, setEditedDescription] = useState(expense.description || '')
  const [editedAmount, setEditedAmount] = useState(expense.amount)
  const [editedCategory, setEditedCategory] = useState(expense.category)
  const [editedDate, setEditedDate] = useState(expense.date)
  const [attachments, setAttachments] = useState(expense.attachments || [])
  const [isDeleting, setIsDeleting] = useState(false)

  // 🔽 수정 모드 토글
  const handleEditToggle = () => {
    setIsEditing(!isEditing)
  }

  // 🔽 취소 핸들러
  const handleCancel = () => {
    // 원래 데이터로 복원
    setEditedTitle(expense.title)
    setEditedDescription(expense.description || '')
    setEditedAmount(expense.amount)
    setEditedCategory(expense.category)
    setEditedDate(expense.date)
    setAttachments(expense.attachments || [])
    setIsEditing(false)
  }

  // 🔽 저장 핸들러
  const handleSave = async () => {
    try {
      await updateExpense(expense.userId, expense.id, {
        title: editedTitle,
        description: editedDescription || undefined,
        amount: editedAmount,
        category: editedCategory,
        date: editedDate
      })
      
      const updatedExpense = await getExpenseById(expense.userId, expense.id)
      if (updatedExpense) {
        onUpdate(updatedExpense)
        setIsEditing(false)
      }
    } catch (error) {
      console.error('지출 업데이트 실패:', error)
    }
  }

  // 🔽 삭제 핸들러
  const handleDelete = async () => {
    if (window.confirm('이 지출을 삭제하시겠습니까?')) {
      onDelete(expense.id)
    }
  }

  // 🔽 금액을 포맷팅하는 함수
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(amount)
  }

  return (
    <Transition appear show={true} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      className="w-full border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                    />
                  ) : (
                    expense.title
                  )}
                </Dialog.Title>

                <div className="mt-4">
                  {isEditing ? (
                    <textarea
                      value={editedDescription}
                      onChange={(e) => setEditedDescription(e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:outline-none"
                      rows={3}
                    />
                  ) : (
                    <p className="text-gray-600">{expense.description}</p>
                  )}
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">금액</h4>
                    {isEditing ? (
                      <input
                        type="number"
                        value={editedAmount}
                        onChange={(e) => setEditedAmount(Number(e.target.value))}
                        className="mt-1 w-full border border-gray-300 rounded-md p-2"
                      />
                    ) : (
                      <p className="mt-1">{expense.amount.toLocaleString()}원</p>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">카테고리</h4>
                    {isEditing ? (
                      <select
                        value={editedCategory}
                        onChange={(e) => setEditedCategory(e.target.value)}
                        className="mt-1 w-full border border-gray-300 rounded-md p-2"
                      >
                        <option value="food">식비</option>
                        <option value="transport">교통비</option>
                        <option value="shopping">쇼핑</option>
                        <option value="entertainment">엔터테인먼트</option>
                        <option value="housing">주거비</option>
                        <option value="medical">의료비</option>
                        <option value="education">교육비</option>
                        <option value="other">기타</option>
                      </select>
                    ) : (
                      <p className="mt-1">{expense.category}</p>
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-500">날짜</h4>
                  {isEditing ? (
                    <input
                      type="date"
                      value={editedDate}
                      onChange={(e) => setEditedDate(e.target.value)}
                      className="mt-1 w-full border border-gray-300 rounded-md p-2"
                    />
                  ) : (
                    <p className="mt-1">{format(new Date(expense.date), 'yyyy년 MM월 dd일', { locale: ko })}</p>
                  )}
                </div>

                {expense.attachments && expense.attachments.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium">첨부파일</h3>
                    <ul className="mt-2 space-y-2">
                      {expense.attachments.map((file) => (
                        <li key={file.id}>
                          <a
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800"
                          >
                            {file.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-6 flex justify-end space-x-3">
                  {isEditing ? (
                    <>
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        onClick={handleSave}
                      >
                        저장
                      </button>
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        onClick={handleCancel}
                      >
                        취소
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        onClick={() => setIsEditing(true)}
                      >
                        <PencilIcon className="h-5 w-5 mr-2" />
                        수정
                      </button>
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                        onClick={handleDelete}
                      >
                        <TrashIcon className="h-5 w-5 mr-2" />
                        삭제
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={onClose}
                  >
                    <XMarkIcon className="h-5 w-5 mr-2" />
                    닫기
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default ExpenseDetailModal 