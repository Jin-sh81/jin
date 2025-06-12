import { db, storage } from '@/infrastructure/firebase/firebaseConfig'
import { collection, doc, setDoc, getDoc, getDocs, updateDoc, deleteDoc, query, where, Timestamp, serverTimestamp, orderBy, addDoc, limit as firestoreLimit } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { Routine, RoutineRecord, RoutineStats } from '../types/firestore'

// 루틴 컬렉션 참조
const getRoutinesCollection = (uid: string) => {
  return collection(db, 'users', uid, 'routines')
}

// 루틴 기록 컬렉션 참조
const getRoutineRecordsCollection = (uid: string) => {
  return collection(db, 'users', uid, 'routineRecords')
}

// 루틴 통계 컬렉션 참조
const getRoutineStatsCollection = (uid: string) => {
  return collection(db, 'users', uid, 'routineStats')
}

/**
 * 이미지 파일을 Firebase Storage에 업로드하는 함수
 * 
 * @param file - 업로드할 이미지 파일
 * @param uid - 사용자 ID
 * @param routineId - 루틴 ID
 * @param type - 이미지 타입 ('before' 또는 'after')
 * @returns 업로드된 이미지의 다운로드 URL
 */
const uploadRoutineImage = async (
  file: File,
  uid: string,
  routineId: string,
  type: 'before' | 'after'
): Promise<string> => {
  try {
    // 파일 이름에 타임스탬프 추가
    const timestamp = new Date().getTime()
    const fileName = `${timestamp}_${file.name}`
    
    // Storage 참조 생성 (경로: users/{uid}/routines/{routineId}/images/{type}/{fileName})
    const storageRef = ref(storage, `users/${uid}/routines/${routineId}/images/${type}/${fileName}`)

    // 파일 업로드
    await uploadBytes(storageRef, file)

    // 다운로드 URL 가져오기
    const downloadUrl = await getDownloadURL(storageRef)
    return downloadUrl
  } catch (error) {
    console.error('이미지 업로드 중 오류 발생:', error)
    throw new Error('이미지 업로드에 실패했습니다.')
  }
}

/**
 * 이미지가 포함된 루틴 생성 함수
 * 
 * 이 함수는 루틴을 생성하고, 선택적으로 before/after 이미지를 업로드합니다.
 * 이미지가 제공되면 Firebase Storage에 업로드하고 URL을 저장합니다.
 * 
 * @param uid - 사용자 ID
 * @param routineData - 루틴 데이터
 * @param beforeImage - 시작 전 이미지 파일 (선택사항)
 * @param afterImage - 완료 후 이미지 파일 (선택사항)
 * @returns 생성된 루틴의 ID
 * 
 * @example
 * // 이미지 없이 루틴 생성
 * const routineId = await createRoutineWithImages('user123', {
 *   title: '아침 운동',
 *   description: '매일 아침 30분 운동하기',
 *   frequency: 'daily',
 *   timeOfDay: '07:00'
 * });
 * 
 * // 이미지와 함께 루틴 생성
 * const routineId = await createRoutineWithImages('user123', {
 *   title: '다이어트 루틴',
 *   description: '매일 운동하고 식단 관리하기',
 *   frequency: 'daily'
 * }, beforeImageFile, afterImageFile);
 */
export const createRoutineWithImages = async (
  uid: string,
  routineData: Omit<Routine, 'id' | 'createdAt' | 'updatedAt'>,
  beforeImage?: File,
  afterImage?: File
): Promise<string> => {
  try {
    // 루틴 ID 생성 (타임스탬프 기반)
    const routineId = `routine_${Date.now()}`
    
    // 현재 시간
    const now = new Date()

    // 이미지 URL을 저장할 객체
    const imageUrls: { beforeImageUrl?: string; afterImageUrl?: string } = {}

    // before 이미지가 있으면 업로드
    if (beforeImage) {
      imageUrls.beforeImageUrl = await uploadRoutineImage(beforeImage, uid, routineId, 'before')
    }

    // after 이미지가 있으면 업로드
    if (afterImage) {
      imageUrls.afterImageUrl = await uploadRoutineImage(afterImage, uid, routineId, 'after')
    }

    // Firestore에 저장할 루틴 데이터 생성
    const routine: Routine = {
      id: routineId,
      ...routineData,
      ...imageUrls,
      isActive: true,
      createdAt: now,
      updatedAt: now
    }

    // Firestore에 루틴 저장
    const routineRef = doc(getRoutinesCollection(uid), routineId)
    await setDoc(routineRef, {
      ...routine,
      createdAt: Timestamp.fromDate(routine.createdAt),
      updatedAt: Timestamp.fromDate(routine.updatedAt)
    })

    // 루틴 통계 초기화
    const statsRef = doc(getRoutineStatsCollection(uid), routineId)
    const initialStats: RoutineStats = {
      id: routineId,
      routineId: routineId,
      totalCompletions: 0,
      totalRecords: 0,
      successRate: 0,
      weekdayStats: {},
      currentStreak: 0,
      longestStreak: 0,
      updatedAt: now
    }

    await setDoc(statsRef, {
      ...initialStats,
      updatedAt: Timestamp.fromDate(initialStats.updatedAt)
    })

    console.log('루틴이 성공적으로 생성되었습니다.')
    return routineId
  } catch (error) {
    console.error('루틴 생성 중 오류 발생:', error)
    throw new Error('루틴 생성에 실패했습니다.')
  }
}

