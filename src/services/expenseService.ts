import { db, storage } from '@/infrastructure/firebase/firebaseConfig'
import { collection, doc, setDoc, getDoc, getDocs, updateDoc, deleteDoc, query, where, Timestamp, serverTimestamp, DocumentReference, DocumentData, QueryDocumentSnapshot, orderBy, addDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import type { Expense, ExpenseCategory } from '@/types/expense'

// 지출 컬렉션 참조
const getExpensesCollection = (uid: string) => {
  return collection(db, 'users', uid, 'expenses')
}

// 전체 지출 컬렉션 참조
const getGlobalExpensesCollection = () => {
  return collection(db, 'expenses')
}

/**
 * 테스트용 지출 생성 함수
 * 
 * 이 함수는 개발 및 테스트 목적으로 사용되는 샘플 지출을 생성합니다.
 * 테스트 사용자 ID('testUser123')를 사용하여 카페에서의 커피 구매 지출을 생성합니다.
 * 
 * @returns {Promise<void>} 지출 생성 완료 시 Promise 반환
 */
export const testCreateExpense = async (): Promise<void> => {
  try {
    const testUid = 'testUser123'
    
    const testExpense: Expense = {
      id: 'test-expense-1',
      title: '스타벅스 아메리카노',
      amount: 4500,
      category: '음식/카페',
      description: '스타벅스 아메리카노',
      date: new Date().toISOString(),
      userId: testUid,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const expenseRef = doc(getExpensesCollection(testUid), testExpense.id)
    await setDoc(expenseRef, testExpense)

    console.log('테스트 지출이 성공적으로 생성되었습니다.')
  } catch (error) {
    console.error('테스트 지출 생성 중 오류 발생:', error)
    throw error
  }
}

/**
 * 새로운 지출을 생성하는 함수
 * 
 * @param uid 사용자 ID
 * @param expenseData 지출 정보
 * @returns 생성된 지출의 ID
 */
export const createExpense = async (
  uid: string,
  expenseData: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  try {
    const expensesRef = getExpensesCollection(uid)
    const now = new Date().toISOString()
    
    const docRef = await addDoc(expensesRef, {
      ...expenseData,
      createdAt: now,
      updatedAt: now
    })
    
    return docRef.id
  } catch (error) {
    console.error('지출 생성 실패:', error)
    throw error
  }
}

/**
 * 사용자의 지출 목록을 가져오는 함수
 * 
 * @param uid 사용자 ID
 * @returns 지출 목록
 */
export const getExpenses = async (uid: string): Promise<Expense[]> => {
  try {
    const expensesRef = getExpensesCollection(uid)
    const q = query(
      expensesRef,
      where('isDeleted', '==', false),
      orderBy('date', 'desc')
    )
    
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Expense[]
  } catch (error) {
    console.error('지출 목록 조회 실패:', error)
    throw error
  }
}

/**
 * 지출을 수정하는 함수
 * 
 * @param uid 사용자 ID
 * @param expenseId 지출 ID
 * @param expenseData 수정할 지출 정보
 */
export const updateExpense = async (
  uid: string,
  expenseId: string,
  expenseData: Partial<Expense>
): Promise<void> => {
  try {
    const expenseRef = doc(db, 'users', uid, 'expenses', expenseId)
    await updateDoc(expenseRef, {
      ...expenseData,
      updatedAt: new Date().toISOString()
    })
  } catch (error) {
    console.error('지출 수정 실패:', error)
    throw error
  }
}

/**
 * 지출을 삭제하는 함수 (소프트 삭제)
 * 
 * @param uid 사용자 ID
 * @param expenseId 지출 ID
 */
export const deleteExpense = async (uid: string, expenseId: string): Promise<void> => {
  try {
    const expenseRef = doc(db, 'users', uid, 'expenses', expenseId)
    await updateDoc(expenseRef, {
      isDeleted: true,
      updatedAt: new Date().toISOString()
    })
  } catch (error) {
    console.error('지출 삭제 실패:', error)
    throw error
  }
}

/**
 * 지출 상세 정보를 가져오는 함수
 * 
 * @param uid 사용자 ID
 * @param expenseId 지출 ID
 * @returns 지출 상세 정보
 */
export const getExpenseById = async (uid: string, expenseId: string): Promise<Expense | null> => {
  try {
    const expenseRef = doc(db, 'users', uid, 'expenses', expenseId)
    const expenseDoc = await getDoc(expenseRef)
    
    if (!expenseDoc.exists()) {
      return null
    }
    
    const data = expenseDoc.data()
    if (data.isDeleted) {
      return null
    }
    
    return {
      id: expenseDoc.id,
      ...data
    } as Expense
  } catch (error) {
    console.error('지출 상세 조회 실패:', error)
    throw error
  }
}

/**
 * 지출 통계를 가져오는 함수
 * 
 * @param uid 사용자 ID
 * @param yearMonth YYYY-MM 형식의 연월
 * @returns 지출 통계
 */
export const getExpenseStats = async (
  uid: string,
  yearMonth: string
): Promise<{ totalAmount: number; categoryStats: Record<ExpenseCategory, number> }> => {
  try {
    const expensesRef = getExpensesCollection(uid)
    const [year, month] = yearMonth.split('-').map(Number)
    
    // 해당 월의 시작일과 종료일
    const startDate = new Date(year, month - 1, 1).toISOString()
    const endDate = new Date(year, month, 0).toISOString()
    
    const q = query(
      expensesRef,
      where('isDeleted', '==', false),
      where('date', '>=', startDate),
      where('date', '<=', endDate)
    )
    
    const querySnapshot = await getDocs(q)
    const expenses = querySnapshot.docs.map(doc => doc.data() as Expense)
    
    // 총액 계산
    const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0)
    
    // 카테고리별 통계
    const categoryStats = expenses.reduce((stats, expense) => {
      const category = expense.category
      stats[category] = (stats[category] || 0) + expense.amount
      return stats
    }, {} as Record<ExpenseCategory, number>)
    
    return { totalAmount, categoryStats }
  } catch (error) {
    console.error('지출 통계 조회 실패:', error)
    throw error
  }
}

/**
 * 이미지를 업로드하는 함수
 * 
 * @param uid 사용자 ID
 * @param file 업로드할 이미지 파일
 * @returns 업로드된 이미지의 URL
 */
export const uploadImage = async (uid: string, file: File): Promise<string> => {
  try {
    const storageRef = ref(storage, `users/${uid}/images/${Date.now()}_${file.name}`)
    await uploadBytes(storageRef, file)
    return await getDownloadURL(storageRef)
  } catch (error) {
    console.error('이미지 업로드 실패:', error)
    throw error
  }
}

/**
 * 이미지를 삭제하는 함수
 * 
 * @param url 삭제할 이미지의 URL
 */
export const deleteImage = async (url: string): Promise<void> => {
  try {
    const imageRef = ref(storage, url)
    await deleteObject(imageRef)
  } catch (error) {
    console.error('이미지 삭제 실패:', error)
    throw error
  }
}

/**
 * 새로운 지출을 생성하는 함수 (전체 컬렉션)
 * 
 * @param expense 지출 정보
 */
export const addExpense = async (expense: Omit<Expense, 'id'>): Promise<void> => {
  try {
    const ref = getGlobalExpensesCollection()
    await addDoc(ref, {
      ...expense,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
  } catch (error) {
    console.error('지출 생성 실패:', error)
    throw error
  }
}

/**
 * 사용자의 지출 목록을 가져오는 함수 (전체 컬렉션)
 * 
 * @param uid 사용자 ID
 * @returns 지출 목록
 */
export const getExpensesByUser = async (uid: string): Promise<Expense[]> => {
  try {
    const q = query(
      getGlobalExpensesCollection(),
      where('userId', '==', uid),
      where('isDeleted', '==', false),
      orderBy('date', 'desc')
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Expense[]
  } catch (error) {
    console.error('지출 목록 조회 실패:', error)
    throw error
  }
} 