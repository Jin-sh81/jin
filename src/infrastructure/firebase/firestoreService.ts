import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore'
import { db } from './config'
import { StorageService } from './storageService'

// Storage 서비스 인스턴스 생성
const storageService = new StorageService()

// 🔥 루틴 초기 테스트용 데이터 삽입 함수
// 이 함수는 Firebase Firestore에 루틴 데이터를 저장합니다
export const seedRoutine = async (uid: string) => {
  try {
    // users/{uid}/routines 컬렉션에 새 문서 생성
    const ref = doc(collection(db, 'users', uid, 'routines'))
    
    // 루틴 데이터 저장
    await setDoc(ref, {
      title: "스트레칭",         // 루틴 이름
      time: "07:00",           // 시작 시간
      memo: "가볍게 시작",     // 메모
      repeat: ["월", "화"],    // 반복 요일
      notify: false,            // 알림 여부
      createdAt: serverTimestamp(),
    })

    console.log('루틴 데이터가 성공적으로 저장되었습니다!')
    return ref.id
  } catch (error) {
    console.error('루틴 데이터 저장 중 오류 발생:', error)
    throw error
  }
}

/**
 * 🔥 루틴 생성 함수 (이미지 업로드 포함)
 * 
 * 이 함수는 새로운 루틴을 생성하고, 선택적으로 before/after 이미지를 업로드합니다.
 * 
 * @param uid 사용자 ID (예: "user123")
 * @param routineData 루틴 정보
 * @param routineData.title 루틴 제목 (예: "아침 운동")
 * @param routineData.time 시작 시간 (예: "07:00")
 * @param routineData.memo 메모 (선택사항)
 * @param routineData.repeat 반복 요일 배열 (예: ["월", "수", "금"])
 * @param routineData.notify 알림 여부
 * @param routineData.beforeImage 시작 전 이미지 파일 (선택사항)
 * @param routineData.afterImage 완료 후 이미지 파일 (선택사항)
 * @returns 생성된 루틴의 ID
 * 
 * 사용 예시:
 * ```typescript
 * // 이미지 파일이 있는 경우
 * const routineId = await createRoutineWithImages("user123", {
 *   title: "아침 운동",
 *   time: "07:00",
 *   memo: "스트레칭 20분",
 *   repeat: ["월", "수", "금"],
 *   notify: true,
 *   beforeImage: beforeImageFile,  // File 객체
 *   afterImage: afterImageFile     // File 객체
 * });
 * 
 * // 이미지 파일이 없는 경우
 * const routineId = await createRoutineWithImages("user123", {
 *   title: "아침 운동",
 *   time: "07:00",
 *   repeat: ["월", "수", "금"],
 *   notify: true
 * });
 * ```
 */