/**
 * 테스트용 루틴 생성 함수
 * 
 * 이 함수는 개발 및 테스트 목적으로 사용되는 샘플 루틴을 생성합니다.
 * 테스트 사용자 ID('testUser123')를 사용하여 매일 아침 7시에 실행되는 '아침 운동' 루틴을 생성합니다.
 * 
 * @returns {Promise<void>} 루틴 생성 완료 시 Promise 반환
 */
export const testCreateRoutine = async (): Promise<void> => {
  try {
    // 테스트 사용자 ID 설정
    const testUid = 'testUser123'
    
    // 테스트용 루틴 데이터 생성
    const testRoutine: Routine = {
      id: 'test-routine-1',
      title: '아침 운동',
      description: '매일 아침 30분 운동하기',
      frequency: 'daily',
      timeOfDay: '07:00',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // Firestore에 루틴 저장
    const routineRef = doc(getRoutinesCollection(testUid), testRoutine.id)
    await setDoc(routineRef, {
      ...testRoutine,
      createdAt: Timestamp.fromDate(testRoutine.createdAt),
      updatedAt: Timestamp.fromDate(testRoutine.updatedAt)
    })

    console.log('테스트 루틴이 성공적으로 생성되었습니다.')
  } catch (error) {
    console.error('테스트 루틴 생성 중 오류 발생:', error)
    throw error
  }
}

/**
 * 🔥 새로운 루틴을 생성하는 함수
 * 
 * @param userId 사용자 ID (Firebase Auth에서 제공하는 고유 식별자)
 * @param routineData 루틴 정보를 담은 객체
 * @returns Promise<RoutineData> 생성된 루틴의 데이터
 * 
 * @example
 * ```typescript
 * const routineData = {
 *   title: "아침운동",
 *   time: "07:00",
 *   memo: "스트레칭",
 *   repeat: ["월", "화"],
 *   notify: true,
 *   beforeImageURL: "https://...",  // 시작 전 이미지 URL
 *   afterImageURL: "https://..."     // 완료 후 이미지 URL
 * };
 * 
 * try {
 *   const routine = await createRoutine("user123", routineData);
 *   console.log("루틴이 생성되었습니다:", routine);
 * } catch (error) {
 *   console.error("루틴 생성 실패:", error);
 * }
 * ```
 */
export const createRoutine = async (uid: string, routine: Omit<Routine, 'id'>): Promise<Routine> => {
  const routinesRef = collection(db, 'users', uid, 'routines')
  const docRef = await addDoc(routinesRef, {
    ...routine,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  })
  return { id: docRef.id, ...routine } as Routine
}

/**
 * 🔥 사용자의 루틴 목록을 가져오는 함수
 * 
 * @param userId 사용자 ID
 * @returns Promise<RoutineData[]> 루틴 목록 배열
 * 
 * @example
 * ```typescript
 * try {
 *   const routines = await getRoutines("user123");
 *   console.log("루틴 목록:", routines);
 * } catch (error) {
 *   console.error("루틴 목록 조회 실패:", error);
 * }
 * ```
 */
export const getRoutines = async (uid: string): Promise<Routine[]> => {
  const routinesRef = collection(db, 'users', uid, 'routines')
  const q = query(routinesRef, orderBy('createdAt', 'desc'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Routine))
}

/**
 * 🔥 루틴 업데이트 함수
 * 
 * @param routineId 루틴 ID
 * @param updateData 업데이트할 데이터를 담은 객체
 * @returns Promise<RoutineData> 업데이트된 루틴의 데이터
 * 
 * @example
 * ```typescript
 * const updateData = {
 *   title: "아침운동 업데이트",
 *   time: "07:00",
 *   memo: "스트레칭 업데이트",
 *   repeat: ["월", "화"],
 *   notify: true,
 *   beforeImageURL: "https://...",  // 시작 전 이미지 URL
 *   afterImageURL: "https://..."     // 완료 후 이미지 URL
 * };
 * 
 * try {
 *   const updatedRoutine = await updateRoutine("user123/routineId", updateData);
 *   console.log("루틴이 성공적으로 업데이트되었습니다:", updatedRoutine);
 * } catch (error) {
 *   console.error("루틴 업데이트 실패:", error);
 * }
 * ```
 */
export const updateRoutine = async (uid: string, routineId: string, data: Partial<Routine>): Promise<Routine> => {
  const routineRef = doc(db, 'users', uid, 'routines', routineId)
  const updateData = {
    ...data,
    updatedAt: new Date().toISOString()
  }
  await updateDoc(routineRef, updateData)
  const updatedDoc = await getDoc(routineRef)
  return { id: updatedDoc.id, ...updatedDoc.data() } as Routine
}

/**
 * 🔥 루틴 삭제 함수
 * 
 * @param routineId 루틴 ID
 * @returns Promise<void>
 * 
 * @example
 * ```typescript
 * try {
 *   await deleteRoutine("user123/routineId");
 *   console.log("루틴이 성공적으로 삭제되었습니다.");
 * } catch (error) {
 *   console.error("루틴 삭제 실패:", error);
 * }
 * ```
 */
export const deleteRoutine = async (uid: string, routineId: string): Promise<void> => {
  const routineRef = doc(db, 'users', uid, 'routines', routineId)
  await deleteDoc(routineRef)
}

// 루틴 상세 조회
export const getRoutine = async (uid: string, routineId: string): Promise<Routine> => {
  const routineRef = doc(db, 'users', uid, 'routines', routineId)
  const docSnap = await getDoc(routineRef)
  if (!docSnap.exists()) {
    throw new Error('Routine not found')
  }
  return { id: docSnap.id, ...docSnap.data() } as Routine
}

// 루틴 기록 조회
export const getRoutineRecords = async (uid: string, routineId: string): Promise<RoutineRecord[]> => {
  try {
    const recordsRef = collection(db, 'users', uid, 'routines', routineId, 'records')
    const q = query(recordsRef, orderBy('date', 'desc'))
    const querySnapshot = await getDocs(q)
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as RoutineRecord[]
  } catch (error) {
    console.error('루틴 기록 조회 실패:', error)
    throw error
  }
}

// 루틴 기록 생성
export const createRoutineRecord = async (uid: string, routineId: string, record: Omit<RoutineRecord, 'id'>): Promise<string> => {
  try {
    const recordsRef = collection(db, 'users', uid, 'routines', routineId, 'records')
    const docRef = await addDoc(recordsRef, {
      ...record,
      createdAt: Timestamp.now().toDate().toISOString()
    })
    
    return docRef.id
  } catch (error) {
    console.error('루틴 기록 생성 실패:', error)
    throw error
  }
}

// 루틴 통계 조회
export const getRoutineStats = async (uid: string, routineId: string): Promise<RoutineStats> => {
  const recordsRef = collection(db, 'users', uid, 'routines', routineId, 'records')
  const q = query(recordsRef, orderBy('createdAt', 'desc'))
  const snapshot = await getDocs(q)
  const records = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as RoutineRecord))
  
  const totalRecords = records.length
  const completedRecords = records.filter(record => record.completedAt).length
  const completionRate = totalRecords > 0 ? Math.round((completedRecords / totalRecords) * 100) : 0

  return {
    id: routineId,
    routineId,
    totalCompletions: completedRecords,
    totalRecords,
    successRate: completionRate,
    weekdayStats: {},
    currentStreak: 0,
    longestStreak: 0,
    updatedAt: new Date()
  }
}

// 이미지 업로드
export const uploadImage = async (uid: string, file: File): Promise<string> => {
  try {
    const storageRef = ref(storage, `users/${uid}/images/${Date.now()}_${file.name}`)
    await uploadBytes(storageRef, file)
    const downloadURL = await getDownloadURL(storageRef)
    return downloadURL
  } catch (error) {
    console.error('이미지 업로드 실패:', error)
    throw error
  }
}

// 이미지 삭제
export const deleteImage = async (url: string): Promise<void> => {
  try {
    const imageRef = ref(storage, url)
    await deleteObject(imageRef)
  } catch (error) {
    console.error('이미지 삭제 실패:', error)
    throw error
  }
}

// 루틴 히스토리 조회
export const getRoutineHistory = async (uid: string, routineId: string, limit: number): Promise<RoutineRecord[]> => {
  try {
    const recordsRef = collection(db, 'users', uid, 'routines', routineId, 'records')
    const q = query(recordsRef, orderBy('date', 'desc'), firestoreLimit(limit))
    const querySnapshot = await getDocs(q)
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as RoutineRecord[]
  } catch (error) {
    console.error('루틴 히스토리 조회 실패:', error)
    throw error
  }
} 