import React, { useState, useRef } from 'react'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from '../../config/firebase'
import Button from '../../shared/components/Button'

/**
 * 이미지 업로드 테스트 페이지
 * 
 * 이 페이지는 Firebase Storage에 이미지를 업로드하고 미리보기를 테스트합니다.
 * 파일 선택, 업로드, 미리보기 기능을 포함합니다.
 */
const UploadTestPage: React.FC = () => {
  // 선택된 파일 상태
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  // 업로드된 이미지 URL 상태
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  // 로딩 상태
  const [isLoading, setIsLoading] = useState(false)
  // 에러 메시지 상태
  const [error, setError] = useState<string | null>(null)
  // 파일 입력 참조
  const fileInputRef = useRef<HTMLInputElement>(null)

  /**
   * 파일 선택 핸들러
   * 
   * 파일이 선택되면 상태를 업데이트하고 에러를 초기화합니다.
   * 이미지 파일만 허용합니다.
   */
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    setError(null)

    if (file) {
      // 이미지 파일인지 확인
      if (!file.type.startsWith('image/')) {
        setError('이미지 파일만 업로드할 수 있습니다.')
        return
      }

      // 파일 크기 제한 (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('파일 크기는 5MB를 초과할 수 없습니다.')
        return
      }

      setSelectedFile(file)
      // 파일 선택 시 미리보기 URL 생성
      const previewUrl = URL.createObjectURL(file)
      setImageUrl(previewUrl)
    }
  }

  /**
   * 이미지 업로드 핸들러
   * 
   * 선택된 파일을 Firebase Storage에 업로드합니다.
   * 업로드 중에는 로딩 상태를 표시하고, 완료되면 다운로드 URL을 저장합니다.
   */
  const handleUpload = async () => {
    if (!selectedFile) {
      setError('파일을 선택해주세요.')
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      // 파일 이름에 타임스탬프 추가
      const timestamp = new Date().getTime()
      const fileName = `${timestamp}_${selectedFile.name}`
      
      // Storage 참조 생성
      const storageRef = ref(storage, `test-images/${fileName}`)

      // 파일 업로드
      await uploadBytes(storageRef, selectedFile)

      // 다운로드 URL 가져오기
      const downloadUrl = await getDownloadURL(storageRef)
      setImageUrl(downloadUrl)

      console.log('이미지가 성공적으로 업로드되었습니다!')
    } catch (error) {
      console.error('업로드 중 오류 발생:', error)
      setError('이미지 업로드 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * 파일 선택 초기화 핸들러
   * 
   * 선택된 파일과 미리보기를 초기화합니다.
   */
  const handleReset = () => {
    setSelectedFile(null)
    setImageUrl(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">이미지 업로드 테스트</h1>

        {/* 업로드 섹션 */}
        <section className="bg-white rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">이미지 업로드</h2>
          
          <div className="space-y-4">
            {/* 파일 선택 영역 */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                ref={fileInputRef}
                className="hidden"
                id="file-input"
              />
              <label
                htmlFor="file-input"
                className="cursor-pointer block"
              >
                <div className="text-gray-600">
                  {selectedFile ? (
                    <p>선택된 파일: {selectedFile.name}</p>
                  ) : (
                    <p>이미지를 선택하려면 클릭하세요</p>
                  )}
                </div>
              </label>
            </div>

            {/* 버튼 영역 */}
            <div className="flex gap-4">
              <Button
                onClick={handleUpload}
                isLoading={isLoading}
                disabled={!selectedFile}
                variant="primary"
              >
                업로드
              </Button>
              <Button
                onClick={handleReset}
                variant="outline"
                disabled={!selectedFile}
              >
                초기화
              </Button>
            </div>

            {/* 에러 메시지 */}
            {error && (
              <div className="bg-red-50 text-red-800 p-4 rounded-md">
                {error}
              </div>
            )}
          </div>
        </section>

        {/* 미리보기 섹션 */}
        {imageUrl && (
          <section className="bg-white rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">이미지 미리보기</h2>
            
            <div className="space-y-4">
              <img
                src={imageUrl}
                alt="업로드된 이미지"
                className="max-w-full h-auto rounded-lg shadow-md"
              />
              <div className="text-sm text-gray-600">
                <p>이미지 URL: {imageUrl}</p>
              </div>
            </div>
          </section>
        )}

        {/* 사용 방법 섹션 */}
        <section className="bg-white rounded-lg p-6 mt-8">
          <h2 className="text-xl font-semibold mb-4">사용 방법</h2>
          
          <div className="prose">
            <h3>1. 이미지 선택하기</h3>
            <p>
              "이미지를 선택하려면 클릭하세요" 영역을 클릭하여 이미지 파일을 선택합니다.
              이미지 파일만 선택 가능하며, 파일 크기는 5MB를 초과할 수 없습니다.
            </p>

            <h3>2. 이미지 업로드하기</h3>
            <p>
              "업로드" 버튼을 클릭하여 선택한 이미지를 Firebase Storage에 업로드합니다.
              업로드가 완료되면 이미지 미리보기가 표시됩니다.
            </p>

            <h3>3. 초기화하기</h3>
            <p>
              "초기화" 버튼을 클릭하여 선택한 파일과 미리보기를 초기화할 수 있습니다.
            </p>

            <h3>4. 주의사항</h3>
            <p>
              - 이미지 파일만 업로드 가능합니다.
              - 파일 크기는 5MB를 초과할 수 없습니다.
              - 업로드된 이미지는 Firebase Storage의 'test-images' 폴더에 저장됩니다.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}

export default UploadTestPage 