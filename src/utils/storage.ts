import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { v4 as uuidv4 } from 'uuid'

/**
 * Firebase Storage에 파일을 업로드하고 다운로드 URL을 반환합니다.
 * @param file 업로드할 파일
 * @param path 저장할 경로 (예: 'images/', 'documents/')
 * @returns 다운로드 URL
 */
export const uploadFileToStorage = async (file: File, path: string): Promise<string> => {
  try {
    const storage = getStorage()
    const fileExtension = file.name.split('.').pop()
    const fileName = `${uuidv4()}.${fileExtension}`
    const storageRef = ref(storage, `${path}${fileName}`)
    
    // 파일 업로드
    const snapshot = await uploadBytes(storageRef, file)
    
    // 다운로드 URL 가져오기
    const downloadURL = await getDownloadURL(snapshot.ref)
    
    return downloadURL
  } catch (error) {
    console.error('파일 업로드 중 오류 발생:', error)
    throw error
  }
} 