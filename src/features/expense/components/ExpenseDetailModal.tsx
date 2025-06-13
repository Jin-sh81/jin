// 🗂️ ExpenseDetailModal: 지출 상세 정보를 모달 창으로 보여주는 컴포넌트예요!
// 📋 기능 검증 명령서:
// 1. 지출 정보가 잘 보이는지 확인해요
// 2. 편집 모드가 잘 작동하는지 확인해요
// 3. 수정된 내용이 잘 저장되는지 확인해요
// 4. 삭제 버튼이 잘 작동하는지 확인해요
// 5. 첨부파일이 잘 보이고 클릭이 되는지 확인해요

import { useState } from 'react'
import { Dialog } from '@headlessui/react'
import { XMarkIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import type { Expense } from '@/types/expense'

interface ExpenseDetailModalProps {
  expense: Expense
  isOpen: boolean
  onClose: () => void
  onUpdate: (expenseId: string, expense: Partial<Expense>) => Promise<void>
  onDelete: (expenseId: string) => Promise<void>
}

export const ExpenseDetailModal: React.FC<ExpenseDetailModalProps> = ({
  expense,
  isOpen,
  onClose,
  onUpdate,
  onDelete
}) => {
  // ✏️ isEditing: 편집 모드 여부를 저장해요
  const [isEditing, setIsEditing] = useState(false)
  // 📝 editedTitle: 수정 중인 제목을 저장해요
  const [editedTitle, setEditedTitle] = useState(expense.title)
  // 💬 editedDescription: 수정 중인 설명을 저장해요
  const [editedDescription, setEditedDescription] = useState(expense.description || '')
  // 💰 editedAmount: 수정 중인 금액을 저장해요
  const [editedAmount, setEditedAmount] = useState(expense.amount)
  // 🏷️ editedCategory: 수정 중인 카테고리를 저장해요
  const [editedCategory, setEditedCategory] = useState(expense.category)
  // 📅 editedDate: 수정 중인 날짜를 저장해요
  const [editedDate, setEditedDate] = useState(
    new Date(expense.date).toISOString().split('T')[0]
  )
  // 📎 attachments: 첨부파일 목록을 저장해요
  const [attachments] = useState(expense.attachments || [])
  // 🗑️ isDeleting: 삭제 중 로딩 표시를 제어해요
  const [isDeleting, setIsDeleting] = useState(false)

  // ✏️ handleEditToggle: 편집 모드를 켜고 끌 수 있어요
  const handleEditToggle = () => {
    setIsEditing(!isEditing)
    if (!isEditing) {
      setEditedTitle(expense.title)
      setEditedDescription(expense.description || '')
      setEditedAmount(expense.amount)
      setEditedCategory(expense.category)
      setEditedDate(new Date(expense.date).toISOString().split('T')[0])
    }
  }

  // 🚫 handleCancel: 편집을 취소하고 원래 데이터를 복원해요
  const handleCancel = () => {
    setIsEditing(false)
    setEditedTitle(expense.title)
    setEditedDescription(expense.description || '')
    setEditedAmount(expense.amount)
    setEditedCategory(expense.category)
    setEditedDate(new Date(expense.date).toISOString().split('T')[0])
  }

  // 💾 handleSave: 수정된 정보를 서버에 저장하고, 업데이트된 데이터를 보여줘요
  const handleSave = async () => {
    try {
      await onUpdate(expense.id, {
        title: editedTitle,
        description: editedDescription,
        amount: editedAmount,
        category: editedCategory,
        date: new Date(editedDate).toISOString(),
        updatedAt: new Date().toISOString()
      })
      setIsEditing(false)
    } catch (error) {
      console.error('지출 수정 실패:', error)
    }
  }

  // 🗑️ handleDelete: 삭제 확인 창을 띄우고, 삭제 후 모달을 닫아요
  const handleDelete = async () => {
    if (window.confirm('정말로 이 지출을 삭제하시겠습니까?')) {
      try {
        setIsDeleting(true)
        await onDelete(expense.id)
        onClose()
      } catch (error) {
        console.error('지출 삭제 실패:', error)
      } finally {
        setIsDeleting(false)
      }
    }
  }

  // 💴 formatAmount: 금액을 한글 화폐(KRW) 형식으로 예쁘게 보여줘요
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(amount)
  }

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-10 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

        <div className="relative bg-white rounded-lg max-w-md w-full mx-4 p-6">
          {/* 🔒 모달 헤더: 제목과 닫기 버튼 */}
          <div className="flex justify-between items-start mb-4">
            <Dialog.Title className="text-xl font-semibold text-gray-900">
              {isEditing ? '지출 수정' : '지출 상세'}
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* 📋 지출 정보 표시 영역 */}
          <div className="space-y-4">
            {/* 🏷️ 제목 영역 */}
            {isEditing ? (
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="제목"
              />
            ) : (
              <h3 className="text-lg font-medium text-gray-900">{expense.title}</h3>
            )}

            {/* 💬 설명 영역 */}
            {isEditing ? (
              <textarea
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                className="w-full p-2 border rounded"
                rows={3}
                placeholder="설명"
              />
            ) : (
              expense.description && (
                <p className="text-gray-600">{expense.description}</p>
              )
            )}

            {/* 💰 금액 영역 */}
            {isEditing ? (
              <input
                type="number"
                value={editedAmount}
                onChange={(e) => setEditedAmount(Number(e.target.value))}
                className="w-full p-2 border rounded"
                placeholder="금액"
              />
            ) : (
              <p className="text-xl font-semibold text-gray-900">
                {formatAmount(expense.amount)}
              </p>
            )}

            {/* 🏷️ 카테고리 영역 */}
            {isEditing ? (
              <select
                value={editedCategory}
                onChange={(e) => setEditedCategory(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="식비">식비</option>
                <option value="교통비">교통비</option>
                <option value="주거비">주거비</option>
                <option value="통신비">통신비</option>
                <option value="의료비">의료비</option>
                <option value="교육비">교육비</option>
                <option value="문화생활">문화생활</option>
                <option value="기타">기타</option>
              </select>
            ) : (
              <p className="text-gray-600">카테고리: {expense.category}</p>
            )}

            {/* 📅 날짜 영역 */}
            {isEditing ? (
              <input
                type="date"
                value={editedDate}
                onChange={(e) => setEditedDate(e.target.value)}
                className="w-full p-2 border rounded"
              />
            ) : (
              <p className="text-gray-600">
                날짜: {new Date(expense.date).toLocaleDateString('ko-KR')}
              </p>
            )}

            {/* 📎 첨부파일 영역 */}
            {attachments.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">첨부파일</h4>
                <ul className="space-y-2">
                  {attachments.map((attachment, index) => (
                    <li key={index}>
                      <a
                        href={attachment}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        첨부파일 {index + 1}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* 🔘 버튼 영역 */}
          <div className="mt-6 flex justify-end space-x-3">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  취소
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                >
                  저장
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleEditToggle}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <PencilIcon className="h-5 w-5 inline-block mr-1" />
                  수정
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 disabled:opacity-50"
                >
                  <TrashIcon className="h-5 w-5 inline-block mr-1" />
                  {isDeleting ? '삭제 중...' : '삭제'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </Dialog>
  )
} 