export const createRoutineWithImages = async (
  uid: string,
  routineData: {
    title: string;
    time: string;
    memo?: string;
    repeat: string[];
    notify: boolean;
    beforeImage?: File;
    afterImage?: File;
  }
) => {
  try {
    // 1. 이미지 파일 검증
    // Before 이미지가 있는 경우 검증
    if (routineData.beforeImage) {
      // 파일 크기가 5MB를 초과하는지 확인
      if (storageService.isFileTooLarge(routineData.beforeImage, 5)) {
        throw new Error('Before 이미지 크기가 너무 큽니다. 5MB 이하의 파일만 업로드 가능합니다.')
      }
      // 지원하는 이미지 형식인지 확인 (jpeg, png, gif, webp)
      if (!storageService.isValidImageFormat(routineData.beforeImage)) {
        throw new Error('지원하지 않는 이미지 형식입니다. jpeg, png, gif, webp 형식만 가능합니다.')
      }
    }

    // After 이미지가 있는 경우 검증
    if (routineData.afterImage) {
      // 파일 크기가 5MB를 초과하는지 확인
      if (storageService.isFileTooLarge(routineData.afterImage, 5)) {
        throw new Error('After 이미지 크기가 너무 큽니다. 5MB 이하의 파일만 업로드 가능합니다.')
      }
      // 지원하는 이미지 형식인지 확인 (jpeg, png, gif, webp)
      if (!storageService.isValidImageFormat(routineData.afterImage)) {
        throw new Error('지원하지 않는 이미지 형식입니다. jpeg, png, gif, webp 형식만 가능합니다.')
      }
    }

    // 2. 이미지 업로드
    let beforeImageURL: string | undefined
    let afterImageURL: string | undefined

    // Before 이미지가 있는 경우 업로드
    if (routineData.beforeImage) {
      beforeImageURL = await storageService.uploadImage(
        uid,
        'routines/before',  // 저장 경로: users/{uid}/routines/before/{파일명}
        routineData.beforeImage
      )
    }

    // After 이미지가 있는 경우 업로드
    if (routineData.afterImage) {
      afterImageURL = await storageService.uploadImage(
        uid,
        'routines/after',   // 저장 경로: users/{uid}/routines/after/{파일명}
        routineData.afterImage
      )
    }

    // 3. 루틴 데이터 저장
    // Firestore에 새 문서 생성
    const ref = doc(collection(db, 'users', uid, 'routines'))
    
    // 루틴 데이터 저장
    await setDoc(ref, {
      title: routineData.title,        // 루틴 제목
      time: routineData.time,          // 시작 시간
      memo: routineData.memo,          // 메모 (선택사항)
      repeat: routineData.repeat,      // 반복 요일
      notify: routineData.notify,      // 알림 여부
      beforeImageURL,                  // 시작 전 이미지 URL (선택사항)
      afterImageURL,                   // 완료 후 이미지 URL (선택사항)
      createdAt: serverTimestamp(),    // 생성 시간
    })

    console.log('루틴이 성공적으로 생성되었습니다!')
    return ref.id
  } catch (error) {
    // 4. 오류 발생 시 에러 메시지 출력
    if (error instanceof Error) {
      console.error('루틴 생성 중 오류 발생:', error.message)
    }
    throw error
  }
}

// 🔥 루틴 기록 생성 함수
export const createRoutineRecord = async (
  uid: string,
  routineId: string,
  recordData: {
    date: string;
    completed: boolean;
    memo?: string;
    afterImageURL?: string;
  }
) => {
  try {
    const recordId = `${recordData.date}_${routineId}`
    const ref = doc(db, 'users', uid, 'routineRecords', recordId)
    await setDoc(ref, {
      ...recordData,
      routineId,
      timestamp: serverTimestamp(),
    })
    return recordId
  } catch (error) {
    console.error('루틴 기록 생성 중 오류 발생:', error)
    throw error
  }
}

// 🔥 프로젝트 생성 함수
export const createProject = async (
  uid: string,
  projectData: {
    title: string;
    dueDate: string;
    tasks: Array<{ title: string; done: boolean }>;
    memo?: string;
    attachments?: string[];
  }
) => {
  try {
    const ref = doc(collection(db, 'users', uid, 'projects'))
    await setDoc(ref, {
      ...projectData,
      createdAt: serverTimestamp(),
    })
    return ref.id
  } catch (error) {
    console.error('프로젝트 생성 중 오류 발생:', error)
    throw error
  }
}

// 🔥 지출 기록 생성 함수
export const createExpense = async (
  uid: string,
  expenseData: {
    date: string;
    amount: number;
    category: string;
    memo?: string;
    fileURL?: string;
  }
) => {
  try {
    const ref = doc(collection(db, 'users', uid, 'expenses'))
    await setDoc(ref, {
      ...expenseData,
      timestamp: serverTimestamp(),
    })
    return ref.id
  } catch (error) {
    console.error('지출 기록 생성 중 오류 발생:', error)
    throw error
  }
}

// 🔥 일기 생성 함수
export const createDiary = async (
  uid: string,
  date: string,
  timeline: Array<{
    hour: string;
    text: string;
    autoFilled?: boolean;
  }>
) => {
  try {
    const ref = doc(db, 'users', uid, 'diaries', date)
    await setDoc(ref, {
      date,
      timeline,
      updatedAt: serverTimestamp(),
    })
    return date
  } catch (error) {
    console.error('일기 생성 중 오류 발생:', error)
    throw error
  }
} 