import React from 'react'

// 📝 DiaryExportPage는 사용자의 일기 데이터를 내보내는 페이지예요
// 💾 CSV나 PDF 형식으로 일기를 저장할 수 있어요
export default function DiaryExportPage() {
  // 🎯 페이지 역할: 사용자의 일기 데이터를 내보내기 위한 UI를 제공합니다.
  return (
    <div className="container mx-auto px-4 py-8">
      {/* 🎉 제목 */}
      <h1 className="text-2xl font-bold mb-4">일기 내보내기</h1>
      
      {/* 📋 설명 텍스트 */}
      <p className="text-gray-600 mb-4">
        여기에서 내보낼 날짜 범위와 형식을 선택할 수 있어요.
      </p>

      {/* 📅 날짜 선택 영역 */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">날짜 범위 선택</h2>
        <div className="flex gap-4">
          <input 
            type="date" 
            className="border rounded px-3 py-2"
            placeholder="시작 날짜"
          />
          <input 
            type="date" 
            className="border rounded px-3 py-2"
            placeholder="종료 날짜"
          />
        </div>
      </div>

      {/* 📄 형식 선택 영역 */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">내보내기 형식</h2>
        <div className="flex gap-4">
          <label className="flex items-center">
            <input type="radio" name="format" value="csv" className="mr-2" />
            CSV 파일
          </label>
          <label className="flex items-center">
            <input type="radio" name="format" value="pdf" className="mr-2" />
            PDF 파일
          </label>
        </div>
      </div>

      {/* ▶ 내보내기 버튼 */}
      <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        내보내기 시작
      </button>
    </div>
  )
} 