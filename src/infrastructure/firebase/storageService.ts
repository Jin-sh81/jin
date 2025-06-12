import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { v4 as uuidv4 } from 'uuid'
import { storage } from './config'

export class StorageService {
  private storage = getStorage()

  /**
   * 파일을 Firebase Storage에 업로드합니다.
   * @param file 업로드할 파일
   * @param path 저장할 경로 (예: 'images/', 'documents/')
   * @returns 다운로드 URL
   */
  async uploadFile(file: File, path: string): Promise<string> {
    try {
      const fileExtension = file.name.split('.').pop()
      const fileName = `${uuidv4()}.${fileExtension}`
      const storageRef = ref(this.storage, `${path}${fileName}`)
      
      const snapshot = await uploadBytes(storageRef, file)
      const downloadURL = await getDownloadURL(snapshot.ref)
      
      return downloadURL
    } catch (error) {
      console.error('파일 업로드 중 오류 발생:', error)
      throw error
    }
  }

  /**
   * Firebase Storage에서 파일을 삭제합니다.
   * @param url 삭제할 파일의 다운로드 URL
   */
  async deleteFile(url: string): Promise<void> {
    try {
      const storageRef = ref(this.storage, url)
      await deleteObject(storageRef)
    } catch (error) {
      console.error('파일 삭제 중 오류 발생:', error)
      throw error
    }
  }

  /**
   * 파일의 다운로드 URL을 가져옵니다.
   * @param path 파일 경로
   * @returns 다운로드 URL
   */
  async getDownloadUrl(path: string): Promise<string> {
    try {
      const storageRef = ref(this.storage, path)
      return await getDownloadURL(storageRef)
    } catch (error) {
      console.error('다운로드 URL 가져오기 중 오류 발생:', error)
      throw error
    }
  }

  /**
   * 이미지 파일을 Firebase Storage에 업로드합니다.
   * 
   * @param uid 사용자 ID (예: "user123")
   * @param folder 저장할 폴더 이름 (예: "routines", "diaries")
   * @param file 업로드할 이미지 파일
   * @returns 업로드된 이미지의 다운로드 URL
   * 
   * 사용 예시:
   * ```typescript
   * const storageService = new StorageService();
   * const imageUrl = await storageService.uploadImage(
   *   "user123",
   *   "routines",
   *   imageFile
   * );
   * ```
   */
  async uploadImage(uid: string, folder: string, file: File): Promise<string> {
    try {
      // 1. 파일 확장자 가져오기 (예: .jpg, .png)
      const fileExtension = file.name.split('.').pop()
      
      // 2. 고유한 파일 이름 생성 (예: "abc123.jpg")
      const fileName = `${uuidv4()}.${fileExtension}`
      
      // 3. 저장 경로 생성 (예: "user123/routines/abc123.jpg")
      const storagePath = `${uid}/${folder}/${fileName}`
      
      // 4. Storage 참조 생성
      const storageRef = ref(storage, storagePath)
      
      // 5. 파일 업로드
      const snapshot = await uploadBytes(storageRef, file)
      
      // 6. 다운로드 URL 가져오기
      const downloadURL = await getDownloadURL(snapshot.ref)
      
      console.log('이미지가 성공적으로 업로드되었습니다!')
      return downloadURL
    } catch (error) {
      console.error('이미지 업로드 중 오류 발생:', error)
      throw error
    }
  }

  /**
   * Firebase Storage에서 이미지를 삭제합니다.
   * 
   * @param url 삭제할 이미지의 다운로드 URL
   * 
   * 사용 예시:
   * ```typescript
   * const storageService = new StorageService();
   * await storageService.deleteImage(imageUrl);
   * ```
   */
  async deleteImage(url: string): Promise<void> {
    try {
      // 1. URL에서 Storage 참조 생성
      const storageRef = ref(storage, url)
      
      // 2. 파일 삭제
      await deleteObject(storageRef)
      
      console.log('이미지가 성공적으로 삭제되었습니다!')
    } catch (error) {
      console.error('이미지 삭제 중 오류 발생:', error)
      throw error
    }
  }

  /**
   * 이미지 파일의 크기를 확인하고 제한합니다.
   * 
   * @param file 확인할 이미지 파일
   * @param maxSize 최대 파일 크기 (MB)
   * @returns 파일 크기가 제한을 초과하면 true, 아니면 false
   * 
   * 사용 예시:
   * ```typescript
   * const storageService = new StorageService();
   * const isTooLarge = storageService.isFileTooLarge(imageFile, 5); // 5MB 제한
   * ```
   */
  isFileTooLarge(file: File, maxSize: number): boolean {
    // 파일 크기를 MB로 변환
    const fileSizeInMB = file.size / (1024 * 1024)
    return fileSizeInMB > maxSize
  }

  /**
   * 이미지 파일의 형식을 확인합니다.
   * 
   * @param file 확인할 이미지 파일
   * @returns 허용된 이미지 형식이면 true, 아니면 false
   * 
   * 사용 예시:
   * ```typescript
   * const storageService = new StorageService();
   * const isValidFormat = storageService.isValidImageFormat(imageFile);
   * ```
   */
  isValidImageFormat(file: File): boolean {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    return allowedTypes.includes(file.type)
  }
} 