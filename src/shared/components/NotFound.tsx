import { Link } from 'react-router-dom'

// 🔍 NotFound는 잘못된 URL로 접속했을 때 보여주는 페이지예요
// 🚫 404 에러 페이지라고도 불러요
export default function NotFound() {
  // 🎯 페이지 역할: 잘못된 URL로 들어왔을 때 보여주는 "페이지를 찾을 수 없음" 화면
  return (
    <div className="container mx-auto px-4 py-8 text-center">
      {/* 😢 제목 */}
      <h1 className="text-4xl font-bold mb-4">404 - 페이지를 찾을 수 없어요</h1>
      
      {/* 📋 안내 텍스트 */}
      <p className="text-gray-600 mb-6">
        요청하신 페이지가 존재하지 않거나 잘못된 경로입니다.
      </p>

      {/* 🔗 홈으로 돌아가는 링크 */}
      <Link 
        to="/" 
        className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        홈으로 돌아가기
      </Link>

      {/* 💡 도움말 */}
      <p className="mt-8 text-sm text-gray-500">
        혹시 링크를 잘못 클릭하셨나요? 위의 버튼을 눌러 홈으로 돌아가세요.
      </p>
    </div>
  )
} 