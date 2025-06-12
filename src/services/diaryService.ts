import { db, storage } from '@/infrastructure/firebase/firebaseConfig'
import { 
  collection,           // 컬렉션 참조 생성
  doc,                 // 문서 참조 생성
  setDoc,              // 문서 설정
  serverTimestamp,     // 서버 타임스탬프
  DocumentReference,   // 문서 참조 타입
  Timestamp,           // 타임스탬프 타입
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  DocumentData,
  QueryDocumentSnapshot,
  addDoc
} from 'firebase/firestore'
import { format, parseISO, eachDayOfInterval } from 'date-fns'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import type { Diary, TimelineEntry } from '@/types/diary'

// 🔽 일기 데이터 타입 가져오기
import { Diary, TimelineEntry } from '@types/diary'

// 🔽 일기 컬렉션 참조 가져오기
const getDiariesRef = (userId: string) => {
  return collection(db, 'users', userId, 'diaries')
}

/**
 * 🔥 새로운 일기를 생성하는 함수
 * 
 * @param userId 사용자 ID (Firebase Auth에서 제공하는 고유 식별자)
 * @param diaryData 일기 정보를 담은 객체
 * @returns Promise<Diary> 생성된 일기의 데이터
 * 
 * @example
 * ```typescript
 * const diaryData = {
 *   date: "2024-03-15",
 *   content: "오늘은 좋은 날이었다.",
 *   mood: "행복",
 *   weather: "맑음",
 *   attachments: ["https://...", "https://..."]
 * };
 * 
 * try {
 *   const diary = await createDiary("user123", diaryData);
 *   console.log("일기가 생성되었습니다:", diary);
 * } catch (error) {
 *   console.error("일기 생성 실패:", error);
 * }
 * ```
 */
export const createDiary = async (
  userId: string,
  diaryData: Omit<Diary, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
): Promise<Diary> => {
  try {
    const diariesRef = getDiariesRef(userId)
    const now = Timestamp.now().toDate().toISOString()
    
    const newDiary = {
      ...diaryData,
      userId,
      createdAt: now,
      updatedAt: now,
      deleted: false
    }

    const docRef = await addDoc(diariesRef, newDiary)
    
    return {
      id: docRef.id,
      ...newDiary
    } as Diary
  } catch (error) {
    console.error('일기 생성 실패:', error)
    throw new Error('일기 작성에 실패했습니다.')
  }
}

/**
 * 🔥 사용자의 일기 목록을 가져오는 함수
 * 
 * @param userId 사용자 ID
 * @returns Promise<Diary[]> 일기 목록 배열
 * 
 * @example
 * ```typescript
 * try {
 *   const diaries = await getDiaries("user123");
 *   console.log("일기 목록:", diaries);
 * } catch (error) {
 *   console.error("일기 목록 조회 실패:", error);
 * }
 * ```
 */
export const getDiaries = async (userId: string): Promise<Diary[]> => {
  try {
    const diariesRef = getDiariesRef(userId)
    const q = query(
      diariesRef,
      where('deleted', '==', false),
      orderBy('date', 'desc')
    )
    const querySnapshot = await getDocs(q)
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Diary[]
  } catch (error) {
    console.error('일기 목록 조회 실패:', error)
    throw new Error('일기 목록을 불러오는데 실패했습니다.')
  }
}

/**
 * 🔥 일기 업데이트 함수
 * 
 * @param diaryId 일기 ID
 * @param updateData 업데이트할 데이터를 담은 객체
 * @returns Promise<Diary> 업데이트된 일기의 데이터
 * 
 * @example
 * ```typescript
 * const updateData = {
 *   date: "2024-03-15",
 *   content: "오늘은 정말 좋은 날이었다.",
 *   mood: "행복",
 *   weather: "맑음",
 *   attachments: ["https://...", "https://..."]
 * };
 * 
 * try {
 *   const updatedDiary = await updateDiary("user123/diaryId", updateData);
 *   console.log("일기가 성공적으로 업데이트되었습니다:", updatedDiary);
 * } catch (error) {
 *   console.error("일기 업데이트 실패:", error);
 * }
 * ```
 */
export const updateDiary = async (
  userId: string,
  diaryId: string,
  diaryData: Partial<Omit<Diary, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>
): Promise<void> => {
  try {
    const diaryRef = doc(getDiariesRef(userId), diaryId)
    const now = Timestamp.now().toDate().toISOString()
    
    await updateDoc(diaryRef, {
      ...diaryData,
      updatedAt: now
    })
  } catch (error) {
    console.error('일기 수정 실패:', error)
    throw new Error('일기 수정에 실패했습니다.')
  }
}

/**
 * 🔥 일기 삭제 함수
 * 
 * @param diaryId 일기 ID
 * @returns Promise<void>
 * 
 * @example
 * ```typescript
 * try {
 *   await deleteDiary("user123/diaryId");
 *   console.log("일기가 성공적으로 삭제되었습니다.");
 * } catch (error) {
 *   console.error("일기 삭제 실패:", error);
 * }
 * ```
 */
