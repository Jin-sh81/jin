// 🏠 HomePage: JIN 앱 첫 화면이에요. 환영 메시지와 주요 기능 버튼을 보여줘요!
// 📋 기능 검증 명령서:
// 1. 로그인한 사용자의 이메일이 환영 메시지에 표시되는지 확인해요
// 2. 모든 기능 버튼이 올바른 페이지로 이동하는지 확인해요
// 3. 데이터 로딩이 정상적으로 되는지 확인해요
// 4. 버튼에 마우스를 올렸을 때 색상이 변하는지 확인해요
// 5. 모바일 화면에서도 버튼이 잘 보이는지 확인해요
// 6. 오류가 발생했을 때 콘솔에 메시지가 표시되는지 확인해요

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProjects } from '@/services/projectService'
import { getRoutines } from '@/services/routineService'
import { getExpenses } from '@/services/expenseService'
import type { Project } from '@/types/project'
import type { Routine } from '@/types/routine'
import type { Expense } from '@/types/expense'
import { useAuth } from '@/hooks/useAuth'

// 🎨 HomePage 컴포넌트: 앱의 첫 화면을 그려주는 컴포넌트예요
export default function HomePage() {
  // 🔀 useNavigate 훅: 버튼 클릭 시 해당 화면으로 이동하게 해줘요
  const navigate = useNavigate()
  // 👤 useAuth 훅: 현재 로그인한 사용자 정보를 가져와요
  const { user } = useAuth()

  // 🔍 앱 로딩 시 서버에서 데이터를 가져오는지 확인. 사용 전 주석 또는 삭제 검토
  useEffect(() => {
    // 📥 fetchData 함수: 사용자의 모든 데이터를 한 번에 가져와요
    const fetchData = async () => {
      if (!user) return
      
      try {
        // 📦 Promise.all: 여러 데이터를 동시에 가져와요
        const [projects, routines, expenses] = await Promise.all([
          getProjects(user.uid),  // 📂 프로젝트 목록
          getRoutines(user.uid),  // ⏰ 루틴 목록
          getExpenses(user.uid),  // 💰 지출 목록
        ])
        console.log('데이터 로딩 완료:', { projects, routines, expenses })
      } catch (error) {
        // ⚠️ 오류 발생 시 콘솔에 기록해요
        console.error('데이터 로딩 실패:', error)
      }
    }
    fetchData()
  }, [user])

  return (
    // 🎯 전체 컨테이너: 화면 중앙에 내용을 배치해요
    <div className="container mx-auto px-4 py-8">
      {/* 🎉 제목: 사용자를 반갑게 맞이해요 */}
      <h1 className="text-3xl font-bold text-center mb-4">
        {user ? `${user.email}님, ` : ''}JIN에 오신 것을 환영합니다!
      </h1>
      
      {/* 📝 설명: JIN 앱의 주요 기능을 안내해요 */}
      <p className="text-center text-gray-600">
        매일의 루틴, 프로젝트, 지출, 일기를 한 곳에서 관리해 보세요.
      </p>

      {/* 📑 기능 버튼들을 격자 형태로 배치해요 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        {/* 🔘 루틴 버튼: 일상적인 활동을 관리해요 */}
        <button 
          onClick={() => navigate('/routines')}
          className="p-4 bg-blue-100 rounded-lg hover:bg-blue-200"
        >
          📅 루틴
        </button>
        {/* 🔘 프로젝트 버튼: 진행 중인 일을 관리해요 */}
        <button 
          onClick={() => navigate('/projects')}
          className="p-4 bg-green-100 rounded-lg hover:bg-green-200"
        >
          📋 프로젝트
        </button>
        {/* 🔘 지출 버튼: 돈을 어떻게 썼는지 기록해요 */}
        <button 
          onClick={() => navigate('/expense')}
          className="p-4 bg-yellow-100 rounded-lg hover:bg-yellow-200"
        >
          💰 지출
        </button>
        {/* 🔘 일기 버튼: 하루를 기록해요 */}
        <button 
          onClick={() => navigate('/diary')}
          className="p-4 bg-purple-100 rounded-lg hover:bg-purple-200"
        >
          📝 일기
        </button>
      </div>
    </div>
  )
} 