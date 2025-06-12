import { seedRoutine } from './firestoreService'

// 테스트 사용자 ID
const TEST_USER_ID = 'testUser123'

// 테스트 데이터 입력 실행
const runTest = async () => {
  try {
    console.log('테스트 데이터 입력을 시작합니다...')
    const routineId = await seedRoutine(TEST_USER_ID)
    console.log(`루틴이 생성되었습니다. ID: ${routineId}`)
  } catch (error) {
    console.error('테스트 데이터 입력 중 오류 발생:', error)
  }
}

// 테스트 실행
runTest() 