export const deleteDiary = async (userId: string, diaryId: string): Promise<void> => {
  try {
    const diaryRef = doc(getDiariesRef(userId), diaryId)
    const now = Timestamp.now().toDate().toISOString()
    
    // 소프트 삭제 구현
    await updateDoc(diaryRef, {
      deleted: true,
      deletedAt: now,
      updatedAt: now
    })
  } catch (error) {
    console.error('일기 삭제 실패:', error)
    throw new Error('일기 삭제에 실패했습니다.')
  }
}

/**
 * 테스트용 일기 생성 함수
 * 
 * 이 함수는 개발 및 테스트 목적으로 사용되는 샘플 일기를 생성합니다.
 * 테스트 사용자 ID('testUser123')를 사용하여 오늘의 일기를 생성합니다.
 * 
 * @returns {Promise<void>} 일기 생성 완료 시 Promise 반환
 */
export const testCreateDiary = async (): Promise<void> => {
  try {
    // 테스트 사용자 ID 설정
    const testUid = 'testUser123'
    
    // 테스트용 일기 데이터 생성
    const testDiary: Diary = {
      id: 'test-diary-1',
      title: '오늘의 일기',
      content: `오늘은 정말 좋은 하루였다.
아침에 일어나서 30분 운동을 했고,
오후에는 친구를 만나서 카페에서 이야기를 나눴다.
저녁에는 새로운 프로젝트를 시작했다.
내일도 좋은 하루가 되길 바란다.`,
      mood: 'happy',
      tags: ['운동', '친구', '프로젝트'],
      date: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // Firestore에 일기 저장
    const diaryRef = doc(getDiariesRef(testUid), testDiary.id)
    await setDoc(diaryRef, {
      ...testDiary,
      date: Timestamp.fromDate(testDiary.date),
      createdAt: Timestamp.fromDate(testDiary.createdAt),
      updatedAt: Timestamp.fromDate(testDiary.updatedAt)
    })

    console.log('테스트 일기가 성공적으로 생성되었습니다.')
  } catch (error) {
    console.error('테스트 일기 생성 중 오류 발생:', error)
    throw error
  }
}

// 일기 상세 조회
export const getDiary = async (userId: string, diaryId: string): Promise<Diary | null> => {
  try {
    const diaryRef = doc(getDiariesRef(userId), diaryId)
    const diaryDoc = await getDoc(diaryRef)
    
    if (!diaryDoc.exists()) {
      return null
    }

    return {
      id: diaryDoc.id,
      ...diaryDoc.data()
    } as Diary
  } catch (error) {
    console.error('일기 조회 실패:', error)
    throw new Error('일기를 불러오는데 실패했습니다.')
  }
}

// 타임라인 조회
export const getTimeline = async (uid: string): Promise<TimelineEntry[]> => {
  try {
    const diariesRef = collection(db, 'users', uid, 'diaries')
    const q = query(diariesRef, orderBy('date', 'desc'))
    const querySnapshot = await getDocs(q)
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as TimelineEntry[]
  } catch (error) {
    console.error('타임라인 조회 실패:', error)
    throw error
  }
}

// 이미지 업로드
export const uploadDiaryImage = async (
  userId: string,
  file: File
): Promise<string> => {
  try {
    const timestamp = Date.now()
    const fileName = `${userId}/${timestamp}_${file.name}`
    const storageRef = ref(storage, `diary-images/${fileName}`)
    
    await uploadBytes(storageRef, file)
    const downloadURL = await getDownloadURL(storageRef)
    
    return downloadURL
  } catch (error) {
    console.error('이미지 업로드 실패:', error)
    throw new Error('이미지 업로드에 실패했습니다.')
  }
}

// 이미지 삭제
export const deleteDiaryImage = async (imageUrl: string): Promise<void> => {
  try {
    const imageRef = ref(storage, imageUrl)
    await deleteObject(imageRef)
  } catch (error) {
    console.error('이미지 삭제 실패:', error)
    throw new Error('이미지 삭제에 실패했습니다.')
  }
} 
/**
 * 📅 날짜로 일기를 가져오는 함수
 * @param userId 사용자 ID
 * @param date 날짜 문자열 (예: '2025-06-14')
 * @returns Diary 또는 null
 */
export const getDiaryByDate = async (
  userId: string,
  date: string
): Promise<Diary | null> => {
  try {
    const diariesRef = getDiariesRef(userId)
    const q = query(
      diariesRef,
      where('deleted', '==', false),
      where('date', '==', date)
    )
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) return null

    const docSnap = querySnapshot.docs[0]
    return {
      id: docSnap.id,
      ...docSnap.data()
    } as Diary
  } catch (error) {
    console.error('날짜로 일기 불러오기 실패:', error)
    throw new Error('일기 조회 중 오류가 발생했습니다.')
  }
}